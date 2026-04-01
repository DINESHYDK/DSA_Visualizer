import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Code } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const navLinks = [
  { label: 'Sorting', to: '/sorting' },
  { label: 'Data Structures', to: '/data-structures' },
  { label: 'Trees', to: '/trees' },
  { label: 'Playground', to: '/playground' },
  { label: 'Complexity', to: '/complexity' },
];

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  return (
    <header className="bg-bg-secondary border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 text-text-primary hover:text-accent transition-colors duration-150">
            <div className="bg-accent p-1.5 rounded">
              <Code className="h-4 w-4 text-[#1a1a1a]" />
            </div>
            <span className="font-bold text-base">DSA Visualizer</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded transition-colors duration-150 ${
                    isActive
                      ? 'text-accent font-medium'
                      : 'text-text-muted hover:text-text-secondary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors duration-150"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-2 animate-slide-up">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onMenuToggle}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm rounded transition-colors duration-150 ${
                    isActive
                      ? 'text-accent font-medium bg-bg-elevated'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
