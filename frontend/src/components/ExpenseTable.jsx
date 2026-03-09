import { Pencil, Trash2 } from 'lucide-react';

const CATEGORY_COLORS = {
    Food: '#f59e0b', 'Healthy Food': '#22c55e', 'Junk Food': '#ef4444',
    Transport: '#3b82f6', Bills: '#6366f1', Shopping: '#ec4899',
    Entertainment: '#8b5cf6', Healthcare: '#10b981', Education: '#06b6d4',
    Utilities: '#f97316', Rent: '#f43f5e', Other: '#6b7280',
};

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const formatAmount = (n) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

    if (!expenses || expenses.length === 0) {
        return (
            <div className="text-center py-16 px-6 text-slate-500 dark:text-slate-400">
                <div className="text-5xl mb-4 opacity-50">📭</div>
                <p className="text-sm">No expenses found. Add your first expense!</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-[#252840] border-b border-slate-200 dark:border-[rgba(255,255,255,0.08)]">
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                        {onEdit && <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[rgba(255,255,255,0.04)]">
                    {expenses.map((exp) => (
                        <tr key={exp._id} className="hover:bg-slate-50/50 dark:hover:bg-[#252840]/60 transition-colors">
                            <td className="px-5 py-3.5">
                                <div className="font-medium text-slate-900 dark:text-white text-sm">{exp.title}</div>
                                {exp.note && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-[200px] truncate" title={exp.note}>
                                        {exp.note}
                                    </div>
                                )}
                            </td>
                            <td className="px-5 py-3.5">
                                <span
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                                    style={{
                                        background: `${CATEGORY_COLORS[exp.category]}18`,
                                        color: CATEGORY_COLORS[exp.category],
                                        borderColor: `${CATEGORY_COLORS[exp.category]}30`,
                                    }}
                                >
                                    {exp.category}
                                </span>
                            </td>
                            <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(exp.date)}</td>
                            <td className="px-5 py-3.5 text-sm font-semibold text-red-600 dark:text-red-400 whitespace-nowrap">{formatAmount(exp.amount)}</td>
                            {onEdit && (
                                <td className="px-5 py-3.5">
                                    <div className="flex gap-2">
                                        <button
                                            className="p-1.5 text-slate-400 hover:text-blue-500 bg-slate-100/50 hover:bg-blue-50 dark:bg-[#252840] dark:hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors"
                                            onClick={() => onEdit(exp)} title="Edit"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button
                                            className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-100/50 hover:bg-red-50 dark:bg-[#252840] dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-lg transition-colors"
                                            onClick={() => onDelete(exp._id)} title="Delete"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
