import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Food', 'Healthy Food', 'Junk Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Rent', 'Other'];

const defaultForm = {
    title: '', amount: '', category: 'Food', date: new Date().toISOString().slice(0, 10), note: '',
};

export default function ExpenseModal({ open, onClose, onSubmit, initial, loading }) {
    const [form, setForm] = useState(defaultForm);

    useEffect(() => {
        if (initial) {
            setForm({
                title: initial.title || '', amount: initial.amount || '', category: initial.category || 'Food',
                date: initial.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
                note: initial.note || '',
            });
        } else {
            setForm(defaultForm);
        }
    }, [initial, open]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...form, amount: Number(form.amount) });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-fade-in" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-md bg-white dark:bg-[#1e2130] border border-slate-200 dark:border-[rgba(255,255,255,0.08)] rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {initial ? '✏️ Edit Expense' : '➕ Add Expense'}
                        </h2>
                        <button className="btn btn-secondary p-2 rounded-lg" onClick={onClose}><X size={16} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">Title *</label>
                            <input className="form-input" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Pizza dinner" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">Amount (₹) *</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
                                    <input className="form-input pl-8" name="amount" type="number" min="1" step="0.01" value={form.amount} onChange={handleChange} placeholder="0" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">Date *</label>
                                <input className="form-input" name="date" type="date" value={form.date} onChange={handleChange} required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">Category *</label>
                            <select className="form-input" name="category" value={form.category} onChange={handleChange} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b90a7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '36px', appearance: 'none' }}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">Note (optional)</label>
                            <input className="form-input" name="note" value={form.note} onChange={handleChange} placeholder="Any extra info..." />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                                {loading ? 'Saving...' : initial ? 'Update' : 'Add Expense'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
