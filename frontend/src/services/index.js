import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllStudents: () => api.get('/admin/students'),
  getPendingStudents: () => api.get('/admin/students/pending'),
  getStudentById: (id) => api.get(`/admin/students/${id}`),
  verifyAndAssignRoom: (studentId, roomId) =>
    api.post(`/admin/students/${studentId}/verify`, { roomId }),
  rejectStudent: (studentId) =>
    api.post(`/admin/students/${studentId}/reject`),
  reassignRoom: (studentId, roomId) =>
    api.put(`/admin/students/${studentId}/room`, { roomId }),
};

export const roomService = {
  getAllRooms: () => api.get('/rooms'),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  getAvailableRooms: () => api.get('/rooms/available'),
  getVacantRooms: () => api.get('/rooms/vacant'),
  createRoom: (data) => api.post('/rooms', data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

export const complaintService = {
  createComplaint: (data) => api.post('/complaints', data),
  getMyComplaints: () => api.get('/complaints/my'),
  getAllComplaints: () => api.get('/complaints'),
  getComplaintById: (id) => api.get(`/complaints/${id}`),
  updateStatus: (id, status, adminNote) =>
    api.patch(`/complaints/${id}/status`, { status, adminNote }),
  deleteComplaint: (id) => api.delete(`/complaints/${id}`),
};

export const feeService = {
  getMyFees: () => api.get('/fees/my'),
  getAllFees: () => api.get('/fees'),
  getStudentFees: (studentId) => api.get(`/fees/student/${studentId}`),
  getFeesByStatus: (status) => api.get(`/fees/status/${status}`),
  createFeeRecord: (data) => api.post('/fees', data),
  updateFeeStatus: (id, status, remarks) =>
    api.patch(`/fees/${id}/status`, { status, remarks }),
  deleteFeeRecord: (id) => api.delete(`/fees/${id}`),
};

export const messService = {
  getCurrentMenu: () => api.get('/mess/current'),
  getMenuByWeek: (weekStart) => api.get(`/mess/week?weekStart=${weekStart}`),
  saveWeeklyMenu: (weekStart, items) =>
    api.post(`/mess/week/${weekStart}`, items),
  saveMenuItem: (weekStart, item) =>
    api.post(`/mess/item/${weekStart}`, item),
  updateMenuItem: (id, menuItems) =>
    api.patch(`/mess/item/${id}`, { menuItems }),
  deleteMenuItem: (id) => api.delete(`/mess/item/${id}`),
};
