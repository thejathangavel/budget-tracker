import { useState, useEffect, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../api';
import Sidebar from '../components/Sidebar';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseModal from '../components/ExpenseModal';
import toast from 'react-hot-toast';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Expenses() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth());
    const [year] = useState(now.getFullYear());

    const [expenses, setExpenses] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getExpenses(month, year);
            setExpenses(res.data);
        } catch {
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    }, [month, year]);

    useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            q ? expenses.filter((e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)) : expenses
        );
    }, [expenses, search]);

    const handleAdd = () => {
        setEditTarget(null);
        setModalOpen(true);
    };

    const handleEdit = (expense) => {
        setEditTarget(expense);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await deleteExpense(id);
            toast.success('Expense deleted');
            fetchExpenses();
        } catch {
            toast.error('Failed to delete expense');
        }
    };

    const handleSubmit = async (data) => {
        setSubmitting(true);
        try {
            if (editTarget) {
                await updateExpense(editTarget._id, data);
                toast.success('Expense updated ✅');
            } else {
                await addExpense(data);
                toast.success('Expense added ✅');
            }
            setModalOpen(false);
            fetchExpenses();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save expense');
        } finally {
            setSubmitting(false);
        }
    };

    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="p-6 md:px-10 md:pt-10 md:pb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Expenses 💸</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage your spending</p>
                </div>

                <div className="px-6 md:px-10 pb-12 space-y-6">
                    {/* Controls Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Month:</label>
                            <select
                                className="form-input w-auto py-2 pr-10"
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b90a7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', appearance: 'none' }}
                            >
                                {MONTHS.map((m, i) => <option key={i} value={i}>{m} {year}</option>)}
                            </select>
                        </div>

                        {/* Search */}
                        <div className="relative flex-1 max-w-sm">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                className="form-input pl-10 py-2"
                                placeholder="Search expenses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary sm:ml-auto" onClick={handleAdd}>
                            <Plus size={16} /> Add Expense
                        </button>
                    </div>

                    {/* Summary Strip */}
                    <div className="card p-5 md:p-6 flex flex-wrap gap-8 md:gap-14">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Total Spent</div>
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{fmt(total)}</div>
                        </div>
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Transactions</div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{expenses.length}</div>
                        </div>
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Avg per Transaction</div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {expenses.length ? fmt(total / expenses.length) : '—'}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="card overflow-hidden">
                        <div className="flex items-center justify-between p-5 md:px-6 border-b border-slate-200 dark:border-[rgba(255,255,255,0.08)]">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">All Expenses — {MONTHS[month]} {year}</h3>
                            <span className="text-[13px] text-slate-500 dark:text-slate-400">{filtered.length} records</span>
                        </div>

                        {loading ? (
                            <div className="p-16 flex justify-center"><div className="loader-spinner" /></div>
                        ) : (
                            <ExpenseTable expenses={filtered} onEdit={handleEdit} onDelete={handleDelete} />
                        )}
                    </div>
                </div>
            </main>

            <ExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initial={editTarget} loading={submitting} />
        </div>
    );
}
