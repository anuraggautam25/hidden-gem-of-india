import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cities } from '@/data/cities';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';

const stateList = [...new Set(cities.map(c => c.state))].sort();

const PopularDestinations = () => {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return cities.filter(c => {
      if (selectedState && c.state !== selectedState) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedState]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Popular Destinations
            </h1>
            <p className="text-muted-foreground mb-8">
              City-wise tourist guides for {cities.length} major Indian destinations
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedState(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedState ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All States
              </button>
              {stateList.slice(0, 8).map(state => (
                <button
                  key={state}
                  onClick={() => setSelectedState(selectedState === state ? null : state)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedState === state ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* City Cards */}
          <div className="space-y-4">
            {filtered.map((city, i) => {
              const isExpanded = expandedCity === city.id;
              return (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow"
                >
                  {/* City Header */}
                  <button
                    onClick={() => setExpandedCity(isExpanded ? null : city.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-display text-xl sm:text-2xl font-bold text-card-foreground">
                          {city.name}
                        </h2>
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                          {city.state}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mb-1">{city.tagline}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{city.description}</p>
                    </div>
                    <ChevronRight
                      className={`h-5 w-5 text-muted-foreground shrink-0 mt-1 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-border"
                    >
                      <div className="p-5 sm:p-6 space-y-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Best time to visit: <strong className="text-foreground">{city.bestTimeToVisit}</strong></span>
                        </div>

                        {/* Places to Visit */}
                        <div>
                          <h3 className="font-display text-lg font-semibold text-card-foreground mb-3">
                            📍 Top Places to Visit
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {city.places.map((place, j) => (
                              <div
                                key={j}
                                className="bg-muted/50 border border-border rounded-lg p-4"
                              >
                                <h4 className="font-semibold text-card-foreground mb-1">{place.name}</h4>
                                <p className="text-sm text-muted-foreground">{place.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Things to Do */}
                        <div>
                          <h3 className="font-display text-lg font-semibold text-card-foreground mb-3">
                            🎯 Things to Do
                          </h3>
                          <ul className="space-y-2">
                            {city.thingsToDo.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-foreground/80">
                                <span className="text-primary font-bold mt-0.5">{j + 1}.</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Map Link */}
                        <a
                          href={`https://www.google.com/maps?q=${city.lat},${city.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          <MapPin className="h-4 w-4" />
                          Open in Google Maps
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No cities found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDestinations;
