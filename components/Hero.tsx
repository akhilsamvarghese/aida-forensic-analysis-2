import React from 'react';

import aidaText from '../assets/AIDA_text.png';

import AsciiAnimation from './AsciiAnimation';

const Hero: React.FC = () => {
  return (
    <section className="w-full relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-4xl relative z-10">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-surface border border-border/50 backdrop-blur-sm">
            <span className="text-xs font-semibold tracking-widest text-muted uppercase">
              from <span className="text-main">Aidrone</span>
            </span>
          </div>
          <h1 className="flex flex-wrap items-center gap-x-4 text-5xl md:text-7xl font-bold tracking-tighter text-main mb-6 leading-[1.05]">
            <img src={aidaText} alt="AiDA" className="h-12 md:h-20 object-contain" />
            <span className="relative">
              Log Analyser<span className="text-brand">.</span>
              <span className="absolute -bottom-5 right-0 text-sm md:text-xl text-orange-500 font-normal tracking-normal">(beta)</span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted font-normal max-w-2xl leading-relaxed tracking-tight">
            Next generation forensic environment. <br className="hidden md:block" />
            <span className="text-main font-medium">Engineered for absolute precision.</span>
          </p>
        </div>

        {/* Right side ASCII Animation */}
        <div className="hidden md:block w-[500px] h-[375px] flex-shrink-0">
          <AsciiAnimation />
        </div>
      </div>
    </section>
  );
};

export default Hero;