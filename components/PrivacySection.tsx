import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PrivacySection: React.FC = () => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <div className="flex items-center gap-2 text-main">
        <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
        <span className="text-sm font-semibold tracking-tight uppercase">
          Privacy & Isolation
        </span>
      </div>
      
      <div className="text-sm text-muted font-light">
        AiDA runs locally. No data leaves this machine. <span className="hidden md:inline text-subtle">|</span> Air Gap Ready.
      </div>
    </div>
  );
};

export default PrivacySection;