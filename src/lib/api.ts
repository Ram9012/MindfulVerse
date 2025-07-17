// API service for handling backend communication

const API_BASE_URL = 'http://127.0.0.1:5001';
const PDF_API_URL = 'http://127.0.0.1:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export interface User {
  id: number;
  email: string;
  created_at?: string;
}

export interface Session {
  id: number;
  user_id: number;
  title: string;
  description: string;
  duration: number;
  created_at: string;
}

export const api = {
  register: async (username:string, email: string, password: string): Promise<{message: string, user: User, access_token: string}> => {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password }),
      credentials: 'omit'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to register user');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data;
  },

  login: async (email: string, password: string): Promise<{message: string, user: User, access_token: string}> => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'omit'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data;
  },
  
  logout: async (): Promise<{message: string}> => {
    localStorage.removeItem('access_token');
    const response = await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
    
    return response.json();
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        headers: getAuthHeaders(),
        credentials: 'omit'
      });
      
      if (!response.ok) {
        return null;
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  

  // Session endpoints
  createSession: async (session: Omit<Session, 'id' | 'created_at'>): Promise<Session> => {
    const response = await fetch(`${API_BASE_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    
    return response.json();
  },

  getUserSessions: async (userId: number): Promise<Session[]> => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/sessions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user sessions');
    }
    
    return response.json();
  },
  
  // Add this to your existing api object
  sendChatMessage: async (message: string): Promise<{response: string}> => {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ message }),
      credentials: 'omit'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get chat response');
    }
    
    return response.json();
  },
  
  // Audio transcription with Gemini 1.5 Pro
  transcribeAudio: async (base64Audio: string) => {
    try {
      console.log('Starting audio transcription API call to:', `${API_BASE_URL}/api/transcribe-audio`);
      
      // First check if the server is reachable
      try {
        const healthCheck = await fetch(`${API_BASE_URL}/`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'omit',
          // Set a shorter timeout for the health check
          signal: AbortSignal.timeout(3000)
        });
        
        if (!healthCheck.ok) {
          console.warn('Backend server health check failed:', healthCheck.status);
        } else {
          console.log('Backend server is reachable');
        }
      } catch (healthError) {
        console.error('Backend server is not reachable:', healthError);
        throw new Error('Backend server is not reachable. Please make sure the backend server is running on port 5001.');
      }
      
      // Proceed with the actual transcription request
      const response = await fetch(`${API_BASE_URL}/api/transcribe-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ audio: base64Audio }),
        credentials: 'omit',
        mode: 'cors',
        cache: 'no-cache',
        // Set a longer timeout for the transcription request (30 seconds)
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error('Transcription API error response:', errorData);
          throw new Error(errorData.error || 'Failed to transcribe audio');
        } catch (jsonError) {
          // If we can't parse the error as JSON, use the status text
          throw new Error(`Failed to transcribe audio: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('Transcription API success response received');
      return data;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
};