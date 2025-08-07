// API client for SOMA backend services
import { queryClient } from './queryClient';

const BACKEND_URL = 'http://localhost:8080/api';

// API request wrapper with proper error handling
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Fallback to mock data if backend is unavailable
    console.warn(`Backend unavailable for ${endpoint}, using mock data`);
    return getMockData(endpoint);
  }
}

// Mock data fallback for development/demo purposes
function getMockData(endpoint: string) {
  if (endpoint.includes('/weather/current')) {
    return {
      location: "Demo Location",
      temperature: 22,
      humidity: 65,
      precipitation: 2.5,
      windSpeed: 12,
      condition: "Partly Cloudy",
      uvIndex: 6,
      visibility: 15,
      soilMoisture: 45,
      growingDegreeDays: 18,
      recommendation: "Weather conditions are favorable for most farming activities."
    };
  }
  
  if (endpoint.includes('/ai/chat')) {
    return {
      response: "Based on sustainable farming practices, I recommend focusing on soil health through cover crops, implementing water-efficient irrigation systems, and considering integrated pest management techniques for optimal crop yields.",
      timestamp: new Date().toISOString()
    };
  }
  
  if (endpoint.includes('/metrics/summary')) {
    return {
      totalRecords: 156,
      averageCarbonUsage: 85.4,
      averageWaterUsage: 320.8
    };
  }
  
  if (endpoint.includes('/tips')) {
    return [
      {
        id: 1,
        title: "Cover Crop Implementation",
        description: "Plant cover crops during off-seasons to improve soil health, prevent erosion, and enhance biodiversity on your farm.",
        createdAt: "2024-01-15T10:00:00Z"
      },
      {
        id: 2,
        title: "Drip Irrigation Systems",
        description: "Install drip irrigation to reduce water usage by 30-50% while maintaining optimal crop yields and preventing water waste.",
        createdAt: "2024-01-10T14:30:00Z"
      },
      {
        id: 3,
        title: "Composting Organic Matter",
        description: "Create compost from farm waste to reduce synthetic fertilizer dependency and improve soil organic matter content.",
        createdAt: "2024-01-05T09:15:00Z"
      }
    ];
  }

  return {};
}

// Authentication service
export const authService = {
  async login(email: string, password: string) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(name: string, email: string, password: string) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  },

  async getProfile() {
    return apiRequest('/auth/profile');
  }
};

// Weather service
export const weatherService = {
  async getCurrentWeather(location: string) {
    return apiRequest(`/weather/current?location=${encodeURIComponent(location)}`);
  }
};

// AI service
export const aiService = {
  async chat(question: string) {
    return apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  },

  async getRecommendations(userId: number) {
    return apiRequest(`/ai/recommendations?userId=${userId}`);
  }
};

// Metrics service
export const metricsService = {
  async submitMetrics(data: {
    userId: number;
    carbonUsage: number;
    waterUsage: number;
    date: string;
    aiInsights?: string;
  }) {
    return apiRequest('/metrics/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getUserMetrics(userId: number) {
    return apiRequest(`/metrics/user/${userId}`);
  },

  async getMetricsSummary() {
    return apiRequest('/metrics/summary');
  }
};

// Tips service
export const tipsService = {
  async getAllTips() {
    return apiRequest('/tips');
  },

  async createTip(title: string, description: string) {
    return apiRequest('/tips', {
      method: 'POST',
      body: JSON.stringify({ title, description })
    });
  },

  async updateTip(id: number, title: string, description: string) {
    return apiRequest(`/tips/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description })
    });
  },

  async deleteTip(id: number) {
    return apiRequest(`/tips/${id}`, {
      method: 'DELETE'
    });
  }
};

// Admin service
export const adminService = {
  async getAllUsers() {
    return apiRequest('/admin/users');
  },

  async getAllMetrics() {
    return apiRequest('/admin/metrics');
  },

  async deleteUser(userId: number) {
    return apiRequest(`/admin/user/${userId}`, {
      method: 'DELETE'
    });
  }
};