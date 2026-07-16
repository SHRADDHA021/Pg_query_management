import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),

  // Student CRUD
  getAllStudents: () => api.get('/admin/students'),
  getPendingStudents: () => api.get('/admin/students/pending'),
  getStudentById: (id) => api.get(`/admin/students/${id}`),
  createStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),

  verifyAndAssignRoom: (studentId, roomId) =>
    api.post(`/admin/students/${studentId}/verify`, { roomId }),
  rejectStudent: (studentId) =>
    api.post(`/admin/students/${studentId}/reject`),
  reassignRoom: (studentId, roomId) =>
    api.put(`/admin/students/${studentId}/room`, { roomId }),

  // Mess Menu
  addMenu: (data) => api.post('/admin/menu', data),
  updateMenu: (id, menuItems) => api.put(`/admin/menu/${id}`, { menuItems }),
  deleteMenu: (id) => api.delete(`/admin/menu/${id}`),

  // Electricity Schedule
  addSchedule: (data) => api.post('/admin/schedule', data),
  updateSchedule: (id, data) => api.put(`/admin/schedule/${id}`, data),
  deleteSchedule: (id) => api.delete(`/admin/schedule/${id}`),
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

export const messService = {
  getCurrentMenu: () => api.get('/student/menu'),
  getMenuByWeek: (weekStart) => api.get(`/student/menu?weekStart=${weekStart}`),
  saveWeeklyMenu: (weekStart, items) =>
    api.post('/admin/menu', { weekStartDate: weekStart, menuItems: items }),
  saveMenuItem: (weekStart, item) =>
    api.post('/admin/menu', { weekStartDate: weekStart, ...item }),
  updateMenuItem: (id, menuItems) =>
    api.put(`/admin/menu/${id}`, { menuItems }),
  deleteMenuItem: (id) => api.delete(`/admin/menu/${id}`),
};

export const noticeService = {
  getAllNotices: () => api.get('/notices'),
  createNotice: (data) => api.post('/notices', data),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
};

export const electricityService = {
  getAllSchedules: () => api.get('/student/schedule'),
  createSchedule: (data) => api.post('/admin/schedule', data),
  deleteSchedule: (id) => api.delete(`/admin/schedule/${id}`),
};
