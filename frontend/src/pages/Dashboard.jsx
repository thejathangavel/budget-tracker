import { useState, useEffect, useCallback } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Filler, Legend, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Wallet, Target, Heart } from 'lucide-react';
import { getExpenses, getIncome, getBudget, getMonthlySummary, getCategorySummary } from '../api';
import Sidebar from '../components/Sidebar';
import ExpenseTable from '../components/ExpenseTable';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Filler, Legend, ArcElement);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PIE_COLORS = ['#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#06b6d4', '#f97316', '#8b5cf6'];
const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth());
    const [year] = useState(now.getFullYear());
    const { theme } = useTheme();

    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState({ amount: 0 });
    const [budget, setBudget] = useState({ limit: 0 });
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [expRes, incRes, budRes, monthlyRes, catRes] = await Promise.all([
                getExpenses(month, year), getIncome(month, year), getBudget(month, year), getMonthlySummary(year), getCategorySummary(month, year)
            ]);
            setExpenses(expRes.data);
            setIncome(incRes.data);
            setBudget(budRes.data);

            const monthly = MONTHS.map((name, i) => {
                const found = monthlyRes.data.find((d) => d._id === i + 1);
                return found ? found.total : 0;
            });
            setMonthlyData(monthly);
            setCategoryData(catRes.data.map((d) => ({ name: d._id, value: d.total })));
        } catch {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, [month, year]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = income.amount - totalExpenses;
    const budgetPct = budget.limit > 0 ? Math.min((totalExpenses / budget.limit) * 100, 100) : 0;

    let progressClass = 'bg-emerald-500';
    let progressText = 'text-emerald-600 dark:text-emerald-400';
    if (budgetPct >= 90) { progressClass = 'bg-red-500'; progressText = 'text-red-600 dark:text-red-400'; }
    else if (budgetPct >= 70) { progressClass = 'bg-amber-500'; progressText = 'text-amber-500'; }

    // Health & Spending Logic
    const healthySpending = expenses.filter(e => e.category === 'Healthy Food').reduce((sum, e) => sum + e.amount, 0);
    const junkSpending = expenses.filter(e => e.category === 'Junk Food').reduce((sum, e) => sum + e.amount, 0);
    const totalHealthRelated = healthySpending + junkSpending;
    const healthScore = totalHealthRelated > 0 ? Math.round((healthySpending / totalHealthRelated) * 100) : null;

    let healthMessage = "Log some healthy or junk food expenses to see your insights!";
    if (healthScore !== null) {
        if (healthScore >= 70) healthMessage = "Great! Most of your spending is on healthy food. Keep it up!";
        else if (healthScore >= 40) healthMessage = `You spent ${fmt(junkSpending)} on junk food this month. Try cooking at home more often!`;
        else healthMessage = `You spent ${fmt(junkSpending)} on junk food this month. Reducing junk food could improve health and save money.`;
    }

    const textColor = theme === 'dark' ? '#8b90a7' : '#64748b';
    const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    const lineChartData = {
        labels: MONTHS,
        datasets: [{
            label: 'Expenses',
            data: monthlyData,
            fill: true,
            borderColor: '#3b82f6',
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                return gradient;
            },
            tension: 0.4,
        }],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: textColor, font: { size: 12 } }, border: { display: false } },
            y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 12 }, callback: (v) => '₹' + (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v) }, border: { display: false } },
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
    };

    const pieChartData = {
        labels: categoryData.map(d => d.name),
        datasets: [{
            data: categoryData.map(d => d.value),
            backgroundColor: categoryData.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]),
            borderWidth: 0,
        }],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { color: textColor, font: { size: 12 }, padding: 20, usePointStyle: true } },
            tooltip: { callbacks: { label: (ctx) => `  ${fmt(ctx.raw)}` } }
        },
        cutout: '65%',
    };

    const healthChartData = {
        labels: ['Healthy Food', 'Junk Food'],
        datasets: [{
            data: [healthySpending, junkSpending],
            backgroundColor: ['#22c55e', '#ef4444'], // Green vs Red
            borderWidth: 0,
        }],
    };

    const healthChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: textColor, font: { size: 12 }, padding: 15, usePointStyle: true } },
            tooltip: { callbacks: { label: (ctx) => `  ${fmt(ctx.raw)}` } }
        },
        cutout: '70%',
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="p-6 md:px-10 md:pt-10 md:pb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Dashboard 📊</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your finances</p>
                </div>

                <div className="px-6 md:px-10 pb-12 space-y-6">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Viewing:</label>
                        <select
                            className="form-input w-auto py-2 pr-10"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238b90a7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', appearance: 'none' }}
                        >
                            {MONTHS.map((m, i) => <option key={i} value={i}>{m} {year}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <div className="card p-5 md:p-6 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Income</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{fmt(income.amount)}</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Income</p>
                        </div>

                        <div className="card p-5 md:p-6 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform"><TrendingDown size={24} /></div>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-600 dark:text-red-400">Spent</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{fmt(totalExpenses)}</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</p>
                        </div>

                        <div className="card p-5 md:p-6 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Wallet size={24} /></div>
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${balance >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                                    {balance >= 0 ? 'Surplus' : 'Deficit'}
                                </span>
                            </div>
                            <h3 className={`text-3xl font-bold mb-1 ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {fmt(Math.abs(balance))}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Remaining Balance</p>
                        </div>

                        <div className="card p-5 md:p-6 group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Target size={24} /></div>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-500">Budget</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{fmt(budget.limit || 0)}</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Budget</p>
                        </div>
                    </div>

                    {budget.limit > 0 && (
                        <div className="card p-5 md:p-6">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                <Target size={16} className="text-slate-400" /> {MONTHS[month]} Budget Progress
                            </h3>
                            <div className="flex justify-between items-center mb-2.5 text-sm">
                                <span className="text-slate-500 dark:text-slate-400">
                                    <strong className="text-slate-900 dark:text-white">{fmt(totalExpenses)}</strong> spent of {fmt(budget.limit)} limit
                                </span>
                                <span className="font-semibold text-slate-900 dark:text-white">{fmt(Math.max(budget.limit - totalExpenses, 0))} remaining</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-2">
                                <div className={`h-full rounded-full transition-all duration-700 ${progressClass}`} style={{ width: `${budgetPct}%` }} />
                            </div>
                            <div className={`text-xs font-semibold text-right ${progressText}`}>
                                {budgetPct.toFixed(1)}% of budget used
                                {budgetPct >= 90 && ' ⚠️ Budget almost full!'}
                                {budgetPct >= 70 && budgetPct < 90 && ' — Watch out!'}
                            </div>
                        </div>
                    )}

                    {!loading && (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="card p-5 md:p-6">
                                    <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-6">📈 Monthly Trend ({year})</h3>
                                    <div className="h-[260px]">
                                        <Line data={lineChartData} options={lineChartOptions} />
                                    </div>
                                </div>

                                <div className="card p-5 md:p-6">
                                    <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-6">🍕 Categories — {MONTHS[month]}</h3>
                                    {categoryData.length === 0 ? (
                                        <div className="h-[260px] flex items-center justify-center text-slate-500 dark:text-slate-400">No expenses this month</div>
                                    ) : (
                                        <div className="h-[260px]">
                                            <Doughnut data={pieChartData} options={pieChartOptions} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="card p-5 md:p-6 mt-6">
                                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                                    <Heart size={18} className="text-pink-500 fill-pink-500/20" /> Health & Spending Insights
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-4 bg-slate-50 dark:bg-[#252840] rounded-2xl border border-slate-200 dark:border-white/5 text-center flex-1">
                                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Health Score</div>
                                                <div className={`text-4xl font-black ${healthScore >= 70 ? 'text-emerald-500' : healthScore >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                                                    {healthScore !== null ? `${healthScore}%` : '--'}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-blue-50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20 mb-6">
                                            {healthMessage}
                                        </p>

                                        <div>
                                            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Health Tips</h4>
                                            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                                <li className="flex items-start gap-2.5">
                                                    <span className="text-emerald-500 mt-0.5">•</span>
                                                    <span>Cooking at home saves money and improves nutrition.</span>
                                                </li>
                                                <li className="flex items-start gap-2.5">
                                                    <span className="text-emerald-500 mt-0.5">•</span>
                                                    <span>Avoid frequent junk food orders.</span>
                                                </li>
                                                <li className="flex items-start gap-2.5">
                                                    <span className="text-emerald-500 mt-0.5">•</span>
                                                    <span>Healthy groceries are usually cheaper long-term.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="h-[280px]">
                                        {totalHealthRelated === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 text-sm bg-slate-50 rounded-2xl dark:bg-[#252840] border border-slate-200 dark:border-white/5">
                                                <Heart size={32} className="mb-2 opacity-20" />
                                                No food data logged
                                            </div>
                                        ) : (
                                            <Doughnut data={healthChartData} options={healthChartOptions} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="card overflow-hidden mt-6">
                        <div className="flex items-center justify-between p-5 md:px-6 border-b border-slate-200 dark:border-white/5">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-0">🧾 Recent Expenses</h3>
                            <span className="text-[13px] text-slate-500 dark:text-slate-400">{expenses.length} records</span>
                        </div>
                        {loading ? (
                            <div className="p-16 flex justify-center"><div className="loader-spinner" /></div>
                        ) : (
                            <ExpenseTable expenses={expenses.slice(0, 7)} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
