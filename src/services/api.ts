const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
console.log('API Service: Using API URL:', apiUrl);

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${apiUrl}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error('Error parsing response:', text);
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  // For login/register endpoints, data is in response.data
  if (endpoint.includes('/auth/') && data.data) {
    return data.data;
  }

  return data;
}

// Health record types
export interface HealthRecord {
  id: string
  userId: string
  date: string
  type: string
  value: number
  unit: string
  notes?: string
}

export const healthApi = {
  // Health records
  getHealthRecords: () => fetchApi('/api/health-records'),
  createHealthRecord: (data: Omit<HealthRecord, 'id'>) => 
    fetchApi('/api/health-records', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateHealthRecord: (id: string, data: Partial<HealthRecord>) =>
    fetchApi(`/api/health-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteHealthRecord: (id: string) => 
    fetchApi(`/api/health-records/${id}`, { method: 'DELETE' }),

  // Authentication
  getCurrentUser: () => fetchApi('/api/auth/me'),
  login: async (email: string, password: string) => {
    console.log('API Service: Attempting login for:', email);
    
    const data = await fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    console.log('API Service: Login successful:', data);
    return data;
  },
  register: async (email: string, password: string, name: string) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    console.log('API Service: Sending registration request');
    
    const data = await fetchApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    
    console.log('API Service: Registration successful:', data);
    return data;
  },
}

// No default export needed
