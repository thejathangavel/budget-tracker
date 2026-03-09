const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const protect = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   POST /api/expenses
// @desc    Add a new expense
router.post('/', async (req, res) => {
    const { title, amount, category, date, note } = req.body;

    if (!title || !amount || !category) {
        return res.status(400).json({ message: 'Title, amount, and category are required' });
    }

    try {
        const expense = await Expense.create({
            user: req.userId,
            title,
            amount,
            category,
            date: date || Date.now(),
            note,
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/expenses
// @desc    Get all expenses for current user (optionally filter by month/year)
router.get('/', async (req, res) => {
    try {
        const { month, year } = req.query;
        let query = { user: req.userId };

        if (month !== undefined && year !== undefined) {
            const startDate = new Date(Number(year), Number(month), 1);
            const endDate = new Date(Number(year), Number(month) + 1, 0, 23, 59, 59);
            query.date = { $gte: startDate, $lte: endDate };
        }

        const expenses = await Expense.find(query).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense
router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.userId });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
router.put('/:id', async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.userId });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        const { title, amount, category, date, note } = req.body;
        if (title) expense.title = title;
        if (amount !== undefined) expense.amount = amount;
        if (category) expense.category = category;
        if (date) expense.date = date;
        if (note !== undefined) expense.note = note;

        const updated = await expense.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.userId });
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        await expense.deleteOne();
        res.json({ message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/expenses/summary/category
// @desc    Get expenses grouped by category for a month
router.get('/summary/category', async (req, res) => {
    try {
        const { month, year } = req.query;
        const m = month !== undefined ? Number(month) : new Date().getMonth();
        const y = year !== undefined ? Number(year) : new Date().getFullYear();

        const startDate = new Date(y, m, 1);
        const endDate = new Date(y, m + 1, 0, 23, 59, 59);

        const summary = await Expense.aggregate([
            {
                $match: {
                    user: require('mongoose').Types.ObjectId.createFromHexString(req.userId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } },
        ]);

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/expenses/summary/monthly
// @desc    Get monthly totals for a year
router.get('/summary/monthly', async (req, res) => {
    try {
        const { year } = req.query;
        const y = year !== undefined ? Number(year) : new Date().getFullYear();

        const startDate = new Date(y, 0, 1);
        const endDate = new Date(y, 11, 31, 23, 59, 59);

        const summary = await Expense.aggregate([
            {
                $match: {
                    user: require('mongoose').Types.ObjectId.createFromHexString(req.userId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $month: '$date' },
                    total: { $sum: '$amount' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
