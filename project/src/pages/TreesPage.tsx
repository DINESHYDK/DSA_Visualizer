import React, { useState } from 'react';
import BinarySearchTreeVisualization from '../components/trees/BinarySearchTreeVisualization';
import HeapVisualization from '../components/trees/HeapVisualization';
import AVLTreeVisualization from '../components/trees/AVLTreeVisualization';
import { Binary, GitBranch, RotateCw, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

type TreeType = 'bst' | 'heap' | 'avl';

const TreesPage: React.FC = () => {
  const [selectedTree, setSelectedTree] = useState<TreeType>('bst');

  const treeTypes = [
    {
      id: 'bst' as const,
      name: 'Binary Search Tree',
      icon: <Binary className="h-6 w-6" />,
      description: 'Ordered binary tree with BST property',
      complexity: 'Average: O(log n), Worst: O(n)',
      color: 'text-primary',
      features: ['In-order traversal gives sorted sequence', 'Simple implementation', 'Can become unbalanced']
    },
    {
      id: 'heap' as const,
      name: 'Heap (Priority Queue)',
      icon: <BarChart3 className="h-6 w-6" />,
      description: 'Complete binary tree with heap property',
      complexity: 'Insert/Extract: O(log n), Peek: O(1)',
      color: 'text-success',
      features: ['Efficient priority queue', 'Complete binary tree', 'Array-based implementation']
    },
    {
      id: 'avl' as const,
      name: 'AVL Tree',
      icon: <RotateCw className="h-6 w-6" />,
      description: 'Self-balancing BST with height balance',
      complexity: 'All operations: O(log n) guaranteed',
      color: 'text-info',
      features: ['Guaranteed O(log n) height', 'Automatic rebalancing', 'Four rotation types']
    }
  ];

  const renderVisualization = () => {
    switch (selectedTree) {
      case 'bst':
        return <BinarySearchTreeVisualization />;
      case 'heap':
        return <HeapVisualization />;
      case 'avl':
        return <AVLTreeVisualization />;
      default:
        return <BinarySearchTreeVisualization />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Tree Data Structures</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explore hierarchical data structures that organize data in tree-like relationships. 
            Understand different tree types, their properties, and optimal use cases.
          </p>
        </div>

        {/* Tree Type Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {treeTypes.map((tree) => (
              <button
                key={tree.id}
                onClick={() => setSelectedTree(tree.id)}
                className={`p-6 rounded-curvy border-2 transition-all duration-200 text-left hover-lift ${
                  selectedTree === tree.id
                    ? 'bg-primary/20 border-primary text-primary shadow-glow'
                    : 'bg-bg-card border-accent/40 text-text-secondary hover:bg-primary/10 hover:border-primary/60'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`${selectedTree === tree.id ? 'text-primary' : tree.color}`}>
                    {tree.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{tree.name}</h3>
                </div>
                
                <p className="text-sm opacity-80 mb-3 leading-relaxed">{tree.description}</p>
                <p className="text-xs font-mono opacity-70 mb-3">{tree.complexity}</p>
                
                <div className="space-y-1">
                  {tree.features.map((feature, index) => (
                    <div key={index} className="text-xs opacity-70 flex items-center">
                      <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {selectedTree === tree.id && (
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
          {renderVisualization()}
        </div>

        {/* Educational Content */}
        <div className="bg-bg-card rounded-curvy p-6 shadow-curvy">
          <h2 className="text-2xl font-semibold text-primary mb-6">Understanding Tree Structures</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Binary Search Trees */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary flex items-center space-x-2">
                <Binary className="h-5 w-5" />
                <span>Binary Search Trees</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Properties</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Left subtree values &lt; node value</li>
                    <li>• Right subtree values &gt; node value</li>
                    <li>• In-order traversal gives sorted sequence</li>
                    <li>• Can become unbalanced (worst case O(n))</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Use Cases</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Database indexing</li>
                    <li>• Expression parsing</li>
                    <li>• File system organization</li>
                    <li>• Decision trees</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Heaps */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-success flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Heaps</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Properties</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Complete binary tree structure</li>
                    <li>• Parent ≥ children (max heap)</li>
                    <li>• Parent ≤ children (min heap)</li>
                    <li>• Array-based implementation</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Use Cases</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Priority queues</li>
                    <li>• Heap sort algorithm</li>
                    <li>• Task scheduling</li>
                    <li>• Graph algorithms (Dijkstra)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AVL Trees */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-info flex items-center space-x-2">
                <RotateCw className="h-5 w-5" />
                <span>AVL Trees</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Properties</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• Self-balancing BST</li>
                    <li>• |Balance Factor| ≤ 1 for all nodes</li>
                    <li>• Automatic rotations maintain balance</li>
                    <li>• Guaranteed O(log n) operations</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Rotations</h4>
                  <ul className="space-y-1 text-text-muted text-sm">
                    <li>• LL: Single right rotation</li>
                    <li>• RR: Single left rotation</li>
                    <li>• LR: Left-right double rotation</li>
                    <li>• RL: Right-left double rotation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-text-primary mb-4">Performance Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-accent/20">
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Tree Type</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Search</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Insert</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Delete</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Space</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Balance</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-accent/10 hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-primary">Binary Search Tree</td>
                    <td className="py-3 px-4 text-warning font-mono">O(log n)*</td>
                    <td className="py-3 px-4 text-warning font-mono">O(log n)*</td>
                    <td className="py-3 px-4 text-warning font-mono">O(log n)*</td>
                    <td className="py-3 px-4 text-info font-mono">O(n)</td>
                    <td className="py-3 px-4 text-error">Manual</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Simple searches, learning</td>
                  </tr>
                  <tr className="border-b border-accent/10 hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-success">Heap</td>
                    <td className="py-3 px-4 text-error font-mono">O(n)</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(log n)</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(log n)</td>
                    <td className="py-3 px-4 text-info font-mono">O(n)</td>
                    <td className="py-3 px-4 text-success">Complete</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Priority queues, sorting</td>
                  </tr>
                  <tr className="hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-info">AVL Tree</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(log n)</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(log n)</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(log n)</td>
                    <td className="py-3 px-4 text-info font-mono">O(n)</td>
                    <td className="py-3 px-4 text-success">Auto</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Databases, frequent searches</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-text-muted mt-3">
              * Average case for balanced tree. Worst case O(n) for skewed BST.
            </p>
          </div>

          {/* Tree Concepts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-accent/10 rounded-curvy p-4">
              <h4 className="text-md font-medium text-primary mb-3">Tree Terminology</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><strong className="text-text-primary">Root:</strong> Top node with no parent</li>
                <li><strong className="text-text-primary">Leaf:</strong> Node with no children</li>
                <li><strong className="text-text-primary">Height:</strong> Longest path from root to leaf</li>
                <li><strong className="text-text-primary">Balance Factor:</strong> Height difference between subtrees</li>
                <li><strong className="text-text-primary">Complete Tree:</strong> All levels filled except possibly last</li>
              </ul>
            </div>
            
            <div className="bg-accent/10 rounded-curvy p-4">
              <h4 className="text-md font-medium text-primary mb-3">Traversal Methods</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><strong className="text-success">In-order:</strong> Left → Root → Right (sorted for BST)</li>
                <li><strong className="text-warning">Pre-order:</strong> Root → Left → Right (tree copying)</li>
                <li><strong className="text-info">Post-order:</strong> Left → Right → Root (tree deletion)</li>
                <li><strong className="text-primary">Level-order:</strong> Breadth-first traversal</li>
                <li><strong className="text-text-primary">Applications:</strong> Expression evaluation, serialization</li>
              </ul>
            </div>
          </div>

          {/* When to Use Each */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-text-primary mb-4">Choosing the Right Tree</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 rounded-curvy p-4 border border-primary/20">
                <h4 className="font-medium text-primary mb-2">Use BST When:</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• Learning tree concepts</li>
                  <li>• Simple implementation needed</li>
                  <li>• Data is roughly balanced</li>
                  <li>• In-order traversal important</li>
                </ul>
              </div>
              
              <div className="bg-success/10 rounded-curvy p-4 border border-success/20">
                <h4 className="font-medium text-success mb-2">Use Heap When:</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• Need priority queue</li>
                  <li>• Implementing heap sort</li>
                  <li>• Finding min/max efficiently</li>
                  <li>• Memory efficiency important</li>
                </ul>
              </div>
              
              <div className="bg-info/10 rounded-curvy p-4 border border-info/20">
                <h4 className="font-medium text-info mb-2">Use AVL When:</h4>
                <ul className="space-y-1 text-sm text-text-muted">
                  <li>• Guaranteed O(log n) needed</li>
                  <li>• Frequent searches</li>
                  <li>• Database indexing</li>
                  <li>• Worst-case performance critical</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreesPage;