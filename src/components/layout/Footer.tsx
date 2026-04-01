import React from 'react';
import { Github, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-text-muted text-sm">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-error fill-current" />
            <span>by a CSE Student</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              className="text-text-muted hover:text-text-secondary transition-colors duration-150"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              className="text-text-muted hover:text-text-secondary transition-colors duration-150"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <span className="text-text-muted text-xs">© 2024 DSA Visualizer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
