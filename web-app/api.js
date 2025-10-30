const API_BASE_URL = 'http://localhost:5000/api';

let authToken = localStorage.getItem('token');

export const setAuthToken = (token) => {
  authToken = token;
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return authToken || localStorage.getItem('token');
};

const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};

// Patients API
export const patientsAPI = {
  search: async (query) => {
    return apiCall(`/patients/search?query=${encodeURIComponent(query)}`);
  },
  
  getById: async (patientId) => {
    return apiCall(`/patients/${patientId}`);
  },
  
  addNote: async (patientId, noteText) => {
    return apiCall(`/patients/${patientId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text: noteText }),
    });
  },
  
  getTrends: async (patientId) => {
    return apiCall(`/patients/${patientId}/trends`);
  },
};

// Doctors API
export const doctorsAPI = {
  getDashboard: async () => {
    return apiCall('/doctors/dashboard');
  },
};