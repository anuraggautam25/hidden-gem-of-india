import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';
import { gems, categoryInfo, type Category } from '@/data/gems';
import GemCard from '@/components/GemCard';
import Navbar from '@/components/Navbar';

const categories: { key: Category; count: number }[] = [
  { key: 'waterfalls', count: gems.filter(g => g.category === 'waterfalls').length },
  { key: 'culture', count: gems.filter(g => g.category === 'culture').length },
  { key: 'cuisine', count: gems.filter(g => g.category === 'cuisine').length },
  { key: 'wildlife', count: gems.filter(g => g.category === 'wildlife').length },
];

const categoryBgClass: Record<string, string> = {
  waterfalls: 'bg-waterfall/10 hover:bg-waterfall/20 border-waterfall/30',
  culture: 'bg-culture/10 hover:bg-culture/20 border-culture/30',
  cuisine: 'bg-cuisine/10 hover:bg-cuisine/20 border-cuisine/30',
  wildlife: 'bg-wildlife/10 hover:bg-wildlife/20 border-wildlife/30',
};

const Index = () => {
  const featured = gems.slice(0, 6);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Hidden Gems of India" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-primary-foreground/70" />
              <span className="text-primary-foreground/70 text-sm font-medium tracking-widest uppercase">
                Discover the Undiscovered
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Hidden Gems<br />of India
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-light">
              100 breathtaking destinations across waterfalls, cultural heritage, culinary trails, and wildlife sanctuaries — curated for the curious traveler.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity shadow-glow"
              >
                <Compass className="h-5 w-5" />
                Start Exploring
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/20"
              >
                View on Map
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-2.5 bg-primary-foreground/60 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Explore by Category
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Four curated collections of India's most remarkable hidden destinations
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const info = categoryInfo[cat.key];
              return (
                <motion.div
                  key={cat.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/explore?category=${cat.key}`}
                    className={`block p-6 rounded-xl border transition-all duration-300 ${categoryBgClass[cat.key]}`}
                  >
                    <span className="text-4xl block mb-3">{info.icon}</span>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{info.label}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count} destinations</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">Featured Gems</h2>
              <p className="text-muted-foreground">Hand-picked destinations to inspire your next journey</p>
            </div>
            <Link to="/explore" className="hidden sm:flex items-center gap-1 text-primary font-medium text-sm hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((gem, i) => (
              <GemCard key={gem.id} gem={gem} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">Hidden Gems of India</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Curated from @indiahiddengems — Discover the undiscovered.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
