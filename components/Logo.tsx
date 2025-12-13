import React from 'react';
import logoImg from '../assets/AIDA.png';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center select-none">
      <img src={logoImg} alt="AiDA" className="h-8 w-auto object-contain" />
    </div>
  );
};

export default Logo;