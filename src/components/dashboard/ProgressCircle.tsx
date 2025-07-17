import React from "react";

interface ProgressCircleProps {
  percentage: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage }) => {
  // Calculate the circumference and the offset
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 180 180">
        <circle
          className="text-gray-700/30 fill-none stroke-current stroke-[15]"
          cx="90"
          cy="90"
          r={radius}
        />
        <circle
          className="text-indigo-400 fill-none stroke-current stroke-[15]"
          cx="90"
          cy="90"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl font-bold text-indigo-300">{percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressCircle;
