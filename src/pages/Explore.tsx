import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { gems, categoryInfo, type Category } from '@/data/gems';
import GemCard from '@/components/GemCard';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';

const categories: Category[] = ['waterfalls', 'culture', 'cuisine', 'wildlife'];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') as Category | null;
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return gems.filter(g => {
      if (activeCategory && g.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return g.name.toLowerCase().includes(q) || g.state.toLowerCase().includes(q) || g.highlight.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Explore Hidden Gems</h1>
          <p className="text-muted-foreground mb-8">Browse all 100 destinations across India</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, state..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSearchParams({})}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                All ({gems.length})
              </button>
              {categories.map(cat => {
                const info = categoryInfo[cat];
                const count = gems.filter(g => g.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSearchParams({ category: cat })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {info.icon} {info.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((gem, i) => (
              <GemCard key={gem.id} gem={gem} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No gems found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
