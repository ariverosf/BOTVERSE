"use client"
import { useCallback, useEffect } from 'react';
import { useQuery, useMutation } from './use-query';
import { workflowApi } from '@/lib/api';
import { useWorkflows, useSelectedWorkflow } from '@/contexts/AppContext';
import { FullWorkflowProject, WorkflowProject } from '@/lib/types';
import { ApiException } from '@/lib/api';
import { Node } from '@xyflow/react';

// Hook for managing workflow data fetching
export function useWorkflowData() {
  const { workflows, setWorkflows } = useWorkflows();
  const { selectedWorkflow, setSelectedWorkflow } = useSelectedWorkflow();

  // Fetch projects with enhanced error handling - skip on network errors
  const {
    data: projectsData,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
    isSuccess: projectsSuccess,
  } = useQuery<FullWorkflowProject[]>(
    'http://127.0.0.1:8000/projects/',
    'GET',
    {
      retry: 0, // Don't retry to avoid infinite loops when offline
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      skip: false, // Always try to fetch, but handle errors gracefully
      onSuccess: (data) => {
        setWorkflows(data);
      },
      onError: (error) => {
        // Silently handle network errors - don't show error message
        console.log('Offline mode: Backend not available');
      },
    }
  );

  // Update workflows when data changes
  useEffect(() => {
    if (projectsData && projectsSuccess) {
      setWorkflows(projectsData);
    }
  }, [projectsData, projectsSuccess, setWorkflows]);

  return {
    workflows,
    selectedWorkflow,
    loading: projectsLoading,
    error: null, // Don't expose network errors to UI
    refetch: refetchProjects,
    isSuccess: projectsSuccess,
  };
}

// Hook for workflow mutations
export function useWorkflowMutations() {
  const { addWorkflow, updateWorkflow, deleteWorkflow } = useWorkflows();
  const { setSelectedWorkflow } = useSelectedWorkflow();

  // Create workflow mutation
  const createWorkflowMutation = useMutation(
    async (workflowData: Omit<WorkflowProject, 'id' | 'created_at'>) => {
      const response = await workflowApi.createProject(workflowData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        addWorkflow();
        setSelectedWorkflow(data);
      },
      onError: (error) => {
        console.error('Failed to create workflow:', error);
      },
    }
  );

  // Update workflow mutation
  const updateWorkflowMutation = useMutation(
    async ({ id, updates }: { id: string; updates: Partial<WorkflowProject> }) => {
      const response = await workflowApi.updateProject(id, updates);
      return response.data;
    },
    {
      onSuccess: (data) => {
        updateWorkflow(data.id, data);
        setSelectedWorkflow(data);
      },
      onError: (error) => {
        console.error('Failed to update workflow:', error);
      },
    }
  );

  // Delete workflow mutation
  const deleteWorkflowMutation = useMutation(
    async (id: string) => {
      await workflowApi.deleteProject(id);
      return id;
    },
    {
      onSuccess: (id) => {
        deleteWorkflow(id);
        setSelectedWorkflow(null);
      },
      onError: (error) => {
        console.error('Failed to delete workflow:', error);
      },
    }
  );

  return {
    createWorkflow: createWorkflowMutation.mutate,
    updateWorkflow: updateWorkflowMutation.mutate,
    deleteWorkflow: deleteWorkflowMutation.mutate,
    isCreating: createWorkflowMutation.loading,
    isUpdating: updateWorkflowMutation.loading,
    isDeleting: deleteWorkflowMutation.loading,
    createError: createWorkflowMutation.error,
    updateError: updateWorkflowMutation.error,
    deleteError: deleteWorkflowMutation.error,
  };
}

// Hook for workflow selection and management
export function useWorkflowSelection() {
  const { selectedWorkflow, setSelectedWorkflow } = useSelectedWorkflow();
  const { workflows } = useWorkflows();

  const selectWorkflow = useCallback((workflow: FullWorkflowProject | null) => {
    setSelectedWorkflow(workflow);
  }, [setSelectedWorkflow]);

  const selectWorkflowById = useCallback((id: string) => {
    const workflow = workflows.find(w => w.id === id);
    setSelectedWorkflow(workflow || null);
  }, [workflows, setSelectedWorkflow]);

  const clearSelection = useCallback(() => {
    setSelectedWorkflow(null);
  }, [setSelectedWorkflow]);

  return {
    selectedWorkflow,
    selectWorkflow,
    selectWorkflowById,
    clearSelection,
    hasSelection: !!selectedWorkflow,
  };
}

// Hook for workflow validation
export function useWorkflowValidation() {
  const validateWorkflow = useCallback((workflow: Partial<FullWorkflowProject>): string[] => {
    const errors: string[] = [];

    if (!workflow.name || workflow.name.trim().length === 0) {
      errors.push('El nombre del workflow es requerido');
    }

    if (workflow.name && workflow.name.length > 100) {
      errors.push('El nombre del workflow no puede exceder 100 caracteres');
    }

    if (workflow.description && workflow.description.length > 500) {
      errors.push('La descripción no puede exceder 500 caracteres');
    }

    return errors;
  }, []);

  const validateWorkflowName = useCallback((name: string): boolean => {
    return name.trim().length > 0 && name.length <= 100;
  }, []);

  const validateWorkflowDescription = useCallback((description: string): boolean => {
    return description.length <= 500;
  }, []);

  return {
    validateWorkflow,
    validateWorkflowName,
    validateWorkflowDescription,
  };
}

// Hook for workflow statistics
export function useWorkflowStats() {
  const { workflows } = useWorkflows();

  const stats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.flows.length > 0).length,
    totalFlows: workflows.reduce((acc, w) => acc + w.flows.length, 0),
    averageFlowsPerWorkflow: workflows.length > 0 
      ? workflows.reduce((acc, w) => acc + w.flows.length, 0) / workflows.length 
      : 0,
  };

  return stats;
}
