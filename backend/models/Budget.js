const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        limit: {
            type: Number,
            required: [true, 'Budget limit is required'],
            min: [0, 'Budget limit must be positive'],
        },
        month: {
            type: Number, // 0-11
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// Compound unique index — one budget per user per month/year
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
