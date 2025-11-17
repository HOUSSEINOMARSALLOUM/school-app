import { useEffect } from "react";

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <span className="text-4xl font-bold text-emerald-600">QE</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Qab Elias</h1>
        <h2 className="text-xl text-white/90 mb-6">Mixed Public School</h2>
        <div className="w-12 h-1 bg-white/50 mx-auto rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
