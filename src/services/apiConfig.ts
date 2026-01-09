const API_BASE_URL = 'https://vict-beeab2c3akcqgyej.malaysiawest-01.azurewebsites.net';

export class ApiConfigService {
  static async execute<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Get token from localStorage if it exists
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken');
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        // Only set Content-Type to application/json if body is NOT FormData
        ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };
    
    const response = await fetch(url, config);
    
    // Always parse JSON response
    const data = await response.json();
    
    // Return data directly from API
    return data as T;
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.execute<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.execute<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    });
  }

  static async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.execute<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.execute<T>(endpoint, { method: 'DELETE' });
  }
}
