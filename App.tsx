
import React, { useState } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import Controls from './components/Controls';
import MathExplanation from './components/MathExplanation';
import { Direction } from './types';

const App: React.FC = () => {
  const [duration, setDuration] = useState(4);
  const [distance, setDistance] = useState(280);
  const [direction, setDirection] = useState<Direction>(Direction.Horizontal);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showMechanics, setShowMechanics] = useState(true);
  const [showTrail, setShowTrail] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row font-sans text-slate-200 bg-slate-950 overflow-hidden">
      
      {/* Left Main Content - Scrollable */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 shrink-0 backdrop-blur-sm z-10">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                SwingAnimation 技术演示
            </h1>
            <p className="text-xs text-slate-500 mt-1">
                iOS Widget 平移动画突破方案 · 核心原理可视化
            </p>
        </header>

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {/* Canvas Section - Normal Flow (Not Sticky) */}
            <div className="p-4 md:p-6 w-full flex justify-center bg-slate-950 shrink-0">
                 <div className="w-full max-w-4xl aspect-[4/3] max-h-[60vh] rounded-xl shadow-2xl shadow-black/50 border border-slate-800/50 overflow-hidden bg-slate-900">
                    <SimulationCanvas 
                        duration={duration}
                        distance={distance}
                        direction={direction}
                        isPlaying={isPlaying}
                        showMechanics={showMechanics}
                        showTrail={showTrail}
                    />
                 </div>
            </div>
            
            {/* Documentation Section */}
            <div className="bg-slate-900 border-t border-slate-800 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <MathExplanation />
                </div>
            </div>
        </main>
      </div>

      {/* Right Sidebar Controls */}
      <Controls 
        duration={duration}
        setDuration={setDuration}
        distance={distance}
        setDistance={setDistance}
        direction={direction}
        setDirection={setDirection}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        showMechanics={showMechanics}
        setShowMechanics={setShowMechanics}
        showTrail={showTrail}
        setShowTrail={setShowTrail}
      />
    </div>
  );
};

export default App;
