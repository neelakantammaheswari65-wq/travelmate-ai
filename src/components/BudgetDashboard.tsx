import React, { useState } from 'react';
import { 
  IndianRupee, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  PieChart, 
  ArrowUpRight, 
  Coins,
  Receipt
} from 'lucide-react';
import { BudgetBreakdown, ExpenseItem } from '../types';

interface BudgetDashboardProps {
  budget: BudgetBreakdown;
  onUpdateExpenses?: (expenses: ExpenseItem[]) => void;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ budget }) => {
  const [loggedExpenses, setLoggedExpenses] = useState<ExpenseItem[]>([
    {
      id: 'exp-1',
      title: 'Advance Hotel Booking Token',
      category: 'Hotel',
      amount: 800,
      date: 'Today'
    },
    {
      id: 'exp-2',
      title: 'Prakasam Barrage RTC Electric Bus Ticket',
      category: 'Transport',
      amount: 60,
      date: 'Today'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<'Hotel' | 'Food' | 'Transport' | 'Attractions' | 'Shopping/Misc'>('Food');

  const totalLogged = loggedExpenses.reduce((sum, item) => sum + item.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || Number(newAmount) <= 0) return;

    const newItem: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      amount: Number(newAmount),
      date: 'Today'
    };

    setLoggedExpenses([newItem, ...loggedExpenses]);
    setNewTitle('');
    setNewAmount('');
    setShowAddModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    setLoggedExpenses(loggedExpenses.filter((item) => item.id !== id));
  };

  const percentUsed = Math.min(100, Math.round((budget.total / budget.userBudget) * 100));

  const categoryItems = [
    { label: 'Hotel & Stay', amount: budget.hotel, color: 'bg-indigo-500', barColor: 'bg-indigo-500', textColor: 'text-indigo-700' },
    { label: 'Food & Dining', amount: budget.food, color: 'bg-amber-500', barColor: 'bg-amber-500', textColor: 'text-amber-700' },
    { label: 'Local Transport', amount: budget.transport, color: 'bg-emerald-500', barColor: 'bg-emerald-500', textColor: 'text-emerald-700' },
    { label: 'Attractions & Entry', amount: budget.attractions, color: 'bg-blue-500', barColor: 'bg-blue-500', textColor: 'text-blue-700' },
    { label: 'Shopping / Misc', amount: budget.shoppingMisc, color: 'bg-teal-500', barColor: 'bg-teal-500', textColor: 'text-teal-700' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-amber-200/60">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>Intelligent Budget Intelligence</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Trip Budget Breakdown & Live Tracker
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Calibrated for real-time cost control and zero hidden tourist surcharges.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Live Expense</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Target Budget</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ₹{budget.userBudget.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Allocated for the entire journey</p>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Estimated Total Cost</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
            ₹{budget.total.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {percentUsed}% of budget utilized
          </p>
        </div>

        <div className={`p-5 rounded-2xl border ${
          budget.remaining >= 0 ? 'bg-teal-50/70 border-teal-200' : 'bg-rose-50 border-rose-200'
        }`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${
            budget.remaining >= 0 ? 'text-teal-800' : 'text-rose-800'
          }`}>
            {budget.remaining >= 0 ? 'Surplus / Remaining' : 'Budget Exceeded By'}
          </p>
          <p className={`text-2xl sm:text-3xl font-black mt-1 ${
            budget.remaining >= 0 ? 'text-teal-900' : 'text-rose-700'
          }`}>
            ₹{Math.abs(budget.remaining).toLocaleString('en-IN')}
          </p>
          <p className={`text-[11px] mt-1 font-medium ${
            budget.remaining >= 0 ? 'text-teal-700' : 'text-rose-600'
          }`}>
            {budget.remaining >= 0 ? 'Safely within planned limits' : 'Requires dynamic optimization'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
          <span>Budget Utilization Status</span>
          <span className={percentUsed > 100 ? 'text-rose-600 font-extrabold' : 'text-emerald-700'}>
            {percentUsed}% ({budget.total > budget.userBudget ? 'Exceeded' : 'Safe'})
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex">
          {categoryItems.map((cat, idx) => {
            const widthPct = (cat.amount / budget.userBudget) * 100;
            return (
              <div
                key={idx}
                className={`${cat.barColor} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                style={{ width: `${widthPct}%` }}
                title={`${cat.label}: ₹${cat.amount}`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-emerald-600" />
          Detailed Category Allocations
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {categoryItems.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-xs font-bold text-slate-700 truncate">{item.label}</span>
              </div>
              <p className="text-lg font-black text-slate-900">
                ₹{item.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {Math.round((item.amount / budget.total) * 100)}% of trip total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Proactive Savings Suggestion if exceeded or optimization tip */}
      {budget.savingsSuggestion && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              AI Budget Optimization Recommendation
            </p>
            <p className="text-xs text-amber-800 mt-1 font-medium leading-relaxed">
              {budget.savingsSuggestion}
            </p>
          </div>
        </div>
      )}

      {/* Live Expense Logger Table */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Live Expense Tracker (Logged during trip: ₹{totalLogged.toLocaleString('en-IN')})
            </h4>
            <p className="text-xs text-slate-500">
              Keep tabs on on-ground spending to avoid unexpected overdrafts.
            </p>
          </div>
        </div>

        {loggedExpenses.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">No live expenses logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {loggedExpenses.map((item) => (
              <div key={item.id} className="p-3.5 bg-white flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{item.title}</p>
                  <p className="text-[11px] text-slate-400">{item.category} • {item.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</span>
                  <button
                    onClick={() => handleDeleteExpense(item.id)}
                    className="text-slate-400 hover:text-rose-600 transition p-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for adding expense */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log New Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Andhra Lunch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 350"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl outline-hidden focus:border-emerald-500"
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Attractions">Attractions</option>
                  <option value="Shopping/Misc">Shopping/Misc</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
