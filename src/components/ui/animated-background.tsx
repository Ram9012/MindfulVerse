import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft floating orbs */}
      <div className="absolute w-24 h-24 bg-white/5 rounded-full blur-xl animate-float-slow top-1/4 left-1/4 transition-opacity duration-1000" />
      <div className="absolute w-32 h-32 bg-white/8 rounded-full blur-xl animate-float-medium top-1/2 left-1/3 transition-opacity duration-1000" />
      <div className="absolute w-20 h-20 bg-white/6 rounded-full blur-xl animate-float-slow top-3/4 left-2/3 transition-opacity duration-1000" />
      
      {/* Gentle waves */}
      <div className="absolute w-full h-64 bg-gradient-to-r from-[#2D1E45]/10 via-[#4A3768]/15 to-[#7B5BA8]/10 transform -skew-y-6 animate-wave-slow bottom-0 opacity-50" />
      <div className="absolute w-full h-48 bg-gradient-to-r from-[#4A3768]/10 via-[#7B5BA8]/15 to-[#2D1E45]/10 transform skew-y-3 animate-wave-slow-reverse bottom-16 opacity-30" />
      
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D1E45]/60 via-[#4A3768]/50 to-[#7B5BA8]/40 animate-gradient-slow transition-all duration-1000" />
      
      {/* Soft glow overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(227,194,255,0.05)_50%,transparent_60%)] bg-[length:400%_400%] animate-glow-slow" />
      
      {/* Ethereal particles */}
      <div className="absolute w-2 h-2 bg-[#E3C2FF]/15 rounded-full blur-sm animate-float-gentle top-1/6 left-1/6" />
      <div className="absolute w-3 h-3 bg-[#C9A6F0]/15 rounded-full blur-sm animate-float-gentle-reverse bottom-1/6 right-1/6" />
      <div className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm animate-float-slow bottom-1/4 left-1/2" />
      <div className="absolute w-4 h-4 bg-[#9B7ED1]/15 rounded-full blur-sm animate-float-gentle top-1/3 right-1/5" />
    </div>
  );
};

export default AnimatedBackground;