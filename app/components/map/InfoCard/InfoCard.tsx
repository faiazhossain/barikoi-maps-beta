import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface InfoCardProps {
  feature: {
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      subclass?: string;
      class?: string;
      rank?: number;
    };
    layer: {
      id: string;
      type: string;
      source: string;
      'source-layer': string;
    };
    source: string;
  };
}

const InfoCard: React.FC<InfoCardProps> = ({ feature }) => {
  const isOpenMapTiles = feature.source === 'openmaptiles';

  const themeColors = {
    bg: isOpenMapTiles ? 'bg-red-50/95' : 'bg-green-50/95',
    text: isOpenMapTiles ? 'text-red-800' : 'text-green-800',
    badge: isOpenMapTiles
      ? 'bg-red-100 text-red-700'
      : 'bg-green-100 text-green-700',
    border: isOpenMapTiles ? 'border-red-100' : 'border-green-100',
    label: isOpenMapTiles ? 'text-red-500' : 'text-green-500',
  };

  return (
    <div className='fixed bottom-3 inset-x-0 flex justify-center items-center px-4 pointer-events-none z-50'>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={twMerge(
          'backdrop-blur-sm rounded-2xl shadow-lg p-2.5 max-w-[280px] w-full pointer-events-auto',
          themeColors.bg
        )}
      >
        <div className='space-y-1'>
          <div className='flex items-center justify-between gap-1.5'>
            <h3
              className={twMerge(
                'text-xs font-medium capitalize truncate',
                themeColors.text
              )}
            >
              {feature.properties.subclass ||
                feature.properties.class ||
                'Unknown'}
            </h3>
            <span
              className={twMerge(
                'px-1.5 py-0.5 rounded-full text-[10px] whitespace-nowrap',
                themeColors.badge
              )}
            >
              {feature.geometry.type}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-1.5 text-[10px]'>
            <div>
              <p className={themeColors.label}>Coordinates</p>
              <p className={twMerge('font-medium truncate', themeColors.text)}>
                {feature.geometry.coordinates?.[1]?.toFixed(4) ?? 'N/A'},
                {feature.geometry.coordinates?.[0]?.toFixed(4) ?? 'N/A'}
              </p>
            </div>
            <div>
              <p className={themeColors.label}>Layer</p>
              <p className={twMerge('font-medium truncate', themeColors.text)}>
                {feature.layer.id}
              </p>
            </div>
          </div>

          <div
            className={twMerge(
              'grid grid-cols-2 gap-1.5 text-[10px] border-t pt-1',
              themeColors.border
            )}
          >
            {feature.properties.rank && (
              <div>
                <p className={themeColors.label}>Rank</p>
                <p className={twMerge('font-medium', themeColors.text)}>
                  {feature.properties.rank}
                </p>
              </div>
            )}
            <div>
              <p className={themeColors.label}>Source</p>
              <p className={twMerge('font-medium truncate', themeColors.text)}>
                {feature.layer.source}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoCard;
