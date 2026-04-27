import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api', timeout: 30000 });

export const getStudents = () => API.get('/students');
export const addStudent = (student) => API.post('/students', student);
export const deleteStudent = (id) => API.delete(`/students/${id}`);