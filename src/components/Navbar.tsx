import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? 'bg-transparent' : 'bg-background/95 backdrop-blur-md border-b border-border'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className={`font-display text-xl font-bold ${isHome ? 'text-primary-foreground' : 'text-foreground'}`}>
              Hidden Gems of India
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { to: '/', label: 'Home' },
              { to: '/explore', label: 'Explore' },
              { to: '/map', label: 'Map' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isHome ? 'text-primary-foreground/80 hover:text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                } ${location.pathname === link.to ? (isHome ? 'text-primary-foreground' : 'text-foreground') : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 ${isHome ? 'text-primary-foreground' : 'text-foreground'}`}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/explore', label: 'Explore' },
                { to: '/map', label: 'Map' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-foreground py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
