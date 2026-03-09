const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount must be positive'],
        },
        source: {
            type: String,
            trim: true,
            default: 'Salary',
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

module.exports = mongoose.model('Income', incomeSchema);
