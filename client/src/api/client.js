import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = async (email, password) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};

// Patients
export const createPatient = async (patientData) => {
  const { data } = await apiClient.post('/patients', patientData);
  return data;
};

export const getPatients = async () => {
  const { data } = await apiClient.get('/patients');
  return data;
};

// Tests
export const createTests = async (patient_id, test_types) => {
  const { data } = await apiClient.post('/tests', { patient_id, test_types });
  return data;
};

export const startTest = async (testId) => {
  const { data } = await apiClient.put(`/tests/start/${testId}`);
  return data;
};

export const completeTest = async (testId) => {
  const { data } = await apiClient.put(`/tests/complete/${testId}`);
  return data;
};

export const getWaitingTests = async () => {
  const { data } = await apiClient.get('/tests/waiting');
  return data;
};

// Consultations
export const startConsultation = async (patientId) => {
  const { data } = await apiClient.put(`/consultation/start/${patientId}`);
  return data;
};

export const endConsultation = async (patientId) => {
  const { data } = await apiClient.put(`/consultation/end/${patientId}`);
  return data;
};

// Billing
export const createBill = async (billData) => {
  const { data } = await apiClient.post('/billing', billData);
  return data;
};

export const payBill = async (billId, paymentData) => {
  const { data } = await apiClient.put(`/billing/pay/${billId}`, paymentData);
  return data;
};

export const getPendingBills = async () => {
  const { data } = await apiClient.get('/billing/pending');
  return data;
};

// Dashboard
export const getDashboardMetrics = async () => {
  const { data } = await apiClient.get('/dashboard/metrics');
  return data;
};

export default apiClient;

