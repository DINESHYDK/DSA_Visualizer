import React, { useState } from 'react';
import GraphVisualization from '../components/graphs/GraphVisualization';
import { Network, Search, Target, Route, GitBranch, Zap } from 'lucide-react';

type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra';

const GraphsPage: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<GraphAlgorithm>('bfs');

  const algorithms = [
    {
      id: 'bfs' as const,
      name: 'Breadth-First Search',
      icon: <Search className="h-6 w-6" />,
      description: 'Level-by-level exploration using a queue',
      complexity: 'Time: O(V + E), Space: O(V)',
      color: 'text-info',
      features: ['Shortest path (unweighted)', 'Level-order traversal', 'Queue-based implementation']
    },
    {
      id: 'dfs' as const,
      name: 'Depth-First Search',
      icon: <Target className="h-6 w-6" />,
      description: 'Deep exploration using a stack',
      complexity: 'Time: O(V + E), Space: O(V)',
      color: 'text-warning',
      features: ['Topological sorting', 'Cycle detection', 'Stack-based implementation']
    },
    {
      id: 'dijkstra' as const,
      name: "Dijkstra's Algorithm",
      icon: <Route className="h-6 w-6" />,
      description: 'Shortest path in weighted graphs',
      complexity: 'Time: O((V + E) log V), Space: O(V)',
      color: 'text-success',
      features: ['Weighted shortest path', 'Priority queue based', 'Non-negative weights only']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Graph Algorithms</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explore graph traversal and shortest path algorithms through interactive visualizations. 
            Understand how different algorithms navigate and analyze graph structures.
          </p>
        </div>

        {/* Algorithm Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {algorithms.map((algorithm) => (
              <button
                key={algorithm.id}
                onClick={() => setSelectedAlgorithm(algorithm.id)}
                className={`p-6 rounded-curvy border-2 transition-all duration-200 text-left hover-lift ${
                  selectedAlgorithm === algorithm.id
                    ? 'bg-primary/20 border-primary text-primary shadow-glow'
                    : 'bg-bg-card border-accent/40 text-text-secondary hover:bg-primary/10 hover:border-primary/60'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`${selectedAlgorithm === algorithm.id ? 'text-primary' : algorithm.color}`}>
                    {algorithm.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{algorithm.name}</h3>
                </div>
                
                <p className="text-sm opacity-80 mb-3 leading-relaxed">{algorithm.description}</p>
                <p className="text-xs font-mono opacity-70 mb-3">{algorithm.complexity}</p>
                
                <div className="space-y-1">
                  {algorithm.features.map((feature, index) => (
                    <div key={index} className="text-xs opacity-70 flex items-center">
                      <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {selectedAlgorithm === algorithm.id && (
                  <div className="mt-3 text-xs text-primary font-medium">
                    ✓ Currently Active
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div className="mb-12">
          <GraphVisualization algorithm={selectedAlgorithm} />
        </div>

        {/* Educational Content */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h2 className="text-2xl font-semibold text-primary mb-6">Understanding Graph Algorithms</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Graph Fundamentals */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>Graph Fundamentals</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Graph Components</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• <strong>Vertices (V):</strong> Nodes in the graph</li>
                    <li>• <strong>Edges (E):</strong> Connections between nodes</li>
                    <li>• <strong>Weight:</strong> Cost associated with edges</li>
                    <li>• <strong>Path:</strong> Sequence of connected vertices</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Graph Types</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• <strong>Directed:</strong> Edges have direction</li>
                    <li>• <strong>Undirected:</strong> Edges are bidirectional</li>
                    <li>• <strong>Weighted:</strong> Edges have associated costs</li>
                    <li>• <strong>Unweighted:</strong> All edges have equal cost</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Traversal Algorithms */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-info flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Traversal Algorithms</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Breadth-First Search</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Explores neighbors before going deeper</li>
                    <li>• Uses queue (FIFO) data structure</li>
                    <li>• Guarantees shortest path (unweighted)</li>
                    <li>• Good for finding connected components</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Depth-First Search</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Explores as far as possible first</li>
                    <li>• Uses stack (LIFO) data structure</li>
                    <li>• Good for topological sorting</li>
                    <li>• Detects cycles in graphs</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Shortest Path */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-success flex items-center space-x-2">
                <Route className="h-5 w-5" />
                <span>Shortest Path</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Dijkstra's Algorithm</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Finds shortest path in weighted graphs</li>
                    <li>• Uses priority queue (min-heap)</li>
                    <li>• Requires non-negative edge weights</li>
                    <li>• Greedy algorithm approach</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Applications</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• GPS navigation systems</li>
                    <li>• Network routing protocols</li>
                    <li>• Social network analysis</li>
                    <li>• Game pathfinding (A*)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-text-primary mb-4">Algorithm Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-accent/20">
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Algorithm</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Time Complexity</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Space Complexity</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Data Structure</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Shortest Path</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-accent/10 hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-info">BFS</td>
                    <td className="py-3 px-4 text-success font-mono">O(V + E)</td>
                    <td className="py-3 px-4 text-warning font-mono">O(V)</td>
                    <td className="py-3 px-4 text-text-muted">Queue</td>
                    <td className="py-3 px-4 text-success">Yes (unweighted)</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Level traversal, shortest path</td>
                  </tr>
                  <tr className="border-b border-accent/10 hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-warning">DFS</td>
                    <td className="py-3 px-4 text-success font-mono">O(V + E)</td>
                    <td className="py-3 px-4 text-warning font-mono">O(V)</td>
                    <td className="py-3 px-4 text-text-muted">Stack</td>
                    <td className="py-3 px-4 text-error">No</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Topological sort, cycle detection</td>
                  </tr>
                  <tr className="hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-success">Dijkstra</td>
                    <td className="py-3 px-4 text-warning font-mono">O((V+E) log V)</td>
                    <td className="py-3 px-4 text-warning font-mono">O(V)</td>
                    <td className="py-3 px-4 text-text-muted">Priority Queue</td>
                    <td className="py-3 px-4 text-success">Yes (weighted)</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Weighted shortest path</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-World Applications */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-accent/10 rounded-curvy p-4">
              <h4 className="text-md font-medium text-primary mb-3">Real-World Applications</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><strong className="text-info">Social Networks:</strong> Friend recommendations, influence analysis</li>
                <li><strong className="text-warning">Transportation:</strong> Route planning, traffic optimization</li>
                <li><strong className="text-success">Internet:</strong> Packet routing, web crawling</li>
                <li><strong className="text-primary">Games:</strong> AI pathfinding, procedural generation</li>
                <li><strong className="text-text-primary">Biology:</strong> Protein interactions, phylogenetic trees</li>
              </ul>
            </div>
            
            <div className="bg-accent/10 rounded-curvy p-4">
              <h4 className="text-md font-medium text-primary mb-3">Implementation Tips</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><strong className="text-info">Adjacency List:</strong> Better for sparse graphs (fewer edges)</li>
                <li><strong className="text-warning">Adjacency Matrix:</strong> Better for dense graphs (many edges)</li>
                <li><strong className="text-success">Priority Queue:</strong> Use min-heap for Dijkstra's algorithm</li>
                <li><strong className="text-primary">Visited Set:</strong> Prevent infinite loops in cyclic graphs</li>
                <li><strong className="text-text-primary">Path Reconstruction:</strong> Store parent pointers for path tracking</li>
              </ul>
            </div>
          </div>

          {/* Interactive Instructions */}
          <div className="mt-8 bg-primary/10 rounded-curvy p-4 border border-primary/20">
            <h4 className="text-md font-medium text-primary mb-3">How to Use the Visualization</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-muted">
              <div>
                <h5 className="font-medium text-text-primary mb-2">Basic Operations:</h5>
                <ul className="space-y-1">
                  <li>• Click nodes to select them (start and target)</li>
                  <li>• Choose an algorithm from the buttons</li>
                  <li>• Use animation controls to step through</li>
                  <li>• Reset to try different scenarios</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-text-primary mb-2">Graph Modification:</h5>
                <ul className="space-y-1">
                  <li>• Add new nodes with custom labels</li>
                  <li>• Create edges between selected nodes</li>
                  <li>• Set edge weights for Dijkstra's algorithm</li>
                  <li>• Generate random graphs for testing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphsPage;