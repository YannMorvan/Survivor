import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
      <div className="text-lg font-semibold text-gray-700 animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default LoadingScreen;
