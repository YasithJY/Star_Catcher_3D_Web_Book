import { atom, useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

const storyPages = [
  "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", 
  "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"
];

export const pageAtom = atom(0);
export const bookFloatingAtom = atom(true);

export const pages = [
  {
    front: "1",       // Front cover
    back: "credits",  // Credits page
  },
];

// Add story pages (Page 1 to Page 25)
for (let i = 0; i < storyPages.length - 1; i += 2) {
  pages.push({
    front: storyPages[i],
    back: storyPages[i + 1],
  });
}

// Add the final pages
pages.push({
  front: storyPages[storyPages.length - 1], // Page 25 (26.jpg)
  back: "27", // The End page
});

pages.push({
  front: "28", // Back cover
  back: "28",  // Same image for both sides of final page
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [bookFloating, setBookFloating] = useAtom(bookFloatingAtom);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const audioRef = useRef(null);

  // Function to play page turn sound with enhanced audio handling
  const playPageTurnSound = () => {
    try {
      // Create a new audio instance for each play to ensure it works
      const audio = new Audio("/audios/page-flip-01a.mp3");
      audio.volume = 0.3;
      audio.playbackRate = 1.0 + (Math.random() - 0.5) * 0.1; // Slight variation in playback speed
      audio.play().catch((error) => {
        console.log("Audio play failed:", error);
      });
    } catch (error) {
      console.log("Audio creation failed:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (isPageChanging) return; // Prevent rapid clicking
    
    setIsPageChanging(true);
    setPage(newPage);
    playPageTurnSound();
    
    // Add a small delay to prevent rapid page changes
    setTimeout(() => {
      setIsPageChanging(false);
    }, 300);
  };

  const toggleBookFloating = () => {
    setBookFloating(!bookFloating);
  };

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && page > 0) {
        handlePageChange(page - 1);
      } else if (e.key === 'ArrowRight' && page < pages.length - 1) {
        handlePageChange(page + 1);
      } else if (e.key === 'Home') {
        handlePageChange(0);
      } else if (e.key === 'End') {
        handlePageChange(pages.length - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleBookFloating();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [page, pages.length]);

  // Function to get the correct page label
  const getPageLabel = (index) => {
    if (index === 0) return "Cover";
    if (index === 1) return "Credits";
    if (index >= 2 && index <= 13) {
      const pageNumber = (index - 2) * 2 + 1;
      return `Page ${pageNumber}`;
    }
    if (index === 14) return "The End";
    if (index === 15) return "Back Cover";
    return `Page ${index}`;
  };

  // Calculate reading progress
  const progress = ((page + 1) / pages.length) * 100;

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        {/* Enhanced Header with Progress Bar */}
        <div className="pointer-events-auto p-6">
          <div className="flex items-center justify-between">
            <a
              className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10"
              href="https://tappyly.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" 
                src="/images/3.png" 
                alt="Tappyly Logo"
              />
              <span className="text-white font-medium text-sm">Powered by Tappyly</span>
            </a>

            {/* Enhanced Controls */}
            <div className="flex items-center gap-4">
              {/* Progress Indicator */}
              <div 
                className="group relative"
                onMouseEnter={() => setShowProgress(true)}
                onMouseLeave={() => setShowProgress(false)}
              >
                <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {showProgress && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    {Math.round(progress)}% Complete
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => page > 0 && handlePageChange(page - 1)}
                disabled={page === 0}
                className="group bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <svg className="w-5 h-5 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => page < pages.length - 1 && handlePageChange(page + 1)}
                disabled={page === pages.length - 1}
                className="group bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <svg className="w-5 h-5 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Book Floating Toggle */}
              <button
                onClick={toggleBookFloating}
                className="group bg-white/10 backdrop-blur-md rounded-full p-4 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10"
                aria-label={bookFloating ? "Stop book floating" : "Start book floating"}
                title={bookFloating ? "Stop floating (Space)" : "Start floating (Space)"}
              >
                {bookFloating ? (
                  <svg className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation with Page Indicators */}
        <div className="w-full overflow-auto pointer-events-auto flex justify-center pb-4 sm:pb-6 md:pb-8 scrollbar-hide">
          <div className="overflow-auto flex items-center gap-2 sm:gap-3 max-w-full px-3 sm:px-4 md:px-6 scrollbar-hide">
            {pages.map((_, index) => (
              <button
                key={index}
                className={`relative group transition-all duration-300 px-6 py-4 rounded-2xl text-lg font-medium shrink-0 border-2 backdrop-blur-md transform hover:scale-105 ${
                  index === page
                    ? "bg-white/90 text-black border-white shadow-lg shadow-white/20 scale-105"
                    : "bg-black/20 text-white border-white/20 hover:bg-white/10 hover:border-white/40"
                } ${isPageChanging ? 'pointer-events-none' : ''}`}
                onClick={() => handlePageChange(index)}
                disabled={isPageChanging}
              >
                <span className="relative z-10">
                  {getPageLabel(index)}
                </span>
                {index === page && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl animate-pulse" />
                )}
                
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Enhanced Animated Background Text */}
      <div className="fixed inset-0 flex items-center -rotate-2 select-none pointer-events-none overflow-hidden">
        <div className="relative">
          <div className="bg-white/0 animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black drop-shadow-2xl hover:text-blue-300 transition-colors duration-1000">
              Star
            </h1>
            <h2 className="shrink-0 text-white text-10xl font-black drop-shadow-2xl hover:text-purple-300 transition-colors duration-1000">
              Catcher
            </h2>
            <h2 className="shrink-0 text-white text-8xl italic font-light drop-shadow-2xl opacity-80">
              Powered by
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text drop-shadow-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
              TAPPYLY
            </h2>
            <h1 className="shrink-0 text-white text-10xl font-black drop-shadow-2xl hover:text-blue-300 transition-colors duration-1000">
              Star
            </h1>
            <h2 className="shrink-0 text-white text-10xl font-black drop-shadow-2xl hover:text-purple-300 transition-colors duration-1000">
              Catcher
            </h2>
            <h2 className="shrink-0 text-white text-8xl italic font-light drop-shadow-2xl opacity-80">
              Powered by
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text drop-shadow-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
              TAPPYLY
            </h2>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Particles Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${
              i % 3 === 0 ? 'w-2 h-2 bg-blue-400/30' : 
              i % 3 === 1 ? 'w-1 h-1 bg-purple-400/40' : 
              'w-3 h-3 bg-white/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Page Change Indicator */}
      {isPageChanging && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Keyboard Navigation Hint */}
      <div className="fixed bottom-4 left-4 pointer-events-none">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-white/70 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Space</kbd>
            <span>Toggle Float</span>
          </div>
        </div>
      </div>
    </>
  );
};