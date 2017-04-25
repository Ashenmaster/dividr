const express = require('express');
const router = express.Router();

const meal_controller = require('./../controllers/meals/meals');

router.get('/', meal_controller.listMeals);

router.post('/', meal_controller.createMeal);

router.get('/:id', meal_controller.getMeal);

router.delete('/:id', meal_controller.deleteMeal);

router.patch('/:id', meal_controller.updateMeal);

module.exports = router;