import { ApiResponse, FullWorkflowProject, WorkflowProject, WorkflowFlow, WorkflowNode, FlowExecutionResult, FlowValidationResult, ExecutionHistoryResponse } from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Custom error class for API errors
export class ApiException extends Error {
  constructor(
    public message: string,
    public status: number,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// Generic API client with proper error handling
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiException(
          data.message || 'An error occurred',
          response.status,
          data.code || 'UNKNOWN_ERROR',
          data.details
        );
      }

      return {
        data,
        success: true,
        message: data.message,
      };
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      
      throw new ApiException(
        'Network error occurred',
        0,
        'NETWORK_ERROR',
        { originalError: error }
      );
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Specific API methods for workflows
export const workflowApi = {
  // Get all projects
  async getProjects(): Promise<ApiResponse<FullWorkflowProject[]>> {
    return apiClient.get<FullWorkflowProject[]>('/projects/');
  },

  // Get single project
  async getProject(id: string): Promise<ApiResponse<FullWorkflowProject>> {
    return apiClient.get<FullWorkflowProject>(`/projects/${id}`);
  },

  // Create new project
  async createProject(project: Omit<WorkflowProject, 'id' | 'created_at'>): Promise<ApiResponse<FullWorkflowProject>> {
    return apiClient.post<FullWorkflowProject>('/projects/', project);
  },

  // Update project
  async updateProject(id: string, updates: Partial<WorkflowProject>): Promise<ApiResponse<FullWorkflowProject>> {
    return apiClient.patch<FullWorkflowProject>(`/projects/${id}`, updates);
  },

  // Delete project
  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/projects/${id}`);
  },

  // Create flow
  async createFlow(projectId: string, flow: Omit<WorkflowFlow, 'id' | 'created_at' | 'project_id'>): Promise<ApiResponse<WorkflowFlow>> {
    return apiClient.post<WorkflowFlow>(`/projects/${projectId}/flows/`, flow);
  },

  // Update flow
  async updateFlow(projectId: string, flowId: string, updates: Partial<WorkflowFlow>): Promise<ApiResponse<WorkflowFlow>> {
    return apiClient.patch<WorkflowFlow>(`/projects/${projectId}/flows/${flowId}`, updates);
  },

  // Delete flow
  async deleteFlow(projectId: string, flowId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/projects/${projectId}/flows/${flowId}`);
  },

  // Execute/simulate flow
  async executeFlow(projectId: string, flowId: string): Promise<ApiResponse<FlowExecutionResult>> {
    return apiClient.post<FlowExecutionResult>(`/projects/${projectId}/flows/${flowId}/execute`);
  },

  // Test execute nodes without saving
  async testExecuteNodes(nodes: WorkflowNode[], edges?: any[]): Promise<ApiResponse<FlowExecutionResult>> {
    return apiClient.post<FlowExecutionResult>('/execute/test', { nodes, edges });
  },

  // Validate flow
  async validateFlow(projectId: string, flowId: string): Promise<ApiResponse<FlowValidationResult>> {
    return apiClient.get<FlowValidationResult>(`/projects/${projectId}/flows/${flowId}/validate`);
  },

  // Get execution history
  async getExecutionHistory(limit: number = 10): Promise<ApiResponse<ExecutionHistoryResponse>> {
    return apiClient.get<ExecutionHistoryResponse>('/execution/history', { limit: limit.toString() });
  },
};