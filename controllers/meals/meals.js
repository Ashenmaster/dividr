const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Meal} = require('./../../models/meal');

let listMeals = (req, res) => {
    Meal.find({
        _creator: req.user._id
    }).then((meals) => {
        res.json(
            {
                user : {
                    meals,
                    profile: req.user.profile
                }
            }
        )
    }, (e) => {
        res.status(400).json({
            e
        });
    });

};

let getMeal = (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.sendStatus(404);
    }
    Meal.findOne({
        _id : id
    }).then((meal) => {
        if(!meal) {
            return res.sendStatus(404);
        }
        res.status(200).send({meal})
    }, () => {
        res.status(404).send();
    });

};

let createMeal = (req, res) => {
    let meal = new Meal({
        mealName : req.body.mealName,
        cookedWeight : req.body.cookedWeight,
        servings : req.body.servings,
        portionSize : Math.floor(req.body.cookedWeight / req.body.servings),
        _creator : req.user._id
    });

    if(!meal.mealName) {
        return res.status(422).send({error: 'Please provide a name for your meal'})
    }

    if(!meal.cookedWeight) {
        return res.status(422).send({error: 'Please provide a cooked weight in grams'})
    }

    if(!meal.servings) {
        return res.status(422).send({error: 'Please provide how many servings this is for'})
    }


    meal.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e);
    });
};

let deleteMeal = (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.sendStatus(404);
    }
    Meal.findOneAndRemove({
        _id : id
    }).then((meal) => {
        if(!meal) {
            return res.sendStatus(404);
        }
        res.status(200).send({meal});
    }).catch((e) => {
        res.sendStatus(400).send(e);
    });
};

let newWeek = (req, res) => {
    Meal.deleteMany({
        _creator: req.user._id
    }).then((meals) => {
        if(!meals) {
            return res.sendStatus(404);
        }
        res.status(200).send({meals});
    }).catch((e) => {
        res.sendStatus(400).send(e);
    })
};

let updateMeal = (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['mealName', 'servings', 'cookedWeight']);
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({error: 'Meal not found'});
    }

    Meal.findOneAndUpdate({
        _id : id
    }, { $set : body}, {new : true}).then((meal) => {
        if(!meal) {
            return res.sendStatus(404);
        }
        res.status(200).send({meal});
    }).catch((e) => {
        res.status(400).send(e);
    })
};

module.exports = {
    createMeal,
    listMeals,
    getMeal,
    deleteMeal,
    newWeek,
    updateMeal
};