import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, Search, RotateCcw, Play, Pause, Shuffle, Target, Route } from 'lucide-react';
import { useAnimationEngine } from '../../hooks/useAnimationEngine';
import AnimationControls from '../animation/AnimationControls';
import { generateId } from '../../utils';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  state: 'default' | 'current' | 'visited' | 'target' | 'path' | 'exploring';
  distance?: number;
  previous?: string | null;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  state: 'default' | 'active' | 'visited' | 'path' | 'exploring';
}

interface GraphOperation {
  type: 'bfs' | 'dfs' | 'dijkstra' | 'add-node' | 'add-edge' | 'remove-node' | 'remove-edge';
  sourceNodeId?: string;
  targetNodeId?: string;
  description: string;
}

interface GraphVisualizationProps {
  algorithm?: 'bfs' | 'dfs' | 'dijkstra';
  className?: string;
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  algorithm = 'bfs',
  className = ''
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [operations, setOperations] = useState<GraphOperation[]>([]);
  const [currentOperation, setCurrentOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');
  const [graphType, setGraphType] = useState<'directed' | 'undirected'>('undirected');

  // Initialize with a sample graph
  useEffect(() => {
    initializeSampleGraph();
  }, []);

  const initializeSampleGraph = () => {
    const sampleNodes: GraphNode[] = [
      { id: 'A', label: 'A', x: 150, y: 100, state: 'default' },
      { id: 'B', label: 'B', x: 300, y: 80, state: 'default' },
      { id: 'C', label: 'C', x: 450, y: 120, state: 'default' },
      { id: 'D', label: 'D', x: 200, y: 250, state: 'default' },
      { id: 'E', label: 'E', x: 350, y: 280, state: 'default' },
      { id: 'F', label: 'F', x: 500, y: 250, state: 'default' }
    ];

    const sampleEdges: GraphEdge[] = [
      { id: 'AB', source: 'A', target: 'B', weight: 4, state: 'default' },
      { id: 'AC', source: 'A', target: 'C', weight: 2, state: 'default' },
      { id: 'AD', source: 'A', target: 'D', weight: 3, state: 'default' },
      { id: 'BC', source: 'B', target: 'C', weight: 1, state: 'default' },
      { id: 'BD', source: 'B', target: 'D', weight: 5, state: 'default' },
      { id: 'CE', source: 'C', target: 'E', weight: 3, state: 'default' },
      { id: 'DE', source: 'D', target: 'E', weight: 2, state: 'default' },
      { id: 'EF', source: 'E', target: 'F', weight: 1, state: 'default' }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
  };

  // Create animation steps for graph algorithms
  const createAlgorithmSteps = (operation: GraphOperation) => {
    const steps = [];
    
    switch (operation.type) {
      case 'bfs':
        if (operation.sourceNodeId) {
          steps.push(...createBFSSteps(operation.sourceNodeId, operation.targetNodeId));
        }
        break;
      case 'dfs':
        if (operation.sourceNodeId) {
          steps.push(...createDFSSteps(operation.sourceNodeId, operation.targetNodeId));
        }
        break;
      case 'dijkstra':
        if (operation.sourceNodeId) {
          steps.push(...createDijkstraSteps(operation.sourceNodeId, operation.targetNodeId));
        }
        break;
    }
    
    return steps;
  };

  const createBFSSteps = (startNodeId: string, targetNodeId?: string) => {
    const steps = [];
    const visited = new Set<string>();
    const queue = [startNodeId];
    const parent = new Map<string, string>();

    steps.push({
      id: `bfs-start-${Date.now()}`,
      type: 'highlight' as const,
      indices: [nodes.findIndex(n => n.id === startNodeId)],
      description: `Starting BFS from node ${startNodeId}`
    });

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      
      if (visited.has(currentNodeId)) continue;
      visited.add(currentNodeId);

      steps.push({
        id: `bfs-visit-${currentNodeId}-${Date.now()}`,
        type: 'set' as const,
        indices: [nodes.findIndex(n => n.id === currentNodeId)],
        description: `Visiting node ${currentNodeId}`
      });

      if (currentNodeId === targetNodeId) {
        steps.push({
          id: `bfs-found-${Date.now()}`,
          type: 'highlight' as const,
          indices: [nodes.findIndex(n => n.id === currentNodeId)],
          description: `Target node ${targetNodeId} found!`
        });
        break;
      }

      // Get neighbors
      const neighbors = getNeighbors(currentNodeId);
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId) && !queue.includes(neighborId)) {
          queue.push(neighborId);
          parent.set(neighborId, currentNodeId);
          
          steps.push({
            id: `bfs-explore-${neighborId}-${Date.now()}`,
            type: 'compare' as const,
            indices: [nodes.findIndex(n => n.id === neighborId)],
            description: `Adding ${neighborId} to queue`
          });
        }
      }
    }

    return steps;
  };

  const createDFSSteps = (startNodeId: string, targetNodeId?: string) => {
    const steps = [];
    const visited = new Set<string>();
    const stack = [startNodeId];

    steps.push({
      id: `dfs-start-${Date.now()}`,
      type: 'highlight' as const,
      indices: [nodes.findIndex(n => n.id === startNodeId)],
      description: `Starting DFS from node ${startNodeId}`
    });

    while (stack.length > 0) {
      const currentNodeId = stack.pop()!;
      
      if (visited.has(currentNodeId)) continue;
      visited.add(currentNodeId);

      steps.push({
        id: `dfs-visit-${currentNodeId}-${Date.now()}`,
        type: 'set' as const,
        indices: [nodes.findIndex(n => n.id === currentNodeId)],
        description: `Visiting node ${currentNodeId}`
      });

      if (currentNodeId === targetNodeId) {
        steps.push({
          id: `dfs-found-${Date.now()}`,
          type: 'highlight' as const,
          indices: [nodes.findIndex(n => n.id === currentNodeId)],
          description: `Target node ${targetNodeId} found!`
        });
        break;
      }

      // Get neighbors (in reverse order for stack)
      const neighbors = getNeighbors(currentNodeId).reverse();
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          stack.push(neighborId);
          
          steps.push({
            id: `dfs-explore-${neighborId}-${Date.now()}`,
            type: 'compare' as const,
            indices: [nodes.findIndex(n => n.id === neighborId)],
            description: `Adding ${neighborId} to stack`
          });
        }
      }
    }

    return steps;
  };

  const createDijkstraSteps = (startNodeId: string, targetNodeId?: string) => {
    const steps = [];
    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const unvisited = new Set(nodes.map(n => n.id));

    // Initialize distances
    nodes.forEach(node => {
      distances.set(node.id, node.id === startNodeId ? 0 : Infinity);
      previous.set(node.id, null);
    });

    steps.push({
      id: `dijkstra-start-${Date.now()}`,
      type: 'highlight' as const,
      indices: [nodes.findIndex(n => n.id === startNodeId)],
      description: `Starting Dijkstra's algorithm from node ${startNodeId}`
    });

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentNodeId = '';
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        const dist = distances.get(nodeId)!;
        if (dist < minDistance) {
          minDistance = dist;
          currentNodeId = nodeId;
        }
      }

      if (minDistance === Infinity) break;

      unvisited.delete(currentNodeId);

      steps.push({
        id: `dijkstra-visit-${currentNodeId}-${Date.now()}`,
        type: 'set' as const,
        indices: [nodes.findIndex(n => n.id === currentNodeId)],
        description: `Processing node ${currentNodeId} (distance: ${minDistance})`
      });

      if (currentNodeId === targetNodeId) {
        steps.push({
          id: `dijkstra-found-${Date.now()}`,
          type: 'highlight' as const,
          indices: [nodes.findIndex(n => n.id === currentNodeId)],
          description: `Shortest path to ${targetNodeId} found! Distance: ${minDistance}`
        });
        break;
      }

      // Update distances to neighbors
      const neighbors = getNeighbors(currentNodeId);
      for (const neighborId of neighbors) {
        if (unvisited.has(neighborId)) {
          const edge = edges.find(e => 
            (e.source === currentNodeId && e.target === neighborId) ||
            (graphType === 'undirected' && e.target === currentNodeId && e.source === neighborId)
          );
          
          if (edge) {
            const newDistance = distances.get(currentNodeId)! + edge.weight;
            const currentDistance = distances.get(neighborId)!;
            
            if (newDistance < currentDistance) {
              distances.set(neighborId, newDistance);
              previous.set(neighborId, currentNodeId);
              
              steps.push({
                id: `dijkstra-update-${neighborId}-${Date.now()}`,
                type: 'compare' as const,
                indices: [nodes.findIndex(n => n.id === neighborId)],
                description: `Updated distance to ${neighborId}: ${newDistance}`
              });
            }
          }
        }
      }
    }

    return steps;
  };

  const getNeighbors = (nodeId: string): string[] => {
    const neighbors: string[] = [];
    
    edges.forEach(edge => {
      if (edge.source === nodeId) {
        neighbors.push(edge.target);
      } else if (graphType === 'undirected' && edge.target === nodeId) {
        neighbors.push(edge.source);
      }
    });
    
    return neighbors;
  };

  const handleStepChange = (stepIndex: number, stepData: any) => {
    if (!stepData) return;

    setCurrentOperation(stepData.description);
    
    setNodes(prevNodes => {
      return prevNodes.map((node, index) => {
        let newState = node.state;
        
        if (stepData.indices.includes(index)) {
          switch (stepData.type) {
            case 'compare':
              newState = 'exploring';
              break;
            case 'highlight':
              newState = 'current';
              break;
            case 'set':
              newState = 'visited';
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
    setCurrentOperation('Algorithm completed');
    setIsAnimating(false);
    
    // Reset all states after a delay
    setTimeout(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          state: 'default'
        }))
      );
      setEdges(prevEdges =>
        prevEdges.map(edge => ({
          ...edge,
          state: 'default'
        }))
      );
    }, 2000);
  };

  const { state, controls } = useAnimationEngine({
    steps: operations.flatMap(createAlgorithmSteps),
    onStepChange: handleStepChange,
    onComplete: handleComplete
  });

  // Graph operations
  const runAlgorithm = (algorithmType: 'bfs' | 'dfs' | 'dijkstra') => {
    if (selectedNodes.length === 0) {
      setCurrentOperation('Please select a starting node');
      return;
    }

    const sourceNodeId = selectedNodes[0];
    const targetNodeId = selectedNodes[1];

    const operation: GraphOperation = {
      type: algorithmType,
      sourceNodeId,
      targetNodeId,
      description: `Run ${algorithmType.toUpperCase()} from ${sourceNodeId}${targetNodeId ? ` to ${targetNodeId}` : ''}`
    };

    setOperations([operation]);
    setIsAnimating(true);
  };

  const addNode = () => {
    if (!newNodeLabel.trim()) return;

    const newNode: GraphNode = {
      id: newNodeLabel.toUpperCase(),
      label: newNodeLabel.toUpperCase(),
      x: 200 + Math.random() * 300,
      y: 100 + Math.random() * 200,
      state: 'default'
    };

    setNodes(prev => [...prev, newNode]);
    setNewNodeLabel('');
  };

  const addEdge = () => {
    if (selectedNodes.length !== 2) {
      setCurrentOperation('Please select exactly 2 nodes to create an edge');
      return;
    }

    const weight = parseInt(edgeWeight) || 1;
    const [source, target] = selectedNodes;
    
    // Check if edge already exists
    const existingEdge = edges.find(e => 
      (e.source === source && e.target === target) ||
      (graphType === 'undirected' && e.source === target && e.target === source)
    );

    if (existingEdge) {
      setCurrentOperation('Edge already exists between these nodes');
      return;
    }

    const newEdge: GraphEdge = {
      id: `${source}${target}`,
      source,
      target,
      weight,
      state: 'default'
    };

    setEdges(prev => [...prev, newEdge]);
    setSelectedNodes([]);
    setIsAddingEdge(false);
  };

  const handleNodeClick = (nodeId: string) => {
    if (isAddingEdge) {
      setSelectedNodes(prev => {
        if (prev.includes(nodeId)) {
          return prev.filter(id => id !== nodeId);
        } else if (prev.length < 2) {
          return [...prev, nodeId];
        } else {
          return [nodeId];
        }
      });
    } else {
      setSelectedNodes(prev => 
        prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
      );
    }
  };

  const resetGraph = () => {
    initializeSampleGraph();
    setOperations([]);
    setCurrentOperation('');
    setSelectedNodes([]);
    setIsAddingEdge(false);
    controls.reset();
  };

  const generateRandomGraph = () => {
    const nodeCount = 6;
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];

    // Generate nodes
    for (let i = 0; i < nodeCount; i++) {
      const label = String.fromCharCode(65 + i); // A, B, C, etc.
      newNodes.push({
        id: label,
        label,
        x: 150 + (i % 3) * 200 + Math.random() * 50,
        y: 100 + Math.floor(i / 3) * 150 + Math.random() * 50,
        state: 'default'
      });
    }

    // Generate random edges
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < 0.4) { // 40% chance of edge
          const source = newNodes[i].id;
          const target = newNodes[j].id;
          newEdges.push({
            id: `${source}${target}`,
            source,
            target,
            weight: Math.floor(Math.random() * 9) + 1,
            state: 'default'
          });
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const getNodeColor = (node: GraphNode) => {
    switch (node.state) {
      case 'current':
        return '#fece67'; // Primary yellow
      case 'visited':
        return '#4ade80'; // Success green
      case 'exploring':
        return '#a78bfa'; // Comparison purple
      case 'target':
        return '#f87171'; // Error red
      case 'path':
        return '#fb923c'; // Pivot orange
      default:
        return '#2a2a2b'; // Accent
    }
  };

  const getEdgeColor = (edge: GraphEdge) => {
    switch (edge.state) {
      case 'active':
        return '#fece67'; // Primary yellow
      case 'visited':
        return '#4ade80'; // Success green
      case 'path':
        return '#fb923c'; // Pivot orange
      case 'exploring':
        return '#a78bfa'; // Comparison purple
      default:
        return '#6b7280'; // Gray
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Graph Algorithms</h2>
            <p className="text-text-secondary">
              Explore graph traversal and shortest path algorithms through interactive visualizations.
              Click nodes to select them, then run algorithms to see how they work.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={graphType}
              onChange={(e) => setGraphType(e.target.value as 'directed' | 'undirected')}
              className="p-2 bg-accent/20 border border-accent/40 rounded-curvy text-text-primary"
            >
              <option value="undirected">Undirected</option>
              <option value="directed">Directed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-text-primary">Graph Structure</h3>
          
          {/* SVG Graph */}
          <div className="border border-accent/20 rounded-curvy bg-bg-secondary/20 overflow-hidden">
            <svg width="700" height="400" className="w-full">
              {/* Render edges */}
              {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                
                if (!sourceNode || !targetNode) return null;

                const midX = (sourceNode.x + targetNode.x) / 2;
                const midY = (sourceNode.y + targetNode.y) / 2;

                return (
                  <g key={edge.id}>
                    {/* Edge line */}
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={getEdgeColor(edge)}
                      strokeWidth="2"
                      className="transition-colors duration-300"
                    />
                    
                    {/* Edge weight */}
                    <circle
                      cx={midX}
                      cy={midY}
                      r="12"
                      fill="var(--color-bg-card)"
                      stroke={getEdgeColor(edge)}
                      strokeWidth="1"
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      className="text-xs font-bold fill-text-primary"
                    >
                      {edge.weight}
                    </text>
                    
                    {/* Arrow for directed graphs */}
                    {graphType === 'directed' && (
                      <polygon
                        points={`${targetNode.x - 10},${targetNode.y - 5} ${targetNode.x - 10},${targetNode.y + 5} ${targetNode.x - 5},${targetNode.y}`}
                        fill={getEdgeColor(edge)}
                      />
                    )}
                  </g>
                );
              })}

              {/* Render nodes */}
              {nodes.map(node => (
                <g key={node.id} className="cursor-pointer" onClick={() => handleNodeClick(node.id)}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill={getNodeColor(node)}
                    stroke={selectedNodes.includes(node.id) ? '#fece67' : '#1f2937'}
                    strokeWidth={selectedNodes.includes(node.id) ? "3" : "2"}
                    className="transition-all duration-300 hover:stroke-primary"
                  />
                  
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="text-sm font-bold fill-text-primary pointer-events-none"
                  >
                    {node.label}
                  </text>
                  
                  {/* Selection indicator */}
                  {selectedNodes.includes(node.id) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="30"
                      fill="none"
                      stroke="#fece67"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Current Operation Display */}
          <div className="bg-accent/10 rounded-curvy p-4 border border-accent/20 min-h-[60px] flex items-center justify-center">
            <p className="text-text-primary text-center font-medium">
              {currentOperation || 'Select nodes and choose an algorithm to begin...'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Algorithm Controls */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h3 className="text-lg font-medium text-text-primary mb-4">Graph Operations</h3>
          
          <div className="space-y-4">
            {/* Selected Nodes Display */}
            <div className="p-3 bg-accent/10 rounded-curvy">
              <div className="text-sm font-medium text-text-secondary mb-2">Selected Nodes:</div>
              <div className="flex space-x-2">
                {selectedNodes.length > 0 ? (
                  selectedNodes.map((nodeId, index) => (
                    <span key={nodeId} className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                      {nodeId} {index === 0 ? '(start)' : index === 1 ? '(target)' : ''}
                    </span>
                  ))
                ) : (
                  <span className="text-text-muted text-sm">None selected</span>
                )}
              </div>
            </div>

            {/* Algorithm Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => runAlgorithm('bfs')}
                disabled={selectedNodes.length === 0 || isAnimating}
                className="px-4 py-3 bg-info hover:bg-info/80 text-white rounded-curvy
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 hover-lift font-medium"
              >
                <Search className="h-4 w-4 inline mr-2" />
                BFS
              </button>
              
              <button
                onClick={() => runAlgorithm('dfs')}
                disabled={selectedNodes.length === 0 || isAnimating}
                className="px-4 py-3 bg-warning hover:bg-warning/80 text-white rounded-curvy
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 hover-lift font-medium"
              >
                <Target className="h-4 w-4 inline mr-2" />
                DFS
              </button>
              
              <button
                onClick={() => runAlgorithm('dijkstra')}
                disabled={selectedNodes.length === 0 || isAnimating}
                className="px-4 py-3 bg-success hover:bg-success/80 text-white rounded-curvy
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 hover-lift font-medium"
              >
                <Route className="h-4 w-4 inline mr-2" />
                Dijkstra
              </button>
            </div>

            {/* Graph Modification */}
            <div className="space-y-3 pt-4 border-t border-accent/20">
              <h4 className="text-md font-medium text-text-secondary">Modify Graph</h4>
              
              {/* Add Node */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="Node label"
                  className="flex-1 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                  maxLength={2}
                />
                <button
                  onClick={addNode}
                  disabled={!newNodeLabel.trim()}
                  className="px-4 py-2 bg-primary hover:bg-hover text-secondary rounded-curvy
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200 hover-lift"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add Edge */}
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={edgeWeight}
                  onChange={(e) => setEdgeWeight(e.target.value)}
                  placeholder="Weight"
                  className="w-20 p-2 bg-accent/20 border border-accent/40 rounded-curvy
                           text-text-primary placeholder-text-muted
                           focus:border-primary focus:ring-1 focus:ring-primary/20"
                  min="1"
                />
                <button
                  onClick={() => setIsAddingEdge(!isAddingEdge)}
                  className={`flex-1 px-4 py-2 rounded-curvy transition-all duration-200 hover-lift ${
                    isAddingEdge 
                      ? 'bg-warning text-white' 
                      : 'bg-accent hover:bg-primary hover:text-secondary text-text-primary'
                  }`}
                >
                  {isAddingEdge ? 'Cancel Edge' : 'Add Edge'}
                </button>
                {isAddingEdge && (
                  <button
                    onClick={addEdge}
                    disabled={selectedNodes.length !== 2}
                    className="px-4 py-2 bg-success hover:bg-success/80 text-white rounded-curvy
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200 hover-lift"
                  >
                    Create
                  </button>
                )}
              </div>
            </div>

            {/* Utility Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-accent/20">
              <button
                onClick={generateRandomGraph}
                className="px-4 py-2 bg-info hover:bg-info/80 text-white rounded-curvy
                         transition-all duration-200 hover-lift font-medium"
              >
                <Shuffle className="h-4 w-4 inline mr-2" />
                Random Graph
              </button>
              
              <button
                onClick={resetGraph}
                className="px-4 py-2 bg-accent hover:bg-primary hover:text-secondary 
                         text-text-primary rounded-curvy transition-all duration-200 hover-lift font-medium"
              >
                <RotateCcw className="h-4 w-4 inline mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Animation Controls and Algorithm Info */}
        <div className="space-y-6">
          <AnimationControls
            state={state}
            controls={controls}
            disabled={operations.length === 0}
          />
          
          {/* Algorithm Information */}
          <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
            <h3 className="text-lg font-medium text-text-primary mb-4">Algorithm Information</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-info mb-2">Breadth-First Search (BFS)</h4>
                <ul className="space-y-1 text-text-muted text-sm">
                  <li>• Explores nodes level by level</li>
                  <li>• Uses a queue data structure</li>
                  <li>• Finds shortest path (unweighted)</li>
                  <li>• Time: O(V + E), Space: O(V)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-warning mb-2">Depth-First Search (DFS)</h4>
                <ul className="space-y-1 text-text-muted text-sm">
                  <li>• Explores as far as possible first</li>
                  <li>• Uses a stack data structure</li>
                  <li>• Good for topological sorting</li>
                  <li>• Time: O(V + E), Space: O(V)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-success mb-2">Dijkstra's Algorithm</h4>
                <ul className="space-y-1 text-text-muted text-sm">
                  <li>• Finds shortest path (weighted)</li>
                  <li>• Uses a priority queue</li>
                  <li>• Works with non-negative weights</li>
                  <li>• Time: O((V + E) log V), Space: O(V)</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-accent/10 rounded-curvy">
              <p className="text-xs text-text-muted leading-relaxed">
                <strong>Usage:</strong> Click nodes to select them (first = start, second = target), 
                then choose an algorithm. BFS and DFS work with any graph, while Dijkstra finds 
                the shortest weighted path.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualization;