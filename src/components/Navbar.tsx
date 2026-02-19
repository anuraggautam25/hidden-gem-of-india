import { Link, useLocation } from 'react-router-dom';
import { MapPin, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore' },
    { to: '/popular', label: 'Popular' },
    { to: '/map', label: 'Map' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-sidebar backdrop-blur-md border-b border-sidebar-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-sidebar-primary" />
            <span className="font-display text-xl font-bold text-sidebar-foreground">
              Hidden Gems of India
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground ${
                  location.pathname === link.to ? 'text-sidebar-foreground' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-sidebar-foreground/70">
                  <User className="h-4 w-4 inline mr-1" />
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm font-medium transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-sidebar-foreground"
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
            className="md:hidden bg-sidebar backdrop-blur-md border-b border-sidebar-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-sidebar-foreground py-2">
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="block text-sm text-sidebar-foreground/70 py-2">
                  Sign Out
                </button>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-sidebar-primary py-2">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
