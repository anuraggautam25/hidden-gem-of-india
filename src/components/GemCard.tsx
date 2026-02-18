import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Gem } from '@/data/gems';
import { categoryInfo } from '@/data/gems';

const categoryColorClass: Record<string, string> = {
  waterfalls: 'bg-waterfall',
  culture: 'bg-culture',
  cuisine: 'bg-cuisine',
  wildlife: 'bg-wildlife',
};

const GemCard = ({ gem, index = 0 }: { gem: Gem; index?: number }) => {
  const info = categoryInfo[gem.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/gem/${gem.id}`}
        className="group block rounded-xl bg-card shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden border border-border hover:border-primary/30"
      >
        <div className={`h-2 ${categoryColorClass[gem.category]}`} />
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <span className="text-2xl">{info.icon}</span>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {info.label}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors mb-1">
            {gem.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span>{gem.state}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{gem.highlight}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default GemCard;
