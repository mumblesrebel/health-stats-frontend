const apiUrl = import.meta.env.VITE_API_URL || 'https://health-stats-api.onrender.com';
console.log('API Service: Using API URL:', apiUrl);

interface ApiResponse<T> {
  status: number;
  statusText: string;
  data: T | null;
  error?: string;
}

async function makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${apiUrl}${endpoint}`;
  console.log('API Service: Making request to:', url);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const text = await response.text();
    console.log('API Response Text:', text);
    
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
      console.log('API Parsed Data:', data);
    } catch (e) {
      console.error('Error parsing response:', text);
      return {
        status: response.status,
        statusText: response.statusText,
        data: null,
        error: 'Invalid JSON response'
      };
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.ok ? data : null,
      error: !response.ok ? (data?.error || 'Request failed') : undefined
    };
  } catch (e) {
    console.error('Network error:', e);
    return {
      status: 0,
      statusText: 'Network Error',
      data: null,
      error: e instanceof Error ? e.message : 'Network request failed'
    };
  }
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

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const healthApi = {
  // Health records
  getHealthRecords: () => makeRequest('/api/health-records'),
  createHealthRecord: (data: Omit<HealthRecord, 'id'>) => 
    makeRequest('/api/health-records', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateHealthRecord: (id: string, data: Partial<HealthRecord>) =>
    makeRequest(`/api/health-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  deleteHealthRecord: (id: string) => 
    makeRequest(`/api/health-records/${id}`, { method: 'DELETE' }),

  // Authentication
  getCurrentUser: () => makeRequest('/api/auth/me'),
  login: async (email: string, password: string) => {
    console.log('API Service: Attempting login for:', email);
    
    const response = await makeRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (!response.data) {
      throw new Error(response.error || 'Login failed');
    }
    
    return response.data;
  },
  register: async (email: string, password: string, name: string) => {
    const [firstName, ...lastNameParts] = name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    const response = await makeRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName })
    });
    
    if (!response.data) {
      throw new Error(response.error || 'Registration failed');
    }
    
    return response.data;
  },
}

// No default export needed
