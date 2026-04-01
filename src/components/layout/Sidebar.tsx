import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3, Layers, Binary, Network,
  FlaskConical, BookOpen, ChevronRight, ChevronDown,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  items: { name: string; path: string }[];
}

const sections: SidebarSection[] = [
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    icon: <BarChart3 className="h-4 w-4" />,
    path: '/sorting',
    items: [
      { name: 'Bubble Sort',    path: '/sorting' },
      { name: 'Selection Sort', path: '/sorting' },
      { name: 'Insertion Sort', path: '/sorting' },
      { name: 'Merge Sort',     path: '/sorting' },
      { name: 'Quick Sort',     path: '/sorting' },
      { name: 'Heap Sort',      path: '/sorting' },
    ],
  },
  {
    id: 'data-structures',
    title: 'Data Structures',
    icon: <Layers className="h-4 w-4" />,
    path: '/data-structures',
    items: [
      { name: 'Arrays',       path: '/data-structures' },
      { name: 'Linked Lists', path: '/data-structures' },
      { name: 'Stacks',       path: '/data-structures' },
      { name: 'Queues',       path: '/data-structures' },
    ],
  },
  {
    id: 'trees',
    title: 'Tree Structures',
    icon: <Binary className="h-4 w-4" />,
    path: '/trees',
    items: [
      { name: 'Binary Search Tree', path: '/trees' },
      { name: 'Heap Tree',          path: '/trees' },
      { name: 'AVL Tree',           path: '/trees' },
    ],
  },
  {
    id: 'graphs',
    title: 'Graph Algorithms',
    icon: <Network className="h-4 w-4" />,
    path: '/graphs',
    items: [
      { name: 'BFS Traversal',      path: '/graphs' },
      { name: 'DFS Traversal',      path: '/graphs' },
      { name: "Dijkstra's",         path: '/graphs' },
    ],
  },
  {
    id: 'playground',
    title: 'Playground',
    icon: <FlaskConical className="h-4 w-4" />,
    path: '/playground',
    items: [],
  },
  {
    id: 'complexity',
    title: 'Complexity Analysis',
    icon: <BookOpen className="h-4 w-4" />,
    path: '/complexity',
    items: [],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expanded, setExpanded] = React.useState<string[]>(['sorting']);

  const toggle = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64
          bg-bg-secondary border-r border-border z-50
          transform transition-transform duration-200 ease-in-out overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-auto
        `}
      >
        <nav className="p-3 space-y-0.5">
          {sections.map((section) => {
            const isExpanded = expanded.includes(section.id);

            return (
              <div key={section.id}>
                {/* Section header */}
                <div className="flex items-center">
                  <NavLink
                    to={section.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex-1 flex items-center gap-2.5 px-3 py-2 text-sm rounded
                       transition-colors duration-150
                       ${isActive
                         ? 'text-accent font-medium border-l-2 border-accent pl-[10px] bg-[rgba(255,161,22,0.06)]'
                         : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
                       }`
                    }
                  >
                    {section.icon}
                    <span>{section.title}</span>
                  </NavLink>

                  {section.items.length > 0 && (
                    <button
                      onClick={() => toggle(section.id)}
                      className="p-2 text-text-muted hover:text-text-secondary transition-colors duration-150"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded
                        ? <ChevronDown className="h-3.5 w-3.5" />
                        : <ChevronRight className="h-3.5 w-3.5" />
                      }
                    </button>
                  )}
                </div>

                {/* Sub-items */}
                {isExpanded && section.items.length > 0 && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                    {section.items.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        className="block px-2 py-1.5 text-xs text-text-muted hover:text-text-secondary
                                   hover:bg-bg-elevated rounded transition-colors duration-150"
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
