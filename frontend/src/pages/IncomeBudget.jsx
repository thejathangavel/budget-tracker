import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Target, CheckCircle } from 'lucide-react';
import { getIncome, setIncome, getBudget, setBudget, getExpenses } from '../api';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export default function IncomeBudget() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth());
    const [year] = useState(now.getFullYear());

    const [incomeData, setIncomeData] = useState({ amount: 0, source: '' });
    const [budgetData, setBudgetData] = useState({ limit: 0 });
    const [totalExpenses, setTotalExpenses] = useState(0);

    const [incomeForm, setIncomeForm] = useState({ amount: '', source: 'Salary' });
    const [budgetForm, setBudgetForm] = useState({ limit: '' });

    const [savingIncome, setSavingIncome] = useState(false);
    const [savingBudget, setSavingBudget] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [incRes, budRes, expRes] = await Promise.all([
                getIncome(month, year),
                getBudget(month, year),
                getExpenses(month, year),
            ]);
            setIncomeData(incRes.data);
            setBudgetData(budRes.data);
            setTotalExpenses(expRes.data.reduce((s, e) => s + e.amount, 0));
            setIncomeForm({ amount: incRes.data.amount || '', source: incRes.data.source || 'Salary' });
            setBudgetForm({ limit: budRes.data.limit || '' });
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [month, year]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSaveIncome = async (e) => {
        e.preventDefault();
        if (!incomeForm.amount || Number(incomeForm.amount) < 0) return toast.error('Please enter a valid amount');
        setSavingIncome(true);
        try {
            await setIncome({ amount: Number(incomeForm.amount), source: incomeForm.source, month, year });
            toast.success('Income saved ✅');
            fetchData();
        } catch {
            toast.error('Failed to save income');
        } finally {
            setSavingIncome(false);
        }
    };

    const handleSaveBudget = async (e) => {
        e.preventDefault();
        if (!budgetForm.limit || Number(budgetForm.limit) < 0) return toast.error('Please enter a valid budget limit');
        setSavingBudget(true);
        try {
            await setBudget({ limit: Number(budgetForm.limit), month, year });
            toast.success('Budget limit saved ✅');
            fetchData();
        } catch {
            toast.error('Failed to save budget');
        } finally {
            setSavingBudget(false);
        }
    };

    const budgetPct = budgetData.limit > 0 ? Math.min((totalExpenses / budgetData.limit) * 100, 100) : 0;
    const progressClass = budgetPct >= 90 ? 'danger' : budgetPct >= 70 ? 'warning' : 'safe';

    const bgColors = {
        danger: 'bg-gradient-to-r from-red-500 to-red-400',
        warning: 'bg-gradient-to-r from-amber-500 to-amber-400',
        safe: 'bg-gradient-to-r from-emerald-500 to-emerald-400'
    };
    const textColors = {
        danger: 'text-red-600 dark:text-red-400',
        warning: 'text-amber-600 dark:text-amber-400',
        safe: 'text-emerald-600 dark:text-emerald-400'
    };

    const balance = incomeData.amount - totalExpenses;

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="p-6 md:px-10 md:pt-10 md:pb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Income & Budget 💰</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Set your monthly income and spending limit</p>
                </div>

                <div className="px-6 md:px-10 pb-12 space-y-6">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Month:</label>
                        <select
                            className="form-input w-auto py-2 pr-10"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b90a7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', appearance: 'none' }}
                        >
                            {SHORT.map((m, i) => <option key={i} value={i}>{m} {year}</option>)}
                        </select>
                    </div>

                    <div className="card p-5 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Income', value: fmt(incomeData.amount), color: 'text-emerald-600 dark:text-emerald-400' },
                            { label: 'Expenses', value: fmt(totalExpenses), color: 'text-red-600 dark:text-red-400' },
                            { label: 'Balance', value: fmt(Math.abs(balance)), color: balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400' },
                            { label: 'Budget Limit', value: fmt(budgetData.limit), color: 'text-amber-500' },
                        ].map(({ label, value, color }) => (
                            <div key={label}>
                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{label}</div>
                                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {budgetData.limit > 0 && (
                        <div className="card p-5 md:p-6">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                <Target size={16} className="text-slate-400" /> {MONTHS[month]} Budget Progress
                            </h3>
                            <div className="flex justify-between items-center mb-2.5 text-sm">
                                <span className="text-slate-500 dark:text-slate-400">
                                    <strong className="text-slate-900 dark:text-white">{fmt(totalExpenses)}</strong> spent of {fmt(budgetData.limit)} limit
                                </span>
                                <span className="font-semibold text-slate-900 dark:text-white">{fmt(Math.max(budgetData.limit - totalExpenses, 0))} remaining</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 dark:bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden mb-2">
                                <div className={`h-full rounded-full transition-all duration-700 ${bgColors[progressClass]}`} style={{ width: `${budgetPct}%` }} />
                            </div>
                            <div className={`text-xs font-semibold text-right ${textColors[progressClass]}`}>
                                {budgetPct.toFixed(1)}% of budget used
                                {progressClass === 'danger' && ' ⚠️ Budget almost full!'}
                                {progressClass === 'warning' && ' — Getting close!'}
                                {progressClass === 'safe' && ' — You\'re doing well! 🎉'}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Income Card */}
                        <div className="card p-6 md:p-7">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-1.5">
                                <TrendingUp size={20} className="text-emerald-500" /> Monthly Income
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Set your income for {MONTHS[month]} {year}</p>

                            {!loading && (
                                <div className="bg-slate-50 dark:bg-[#252840] border border-slate-200 dark:border-[rgba(255,255,255,0.05)] rounded-xl p-4 md:px-5 flex items-center justify-between mb-6">
                                    <div>
                                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">Current Income</div>
                                        <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(incomeData.amount)}</div>
                                    </div>
                                    {incomeData.source && (
                                        <div className="text-right">
                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">Source</div>
                                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{incomeData.source}</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSaveIncome} className="space-y-4 md:space-y-5">
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">Income Amount (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
                                        <input className="form-input pl-8" type="number" min="0" step="100" placeholder="e.g. 50000" value={incomeForm.amount} onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">Income Source</label>
                                    <input className="form-input" type="text" placeholder="e.g. Salary, Freelance" value={incomeForm.source} onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })} />
                                </div>
                                <button type="submit" className="btn btn-primary w-full" disabled={savingIncome}>
                                    <CheckCircle size={16} /> {savingIncome ? 'Saving...' : 'Save Income'}
                                </button>
                            </form>
                        </div>

                        {/* Budget Card */}
                        <div className="card p-6 md:p-7">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-1.5">
                                <Target size={20} className="text-amber-500" /> Monthly Budget
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Set a spending limit for {MONTHS[month]} {year}</p>

                            {!loading && (
                                <div className="bg-slate-50 dark:bg-[#252840] border border-slate-200 dark:border-[rgba(255,255,255,0.05)] rounded-xl p-4 md:px-5 flex items-center justify-between mb-6">
                                    <div>
                                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">Current Budget Limit</div>
                                        <div className="text-xl md:text-2xl font-bold text-amber-500">{fmt(budgetData.limit)}</div>
                                    </div>
                                    {budgetData.limit > 0 && (
                                        <div className="text-right">
                                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">Status</div>
                                            <div className={`text-sm font-semibold ${textColors[progressClass]}`}>
                                                {progressClass === 'safe' ? '✅ On Track' : progressClass === 'warning' ? '⚡ Warning' : '🚨 Over Limit'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSaveBudget} className="space-y-4 md:space-y-5">
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">Budget Limit (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
                                        <input className="form-input pl-8" type="number" min="0" step="500" placeholder="e.g. 30000" value={budgetForm.limit} onChange={(e) => setBudgetForm({ limit: e.target.value })} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tips</label>
                                    <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-200 rounded-lg p-3.5 text-xs leading-relaxed">
                                        💡 A good rule is the <strong className="font-semibold text-blue-900 dark:text-blue-100">50/30/20 rule</strong>: 50% needs, 30% wants, 20% savings.
                                        With income of <b>{fmt(incomeData.amount)}</b>, consider a limit of <b>{fmt(incomeData.amount * 0.8)}</b>.
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-full shadow-amber-500/30 hover:shadow-amber-500/40 from-amber-500 to-orange-500 bg-gradient-to-r" disabled={savingBudget}>
                                    <CheckCircle size={16} /> {savingBudget ? 'Saving...' : 'Set Budget Limit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
