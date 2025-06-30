import React, { useState } from 'react';
import ArrayDataStructure from '../components/datastructures/ArrayVisualization';
import LinkedListVisualization from '../components/datastructures/LinkedListVisualization';
import StackQueueVisualization from '../components/datastructures/StackQueueVisualization';
import { Database, List, Layers, GitBranch, ArrowUp, ArrowRight } from 'lucide-react';

type DataStructureType = 'array' | 'linked-list' | 'stack' | 'queue';

const DataStructuresPage: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState<DataStructureType>('array');

  const dataStructures = [
    {
      id: 'array' as const,
      name: 'Array',
      icon: <Database className="h-6 w-6" />,
      description: 'Linear collection with indexed access',
      complexity: 'Access: O(1), Search: O(n)',
      color: 'text-info'
    },
    {
      id: 'linked-list' as const,
      name: 'Linked List',
      icon: <GitBranch className="h-6 w-6" />,
      description: 'Dynamic structure with pointer-based connections',
      complexity: 'Access: O(n), Insert/Delete: O(1)*',
      color: 'text-primary'
    },
    {
      id: 'stack' as const,
      name: 'Stack',
      icon: <ArrowUp className="h-6 w-6" />,
      description: 'LIFO (Last In, First Out) structure',
      complexity: 'Push/Pop: O(1), Peek: O(1)',
      color: 'text-success'
    },
    {
      id: 'queue' as const,
      name: 'Queue',
      icon: <ArrowRight className="h-6 w-6" />,
      description: 'FIFO (First In, First Out) structure',
      complexity: 'Enqueue/Dequeue: O(1)',
      color: 'text-warning'
    }
  ];

  const renderVisualization = () => {
    switch (selectedStructure) {
      case 'array':
        return <ArrayDataStructure />;
      case 'linked-list':
        return <LinkedListVisualization />;
      case 'stack':
        return <StackQueueVisualization dataStructure="stack" />;
      case 'queue':
        return <StackQueueVisualization dataStructure="queue" />;
      default:
        return <ArrayDataStructure />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Data Structures</h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Explore fundamental data structures through interactive visualizations. 
            Understand how data is organized, stored, and accessed in different structures.
          </p>
        </div>

        {/* Data Structure Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dataStructures.map((structure) => (
              <button
                key={structure.id}
                onClick={() => setSelectedStructure(structure.id)}
                className={`p-6 rounded-curvy border-2 transition-all duration-200 text-left hover-lift ${
                  selectedStructure === structure.id
                    ? 'bg-primary/20 border-primary text-primary shadow-glow'
                    : 'bg-bg-card border-accent/40 text-text-secondary hover:bg-primary/10 hover:border-primary/60'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`${selectedStructure === structure.id ? 'text-primary' : structure.color}`}>
                    {structure.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{structure.name}</h3>
                </div>
                
                <p className="text-sm opacity-80 mb-2 leading-relaxed">{structure.description}</p>
                <p className="text-xs font-mono opacity-70">{structure.complexity}</p>
                
                {selectedStructure === structure.id && (
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
          <h2 className="text-2xl font-semibold text-primary mb-6">Understanding Data Structures</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Arrays */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-info flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Arrays</span>
              </h3>
              <ul className="space-y-2 text-text-muted text-sm">
                <li>• Fixed-size sequential collection</li>
                <li>• Direct access via index</li>
                <li>• Contiguous memory allocation</li>
                <li>• Cache-friendly due to locality</li>
                <li>• Best for: Random access, mathematical operations</li>
              </ul>
            </div>

            {/* Linked Lists */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-primary flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>Linked Lists</span>
              </h3>
              <ul className="space-y-2 text-text-muted text-sm">
                <li>• Dynamic size with pointer connections</li>
                <li>• Sequential access only</li>
                <li>• Non-contiguous memory</li>
                <li>• Efficient insertion/deletion</li>
                <li>• Best for: Frequent insertions, unknown size</li>
              </ul>
            </div>

            {/* Stacks */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-success flex items-center space-x-2">
                <ArrowUp className="h-5 w-5" />
                <span>Stacks</span>
              </h3>
              <ul className="space-y-2 text-text-muted text-sm">
                <li>• LIFO (Last In, First Out)</li>
                <li>• Restricted access to top only</li>
                <li>• Push and pop operations</li>
                <li>• Constant time operations</li>
                <li>• Best for: Function calls, undo operations</li>
              </ul>
            </div>

            {/* Queues */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-warning flex items-center space-x-2">
                <ArrowRight className="h-5 w-5" />
                <span>Queues</span>
              </h3>
              <ul className="space-y-2 text-text-muted text-sm">
                <li>• FIFO (First In, First Out)</li>
                <li>• Add at rear, remove from front</li>
                <li>• Enqueue and dequeue operations</li>
                <li>• Constant time operations</li>
                <li>• Best for: Task scheduling, BFS algorithms</li>
              </ul>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-text-primary mb-4">Performance Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-accent/20">
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Data Structure</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Access</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Search</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Insert</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Delete</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Space</th>
                    <th className="text-left py-3 px-4 text-text-secondary font-semibold">Use Cases</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-accent/10 hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-info">Array</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(1)</td>
                    <td className="py-3 px-4 text-warning font-mono">O(n)</td>
                    <td className="py-3 px-4 text-error font-mono">O(n)</td>
                    <td className="py-3 px-4 text-error font-mono">O(n)</td>
                    <td className="py-3 px-4 text-info font-mono">O(n)</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Math operations, lookup tables</td>
                  </tr>
                  <tr className="border-b border-accent/10 hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-primary">Linked List</td>
                    <td className="py-3 px-4 text-error font-mono">O(n)</td>
                    <td className="py-3 px-4 text-error font-mono">O(n)</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(1)*</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(1)*</td>
                    <td className="py-3 px-4 text-info font-mono">O(n)</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Dynamic lists, memory efficiency</td>
                  </tr>
                  <tr className="border-b border-accent/10 hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-success">Stack</td>
                    <td className="py-3 px-4 text-error font-mono">O(n)</td>
                    <td className="py-3 px-4 text-error font-mono">O(n)</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(1)</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(1)</td>
                    <td className="py-3 px-4 text-info font-mono">O(n)</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Function calls, undo operations</td>
                  </tr>
                  <tr className="hover:bg-accent/5">
                    <td className="py-3 px-4 font-medium text-warning">Queue</td>
                    <td className="py-3 px-4 text-error font-mono">O(n)</td>
                    <td className="py-3 px-4 text-error font-mono">O(n)</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(1)</td>
                    <td className="py-3 px-4 text-success font-mono font-bold">O(1)</td>
                    <td className="py-3 px-4 text-info font-mono">O(n)</td>
                    <td className="py-3 px-4 text-text-muted text-xs">Task scheduling, BFS algorithms</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-xs text-text-muted mt-3">
              * O(1) when you have a reference to the node. O(n) if you need to traverse to find the position.
            </p>
          </div>

          {/* Key Concepts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-accent/10 rounded-curvy p-4">
              <h4 className="text-md font-medium text-primary mb-3">When to Use Each Structure</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><strong className="text-info">Arrays:</strong> When you need fast random access and know the size</li>
                <li><strong className="text-primary">Linked Lists:</strong> When size varies and you insert/delete frequently</li>
                <li><strong className="text-success">Stacks:</strong> For LIFO operations like parsing, recursion</li>
                <li><strong className="text-warning">Queues:</strong> For FIFO operations like scheduling, buffering</li>
              </ul>
            </div>
            
            <div className="bg-accent/10 rounded-curvy p-4">
              <h4 className="text-md font-medium text-primary mb-3">Memory Considerations</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><strong className="text-info">Arrays:</strong> Contiguous memory, cache-friendly</li>
                <li><strong className="text-primary">Linked Lists:</strong> Scattered memory, extra pointer overhead</li>
                <li><strong className="text-success">Stacks:</strong> Can use arrays or linked lists as backing</li>
                <li><strong className="text-warning">Queues:</strong> Circular arrays or linked lists for efficiency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataStructuresPage;