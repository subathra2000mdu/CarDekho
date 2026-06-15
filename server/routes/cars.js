const express = require('express');
const router = express.Router();
const {
  getCars,
  searchCars,
  getCarById,
  compareCars,
  getFilterMeta,
  recommendCars,
} = require('../controllers/carController');

// Static routes must come before :id route
router.get('/search', searchCars);
router.get('/compare', compareCars);
router.get('/meta/filters', getFilterMeta);
router.post('/recommend', recommendCars);

// Dynamic routes
router.get('/', getCars);
router.get('/:id', getCarById);

module.exports = router;
