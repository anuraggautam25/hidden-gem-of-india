import { useState, useMemo } from 'react';
import { gems, categoryInfo, type Category } from '@/data/gems';
import MapView from '@/components/MapView';
import Navbar from '@/components/Navbar';

const categories: Category[] = ['waterfalls', 'culture', 'cuisine', 'wildlife'];

const MapPage = () => {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set(categories));

  const toggle = (cat: Category) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const filtered = useMemo(() => gems.filter(g => activeCategories.has(g.category)), [activeCategories]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-4 pb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Map View</h1>
              <p className="text-muted-foreground text-sm">All {filtered.length} gems on the map</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => {
                const info = categoryInfo[cat];
                const active = activeCategories.has(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggle(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {info.icon} {info.label}
                  </button>
                );
              })}
            </div>
          </div>
          <MapView gems={filtered} className="h-[calc(100vh-160px)]" />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
