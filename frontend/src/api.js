import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000/api' });

export const getComponents = () => api.get('/components/');
export const createComponent = (data) => api.post('/components/', data);
export const updateComponent = (id, data) => api.put(`/components/${id}/`, data);
export const deleteComponent = (id) => api.delete(`/components/${id}/`);

export const getVehicles = () => api.get('/vehicles/');
export const createVehicle = (data) => api.post('/vehicles/', data);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}/`, data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}/`);

export const getIssues = (vehicleId) => api.get(vehicleId ? `/issues/?vehicle=${vehicleId}` : '/issues/');
export const createIssue = (data) => api.post('/issues/', data);
export const deleteIssue = (id) => api.delete(`/issues/${id}/`);

export const getComponentUsages = () => api.get('/component-usages/');
export const createComponentUsage = (data) => api.post('/component-usages/', data);
export const deleteComponentUsage = (id) => api.delete(`/component-usages/${id}/`);

export const getInvoices = () => api.get('/invoices/');
export const generateInvoice = (vehicleId) => api.post('/invoices/generate/', { vehicle_id: vehicleId });
export const getPayments = () => api.get('/payments/');
export const payInvoice = (paymentId) => api.post(`/payments/${paymentId}/pay/`);

export const getDailyRevenue = () => api.get('/revenue/daily/');
export const getMonthlyRevenue = () => api.get('/revenue/monthly/');
export const getYearlyRevenue = () => api.get('/revenue/yearly/');

export default api;