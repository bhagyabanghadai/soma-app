import React from 'react';

interface StunningImageCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  emoji: string;
  children?: React.ReactNode;
}

const StunningImageCard: React.FC<StunningImageCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  emoji, 
  children 
}) => {
  return (
    <div className="card-3d floating-card glass-morphism p-6 rounded-2xl scale-on-hover">
      {/* Stunning Image Section */}
      <div className="mb-6 relative overflow-hidden rounded-xl">
        <div className="h-48 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer"></div>
          
          {/* Large emoji as visual centerpiece */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl animate-pulse">{emoji}</div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-white/40 rounded-full floating-card"></div>
          <div className="absolute top-8 right-6 w-2 h-2 bg-yellow-300/60 rounded-full floating-card" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-6 left-8 w-4 h-4 bg-blue-300/50 rounded-full floating-card" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-green-300/50 rounded-full floating-card" style={{ animationDelay: '3s' }}></div>
          
          {/* Holographic corner accents */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/30 to-transparent"></div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="text-center">
        <h3 className="text-2xl font-bold gradient-text mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
};

export default StunningImageCard;