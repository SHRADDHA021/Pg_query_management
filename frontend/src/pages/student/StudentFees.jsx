import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState, StatusBadge } from '../../components/UI';
import { feeService } from '../../services';
import { CreditCard, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await feeService.getMyFees();
        setFees(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const getMonthName = (monthNum) => {
    const date = new Date();
    date.setMonth(monthNum - 1);
    return format(date, 'MMMM');
  };

  if (loading) return <LoadingSpinner />;

  // Group stats
  const unpaidRecords = fees.filter(f => f.status !== 'PAID');
  const totalOutstanding = unpaidRecords.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Rent & Fee Management" 
        subtitle="View and verify your monthly hostal rent invoices and payment history." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Dues Outstanding</p>
            <p className={`text-3xl font-bold ${totalOutstanding > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ₹{totalOutstanding}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${totalOutstanding > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {totalOutstanding > 0 ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
        </div>

        <div className="glass-card p-6 border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Payment Method</p>
            <p className="text-xl font-bold text-white">Direct to PG Desk</p>
            <p className="text-gray-500 text-xs mt-1">Please pay to admin counter directly</p>
          </div>
          <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Payment History</h2>
        </div>
        {fees.length === 0 ? (
          <EmptyState 
            icon={CreditCard} 
            title="No Invoices Yet" 
            description="You don't have any billing records generated yet." 
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Billing Month</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.id}>
                    <td className="font-medium text-white">
                      {getMonthName(f.month)} {f.year}
                    </td>
                    <td className="font-semibold">₹{f.amount}</td>
                    <td>
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {f.dueDate ? format(new Date(f.dueDate), 'dd MMM yyyy') : 'N/A'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={f.status} type="fee" />
                    </td>
                    <td>
                      {f.paidDate ? (
                        <span className="text-emerald-400 font-medium">
                          {format(new Date(f.paidDate), 'dd MMM yyyy')}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="text-gray-400 italic text-xs max-w-xs truncate">
                      {f.remarks || 'No remarks'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
