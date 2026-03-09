const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const protect = require('../middleware/auth');

router.use(protect);

// @route   POST /api/income
// @desc    Set/update monthly income
router.post('/', async (req, res) => {
    const { amount, source, month, year } = req.body;

    if (amount === undefined) {
        return res.status(400).json({ message: 'Amount is required' });
    }

    const m = month !== undefined ? Number(month) : new Date().getMonth();
    const y = year !== undefined ? Number(year) : new Date().getFullYear();

    try {
        // Upsert: update if exists, create if not
        const income = await Income.findOneAndUpdate(
            { user: req.userId, month: m, year: y },
            { amount, source: source || 'Salary', month: m, year: y, user: req.userId },
            { new: true, upsert: true }
        );
        res.status(201).json(income);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/income
// @desc    Get income for a specific month/year (defaults to current)
router.get('/', async (req, res) => {
    try {
        const { month, year } = req.query;
        const m = month !== undefined ? Number(month) : new Date().getMonth();
        const y = year !== undefined ? Number(year) : new Date().getFullYear();

        const income = await Income.findOne({ user: req.userId, month: m, year: y });
        res.json(income || { amount: 0, source: 'Not set', month: m, year: y });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/income/all
// @desc    Get all income records for current user
router.get('/all', async (req, res) => {
    try {
        const records = await Income.find({ user: req.userId }).sort({ year: -1, month: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
