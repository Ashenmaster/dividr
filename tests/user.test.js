const request  = require('supertest');
const expect = require('expect');

const {mongoose} = require('mongoose');
// Local files
const app = require('./../app');
const {validUsers, validUser2, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

describe('POST /register', () => {
    it('should FAIL [422] to create a user without parameters', (done) => {
        request(app)
            .post('/api/v1/register')
            .expect(422)
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.error).toEqual('You must enter an email address.');
                done();
            });
    });

    it('should FAIL [422] to create a user with an invalid e-mail address', (done) => {
        request(app)
            .post('/api/v1/register')
            .send({ email: 'test', firstName: 'Chris', lastName: 'Gray', password: 'secret'})
            .expect(422)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.error).toEqual('Please enter a valid e-mail address');
                done();
            });
    });

    it('should FAIL [422] to create a user with incomplete parameters', (done) => {
        request(app)
            .post('/api/v1/register')
            .send({ email: 'johndoe@exampledomain.com', lastName: 'Doe', firstName: 'John' })
            .expect(422)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.error).toEqual('You must enter a password.');
                done();
            });
    });

    it('should CREATE [201] a valid user', (done) => {
        request(app)
            .post('/api/v1/register')
            .send(validUser2)
            .expect(201)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.token).toBeA('string');
                expect(res.body.user).toBeA('object');
                done();
            });
    });

    it('should FAIL [422] to create a user with occupied email', (done) => {
        request(app)
            .post('/api/v1/register')
            .send(validUsers[0])
            .expect(422)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.error).toEqual('That email address is already in use.');
                done();
            });
    });
});

describe('POST /login', () => {
    before((done) => {
        request(app)
            .post('/api/v1/register')
            .send(validUser2)
            .expect(201)
            .end((err) => {
                if (err) done(err);
                done();
            });
    });

    it('should FAIL [400] to login without parameters', (done) => {
        request(app)
            .post('/api/v1/login')
            .expect(400, done);
    });

    it('should FAIL [400] to login with bad parameters', (done) => {
        request(app)
            .post('/api/v1/login')
            .send({ wrongParam: 'err' })
            .expect(400, done);
    });

    it('should FAIL [401] to login with invalid credentials', (done) => {
        request(app)
            .post('/api/v1/login')
            .send({ email: 'err', password: '22' })
            .expect(401, done);
    });

    it('should LOGIN [200] with valid credential', (done) => {
        request(app)
            .post('/api/v1/login')
            .send({
                email: "johndoe@exampledomain.com",
                password: "secret"
            })
            .expect(200)
            .end((err, res) => {
                if (err){
                    done(err);
                }
                expect(res.body.token).toBeA("string");
                expect(res.body.user).toBeA("object");
                done();
            });
    });
});

describe('GET /logout', () => {
    it('should LOGOUT when requested', (done) => {
        request(app)
            .get('/api/v1/logout')
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                expect(res.user).toNotExist();
                done();
            });
    });
});