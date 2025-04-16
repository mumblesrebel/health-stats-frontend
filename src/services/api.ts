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
  console.log('API Response Text:', text);
  
  let data;
  try {
    data = text ? JSON.parse(text) : null;
    console.log('API Parsed Data:', data);
  } catch (e) {
    console.error('Error parsing response:', text);
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  // For login/register endpoints, the response is already in the right format
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
    
    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const text = await response.text();
    console.log('API Response Text:', text);
    
    let data;
    try {
      data = text ? JSON.parse(text) : null;
      console.log('API Parsed Data:', data);
    } catch (e) {
      console.error('Error parsing response:', text);
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Request failed');
    }

    return data;
  },
  register: async (email: string, password: string, name: string) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    
    const text = await response.text();
    console.log('API Response Text:', text);
    
    let data;
    try {
      data = text ? JSON.parse(text) : null;
      console.log('API Parsed Data:', data);
    } catch (e) {
      console.error('Error parsing response:', text);
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Request failed');
    }

    return data;
  },
}

// No default export needed
