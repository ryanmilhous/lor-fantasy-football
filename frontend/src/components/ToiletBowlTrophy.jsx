import React, { useState, useEffect } from 'react';

const ToiletBowlTrophy = ({ toiletBowls }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const columns = 2; // Fixed 2 columns for better display with fewer years

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-1 shadow-xl">
      <div className="bg-gradient-to-b from-white to-orange-50/30 rounded-3xl p-8 border-2 border-orange-200/50">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent mb-6 text-center flex items-center justify-center space-x-3 drop-shadow-sm">
          <span className="text-5xl">🚽</span>
          <span>Toilet Bowl Trophy</span>
        </h2>

        <div className="flex flex-col items-center">
          {/* Trophy Image with Text Overlay */}
          <div className="relative w-full max-w-2xl">
            <img
              src="/images/toilet-bowl-trophy.png"
              alt="Toilet Bowl Trophy"
              className="w-full h-auto"
            />

            {/* Text overlay on the base */}
            <div className="absolute bottom-[23%] left-[16%] right-[16%] sm:left-[20%] sm:right-[20%] max-h-[30%]">
              <div
                className="grid grid-cols-2 gap-x-3 sm:gap-x-8 gap-y-1 p-2 sm:p-4 auto-rows-min"
                style={{ gridAutoFlow: 'column', gridTemplateRows: `repeat(${Math.ceil(toiletBowls.length / columns)}, minmax(0, 1fr))` }}
              >
                {toiletBowls.map((bowl, index) => (
                  <div
                    key={index}
                    className="text-center"
                  >
                    <span className="text-amber-200 font-bold text-[10px] sm:text-[13px] drop-shadow-lg whitespace-nowrap" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                      {bowl.year} - {bowl.owner}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToiletBowlTrophy;
