import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState, StatusBadge, Modal } from '../../components/UI';
import { feeService, adminService } from '../../services';
import { CreditCard, Plus, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminFees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [form, setForm] = useState({
    studentId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: 5000.0,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    remarks: ''
  });

  const [updateForm, setUpdateForm] = useState({
    status: 'PAID',
    remarks: ''
  });

  const fetchData = async () => {
    try {
      const [feesRes, studentsRes] = await Promise.all([
        feeService.getAllFees(),
        adminService.getAllStudents()
      ]);
      setFees(feesRes.data.data);
      // Only verified students can have fee records
      setStudents(studentsRes.data.data.filter(s => s.status === 'VERIFIED'));
    } catch (err) {
      toast.error('Failed to load fee logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClick = () => {
    setForm({
      studentId: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: 5000.0,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      remarks: ''
    });
    setModalOpen(true);
  };

  const handleUpdateClick = (fee) => {
    setSelectedFee(fee);
    setUpdateForm({
      status: fee.status,
      remarks: fee.remarks || ''
    });
    setUpdateModalOpen(true);
  };

  const handleStudentSelect = (e) => {
    const sId = e.target.value;
    const selected = students.find(s => s.id.toString() === sId);
    let defaultRent = 5000.0;
    
    // Auto-calculate rent if student is assigned to a room
    if (selected && selected.roomId) {
      // Find room in student details if it has a monthly rent info or fall back to default
      defaultRent = 5000.0; // standard fallback
    }

    setForm({
      ...form,
      studentId: sId,
      amount: defaultRent
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId) {
      toast.error('Please select a student');
      return;
    }
    try {
      await feeService.createFeeRecord(form);
      toast.success('Fee record generated successfully!');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create fee record');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await feeService.updateFeeStatus(selectedFee.id, updateForm.status, updateForm.remarks);
      toast.success('Payment status updated!');
      setUpdateModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await feeService.deleteFeeRecord(id);
      toast.success('Invoice deleted');
      fetchData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const getMonthName = (monthNum) => {
    const date = new Date();
    date.setMonth(monthNum - 1);
    return format(date, 'MMMM');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Fee Ledger & Invoice Dispatch" 
        subtitle="Generate monthly rent bills, mark payments paid/unpaid, and view transaction history."
        action={
          <button onClick={handleCreateClick} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Bill Invoice
          </button>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Monthly Fee Ledger</h2>
        </div>

        {fees.length === 0 ? (
          <EmptyState 
            icon={CreditCard} 
            title="No ledger entries found" 
            description="Use the button above to generate a new rent invoice." 
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Room No</th>
                  <th>Billing Month</th>
                  <th>Dues Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Receipt Date</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-white">{f.studentName}</p>
                        <p className="text-gray-500 text-xs">{f.studentEmail}</p>
                      </div>
                    </td>
                    <td className="font-semibold text-primary-400">Room {f.roomNumber || 'N/A'}</td>
                    <td className="font-medium text-white">{getMonthName(f.month)} {f.year}</td>
                    <td className="font-bold">₹{f.amount}</td>
                    <td>
                      <StatusBadge status={f.status} type="fee" />
                    </td>
                    <td>{f.dueDate ? format(new Date(f.dueDate), 'dd MMM yyyy') : 'N/A'}</td>
                    <td>
                      {f.paidDate ? (
                        <span className="text-emerald-400 font-semibold">
                          {format(new Date(f.paidDate), 'dd MMM yyyy')}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic text-xs">Pending</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateClick(f)}
                          className="text-primary-400 hover:text-primary-300 text-xs font-bold uppercase tracking-wider"
                        >
                          Modify Status
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Fee Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Generate Rent Invoice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Select Verified Resident</label>
            <select
              className="select-field"
              value={form.studentId}
              onChange={handleStudentSelect}
              required
            >
              <option value="">Choose student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Room {s.roomNumber || 'None'} • {s.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Billing Month</label>
              <select
                className="select-field"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: parseInt(e.target.value) })}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {format(new Date(2020, i, 1), 'MMMM')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Billing Year</label>
              <input
                type="number"
                className="input-field"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                className="input-field"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="input-field"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Remarks</label>
            <input
              type="text"
              placeholder="E.g. Electricity charges included"
              className="input-field"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* Modify Fee Status Modal */}
      <Modal isOpen={updateModalOpen} onClose={() => setUpdateModalOpen(false)} title="Update Invoice Receipt Details">
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-sm space-y-2 mb-4">
            <p className="text-gray-400">
              <strong className="text-gray-300">Student Name:</strong> {selectedFee?.studentName}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-300">Amount:</strong> ₹{selectedFee?.amount}
            </p>
            <p className="text-gray-400">
              <strong className="text-gray-300">Billing Month:</strong> {selectedFee ? getMonthName(selectedFee.month) : ''} {selectedFee?.year}
            </p>
          </div>

          <div>
            <label className="form-label">Payment Status</label>
            <select
              className="select-field"
              value={updateForm.status}
              onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
            >
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid (Clear Dues)</option>
              <option value="OVERDUE">Overdue (Past Date)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Payment Notes / Transaction Details</label>
            <input
              type="text"
              placeholder="E.g. Paid via GPay Ref #12345"
              className="input-field"
              value={updateForm.remarks}
              onChange={(e) => setUpdateForm({ ...updateForm, remarks: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setUpdateModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Verification
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
