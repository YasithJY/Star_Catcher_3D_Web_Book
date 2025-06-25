import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";

const pictures = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
];

export const pageAtom = atom(0);
export const bookFloatingAtom = atom(true);

export const pages = [
  {
    front: "1",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "28",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [bookFloating, setBookFloating] = useAtom(bookFloatingAtom);
  const audioRef = useRef(null);

  // Initialize audio once
  useEffect(() => {
    audioRef.current = new Audio("/audios/page-flip-01a.mp3");
    audioRef.current.volume = 0.3;
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Play audio only when user clicks (user interaction)
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Silently handle audio play errors
      });
    }
  };

  const toggleBookFloating = () => {
    setBookFloating(!bookFloating);
  };

  return (
    <>
      <main className="pointer-events-none select-none z-10 fixed inset-0 flex justify-between flex-col">
        {/* Header */}
        <div className="pointer-events-auto p-6">
          <div className="flex items-center justify-between">
            <a
              className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
              href="https://tappyly.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" 
                src="/images/3.png" 
                alt="Tappyly Logo"
              />
              <span className="text-white font-medium text-sm">Powered by Tappyly</span>
            </a>

            {/* Book Floating Toggle */}
            <button
              onClick={toggleBookFloating}
              className="group bg-white/10 backdrop-blur-md rounded-full p-4 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
              aria-label={bookFloating ? "Stop book floating" : "Start book floating"}
              title={bookFloating ? "Stop floating" : "Start floating"}
            >
              {bookFloating ? (
                <svg className="w-6 h-6 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="w-full overflow-auto pointer-events-auto flex justify-center pb-8">
          <div className="overflow-auto flex items-center gap-3 max-w-full px-6">
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={`relative group transition-all duration-300 px-6 py-4 rounded-2xl text-lg font-medium shrink-0 border-2 backdrop-blur-md ${
                  index === page
                    ? "bg-white/90 text-black border-white shadow-lg shadow-white/20"
                    : "bg-black/20 text-white border-white/20 hover:bg-white/10 hover:border-white/40"
                }`}
                onClick={() => handlePageChange(index)}
              >
                <span className="relative z-10">
                  {index === 0 ? "Cover" : `Page ${index}`}
                </span>
                {index === page && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl animate-pulse" />
                )}
              </button>
            ))}
            <button
              className={`relative group transition-all duration-300 px-6 py-4 rounded-2xl text-lg font-medium shrink-0 border-2 backdrop-blur-md ${
                page === pages.length
                  ? "bg-white/90 text-black border-white shadow-lg shadow-white/20"
                  : "bg-black/20 text-white border-white/20 hover:bg-white/10 hover:border-white/40"
              }`}
              onClick={() => handlePageChange(pages.length)}
            >
              <span className="relative z-10">Back Cover</span>
              {page === pages.length && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Animated Background Text */}
      <div className="fixed inset-0 flex items-center -rotate-2 select-none pointer-events-none">
        <div className="relative">
          <div className="bg-white/0 animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black drop-shadow-2xl">
              Star
            </h1>
            <h2 className="shrink-0 text-white text-10xl font-black drop-shadow-2xl">
              Catcher
            </h2>
            <h2 className="shrink-0 text-white text-8xl italic font-light drop-shadow-2xl">
              Powered by
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text drop-shadow-2xl">
              TAPPYLY
            </h2>
            <h1 className="shrink-0 text-white text-10xl font-black drop-shadow-2xl">
              Star
            </h1>
            <h2 className="shrink-0 text-white text-10xl font-black drop-shadow-2xl">
              Catcher
            </h2>
            <h2 className="shrink-0 text-white text-8xl italic font-light drop-shadow-2xl">
              Powered by
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text drop-shadow-2xl">
              TAPPYLY
            </h2>
          </div>
          
        </div>
      </div>

      {/* Floating Particles Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};
