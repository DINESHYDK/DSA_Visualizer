import React, { useState, useEffect } from 'react';
import { Plus, Minus, Search, ArrowRight, RotateCcw, Play, Pause, Edit3, Trash2 } from 'lucide-react';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import AnimationControls from '../animation/AnimationControls';
import { generateId } from '../../utils';

interface ListNode {
  id: string;
  value: number;
  next: string | null;
  state: 'default' | 'current' | 'comparing' | 'found' | 'inserting' | 'deleting';
}

interface LinkedListOperation {
  type: 'insert' | 'delete' | 'search' | 'traverse';
  position?: number;
  value?: number;
  description: string;
}

interface LinkedListVisualizationProps {
  initialValues?: number[];
  listType?: 'singly' | 'doubly' | 'circular';
  className?: string;
}

const LinkedListVisualization: React.FC<LinkedListVisualizationProps> = ({
  initialValues = [10, 20, 30, 40],
  listType = 'singly',
  className = ''
}) => {
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [head, setHead] = useState<string | null>(null);
  const [operations, setOperations] = useState<LinkedListOperation[]>([]);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [insertPosition, setInsertPosition] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize linked list
  useEffect(() => {
    if (initialValues.length === 0) {
      setNodes([]);
      setHead(null);
      return;
    }

    const newNodes: ListNode[] = initialValues.map((value, index) => ({
      id: generateId(),
      value,
      next: null,
      state: 'default'
    }));

    // Link nodes
    for (let i = 0; i < newNodes.length - 1; i++) {
      newNodes[i].next = newNodes[i + 1].id;
    }

    // For circular list, link last to first
    if (listType === 'circular' && newNodes.length > 1) {
      newNodes[newNodes.length - 1].next = newNodes[0].id;
    }

    setNodes(newNodes);
    setHead(newNodes[0]?.id || null);
  }, [initialValues, listType]);

  // Create animation steps for operations
  const createOperationSteps = (operation: LinkedListOperation) => {
    const steps = [];
    
    switch (operation.type) {
      case 'traverse':
        // Traverse through all nodes
        let currentId = head;
        let position = 0;
        
        while (currentId && position < nodes.length) {
          steps.push({
            id: `traverse-${position}-${Date.now()}`,
            type: 'highlight' as const,
            indices: [position],
            description: `Visiting node ${position + 1} with value ${nodes.find(n => n.id === currentId)?.value}`
          });
          
          const currentNode = nodes.find(n => n.id === currentId);
          currentId = currentNode?.next || null;
          position++;
          
          // Prevent infinite loop for circular lists
          if (listType === 'circular' && position >= nodes.length) break;
        }
        break;

      case 'search':
        // Linear search through linked list
        let searchCurrentId = head;
        let searchPosition = 0;
        
        while (searchCurrentId && searchPosition < nodes.length) {
          const currentNode = nodes.find(n => n.id === searchCurrentId);
          
          steps.push({
            id: `search-${searchPosition}-${Date.now()}`,
            type: 'compare' as const,
            indices: [searchPosition],
            description: `Checking node ${searchPosition + 1}: ${currentNode?.value} ${currentNode?.value === operation.value ? '==' : '!='} ${operation.value}`
          });
          
          if (currentNode?.value === operation.value) {
            steps.push({
              id: `search-found-${Date.now()}`,
              type: 'set' as const,
              indices: [searchPosition],
              description: `Found ${operation.value} at position ${searchPosition + 1}!`
            });
            break;
          }
          
          searchCurrentId = currentNode?.next || null;
          searchPosition++;
          
          // Prevent infinite loop for circular lists
          if (listType === 'circular' && searchPosition >= nodes.length) break;
        }
        
        if (!nodes.some(node => node.value === operation.value)) {
          steps.push({
            id: `search-not-found-${Date.now()}`,
            type: 'highlight' as const,
            indices: [],
            description: `Value ${operation.value} not found in the list`
          });
        }
        break;

      case 'insert':
        if (operation.position === 0) {
          // Insert at head
          steps.push({
            id: `insert-head-${Date.now()}`,
            type: 'highlight' as const,
            indices: [0],
            description: `Inserting ${operation.value} at the head of the list`
          });
        } else {
          // Traverse to insertion point
          for (let i = 0; i < (operation.position || 0); i++) {
            steps.push({
              id: `insert-traverse-${i}-${Date.now()}`,
              type: 'highlight' as const,
              indices: [i],
              description: `Traversing to insertion point (position ${(operation.position || 0) + 1})`
            });
          }
          
          steps.push({
            id: `insert-position-${Date.now()}`,
            type: 'set' as const,
            indices: [operation.position || 0],
            description: `Inserting ${operation.value} at position ${(operation.position || 0) + 1}`
          });
        }
        break;

      case 'delete':
        if (operation.position === 0) {
          // Delete head
          steps.push({
            id: `delete-head-${Date.now()}`,
            type: 'highlight' as const,
            indices: [0],
            description: 'Deleting head node'
          });
        } else {
          // Traverse to deletion point
          for (let i = 0; i < (operation.position || 0); i++) {
            steps.push({
              id: `delete-traverse-${i}-${Date.now()}`,
              type: 'highlight' as const,
              indices: [i],
              description: `Traversing to node before deletion point`
            });
          }
          
          steps.push({
            id: `delete-position-${Date.now()}`,
            type: 'highlight' as const,
            indices: [operation.position || 0],
            description: `Deleting node at position ${(operation.position || 0) + 1}`
          });
        }
        break;
    }
    
    return steps;
  };

  const handleStepChange = (stepIndex: number, stepData: any) => {
    if (!stepData) return;

    setCurrentOperation(stepData.description);
    
    setNodes(prevNodes => {
      return prevNodes.map((node, index) => {
        let newState: ListNode['state'] = 'default';
        
        if (stepData.indices.includes(index)) {
          switch (stepData.type) {
            case 'compare':
              newState = 'comparing';
              break;
            case 'highlight':
              newState = 'current';
              break;
            case 'set':
              newState = 'found';
              break;
          }
        }
        
        return {
          ...node,
          state: newState
        };
      });
    });
  };

  const handleComplete = () => {
    setCurrentOperation('Operation completed');
    setIsAnimating(false);
    
    // Reset all node states
    setNodes(prevNodes =>
      prevNodes.map(node => ({
        ...node,
        state: 'default'
      }))
    );
  };

  const { state, controls } = useAnimationEngine({
    steps: operations.flatMap(createOperationSteps),
    onStepChange: handleStepChange,
    onComplete: handleComplete
  });

  // Linked list operations
  const insertNode = () => {
    const value = parseInt(newValue);
    const position = insertPosition === '' ? nodes.length : parseInt(insertPosition);
    
    if (isNaN(value) || position < 0 || position > nodes.length) {
      return;
    }

    const newNode: ListNode = {
      id: generateId(),
      value,
      next: null,
      state: 'default'
    };

    const newNodes = [...nodes];
    
    if (position === 0) {
      // Insert at head
      newNode.next = head;
      setHead(newNode.id);
    } else {
      // Insert at position
      const prevNode = newNodes[position - 1];
      newNode.next = prevNode.next;
      prevNode.next = newNode.id;
    }
    
    newNodes.splice(position, 0, newNode);
    setNodes(newNodes);
    
    const operation: LinkedListOperation = {
      type: 'insert',
      position,
      value,
      description: `Insert ${value} at position ${position + 1}`
    };
    
    setOperations([operation]);
    setNewValue('');
    setInsertPosition('');
    setIsAnimating(true);
  };

  const deleteNode = (position: number) => {
    if (position < 0 || position >= nodes.length) return;

    const newNodes = [...nodes];
    const nodeToDelete = newNodes[position];
    
    if (position === 0) {
      // Delete head
      setHead(nodeToDelete.next);
    } else {
      // Update previous node's next pointer
      const prevNode = newNodes[position - 1];
      prevNode.next = nodeToDelete.next;
    }
    
    newNodes.splice(position, 1);
    setNodes(newNodes);
    
    const operation: LinkedListOperation = {
      type: 'delete',
      position,
      description: `Delete node at position ${position + 1}`
    };
    
    setOperations([operation]);
    setIsAnimating(true);
  };

  const searchNode = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;

    const operation: LinkedListOperation = {
      type: 'search',
      value,
      description: `Search for ${value}`
    };
    
    setOperations([operation]);
    setSearchValue('');
    setIsAnimating(true);
  };

  const traverseList = () => {
    const operation: LinkedListOperation = {
      type: 'traverse',
      description: 'Traverse through all nodes'
    };
    
    setOperations([operation]);
    setIsAnimating(true);
  };

  const resetList = () => {
    const newNodes: ListNode[] = initialValues.map((value, index) => ({
      id: generateId(),
      value,
      next: null,
      state: 'default'
    }));

    // Link nodes
    for (let i = 0; i < newNodes.length - 1; i++) {
      newNodes[i].next = newNodes[i + 1].id;
    }

    if (listType === 'circular' && newNodes.length > 1) {
      newNodes[newNodes.length - 1].next = newNodes[0].id;
    }

    setNodes(newNodes);
    setHead(newNodes[0]?.id || null);
    setOperations([]);
    setCurrentOperation('');
    setSelectedNodeId('');
    controls.reset();
  };

  const getNodeColor = (node: ListNode) => {
    switch (node.state) {
      case 'current':
        return 'bg-current border-primary';
      case 'comparing':
        return 'bg-comparison border-primary animate-pulse-glow';
      case 'found':
        return 'bg-sorted border-success';
      case 'inserting':
        return 'bg-primary border-primary';
      case 'deleting':
        return 'bg-error border-error';
      default:
        return 'bg-accent border-accent';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <h2 className="text-2xl font-semibold text-primary mb-2">
          {listType === 'singly' ? 'Singly' : listType === 'doubly' ? 'Doubly' : 'Circular'} Linked List
        </h2>
        <p className="text-text-secondary">
          Dynamic data structure where elements are stored in nodes with pointers to the next element. 
          Efficient insertion and deletion but requires sequential access.
        </p>
      </div>

      {/* Linked List Visualization */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-text-primary">Node Structure</h3>
          
          {/* Head pointer */}
          <div className="flex items-center space-x-4">
            <div className="bg-primary/20 border border-primary rounded-curvy px-3 py-2">
              <span className="text-primary font-medium">HEAD</span>
            </div>
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>

          {/* Nodes visualization */}
          <div className="overflow-x-auto">
            <div className="flex items-center space-x-4 min-w-max pb-4">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-center space-x-2">
                  {/* Node */}
                  <div
                    className={`
                      relative border-2 rounded-curvy p-4 cursor-pointer
                      transition-all duration-300 hover-lift
                      ${getNodeColor(node)}
                      ${selectedNodeId === node.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-primary' : ''}
                    `}
                    onClick={() => setSelectedNodeId(selectedNodeId === node.id ? '' : node.id)}
                  >
                    {/* Data section */}
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-xs text-text-muted mb-1">Data</div>
                        <div className="text-lg font-bold text-text-primary">{node.value}</div>
                      </div>
                      
                      <div className="w-px h-8 bg-accent"></div>
                      
                      {/* Next pointer section */}
                      <div className="text-center">
                        <div className="text-xs text-text-muted mb-1">Next</div>
                        <div className="text-sm font-mono text-text-secondary">
                          {node.next ? '→' : 'NULL'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Position label */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="text-xs text-text-muted font-medium">
                        [{index}]
                      </div>
                    </div>
                    
                    {/* State indicator */}
                    {node.state !== 'default' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  {/* Arrow to next node */}
                  {node.next && (
                    <ArrowRight className="h-6 w-6 text-primary flex-shrink-0" />
                  )}
                  
                  {/* Circular indicator */}
                  {listType === 'circular' && index === nodes.length - 1 && nodes.length > 1 && (
                    <div className="flex items-center space-x-2">
                      <div className="text-primary text-sm">↺</div>
                      <span className="text-xs text-text-muted">to HEAD</span>
                    </div>
                  )}
                </div>
              ))}
              
              {/* NULL terminator for non-circular lists */}
              {listType !== 'circular' && nodes.length > 0 && (
                <div className="bg-accent/20 border border-accent rounded-curvy px-3 py-2">
                  <span className="text-text-muted font-mono">NULL</span>
                </div>
              )}
            </div>
          </div>

          {/* Current Operation Display */}
          <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20 min-h-[60px] flex items-center justify-center">
            <p className="text-text-primary text-center">
              {currentOperation || 'Select an operation to begin...'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operation Controls */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h3 className="text-lg font-medium text-text-primary mb-4">List Operations</h3>
          
          <div className="space-y-4">
            {/* Insert */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Insert Node</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <input
                  type="number"
                  value={insertPosition}
                  onChange={(e) => setInsertPosition(e.target.value)}
                  placeholder="Position"
                  className="w-24 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <button
                  onClick={insertNode}
                  disabled={!newValue || isAnimating}
                  className="px-4 py-2 bg-primary hover:bg-hover text-secondary rounded-curvy
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover-lift"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Search Node</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Value to search"
                  className="flex-1 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
                <button
                  onClick={searchNode}
                  disabled={!searchValue || isAnimating}
                  className="px-4 py-2 bg-info hover:bg-info/80 text-white rounded-curvy
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover-lift"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Traverse */}
            <button
              onClick={traverseList}
              disabled={nodes.length === 0 || isAnimating}
              className="w-full px-4 py-2 bg-success hover:bg-success/80 text-white rounded-curvy
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 hover-lift"
            >
              Traverse List
            </button>

            {/* Selected Node Operations */}
            {selectedNodeId && (
              <div className="p-4 bg-primary/10 rounded-curvy border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-primary">
                    Selected Node: {nodes.find(n => n.id === selectedNodeId)?.value}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    const nodeIndex = nodes.findIndex(n => n.id === selectedNodeId);
                    if (nodeIndex >= 0) {
                      deleteNode(nodeIndex);
                      setSelectedNodeId('');
                    }
                  }}
                  disabled={isAnimating}
                  className="w-full px-4 py-2 bg-error hover:bg-error/80 text-white rounded-curvy
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover-lift"
                >
                  <Trash2 className="h-4 w-4 inline mr-2" />
                  Delete Node
                </button>
              </div>
            )}

            {/* Reset */}
            <button
              onClick={resetList}
              className="w-full px-4 py-2 bg-accent hover:bg-primary hover:text-secondary 
                       text-text-primary rounded-curvy transition-all duration-200 hover-lift"
            >
              <RotateCcw className="h-4 w-4 inline mr-2" />
              Reset List
            </button>
          </div>
        </div>

        {/* Animation Controls and Properties */}
        <div className="space-y-6">
          <AnimationControls
            state={state}
            controls={controls}
            disabled={operations.length === 0}
          />
          
          {/* List Properties */}
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <h3 className="text-lg font-medium text-text-primary mb-4">List Properties</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Access Time:</span>
                <span className="text-error font-mono">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Search Time:</span>
                <span className="text-error font-mono">O(n)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Insert/Delete:</span>
                <span className="text-success font-mono">O(1)*</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Space per Node:</span>
                <span className="text-info font-mono">O(1)</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-accent/10 rounded-curvy">
              <p className="text-xs text-text-muted">
                *O(1) insertion/deletion when you have a reference to the node. 
                O(n) if you need to traverse to find the position.
              </p>
            </div>
            
            <div className="mt-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Current Length:</span>
                <span className="text-primary font-medium">{nodes.length} nodes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Memory Usage:</span>
                <span className="text-primary font-medium">{nodes.length * 8} bytes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualization;