import React from 'react';
import PlatformCard from './PlatformCard';

interface PlatformSectionProps {
  onSelect?: (platform: string) => void;
}

const PlatformSection: React.FC<PlatformSectionProps> = ({ onSelect }) => {
  const platforms = [
    {
      title: "Ardupilot Flight Stack",
      subtitle: ".bin logs",
      id: "ARDU"
    },
    {
      title: "Px4 Flight Stack",
      subtitle: ".ulg logs",
      id: "PX4"
    },
    {
      title: "DJI Platforms",
      subtitle: ".DAT (Limited)",
      id: "DJI"
    },
    {
      title: "FPV Systems",
      subtitle: "Betaflight/iNAV",
      id: "FPV",
      status: "Development in Progress"
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Select Platform
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            title={platform.title}
            subtitle={platform.subtitle}
            status={platform.status}
            onClick={() => onSelect?.(platform.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlatformSection;