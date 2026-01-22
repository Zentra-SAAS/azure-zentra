import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  const links = {
    company: [
      { name: 'About', href: '#about' },
      { name: 'Contact', href: '#contact' },
      { name: 'Docs', href: '#docs' }
    ],
    legal: [
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Privacy Policy', href: '#privacy' }
    ]
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Zentra</span>
            </div>
            <p className="text-gray-300 max-w-md mb-6">
              AI-powered multi-branch shop management for small businesses. Streamline your operations and grow your revenue.
            </p>
            <div className="flex space-x-4">
              <a
                href="#linkedin"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a
                href="#twitter"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Zentra. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a
              href="mailto:support@zentra.ai"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              support@zentra.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;