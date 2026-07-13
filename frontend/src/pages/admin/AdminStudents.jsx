import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState, StatusBadge, Modal } from '../../components/UI';
import { adminService, roomService } from '../../services';
import { Users, Plus, Edit2, Trash2, Home, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const emptyForm = {
  name: '', username: '', password: '', phone: '',
  address: '', emergencyContact: '', age: '', rentStatus: 'Pending', roomId: ''
};

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, roomsRes] = await Promise.all([
        adminService.getAllStudents(),
        roomService.getAllRooms()
      ]);
      setStudents(studentsRes.data.data);
      setRooms(roomsRes.data.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ---- Add Student ----
  const openAddModal = () => {
    setForm(emptyForm);
    setShowPassword(false);
    setAddModalOpen(true);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.name) {
      toast.error('Name, Username and Password are required');
      return;
    }
    setSaving(true);
    try {
      await adminService.createStudent({
        name: form.name,
        username: form.username,
        password: form.password,
        phone: form.phone,
        address: form.address,
        emergencyContact: form.emergencyContact,
        age: form.age || null,
        rentStatus: form.rentStatus,
        roomId: form.roomId || null
      });
      toast.success('Student added successfully!');
      setAddModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add student');
    } finally {
      setSaving(false);
    }
  };

  // ---- Edit Student ----
  const openEditModal = (student) => {
    setSelectedStudent(student);
    setForm({
      name: student.name || '',
      username: student.username || '',
      password: '',
      phone: student.phone || '',
      address: student.address || '',
      emergencyContact: student.emergencyContact || '',
      age: student.age || '',
      rentStatus: student.rentStatus || 'Pending',
      roomId: student.roomId || ''
    });
    setEditModalOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateStudent(selectedStudent.id, {
        name: form.name,
        phone: form.phone,
        address: form.address,
        emergencyContact: form.emergencyContact,
        age: form.age || null,
        rentStatus: form.rentStatus,
        roomId: form.roomId || null
      });
      toast.success('Student updated successfully!');
      setEditModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete Student ----
  const handleDelete = async (student) => {
    if (!window.confirm(`Remove ${student.name} from the system? This cannot be undone.`)) return;
    try {
      await adminService.deleteStudent(student.id);
      toast.success('Student removed successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove student');
    }
  };

  // ---- Verify & Assign Room (for PENDING students) ----
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomId) { toast.error('Please select a room'); return; }
    try {
      await adminService.verifyAndAssignRoom(selectedStudent.id, selectedRoomId);
      toast.success('Student verified & room assigned!');
      setVerifyModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  // ---- Reassign Room ----
  const handleReassignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomId) { toast.error('Please select a room'); return; }
    try {
      await adminService.reassignRoom(selectedStudent.id, selectedRoomId);
      toast.success('Room reassigned successfully!');
      setReassignModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reallocation failed');
    }
  };

  const availableRooms = rooms.filter(r => r.occupancyStatus !== 'FULL');

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Student Management"
        subtitle="Add, edit and manage resident records. Create login credentials for students."
        action={
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        }
      />

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">All Students ({students.length})</h2>
        </div>

        {students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students found"
            description="Click 'Add Student' to create the first student account."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Username / Login ID</th>
                  <th>Phone</th>
                  <th>Room</th>
                  <th>Rent Status</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {student.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.name}</p>
                          <p className="text-gray-500 text-xs">{student.phone || 'No phone'}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-primary-300 text-sm bg-primary-500/10 px-2 py-0.5 rounded">
                        {student.username}
                      </span>
                    </td>
                    <td className="text-gray-300 text-sm">{student.phone || '—'}</td>
                    <td className="font-semibold text-primary-400">
                      {student.roomNumber ? `Room ${student.roomNumber}` : <span className="text-gray-500 italic">Unassigned</span>}
                    </td>
                    <td>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        student.rentStatus === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {student.rentStatus || 'Pending'}
                      </span>
                    </td>
                    <td><StatusBadge status={student.status} type="user" /></td>
                    <td className="text-gray-400 text-sm">
                      {student.joinedDate ? format(new Date(student.joinedDate), 'dd MMM yyyy') : 'N/A'}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {student.status === 'PENDING' && (
                          <button
                            onClick={() => { setSelectedStudent(student); setSelectedRoomId(''); setVerifyModalOpen(true); }}
                            className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold uppercase tracking-wider transition-colors"
                          >
                            Verify
                          </button>
                        )}
                        {student.status === 'VERIFIED' && (
                          <button
                            onClick={() => { setSelectedStudent(student); setSelectedRoomId(''); setReassignModalOpen(true); }}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Change Room"
                          >
                            <Home className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(student)}
                          className="text-primary-400 hover:text-primary-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ── Add Student Modal ── */}
      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Student">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name *</label>
              <input className="input-field" placeholder="Student name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Username / Login ID *</label>
              <input className="input-field" placeholder="e.g. student01" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })} required />
            </div>
          </div>

          <div className="relative">
            <label className="form-label">Password *</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field pr-10"
              placeholder="Set a password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2.5 text-gray-500 hover:text-gray-300">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone</label>
              <input className="input-field" placeholder="Phone number" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Age</label>
              <input type="number" className="input-field" placeholder="Age" value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })} min={15} max={60} />
            </div>
          </div>

          <div>
            <label className="form-label">Emergency Contact</label>
            <input className="input-field" placeholder="Emergency phone number" value={form.emergencyContact}
              onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
          </div>

          <div>
            <label className="form-label">Address</label>
            <input className="input-field" placeholder="Permanent address" value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Rent Status</label>
              <select className="select-field" value={form.rentStatus}
                onChange={e => setForm({ ...form, rentStatus: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="form-label">Assign Room (optional)</label>
              <select className="select-field" value={form.roomId}
                onChange={e => setForm({ ...form, roomId: e.target.value })}>
                <option value="">No Room</option>
                {availableRooms.map(r => (
                  <option key={r.id} value={r.id}>
                    Room {r.roomNumber} ({r.type} • {r.availableSlots}/{r.capacity} free)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setAddModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Student Modal ── */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit: ${selectedStudent?.name}`}>
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <input className="input-field" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Username</label>
              <input className="input-field" value={form.username} disabled
                title="Username cannot be changed" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Phone</label>
              <input className="input-field" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Age</label>
              <input type="number" className="input-field" value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="form-label">Emergency Contact</label>
            <input className="input-field" value={form.emergencyContact}
              onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
          </div>

          <div>
            <label className="form-label">Address</label>
            <input className="input-field" value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Rent Status</label>
              <select className="select-field" value={form.rentStatus}
                onChange={e => setForm({ ...form, rentStatus: e.target.value })}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="form-label">Room</label>
              <select className="select-field" value={form.roomId}
                onChange={e => setForm({ ...form, roomId: e.target.value })}>
                <option value="">Unassigned</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    Room {r.roomNumber} ({r.availableSlots}/{r.capacity} free)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setEditModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Verify & Assign Room Modal ── */}
      <Modal isOpen={verifyModalOpen} onClose={() => setVerifyModalOpen(false)} title={`Verify ${selectedStudent?.name}`}>
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-sm space-y-2">
            <p className="text-gray-400"><strong className="text-gray-300">Name:</strong> {selectedStudent?.name}</p>
            <p className="text-gray-400"><strong className="text-gray-300">Username:</strong> {selectedStudent?.username}</p>
          </div>
          <div>
            <label className="form-label">Allocate Room</label>
            <select className="select-field" value={selectedRoomId}
              onChange={e => setSelectedRoomId(e.target.value)} required>
              <option value="">Select a Room</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} ({room.type} • ₹{room.monthlyRent} • {room.availableSlots}/{room.capacity})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setVerifyModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-success">Approve & Assign Room</button>
          </div>
        </form>
      </Modal>

      {/* ── Reassign Room Modal ── */}
      <Modal isOpen={reassignModalOpen} onClose={() => setReassignModalOpen(false)} title={`Change Room — ${selectedStudent?.name}`}>
        <form onSubmit={handleReassignSubmit} className="space-y-4">
          <p className="text-gray-400 text-sm">
            Currently in: <strong className="text-primary-400">Room {selectedStudent?.roomNumber || 'Unassigned'}</strong>
          </p>
          <div>
            <label className="form-label">New Room</label>
            <select className="select-field" value={selectedRoomId}
              onChange={e => setSelectedRoomId(e.target.value)} required>
              <option value="">Select a Room</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} ({room.type} • {room.availableSlots}/{room.capacity} free)
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setReassignModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Confirm Reassignment</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
