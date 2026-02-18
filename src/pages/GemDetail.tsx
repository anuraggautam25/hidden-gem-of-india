import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { gems, categoryInfo } from '@/data/gems';
import MapView from '@/components/MapView';
import Navbar from '@/components/Navbar';
import ItineraryGenerator from '@/components/ItineraryGenerator';

const categoryColorClass: Record<string, string> = {
  waterfalls: 'bg-waterfall',
  culture: 'bg-culture',
  cuisine: 'bg-cuisine',
  wildlife: 'bg-wildlife',
  landmarks: 'bg-landmarks',
};

const GemDetail = () => {
  const { id } = useParams();
  const gem = gems.find(g => g.id === id);

  if (!gem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Gem not found</h1>
          <Link to="/explore" className="text-primary hover:underline">← Back to Explore</Link>
        </div>
      </div>
    );
  }

  const info = categoryInfo[gem.category];
  const related = gems.filter(g => g.category === gem.category && g.id !== gem.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/explore" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Explore
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`h-2 rounded-t-xl ${categoryColorClass[gem.category]}`} />
            <div className="bg-card rounded-b-xl shadow-elevated border border-border p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{info.icon}</span>
                <span className="text-sm font-medium bg-muted text-muted-foreground px-3 py-1 rounded-full">
                  {info.label}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-card-foreground mb-2">
                {gem.name}
              </h1>

              <div className="flex items-center gap-1.5 text-muted-foreground mb-6">
                <MapPin className="h-4 w-4" />
                <span>{gem.location}, {gem.state}</span>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-8">
                <p className="text-sm font-medium text-primary mb-1">Why it's special</p>
                <p className="text-foreground font-medium">{gem.highlight}</p>
              </div>

              <p className="text-foreground/80 leading-relaxed text-lg mb-8">{gem.description}</p>

              {gem.thingsToDo && gem.thingsToDo.length > 0 && (
                <div className="bg-muted/50 border border-border rounded-lg p-5 mb-8">
                  <h3 className="font-display text-xl font-semibold mb-3 text-card-foreground">🎯 Top Things to Do</h3>
                  <ul className="space-y-2">
                    {gem.thingsToDo.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground/80">
                        <span className="text-primary font-bold mt-0.5">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-display text-xl font-semibold mb-4 text-card-foreground">Location</h3>
                <MapView gems={[gem]} selectedGem={gem} className="h-[300px]" />
              </div>

              <a
                href={`https://www.google.com/maps?q=${gem.lat},${gem.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>

            <div className="mt-8">
              <ItineraryGenerator gem={gem} />
            </div>
          </motion.div>

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">More {info.label}</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map(r => (
                  <Link
                    key={r.id}
                    to={`/gem/${r.id}`}
                    className="block bg-card border border-border rounded-xl p-4 hover:shadow-card transition-shadow"
                  >
                    <h3 className="font-display font-semibold text-card-foreground mb-1">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{r.state}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GemDetail;
