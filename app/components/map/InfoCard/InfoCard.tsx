import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { FaClipboardCheck, FaCopy, FaTimes } from 'react-icons/fa';

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
  onClose?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ feature, onClose }) => {
  const isOpenMapTiles = feature.source === 'openmaptiles';
  const [copied, setCopied] = React.useState(false);

  const themeColors = {
    bg: isOpenMapTiles
      ? 'bg-slate-800/90 border-red-500/20'
      : 'bg-slate-800/90 border-green-500/20',
    text: isOpenMapTiles ? 'text-red-200' : 'text-green-200',
    badge: isOpenMapTiles
      ? 'bg-red-900/50 text-red-200 border border-red-500/30'
      : 'bg-green-900/50 text-green-200 border border-green-500/30',
    border: isOpenMapTiles ? 'border-red-500/20' : 'border-green-500/20',
    label: isOpenMapTiles ? 'text-red-400' : 'text-green-400',
  };

  const coordinates = feature.geometry.coordinates
    ? `${feature.geometry.coordinates[1]?.toFixed(
        4
      )}, ${feature.geometry.coordinates[0]?.toFixed(4)}`
    : 'N/A';

  const copyCoordinates = () => {
    if (feature.geometry.coordinates) {
      navigator.clipboard.writeText(coordinates);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className='fixed bottom-3 inset-x-0 flex justify-center items-center px-4 pointer-events-none z-50'>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={twMerge(
          'backdrop-blur-md rounded-2xl shadow-2xl p-2.5 max-w-[280px] w-full pointer-events-auto relative',
          'border ring-1 ring-white/10',
          themeColors.bg
        )}
      >
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className={twMerge(
              'absolute -top-2 -right-2 rounded-full p-1.5',
              'bg-slate-700 text-white hover:bg-slate-600',
              'shadow-lg transition-colors z-10'
            )}
            aria-label='Close'
          >
            <FaTimes className='w-3 h-3' />
          </button>
        )}

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
                'BARIKOI DATA'}
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
              <div className='flex items-center justify-start'>
                <p
                  className={twMerge('font-medium truncate', themeColors.text)}
                >
                  {coordinates}
                </p>
                <button
                  onClick={copyCoordinates}
                  disabled={!feature.geometry.coordinates}
                  className={twMerge(
                    'p-0.5 rounded hover:bg-white/10 transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed ml-2',
                    themeColors.text
                  )}
                  title='Copy coordinates'
                >
                  {copied ? (
                    <FaClipboardCheck className='w-3 h-3' />
                  ) : (
                    <FaCopy className='w-3 h-3' />
                  )}
                </button>
              </div>
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
