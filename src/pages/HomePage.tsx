import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Layers, Binary, Network, FlaskConical, BookOpen } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

interface NavCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  badge?: { label: string; variant: 'easy' | 'medium' | 'hard' | 'info' | 'default' };
  available: boolean;
}

const navCards: NavCard[] = [
  {
    title: 'Sorting Algorithms',
    description: 'Bubble, Selection, Insertion, Merge, Quick, Heap Sort with step-by-step visualization.',
    icon: <BarChart3 className="h-5 w-5" />,
    path: '/sorting',
    badge: { label: '6 Algorithms', variant: 'info' },
    available: true,
  },
  {
    title: 'Data Structures',
    description: 'Arrays, Linked Lists, Stacks, and Queues with interactive operations.',
    icon: <Layers className="h-5 w-5" />,
    path: '/data-structures',
    badge: { label: '4 Structures', variant: 'info' },
    available: true,
  },
  {
    title: 'Tree Structures',
    description: 'Binary Search Tree, Heap, and AVL Tree with insert, delete, and search animations.',
    icon: <Binary className="h-5 w-5" />,
    path: '/trees',
    badge: { label: '3 Trees', variant: 'info' },
    available: true,
  },
  {
    title: 'Graph Algorithms',
    description: 'BFS, DFS, and Dijkstra\'s shortest path visualized on interactive graphs.',
    icon: <Network className="h-5 w-5" />,
    path: '/graphs',
    badge: { label: 'Coming Soon', variant: 'default' },
    available: false,
  },
  {
    title: 'Playground',
    description: 'Test algorithms with custom inputs, compare performance, and explore scenarios.',
    icon: <FlaskConical className="h-5 w-5" />,
    path: '/playground',
    badge: { label: 'Interactive', variant: 'easy' },
    available: true,
  },
  {
    title: 'Complexity Analysis',
    description: 'Time and space complexity charts, Big O comparison, and performance benchmarks.',
    icon: <BookOpen className="h-5 w-5" />,
    path: '/complexity',
    badge: { label: 'Educational', variant: 'medium' },
    available: true,
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight">
          DSA Visualizer
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl">
          Interactive visualizations for data structures and algorithms. Learn by watching
          each step, control the pace, and understand the code as it executes.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navCards.map((card) => (
          <Card
            key={card.path}
            onClick={card.available ? () => navigate(card.path) : undefined}
            className={`space-y-3 ${!card.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            padding="lg"
          >
            <div className="flex items-start justify-between">
              <div className="text-accent">{card.icon}</div>
              {card.badge && (
                <Badge variant={card.badge.variant}>{card.badge.label}</Badge>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{card.title}</h3>
              <p className="text-sm text-text-muted mt-1 leading-relaxed">
                {card.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Feature highlights */}
      <div className="border-t border-border pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <h4 className="font-semibold text-text-primary text-sm">Step-by-Step Control</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Play, pause, and step through every comparison and swap. Go backward to review any moment.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-text-primary text-sm">Live Code Highlighting</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Watch the algorithm's source code highlight in sync with the visualization.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-text-primary text-sm">Real-Time Metrics</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Track comparisons, swaps, and array accesses as the algorithm runs.
          </p>
        </div>
      </div>
    </div>
  );
}
