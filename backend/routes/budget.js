const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const protect = require('../middleware/auth');

router.use(protect);

// @route   POST /api/budget
// @desc    Set or update monthly budget
router.post('/', async (req, res) => {
    const { limit, month, year } = req.body;

    if (limit === undefined) {
        return res.status(400).json({ message: 'Budget limit is required' });
    }

    const m = month !== undefined ? Number(month) : new Date().getMonth();
    const y = year !== undefined ? Number(year) : new Date().getFullYear();

    try {
        const budget = await Budget.findOneAndUpdate(
            { user: req.userId, month: m, year: y },
            { limit, month: m, year: y, user: req.userId },
            { new: true, upsert: true }
        );
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/budget
// @desc    Get budget for a month/year
router.get('/', async (req, res) => {
    try {
        const { month, year } = req.query;
        const m = month !== undefined ? Number(month) : new Date().getMonth();
        const y = year !== undefined ? Number(year) : new Date().getFullYear();

        const budget = await Budget.findOne({ user: req.userId, month: m, year: y });
        res.json(budget || { limit: 0, month: m, year: y });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
