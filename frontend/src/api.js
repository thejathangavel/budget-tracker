import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Expenses
export const getExpenses = (month, year) =>
    API.get('/expenses', { params: { month, year } });
export const addExpense = (data) => API.post('/expenses', data);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const getCategorySummary = (month, year) =>
    API.get('/expenses/summary/category', { params: { month, year } });
export const getMonthlySummary = (year) =>
    API.get('/expenses/summary/monthly', { params: { year } });

// Income
export const getIncome = (month, year) =>
    API.get('/income', { params: { month, year } });
export const setIncome = (data) => API.post('/income', data);

// Budget
export const getBudget = (month, year) =>
    API.get('/budget', { params: { month, year } });
export const setBudget = (data) => API.post('/budget', data);

export default API;
