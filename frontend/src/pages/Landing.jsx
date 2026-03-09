import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, ShieldCheck, BarChart3, Target, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
    {
        icon: <TrendingUp size={22} />,
        title: 'Track Expenses',
        desc: 'Log every rupee you spend across custom categories. Never lose track again.',
        color: 'text-blue-500', bg: 'bg-blue-500/10 dark:bg-blue-500/10',
    },
    {
        icon: <Target size={22} />,
        title: 'Set Budget Limits',
        desc: 'Define monthly spending limits and get instant alerts as you approach them.',
        color: 'text-amber-500', bg: 'bg-amber-500/10',
    },
    {
        icon: <BarChart3 size={22} />,
        title: 'Analyze Spending',
        desc: 'Beautiful charts show where your money goes — monthly trends & category breakdown.',
        color: 'text-violet-500', bg: 'bg-violet-500/10',
    },
    {
        icon: <ShieldCheck size={22} />,
        title: 'Secure & Private',
        desc: 'Your financial data is protected with JWT authentication and encrypted passwords.',
        color: 'text-emerald-500', bg: 'bg-emerald-500/10',
    },
    {
        icon: <Zap size={22} />,
        title: 'Smart Insights',
        desc: 'Health score tracking distinguishes healthy vs junk food spending habits.',
        color: 'text-pink-500', bg: 'bg-pink-500/10',
    },
    {
        icon: <CheckCircle2 size={22} />,
        title: 'Income Management',
        desc: 'Record monthly income and see exactly how much you have left to spend.',
        color: 'text-cyan-500', bg: 'bg-cyan-500/10',
    },
];

const STATS = [
    { value: '100%', label: 'Free to use' },
    { value: '6+', label: 'Expense categories' },
    { value: '∞', label: 'Expenses tracked' },
    { value: '24/7', label: 'Available anytime' },
];

export default function Landing() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d16] text-slate-900 dark:text-white">

            {/* --- Navbar --- */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <Wallet size={18} />
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">BudgetPro</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary px-5 py-2.5 text-sm">
                                Go to Dashboard <ArrowRight size={14} />
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary px-5 py-2.5 text-sm hidden sm:inline-flex">
                                    Sign In
                                </Link>
                                <Link to="/signup" className="btn btn-primary px-5 py-2.5 text-sm">
                                    Get Started <ArrowRight size={14} />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <section className="relative overflow-hidden">
                {/* Background blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl" />
                </div>

                <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-8">
                        <Zap size={12} className="fill-current" /> Free · Secure · No credit card required
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
                        <span className="text-slate-900 dark:text-white">Take control</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
                            of your money
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        BudgetPro is your all-in-one monthly budget tracker. Log expenses, set limits,
                        visualize spending and build healthier financial habits — all for free.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="btn btn-primary px-8 py-4 text-base shadow-2xl shadow-blue-500/30 hover:scale-105 hover:shadow-blue-500/50 transition-all">
                            Get Started — It's Free <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" className="btn btn-secondary px-8 py-4 text-base hover:scale-105 transition-transform">
                            Sign In to Dashboard
                        </Link>
                    </div>

                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-5">
                        No credit card required. Start in 30 seconds.
                    </p>
                </div>
            </section>

            {/* --- Stats Strip --- */}
            <section className="border-y border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f1117]/60">
                <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {STATS.map((s) => (
                        <div key={s.label}>
                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 mb-1">
                                {s.value}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- Features Section --- */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 mb-4">
                        Everything you need
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                        Smart features for<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-500">smarter spending</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
                        Everything you need to understand and improve your financial habits.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((f) => (
                        <div key={f.title} className="card p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group">
                            <div className={`w-12 h-12 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                {f.icon}
                            </div>
                            <h3 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl shadow-blue-500/30">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent_60%)]" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to start saving?</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
                            Join and take control of your finances today. It only takes 30 seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-base hover:-translate-y-0.5 hover:shadow-xl transition-all">
                                Create Free Account <ArrowRight size={18} />
                            </Link>
                            <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-blue-500/40 text-white border border-white/30 font-bold px-8 py-4 rounded-xl text-base hover:-translate-y-0.5 hover:bg-blue-500/60 transition-all">
                                I already have an account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="border-t border-slate-200 dark:border-white/5 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <Wallet size={12} />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">BudgetPro</span>
                </div>
                <p>© {new Date().getFullYear()} BudgetPro — Monthly Budget Tracker</p>
            </footer>
        </div>
    );
}
