import React from 'react';
import { BarChart3, Search, GitBranch, Layers, List, FileStack as Stack, Binary, Network, ChevronRight, ChevronDown } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarSection {
  title: string;
  icon: React.ReactNode;
  items: {
    name: string;
    path: string;
    description: string;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['sorting', 'data-structures', 'trees', 'graphs']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections: SidebarSection[] = [
    {
      title: 'Sorting Algorithms',
      icon: <BarChart3 className="h-5 w-5" />,
      items: [
        { name: 'Bubble Sort', path: '/sorting/bubble', description: 'Simple comparison-based sorting' },
        { name: 'Selection Sort', path: '/sorting/selection', description: 'Find minimum and swap' },
        { name: 'Insertion Sort', path: '/sorting/insertion', description: 'Build sorted array incrementally' },
        { name: 'Merge Sort', path: '/sorting/merge', description: 'Divide and conquer approach' },
        { name: 'Quick Sort', path: '/sorting/quick', description: 'Partition-based sorting' },
        { name: 'Heap Sort', path: '/sorting/heap', description: 'Heap-based sorting algorithm' },
      ]
    },
    {
      title: 'Search Algorithms',
      icon: <Search className="h-5 w-5" />,
      items: [
        { name: 'Linear Search', path: '/search/linear', description: 'Sequential element search' },
        { name: 'Binary Search', path: '/search/binary', description: 'Divide and conquer search' },
      ]
    },
    {
      title: 'Data Structures',
      icon: <Layers className="h-5 w-5" />,
      items: [
        { name: 'Arrays', path: '/structures/arrays', description: 'Linear data collection' },
        { name: 'Linked Lists', path: '/structures/linked-lists', description: 'Node-based linear structure' },
        { name: 'Stacks', path: '/structures/stacks', description: 'LIFO data structure' },
        { name: 'Queues', path: '/structures/queues', description: 'FIFO data structure' },
      ]
    },
    {
      title: 'Tree Structures',
      icon: <Binary className="h-5 w-5" />,
      items: [
        { name: 'Binary Search Tree', path: '/trees/bst', description: 'Ordered binary tree' },
        { name: 'Heap', path: '/trees/heap', description: 'Complete binary tree' },
        { name: 'AVL Tree', path: '/trees/avl', description: 'Self-balancing BST' },
      ]
    },
    {
      title: 'Graph Algorithms',
      icon: <Network className="h-5 w-5" />,
      items: [
        { name: 'BFS Traversal', path: '/graphs/bfs', description: 'Breadth-first exploration' },
        { name: 'DFS Traversal', path: '/graphs/dfs', description: 'Depth-first exploration' },
        { name: 'Dijkstra\'s Algorithm', path: '/graphs/dijkstra', description: 'Shortest path algorithm' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-bg-secondary/95 backdrop-blur-sm border-r border-accent/20 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-[calc(100vh-4rem)]
      `}>
        <div className="h-full overflow-y-auto p-4">
          <div className="space-y-2">
            {sections.map((section, sectionIndex) => {
              const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
              const isExpanded = expandedSections.includes(sectionId);

              return (
                <div key={sectionIndex} className="space-y-1">
                  <button
                    onClick={() => toggleSection(sectionId)}
                    className="w-full flex items-center justify-between p-3 text-text-secondary hover:text-primary hover:bg-accent/20 rounded-curvy transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-primary group-hover:text-hover transition-colors duration-200">
                        {section.icon}
                      </div>
                      <span className="font-medium">{section.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-4 space-y-1 animate-slide-up">
                      {section.items.map((item, itemIndex) => (
                        <a
                          key={itemIndex}
                          href={item.path}
                          className="block p-3 text-text-muted hover:text-text-primary hover:bg-accent/10 rounded-curvy-sm transition-all duration-200 group"
                          onClick={onClose}
                        >
                          <div className="font-medium text-sm group-hover:text-primary transition-colors duration-200">
                            {item.name}
                          </div>
                          <div className="text-xs text-text-muted mt-1">
                            {item.description}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Playground Section */}
          <div className="mt-8 p-4 bg-primary rounded-curvy shadow-curvy">
            <h3 className="text-secondary font-semibold mb-2">Interactive Playground</h3>
            <p className="text-secondary/80 text-sm mb-3">
              Test algorithms with custom inputs and compare performance
            </p>
            <button className="w-full bg-secondary hover:bg-accent text-primary px-4 py-2 rounded-curvy-sm transition-all duration-200 hover-lift">
              Open Playground
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;