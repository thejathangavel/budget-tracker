import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, CreditCard, TrendingUp, LogOut, Wallet, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/expenses', icon: CreditCard, label: 'Expenses' },
    { to: '/income', icon: TrendingUp, label: 'Income & Budget' },
];

export default function Sidebar() {
    const { user, logoutUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <aside className="fixed top-0 left-0 z-50 flex flex-col w-[260px] h-screen bg-white dark:bg-[#1a1d27] border-r border-slate-200 dark:border-[rgba(255,255,255,0.08)] p-6 transition-transform -translate-x-full md:translate-x-0">
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="flex items-center justify-center w-10 h-10 text-white rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                    <Wallet size={20} />
                </div>
                <div>
                    <h2 className="font-bold text-slate-900 dark:text-white leading-tight">BudgetPro</h2>
                    <small className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Monthly Tracker</small>
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1.5">
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 px-3 py-2 mt-2">Menu</div>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative
              ${isActive
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#252840] hover:text-slate-900 dark:hover:text-white'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 dark:bg-blue-500 rounded-r-md" />}
                                <Icon size={18} />
                                {label}
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#252840] hover:text-slate-900 dark:hover:text-white mt-auto"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
            </nav>

            <div className="pt-4 mt-2 border-t border-slate-200 dark:border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-[#252840] rounded-xl">
                    <div className="flex items-center justify-center w-8 h-8 text-[13px] font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <strong className="block text-[13px] font-semibold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</strong>
                        <small className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</small>
                    </div>
                    <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors" title="Logout">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
