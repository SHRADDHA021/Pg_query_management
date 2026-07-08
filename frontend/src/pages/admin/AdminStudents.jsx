import { useEffect, useState } from 'react';
import { PageHeader, LoadingSpinner, EmptyState, StatusBadge, Modal } from '../../components/UI';
import { adminService, roomService } from '../../services';
import { Users, ShieldAlert, CheckCircle, XCircle, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const fetchData = async () => {
    try {
      const [studentsRes, roomsRes] = await Promise.all([
        adminService.getAllStudents(),
        roomService.getAvailableRooms()
      ]);
      setStudents(studentsRes.data.data);
      setRooms(roomsRes.data.data);
    } catch (err) {
      toast.error('Failed to load students queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyClick = (student) => {
    setSelectedStudent(student);
    setSelectedRoomId('');
    setVerifyModalOpen(true);
  };

  const handleReassignClick = (student) => {
    setSelectedStudent(student);
    setSelectedRoomId('');
    setReassignModalOpen(true);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomId) {
      toast.error('Please select a room');
      return;
    }
    try {
      await adminService.verifyAndAssignRoom(selectedStudent.id, selectedRoomId);
      toast.success('Student verified & Room allocated!');
      setVerifyModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleReassignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoomId) {
      toast.error('Please select a room');
      return;
    }
    try {
      await adminService.reassignRoom(selectedStudent.id, selectedRoomId);
      toast.success('Room reallocated successfully!');
      setReassignModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reallocation failed');
    }
  };

  const handleReject = async (studentId) => {
    if (!window.confirm('Are you sure you want to reject this student application?')) return;
    try {
      await adminService.rejectStudent(studentId);
      toast.success('Student rejected');
      fetchData();
    } catch (err) {
      toast.error('Rejection failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Student Operations & Verification Queue" 
        subtitle="Manage resident profiles, verify pending sign-ups, and reallocate rooms." 
      />

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">All Resident Applications</h2>
        </div>

        {students.length === 0 ? (
          <EmptyState 
            icon={Users} 
            title="No students found" 
            description="No student accounts are currently registered under this PG system." 
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resident Info</th>
                  <th>Contact Details</th>
                  <th>Room Assigned</th>
                  <th>Status</th>
                  <th>Onboarding Date</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-white">{student.name}</p>
                        <p className="text-gray-500 text-xs">{student.email}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="text-gray-300 text-sm">{student.phone || 'No phone'}</p>
                        <p className="text-gray-500 text-xs">Emergency: {student.emergencyContact || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="font-semibold text-primary-400">
                      {student.roomNumber ? `Room ${student.roomNumber}` : <span className="text-gray-500 italic">Unassigned</span>}
                    </td>
                    <td>
                      <StatusBadge status={student.status} type="user" />
                    </td>
                    <td>
                      {student.joinedDate ? format(new Date(student.joinedDate), 'dd MMM yyyy') : 'N/A'}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        {student.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleVerifyClick(student)}
                              className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs uppercase tracking-wider transition-colors"
                            >
                              Verify & Assign
                            </button>
                            <button
                              onClick={() => handleReject(student.id)}
                              className="text-red-400 hover:text-red-300 font-semibold text-xs uppercase tracking-wider transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {student.status === 'VERIFIED' && (
                          <button
                            onClick={() => handleReassignClick(student)}
                            className="text-primary-400 hover:text-primary-300 font-semibold text-xs uppercase tracking-wider transition-colors"
                          >
                            Change Room
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verify & Assign Room Modal */}
      <Modal 
        isOpen={verifyModalOpen} 
        onClose={() => setVerifyModalOpen(false)} 
        title={`Verify ${selectedStudent?.name}`}
      >
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-sm space-y-2 mb-4">
            <p className="text-gray-400"><strong className="text-gray-300">Name:</strong> {selectedStudent?.name}</p>
            <p className="text-gray-400"><strong className="text-gray-300">Email:</strong> {selectedStudent?.email}</p>
            <p className="text-gray-400"><strong className="text-gray-300">Address:</strong> {selectedStudent?.address}</p>
          </div>

          <div>
            <label className="form-label">Allocate Room</label>
            <select
              className="select-field"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              required
            >
              <option value="">Select a Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} ({room.type} • Rent: ₹{room.monthlyRent} • Space: {room.availableSlots}/{room.capacity})
                </option>
              ))}
            </select>
            {rooms.length === 0 && (
              <p className="text-rose-400 text-xs mt-2">No available rooms found. Please create/vacate a room first.</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setVerifyModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-success">
              Approve & Onboard
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Room Modal */}
      <Modal 
        isOpen={reassignModalOpen} 
        onClose={() => setReassignModalOpen(false)} 
        title={`Change Room for ${selectedStudent?.name}`}
      >
        <form onSubmit={handleReassignSubmit} className="space-y-4">
          <p className="text-gray-400 text-sm mb-4">
            Currently allocated to: <strong className="text-primary-400">Room {selectedStudent?.roomNumber}</strong>
          </p>

          <div>
            <label className="form-label">Reallocate Room</label>
            <select
              className="select-field"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              required
            >
              <option value="">Select a Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} ({room.type} • Rent: ₹{room.monthlyRent} • Space: {room.availableSlots}/{room.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setReassignModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Confirm Reallocation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
