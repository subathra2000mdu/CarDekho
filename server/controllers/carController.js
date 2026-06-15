const Car = require('../models/Car');

// @desc    Get all cars with filters, sorting, pagination
// @route   GET /api/cars
const getCars = async (req, res, next) => {
  try {
    const {
      bodyType,
      fuelType,
      transmission,
      make,
      minPrice,
      maxPrice,
      sort = '-expertRating',
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    const filter = {};
    if (bodyType) filter.bodyType = { $in: bodyType.split(',') };
    if (fuelType) filter.fuelType = { $in: fuelType.split(',') };
    if (transmission) filter.transmission = { $in: transmission.split(',') };
    if (make) filter.make = { $in: make.split(',') };

    // Price range filter
    if (minPrice || maxPrice) {
      filter['priceRange.min'] = {};
      filter['priceRange.max'] = {};
      if (minPrice) filter['priceRange.min'].$lte = parseFloat(maxPrice || 100);
      if (maxPrice) filter['priceRange.max'].$gte = parseFloat(minPrice || 0);
      // Clean up empty objects
      if (Object.keys(filter['priceRange.min']).length === 0) delete filter['priceRange.min'];
      if (Object.keys(filter['priceRange.max']).length === 0) delete filter['priceRange.max'];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [cars, total] = await Promise.all([
      Car.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Car.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: cars,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search cars by keyword
// @route   GET /api/cars/search
const searchCars = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Use regex for flexible matching (text index can be too strict)
    const regex = new RegExp(q, 'i');
    const cars = await Car.find({
      $or: [
        { make: regex },
        { model: regex },
        { bodyType: regex },
        { fuelType: regex },
        { tags: regex },
      ],
    })
      .sort('-expertRating')
      .limit(20)
      .lean();

    res.json({ success: true, data: cars, total: cars.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).lean();
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

// @desc    Get multiple cars for comparison
// @route   GET /api/cars/compare
const compareCars = async (req, res, next) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ success: false, message: 'Car IDs are required' });
    }

    const idArray = ids.split(',').slice(0, 3); // Max 3 cars
    const cars = await Car.find({ _id: { $in: idArray } }).lean();

    res.json({ success: true, data: cars });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter metadata (available options)
// @route   GET /api/cars/meta/filters
const getFilterMeta = async (req, res, next) => {
  try {
    const [makes, bodyTypes, fuelTypes, transmissions, priceRange] = await Promise.all([
      Car.distinct('make'),
      Car.distinct('bodyType'),
      Car.distinct('fuelType'),
      Car.distinct('transmission'),
      Car.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$priceRange.min' },
            maxPrice: { $max: '$priceRange.max' },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        makes: makes.sort(),
        bodyTypes: bodyTypes.sort(),
        fuelTypes: fuelTypes.sort(),
        transmissions: transmissions.sort(),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 100 },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Smart recommendation engine
// @route   POST /api/cars/recommend
//
// The recommendation engine works in two phases:
// Phase 1 (Hard filters): Eliminate cars that don't meet budget & fuel constraints
// Phase 2 (Soft scoring): Score remaining cars on preferences using weighted scoring
const recommendCars = async (req, res, next) => {
  try {
    const {
      budget,        // { min: 5, max: 15 } in lakhs
      bodyTypes,     // ["SUV", "Hatchback"] - preferred body types
      fuelTypes,     // ["Petrol", "Diesel"] - preferred fuel types
      seating,       // 5 or 7
      priorities,    // { mileage: 5, safety: 4, performance: 3, features: 2, budget: 1 }
                     // Each value 1-5, higher = more important
    } = req.body;

    // Phase 1: Hard filters - must match budget
    const hardFilter = {};

    if (budget) {
      // Car's starting price must be within budget range
      hardFilter['priceRange.min'] = { $lte: budget.max || 100 };
      hardFilter['priceRange.max'] = { $gte: budget.min || 0 };
    }

    if (fuelTypes && fuelTypes.length > 0) {
      hardFilter.fuelType = { $in: fuelTypes };
    }

    if (seating) {
      if (seating >= 7) {
        hardFilter.seatingCapacity = { $gte: 7 };
      }
    }

    const candidates = await Car.find(hardFilter).lean();

    if (candidates.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No cars found matching your criteria. Try adjusting your budget or preferences.',
      });
    }

    // Phase 2: Soft scoring
    const defaultPriorities = {
      mileage: 3,
      safety: 3,
      performance: 3,
      features: 3,
      budget: 3,
    };
    const p = { ...defaultPriorities, ...priorities };

    // Normalize priorities to weights (0-1)
    const totalPriority = Object.values(p).reduce((a, b) => a + b, 0);
    const weights = {};
    for (const key of Object.keys(p)) {
      weights[key] = p[key] / totalPriority;
    }

    // Calculate min/max for normalization across candidates
    const stats = {
      mileage: { min: Infinity, max: -Infinity },
      safety: { min: Infinity, max: -Infinity },
      power: { min: Infinity, max: -Infinity },
      expertRating: { min: Infinity, max: -Infinity },
      price: { min: Infinity, max: -Infinity },
    };

    candidates.forEach((car) => {
      const avgMileage = ((car.mileage?.city || 0) + (car.mileage?.highway || 0)) / 2;
      const safetyScore = (car.safety?.rating || 0) * 2 + (car.safety?.airbags || 0) * 0.5;
      const power = car.engine?.power || 0;
      const rating = car.expertRating || 0;
      const price = car.priceRange?.min || 0;

      stats.mileage.min = Math.min(stats.mileage.min, avgMileage);
      stats.mileage.max = Math.max(stats.mileage.max, avgMileage);
      stats.safety.min = Math.min(stats.safety.min, safetyScore);
      stats.safety.max = Math.max(stats.safety.max, safetyScore);
      stats.power.min = Math.min(stats.power.min, power);
      stats.power.max = Math.max(stats.power.max, power);
      stats.expertRating.min = Math.min(stats.expertRating.min, rating);
      stats.expertRating.max = Math.max(stats.expertRating.max, rating);
      stats.price.min = Math.min(stats.price.min, price);
      stats.price.max = Math.max(stats.price.max, price);
    });

    // Helper: normalize value to 0-1 range
    const normalize = (value, min, max) => {
      if (max === min) return 0.5;
      return (value - min) / (max - min);
    };

    // Score each car
    const scored = candidates.map((car) => {
      const avgMileage = ((car.mileage?.city || 0) + (car.mileage?.highway || 0)) / 2;
      const safetyScore = (car.safety?.rating || 0) * 2 + (car.safety?.airbags || 0) * 0.5;
      const power = car.engine?.power || 0;
      const rating = car.expertRating || 0;
      const price = car.priceRange?.min || 0;

      // Normalized scores (0-1)
      const mileageNorm = normalize(avgMileage, stats.mileage.min, stats.mileage.max);
      const safetyNorm = normalize(safetyScore, stats.safety.min, stats.safety.max);
      const performanceNorm = normalize(power, stats.power.min, stats.power.max);
      const featuresNorm = normalize(rating, stats.expertRating.min, stats.expertRating.max);
      // For budget, lower price = higher score
      const budgetNorm = 1 - normalize(price, stats.price.min, stats.price.max);

      // Weighted score
      let score =
        mileageNorm * weights.mileage +
        safetyNorm * weights.safety +
        performanceNorm * weights.performance +
        featuresNorm * weights.features +
        budgetNorm * weights.budget;

      // Bonus for matching preferred body type
      if (bodyTypes && bodyTypes.length > 0 && bodyTypes.includes(car.bodyType)) {
        score += 0.15;
      }

      // Convert to percentage (cap at 99)
      const matchPercentage = Math.min(Math.round(score * 100), 99);

      // Generate reasoning
      const reasons = [];
      if (mileageNorm > 0.7) reasons.push('Excellent fuel efficiency');
      if (safetyNorm > 0.7) reasons.push('Top-tier safety ratings');
      if (performanceNorm > 0.7) reasons.push('Powerful engine');
      if (budgetNorm > 0.7) reasons.push('Great value for money');
      if (featuresNorm > 0.7) reasons.push('Highly rated by experts');
      if (bodyTypes && bodyTypes.includes(car.bodyType)) reasons.push(`Matches your ${car.bodyType} preference`);

      if (reasons.length === 0) reasons.push('Well-rounded performer in its segment');

      return {
        ...car,
        matchPercentage,
        reasons,
        scores: {
          mileage: Math.round(mileageNorm * 100),
          safety: Math.round(safetyNorm * 100),
          performance: Math.round(performanceNorm * 100),
          features: Math.round(featuresNorm * 100),
          budget: Math.round(budgetNorm * 100),
        },
      };
    });

    // Sort by match percentage, take top 6
    scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const topRecommendations = scored.slice(0, 6);

    res.json({
      success: true,
      data: topRecommendations,
      total: candidates.length,
      message: `Found ${topRecommendations.length} great matches from ${candidates.length} cars.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCars,
  searchCars,
  getCarById,
  compareCars,
  getFilterMeta,
  recommendCars,
};
