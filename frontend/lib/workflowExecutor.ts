import { Node } from '@xyflow/react';

export interface ChatMessage {
  type: 'user' | 'bot';
  message: string;
  timestamp?: Date;
}

export interface WorkflowState {
  currentNodeId: string | null;
  variables: Record<string, any>;
  isRunning: boolean;
  messages: ChatMessage[];
}

export interface ActionConfig {
  id: string;
  type: string;
  label: string;
  config?: Record<string, any>;
}

export class WorkflowExecutor {
  private nodes: Node[];
  private edges: any[];
  private state: WorkflowState;
  private onStateChange?: (state: WorkflowState) => void;

  constructor(nodes: Node[], edges: any[] = [], onStateChange?: (state: WorkflowState) => void) {
    this.nodes = nodes;
    this.edges = edges;
    this.onStateChange = onStateChange;
    this.state = {
      currentNodeId: this.findStartNode()?.id || null,
      variables: {},
      isRunning: false,
      messages: [
        { type: 'bot', message: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?', timestamp: new Date() }
      ]
    };
  }

  private findStartNode(): Node | null {
    return this.nodes.find(node => node.id === 'start') || this.nodes[0] || null;
  }

  private getNodeById(id: string): Node | null {
    return this.nodes.find(node => node.id === id) || null;
  }

  private getConnectedNodes(nodeId: string): Node[] {
    const connectedNodeIds = this.edges
      .filter(edge => edge.source === nodeId)
      .map(edge => edge.target);
    
    return connectedNodeIds
      .map(id => this.getNodeById(id))
      .filter(node => node !== null) as Node[];
  }

  private executeAction(action: ActionConfig): ChatMessage[] {
    const messages: ChatMessage[] = [];
    
    switch (action.type) {
      case 'send-text':
        const textMessage = action.config?.message || 'Mensaje de texto';
        const textDelay = action.config?.delay || 0;
        
        messages.push({
          type: 'bot',
          message: textMessage,
          timestamp: new Date()
        });
        
        // Add delay if configured
        if (textDelay > 0) {
          messages.push({
            type: 'bot',
            message: `⏱️ Esperando ${textDelay} segundos...`,
            timestamp: new Date()
          });
        }
        break;
        
      case 'send-image':
        const imageUrl = action.config?.url || 'https://via.placeholder.com/300x200';
        const imageCaption = action.config?.caption || '';
        const imageMessage = imageCaption 
          ? `📷 Imagen: ${imageUrl}\n${imageCaption}`
          : `📷 Imagen: ${imageUrl}`;
        messages.push({
          type: 'bot',
          message: imageMessage,
          timestamp: new Date()
        });
        break;
        
      case 'send-video':
        const videoUrl = action.config?.url || 'https://example.com/video.mp4';
        const videoCaption = action.config?.caption || '';
        const videoMessage = videoCaption 
          ? `🎥 Video: ${videoUrl}\n${videoCaption}`
          : `🎥 Video: ${videoUrl}`;
        messages.push({
          type: 'bot',
          message: videoMessage,
          timestamp: new Date()
        });
        break;
        
      case 'send-audio':
        const audioUrl = action.config?.url || 'https://example.com/audio.mp3';
        const audioDuration = action.config?.duration || 0;
        const audioMessage = audioDuration > 0 
          ? `🎵 Audio: ${audioUrl} (${audioDuration}s)`
          : `🎵 Audio: ${audioUrl}`;
        messages.push({
          type: 'bot',
          message: audioMessage,
          timestamp: new Date()
        });
        break;
        
      case 'send-location':
        const location = action.config?.location || 'Ubicación no especificada';
        messages.push({
          type: 'bot',
          message: `📍 Ubicación: ${location}`,
          timestamp: new Date()
        });
        break;
        
      case 'execute-code':
        const codeScript = action.config?.script || 'console.log("Código ejecutado");';
        const codeLanguage = action.config?.language || 'javascript';
        messages.push({
          type: 'bot',
          message: `💻 Ejecutando código ${codeLanguage}:\n\`\`\`${codeLanguage}\n${codeScript}\n\`\`\`\n✅ Código ejecutado exitosamente`,
          timestamp: new Date()
        });
        break;
        
      case 'ai-task':
        const aiTask = action.config?.task || 'Tarea de IA completada';
        messages.push({
          type: 'bot',
          message: `🤖 IA: ${aiTask}`,
          timestamp: new Date()
        });
        break;
        
      case 'single-option':
        const options = action.config?.options || ['Opción 1', 'Opción 2'];
        const question = action.config?.question || 'Selecciona una opción:';
        messages.push({
          type: 'bot',
          message: `${question}\n${options.map((opt: string, i: number) => `${i + 1}. ${opt}`).join('\n')}`,
          timestamp: new Date()
        });
        break;
        
      case 'multiple-options':
        const multiOptions = action.config?.options || ['Opción A', 'Opción B', 'Opción C'];
        const multiQuestion = action.config?.question || 'Selecciona múltiples opciones:';
        messages.push({
          type: 'bot',
          message: `${multiQuestion}\n${multiOptions.map((opt: string, i: number) => `${i + 1}. ${opt}`).join('\n')}`,
          timestamp: new Date()
        });
        break;
        
      case 'boolean':
        const booleanQuestion = action.config?.question || '¿Confirmas esta acción?';
        messages.push({
          type: 'bot',
          message: `${booleanQuestion} (Sí/No)`,
          timestamp: new Date()
        });
        break;
        
      case 'confirmation':
        const confirmMessage = action.config?.question || action.config?.message || '¿Confirmas?';
        messages.push({
          type: 'bot',
          message: `${confirmMessage} (Sí/No)`,
          timestamp: new Date()
        });
        break;
        
      default:
        messages.push({
          type: 'bot',
          message: `Acción ejecutada: ${action.label}`,
          timestamp: new Date()
        });
    }
    
    return messages;
  }

  public start(): void {
    this.state.isRunning = true;
    this.state.currentNodeId = this.findStartNode()?.id || null;
    
    // Execute the start node
    this.executeCurrentNode();
    
    // Check if we need to move to next node immediately (without executing again)
    if (this.state.currentNodeId) {
      const startNode = this.getNodeById(this.state.currentNodeId);
      if (startNode && !this.nodeRequiresInput(startNode)) {
        this.moveToNextNodeWithoutExecution();
      }
    }
    
    this.notifyStateChange();
  }

  public stop(): void {
    this.state.isRunning = false;
    this.notifyStateChange();
  }

  public reset(): void {
    this.state = {
      currentNodeId: this.findStartNode()?.id || null,
      variables: {},
      isRunning: false,
      messages: [
        { type: 'bot', message: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?', timestamp: new Date() }
      ]
    };
    this.notifyStateChange();
  }

  public processUserInput(userMessage: string): void {
    if (!this.state.isRunning) return;
    
    // Add user message
    this.state.messages.push({
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    });
    
    // Store user input for routing decisions
    this.state.variables.lastUserInput = userMessage;
    
    // Move to next node based on user input and current node type
    this.moveToNextNode(userMessage);
    this.notifyStateChange();
  }

  private executeCurrentNode(): void {
    if (!this.state.currentNodeId) return;
    
    const currentNode = this.getNodeById(this.state.currentNodeId);
    if (!currentNode) return;
    
    // Execute all actions in the current node
    const actions = currentNode.data?.actions as ActionConfig[] || [];
    
    for (const action of actions) {
      const actionMessages = this.executeAction(action);
      this.state.messages.push(...actionMessages);
    }
  }

  private moveToNextNode(userInput?: string): void {
    if (!this.state.currentNodeId) return;
    
    const currentNode = this.getNodeById(this.state.currentNodeId);
    if (!currentNode) return;
    
    // Check if current node has input-requiring actions
    const hasInputActions = this.nodeRequiresInput(currentNode);
    
    if (hasInputActions && !userInput) {
      // Node requires user input, don't move yet
      return;
    }
    
    // Execute current node actions first
    this.executeCurrentNode();
    
    // Then move to next node
    this.moveToNextNodeWithoutExecution(userInput);
  }

  private moveToNextNodeWithoutExecution(userInput?: string): void {
    if (!this.state.currentNodeId) return;
    
    // Move to next node
    const connectedNodes = this.getConnectedNodes(this.state.currentNodeId);
    
    if (connectedNodes.length > 0) {
      // Determine which node to go to based on user input and node logic
      const nextNode = this.determineNextNode(connectedNodes, userInput);
      this.state.currentNodeId = nextNode.id;
      
      // Execute the next node immediately if it doesn't require input
      if (!this.nodeRequiresInput(nextNode)) {
        this.executeCurrentNode();
      }
    } else {
      // No more nodes, workflow is complete
      this.state.messages.push({
        type: 'bot',
        message: 'Flujo completado. ¡Gracias por usar el bot!',
        timestamp: new Date()
      });
      this.state.isRunning = false;
    }
  }

  private nodeRequiresInput(node: Node): boolean {
    const actions = node.data?.actions as ActionConfig[] || [];
    return actions.some(action => 
      ['single-option', 'multiple-options', 'boolean', 'confirmation', 'intent', 'expression'].includes(action.type)
    );
  }

  private determineNextNode(connectedNodes: Node[], userInput?: string): Node {
    // Simple routing logic based on user input
    if (userInput) {
      const input = userInput.toLowerCase().trim();
      
      // Check for common responses
      if (input.includes('sí') || input.includes('si') || input.includes('yes') || input.includes('1')) {
        // Look for a "yes" or "positive" path (could be based on node names or data)
        const positiveNode = connectedNodes.find(node => {
          const label = (node.data?.label as string) || '';
          return label.toLowerCase().includes('sí') ||
                 label.toLowerCase().includes('yes') ||
                 label.toLowerCase().includes('positivo');
        });
        if (positiveNode) return positiveNode;
      }
      
      if (input.includes('no') || input.includes('2')) {
        // Look for a "no" or "negative" path
        const negativeNode = connectedNodes.find(node => {
          const label = (node.data?.label as string) || '';
          return label.toLowerCase().includes('no') ||
                 label.toLowerCase().includes('negativo');
        });
        if (negativeNode) return negativeNode;
      }
      
      // Check for option numbers (1, 2, 3, etc.)
      const optionMatch = input.match(/^(\d+)$/);
      if (optionMatch) {
        const optionIndex = parseInt(optionMatch[1]) - 1;
        if (optionIndex >= 0 && optionIndex < connectedNodes.length) {
          return connectedNodes[optionIndex];
        }
      }
    }
    
    // Default: go to the first connected node
    return connectedNodes[0];
  }

  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  public getState(): WorkflowState {
    return { ...this.state };
  }

  public updateNodes(nodes: Node[]): void {
    this.nodes = nodes;
  }

  public updateEdges(edges: any[]): void {
    this.edges = edges;
  }
}
