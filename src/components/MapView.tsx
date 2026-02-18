import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Gem, Category } from '@/data/gems';
import { categoryInfo } from '@/data/gems';

const markerColors: Record<Category, string> = {
  waterfalls: '#1598c4',
  culture: '#d4922a',
  cuisine: '#d4522a',
  wildlife: '#3d9c5a',
  landmarks: '#8b5cf6',
};

interface MapViewProps {
  gems: Gem[];
  selectedGem?: Gem | null;
  className?: string;
}

const MapView = ({ gems, selectedGem, className = '' }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([22.5, 82.0], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(mapInstance.current);

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    mapInstance.current.eachLayer(layer => {
      if (layer instanceof L.CircleMarker) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    gems.forEach(gem => {
      const color = markerColors[gem.category];
      const info = categoryInfo[gem.category];

      const marker = L.circleMarker([gem.lat, gem.lng], {
        radius: selectedGem?.id === gem.id ? 10 : 6,
        fillColor: color,
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(mapInstance.current!);

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;min-width:160px">
          <div style="font-size:18px;margin-bottom:4px">${info.icon}</div>
          <strong style="font-size:14px">${gem.name}</strong><br/>
          <span style="color:#666;font-size:12px">${gem.state}</span><br/>
          <span style="font-size:12px;color:#888">${gem.highlight}</span>
          <br/><a href="/gem/${gem.id}" style="color:hsl(215,80%,42%);font-size:12px;text-decoration:none">View Details →</a>
        </div>`
      );
    });

    if (selectedGem) {
      mapInstance.current.setView([selectedGem.lat, selectedGem.lng], 10, { animate: true });
    }
  }, [gems, selectedGem]);

  return <div ref={mapRef} className={`w-full rounded-xl relative z-0 ${className}`} style={{ minHeight: '400px' }} />;
};

export default MapView;
