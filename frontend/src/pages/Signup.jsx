import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Wallet } from 'lucide-react';

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) return setError('Password must be at least 6 characters');
        setError('');
        setLoading(true);
        try {
            const res = await signup(form);
            loginUser(res.data, res.data.token);
            toast.success(`Account created! Welcome, ${res.data.name}! 🎉`);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0f1117]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent dark:from-emerald-900/20 dark:via-transparent dark:to-transparent pointer-events-none" />

            <div className="w-full max-w-[440px] bg-white dark:bg-[#1e2130] border border-slate-200 dark:border-[rgba(255,255,255,0.08)] rounded-[24px] p-10 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none relative z-10 animate-fade-in-up">

                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4">
                        <Wallet size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">BudgetPro</h1>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Monthly Budget Tracker</span>
                </div>

                <h2 className="text-[26px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-indigo-300 mb-2">Create account</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Start tracking your budget today</p>

                {error && <div className="bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 rounded-lg p-3 text-sm mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-2">Full Name</label>
                        <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-2">Email address</label>
                        <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400 mb-2">Password</label>
                        <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-full py-3.5 text-[15px] mt-2" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 dark:text-indigo-400 font-medium hover:underline">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
