import React from 'react';
import { Menu, Code, BookOpen } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  return (
    <header className="bg-bg-secondary/95 backdrop-blur-sm border-b border-accent/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-curvy">
              <Code className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">DSA Visualizer</h1>
              <p className="text-xs text-text-muted hidden sm:block">Interactive Algorithm Learning</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#algorithms" className="text-text-secondary hover:text-primary transition-colors duration-200">
              Algorithms
            </a>
            <a href="#data-structures" className="text-text-secondary hover:text-primary transition-colors duration-200">
              Data Structures
            </a>
            <a href="#playground" className="text-text-secondary hover:text-primary transition-colors duration-200">
              Playground
            </a>
            <a href="#about" className="text-text-secondary hover:text-primary transition-colors duration-200">
              About
            </a>
          </nav>

          {/* Help Button */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-accent hover:bg-primary hover:text-secondary text-text-primary px-4 py-2 rounded-curvy transition-all duration-200 hover-lift">
              <BookOpen className="h-4 w-4" />
              <span>Help</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-curvy text-text-secondary hover:text-primary hover:bg-accent/20 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-bg-card rounded-curvy mt-2 shadow-curvy">
              <a href="#algorithms" className="block px-3 py-2 text-text-secondary hover:text-primary hover:bg-accent/20 rounded-curvy-sm transition-colors duration-200">
                Algorithms
              </a>
              <a href="#data-structures" className="block px-3 py-2 text-text-secondary hover:text-primary hover:bg-accent/20 rounded-curvy-sm transition-colors duration-200">
                Data Structures
              </a>
              <a href="#playground" className="block px-3 py-2 text-text-secondary hover:text-primary hover:bg-accent/20 rounded-curvy-sm transition-colors duration-200">
                Playground
              </a>
              <a href="#about" className="block px-3 py-2 text-text-secondary hover:text-primary hover:bg-accent/20 rounded-curvy-sm transition-colors duration-200">
                About
              </a>
              <div className="border-t border-accent/20 pt-2">
                <button className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-primary hover:text-secondary text-text-primary px-4 py-2 rounded-curvy transition-all duration-200">
                  <BookOpen className="h-4 w-4" />
                  <span>Help</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;