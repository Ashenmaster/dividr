// NPM imports
const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

// Local files
const app = require('./../app');
const {Meal} = require('./../models/meal');
const {meals, validUsers, populateUsers, populateMeals} = require('./seed/seed');

const {createLoginToken} = require('./test-helpers');
const validLogin = { email: validUsers[0].email, password: 'secret'};

beforeEach(populateMeals);
before(populateUsers);


describe('GET /meals', () => {
    it('should get only the logged in users meals', (done) => {
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .get('/api/v1/meals')
                .set('Authorization', header)
                .expect(200)
                .expect((res) => {
                    expect(res.body.length).toBe(1);
                })
                .end(done);
        });
    });
});

describe('POST /meals', () => {
    it('should create a new meal', (done) => {
        let mealName = 'Casserole';
        let cookedWeight = 1000;
        let servings = 5;
        let portionSize = 200;

        createLoginToken(app, validLogin, (header, userId) => {
            request(app)
                .post('/api/v1/meals')
                .set('Authorization', header)
                .send({
                    mealName,
                    cookedWeight,
                    servings
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.mealName).toBe(mealName);
                    expect(res.body.cookedWeight).toBe(cookedWeight);
                    expect(res.body.servings).toBe(servings);
                    expect(res.body.portionSize).toBe(portionSize);
                    expect(res.body._creator).toBe(userId);
                })
                .end((err) => {
                    if (err) {
                        return done(err);
                    }
                    Meal.find({mealName}).then((meals) => {
                        expect(meals.length).toBe(1);
                        expect(meals[0].mealName).toBe(mealName);
                        done();
                    }).catch((e) => done(e))
                });
        });
    });

    it('should not create a meal with incorrect data', (done) => {
        let mealName = 'Casserole';
        let cookedWeight = 'falafel';
        let servings = 5;
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .post('/api/v1/meals')
                .set('Authorization', header)
                .send({
                    mealName,
                    cookedWeight,
                    servings
                })
                .expect(400, done);
        });
    });

    it('should not create a meal with no data sent', (done) => {
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .post('/api/v1/meals')
                .set('Authorization', header)
                .send()
                .expect(400, done);
        });
    });
});

describe('GET /meals/:id', () => {
    it('should return a specific meal', (done) => {
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .get(`/api/v1/meals/${meals[0]._id.toHexString()}`)
                .set('Authorization', header)
                .expect(200)
                .expect((res) => {
                    expect(res.body.meal.mealName).toBe(meals[0].mealName);
                })
                .end(done);
        });
    });
    it('should return a 404 if not found', (done) => {
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .get('/api/v1/meals/asd')
                .set('Authorization', header)
                .expect(404)
                .end(done);
        });
    });
    it('should return a 404 if doc not found', (done) => {
        let hexId = new ObjectID().toHexString();

        createLoginToken(app, validLogin, (header) => {
            request(app)
                .get(`/api/v1/meals/${hexId}`)
                .set('Authorization', header)
                .expect(404)
                .end(done);
        });
    });
});

describe('DELETE /meals/:id', () => {
    it('should delete a meal', (done) => {
        let hexId = meals[0]._id.toHexString();
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .delete(`/api/v1/meals/${meals[0]._id.toHexString()}`)
                .set('Authorization', header)
                .expect(200)
                .expect((res) => {
                    expect(res.body.meal._id).toBe(hexId);
                })
                .end((err) => {
                    if(err) {
                        return done(err)
                    }
                    Meal.findById(hexId).then((meal) => {
                        expect(meal).toNotExist();
                        done();
                    }).catch((e) => done(e));
                })
        });
    });

    it('should return a 404 if meal not found', (done) => {
        let hexId = new ObjectID().toHexString();
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .delete(`/api/v1/meals/${hexId}`)
                .set('Authorization', header)
                .expect(404)
                .end(done);
        });
    });

    it('should return a 404 if malformed id is sent', (done) => {
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .delete('/api/v1/meals/123abc')
                .set('Authorization', header)
                .expect(404)
                .end(done);
        });
    });

});

describe('PATCH /meals/:id', () => {
    it('should update a meal if a valid request is sent', (done) => {
        let id = meals[0]._id.toHexString();
        let mealName = 'Testing update route';
        let servings = 2;
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .patch(`/api/v1/meals/${id}`)
                .set('Authorization', header)
                .send({
                    mealName,
                    servings
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.meal.mealName).toBe(mealName);
                    expect(res.body.meal.servings).toBe(servings);
                    expect(res.body.meal.portionSize).toBe(500);
                })
                .end(done);
        });
    });

    it('should return a 404 if meal is not found', (done) => {
        let id = new ObjectID().toHexString();
        let mealName = 'Testing update route';
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .patch(`/api/v1/meals/${id}`)
                .set('Authorization', header)
                .send({ mealName })
                .expect(404)
                .end(done);
        });
    });

    it('should return a 404 if malformed id is sent', (done) => {
        createLoginToken(app, validLogin, (header) => {
            request(app)
                .patch('/api/v1/meals/123abc')
                .set('Authorization', header)
                .expect(404)
                .end(done);
        });
    });
});