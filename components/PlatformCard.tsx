import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PlatformCardProps {
  title: string;
  subtitle: string;
  status?: string;
  onClick?: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ title, subtitle, status, onClick }) => {
  return (
    <div
      className="group relative bg-surface hover:bg-white rounded-sm border border-border p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between h-[220px] 2xl:h-[280px] hover:shadow-pop hover:border-brand hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="space-y-4 relative z-10">
        <span className="inline-block px-2 py-1 text-[11px] font-bold font-mono uppercase tracking-widest text-muted group-hover:text-brand group-hover:bg-red-50 transition-colors border border-transparent group-hover:border-red-100 rounded-sm">
          {subtitle}
        </span>
        <h3 className="text-2xl font-bold text-main leading-none tracking-tight group-hover:text-black">
          {title}
        </h3>
        {status && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-amber-500 mt-2">
            {status}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200/50 group-hover:border-red-100 transition-colors delay-75">
        <span className="text-[11px] font-black uppercase tracking-widest text-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          Enter Analysis
        </span>
        <div className="bg-white group-hover:bg-brand rounded-full p-2 transition-colors duration-300">
          <ArrowRight size={20} className="text-muted group-hover:text-white transition-colors duration-300" />
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;