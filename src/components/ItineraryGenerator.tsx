import { useState, useRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Gem } from '@/data/gems';
import { categoryInfo } from '@/data/gems';
import { Link } from 'react-router-dom';

const simpleMarkdown = (text: string) =>
  text
    .replace(/### \*\*(.*?)\*\*/g, '<h3 class="font-display font-semibold text-base mt-4 mb-2 text-foreground">$1</h3>')
    .replace(/### (.*)/g, '<h3 class="font-display font-semibold text-base mt-4 mb-2 text-foreground">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr class="my-3 border-border"/>')
    .replace(/^\* {2}/gm, '• ')
    .replace(/\n/g, '<br/>');

const ItineraryGenerator = ({ gem }: { gem: Gem }) => {
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const abortRef = useRef<AbortController | null>(null);

  const generate = async () => {
    if (!user) return;
    setLoading(true);
    setItinerary('');

    try {
      abortRef.current = new AbortController();
      const info = categoryInfo[gem.category];

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          gemName: gem.name,
          gemState: gem.state,
          gemDescription: gem.description,
          gemCategory: info.label,
          gemHighlight: gem.highlight,
        }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        const data = await resp.json();
        if (resp.status === 429) {
          toast({ title: 'Rate Limited', description: 'Too many requests. Please try again later.', variant: 'destructive' });
        } else if (resp.status === 402) {
          toast({ title: 'Credits Required', description: 'AI credits need to be topped up.', variant: 'destructive' });
        } else {
          toast({ title: 'Error', description: data.error || 'Failed to generate itinerary', variant: 'destructive' });
        }
        setLoading(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error('No response body');
      const decoder = new TextDecoder();
      let buffer = '';
      let content = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              content += delta;
              setItinerary(content);
            }
          } catch { /* partial */ }
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        toast({ title: 'Error', description: 'Failed to generate itinerary', variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-center">
        <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="font-display text-lg font-semibold mb-2">AI Travel Itinerary</h3>
        <p className="text-muted-foreground text-sm mb-4">Sign in to generate a personalized travel itinerary for this destination.</p>
        <Link to="/auth" className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
          Sign In to Generate
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">AI Travel Itinerary</h3>
        </div>
        <Button
          onClick={generate}
          disabled={loading}
          size="sm"
          className="bg-gradient-primary text-primary-foreground"
        >
          {loading ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Generating...</> : 'Generate Itinerary'}
        </Button>
      </div>

      {itinerary ? (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div
            className="text-foreground/80 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: simpleMarkdown(itinerary) }}
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Click "Generate Itinerary" to get an AI-powered travel plan for {gem.name}.
        </p>
      )}
    </div>
  );
};

export default ItineraryGenerator;
