// Application constants
export const APP_CONFIG = {
  name: 'BOTVERSE',
  version: '1.0.0',
  description: 'Bot Editor Platform',
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  projects: '/projects/',
  flows: (projectId: string) => `/projects/${projectId}/flows/`,
  flow: (projectId: string, flowId: string) => `/projects/${projectId}/flows/${flowId}`,
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  defaultStaleTime: 5 * 60 * 1000, // 5 minutes
  defaultCacheTime: 10 * 60 * 1000, // 10 minutes
  maxRetries: 3,
  retryDelay: 1000, // 1 second
} as const;

// UI constants
export const UI_CONFIG = {
  sidebarWidth: 256,
  rightPanelWidth: 384,
  headerHeight: 64,
  animationDuration: 200,
} as const;

// Node types
export const NODE_TYPES = {
  START: 'start',
  END: 'end',
  ACTION: 'action',
  CONDITION: 'condition',
  RESPONSE: 'response',
  DEFAULT: 'defaultNode',
} as const;

// Action types for workflow nodes
export const ACTION_TYPES = {
  // Messaging actions
  SEND_TEXT: 'send-text',
  SEND_VIDEO: 'send-video',
  SEND_AUDIO: 'send-audio',
  SEND_ACTION: 'send-action',
  SEND_FILE: 'send-file',
  SEND_LOCATION: 'send-location',
  SEND_IMAGE: 'send-image',
  
  // Code execution
  EXECUTE_CODE: 'execute-code',
  
  // Database operations
  GET_RECORD: 'get-record',
  INSERT_RECORD: 'insert-record',
  UPDATE_RECORD: 'update-record',
  DELETE_RECORD: 'delete-record',
  FIND_RECORD: 'find-record',
  
  // WebChat operations
  CONFIGURE_WEBCHAT: 'configure-webchat',
  SHOW_WEBCHAT: 'show-webchat',
  HIDE_WEBCHAT: 'hide-webchat',
  TOGGLE_WEBCHAT: 'toggle-webchat',
  
  // User operations
  GET_USER_DATA: 'get-user-data',
  SEND_CUSTOM_EVENT: 'send-custom-event',
  
  // AI operations
  AI_TASK: 'ai-task',
  AI_GENERATE_TEXT: 'ai-generate-text',
  AI_TRANSITION: 'ai-transition',
  
  // Intent and expressions
  INTENT: 'intent',
  EXPRESSION: 'expression',
  
  // Options and confirmations
  SINGLE_OPTION: 'single-option',
  MULTIPLE_OPTIONS: 'multiple-options',
  BOOLEAN: 'boolean',
  CONFIRMATION: 'confirmation',
} as const;

// Action labels mapping
export const ACTION_LABELS: Record<string, string> = {
  [ACTION_TYPES.SEND_TEXT]: 'Enviar Texto',
  [ACTION_TYPES.SEND_VIDEO]: 'Enviar Video',
  [ACTION_TYPES.SEND_AUDIO]: 'Enviar Audio',
  [ACTION_TYPES.SEND_ACTION]: 'Enviar Acción',
  [ACTION_TYPES.SEND_FILE]: 'Enviar Archivo',
  [ACTION_TYPES.SEND_LOCATION]: 'Enviar Ubicación',
  [ACTION_TYPES.SEND_IMAGE]: 'Enviar Imagen',
  [ACTION_TYPES.EXECUTE_CODE]: 'Ejecutar Código',
  [ACTION_TYPES.GET_RECORD]: 'Obtener Registro',
  [ACTION_TYPES.INSERT_RECORD]: 'Insertar Registro',
  [ACTION_TYPES.UPDATE_RECORD]: 'Actualizar Registro',
  [ACTION_TYPES.DELETE_RECORD]: 'Eliminar Registro',
  [ACTION_TYPES.FIND_RECORD]: 'Buscar Registro',
  [ACTION_TYPES.CONFIGURE_WEBCHAT]: 'Configurar WebChat',
  [ACTION_TYPES.SHOW_WEBCHAT]: 'Mostrar WebChat',
  [ACTION_TYPES.HIDE_WEBCHAT]: 'Ocultar WebChat',
  [ACTION_TYPES.TOGGLE_WEBCHAT]: 'Alternar WebChat',
  [ACTION_TYPES.GET_USER_DATA]: 'Obtener Datos Usuario',
  [ACTION_TYPES.SEND_CUSTOM_EVENT]: 'Enviar Evento Personalizado',
  [ACTION_TYPES.AI_TASK]: 'Tarea con IA',
  [ACTION_TYPES.AI_GENERATE_TEXT]: 'Generar Texto IA',
  [ACTION_TYPES.AI_TRANSITION]: 'Transición IA',
  [ACTION_TYPES.INTENT]: 'Intent',
  [ACTION_TYPES.EXPRESSION]: 'Expression',
  [ACTION_TYPES.SINGLE_OPTION]: 'Opción Única',
  [ACTION_TYPES.MULTIPLE_OPTIONS]: 'Múltiples Opciones',
  [ACTION_TYPES.BOOLEAN]: 'Boolean',
  [ACTION_TYPES.CONFIRMATION]: 'Confirmación',
} as const;

// Workflow validation rules
export const VALIDATION_RULES = {
  workflowName: {
    minLength: 1,
    maxLength: 100,
  },
  workflowDescription: {
    maxLength: 500,
  },
  nodeContent: {
    maxLength: 1000,
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  networkError: 'Error de conexión. Verifica tu conexión a internet.',
  serverError: 'Error del servidor. Intenta de nuevo más tarde.',
  validationError: 'Los datos ingresados no son válidos.',
  notFound: 'El recurso solicitado no fue encontrado.',
  unauthorized: 'No tienes permisos para realizar esta acción.',
  genericError: 'Ha ocurrido un error inesperado.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  workflowCreated: 'Workflow creado exitosamente',
  workflowUpdated: 'Workflow actualizado exitosamente',
  workflowDeleted: 'Workflow eliminado exitosamente',
  workflowSaved: 'Workflow guardado exitosamente',
} as const;
