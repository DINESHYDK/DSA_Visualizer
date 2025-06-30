import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-dark border-t border-accent/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">DSA Visualizer</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              An interactive platform for learning data structures and algorithms through 
              beautiful visualizations and hands-on practice.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                className="text-text-muted hover:text-primary transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                className="text-text-muted hover:text-primary transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@dsavisualizer.com" 
                className="text-text-muted hover:text-primary transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#algorithms" className="text-text-muted hover:text-primary transition-colors duration-200 text-sm">
                  Algorithms
                </a>
              </li>
              <li>
                <a href="#data-structures" className="text-text-muted hover:text-primary transition-colors duration-200 text-sm">
                  Data Structures
                </a>
              </li>
              <li>
                <a href="#playground" className="text-text-muted hover:text-primary transition-colors duration-200 text-sm">
                  Interactive Playground
                </a>
              </li>
              <li>
                <a href="#about" className="text-text-muted hover:text-primary transition-colors duration-200 text-sm">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-text-primary">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#documentation" className="text-text-muted hover:text-primary transition-colors duration-200 text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#tutorials" className="text-text-muted hover:text-primary transition-colors duration-200 text-sm">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#examples" className="text-text-muted hover:text-primary transition-colors duration-200 text-sm">
                  Examples
                </a>
              </li>
              <li>
                <a href="#help" className="text-text-muted hover:text-primary transition-colors duration-200 text-sm">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-accent/20">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-text-muted text-sm">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-error fill-current" />
              <span>by a CSE Student</span>
            </div>
            <div className="text-text-muted text-sm">
              © 2024 DSA Visualizer. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;