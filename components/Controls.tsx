import React from 'react';
import { Direction } from '../types';
import { Play, Pause, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface ControlsProps {
  duration: number;
  setDuration: (v: number) => void;
  distance: number;
  setDistance: (v: number) => void;
  direction: Direction;
  setDirection: (v: Direction) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  showMechanics: boolean;
  setShowMechanics: (v: boolean) => void;
  showTrail: boolean;
  setShowTrail: (v: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({
  duration,
  setDuration,
  distance,
  setDistance,
  direction,
  setDirection,
  isPlaying,
  setIsPlaying,
  showMechanics,
  setShowMechanics,
  showTrail,
  setShowTrail
}) => {
  return (
    <div className="w-full md:w-80 bg-slate-800 p-6 flex flex-col gap-6 border-l border-slate-700 h-full overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">控制面板</h2>
        <p className="text-slate-400 text-sm">调整 SwingAnimation 核心参数。</p>
      </div>

      {/* Playback */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
            isPlaying ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
          }`}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? '暂停' : '播放'}
        </button>
      </div>

      <div className="h-px bg-slate-700" />

      {/* Sliders */}
      <div className="space-y-4">
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-slate-300">周期 (Duration)</span>
                <span className="text-slate-400">{duration}s</span>
            </div>
            <input 
                type="range" 
                min="1" 
                max="10" 
                step="0.5"
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
        </div>

        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-slate-300">距离 (Distance)</span>
                <span className="text-slate-400">{distance}pt</span>
            </div>
            <input 
                type="range" 
                min="100" 
                max="500" 
                step="10"
                value={distance} 
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
        </div>
      </div>

      <div className="h-px bg-slate-700" />

      {/* Direction */}
      <div className="space-y-3">
        <label className="text-sm text-slate-300 font-medium">运动方向</label>
        <div className="grid grid-cols-2 gap-2">
            <button
                onClick={() => setDirection(Direction.Horizontal)}
                className={`py-2 px-3 rounded-md text-sm transition-all ${
                    direction === Direction.Horizontal 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
            >
                水平 (Horizontal)
            </button>
            <button
                onClick={() => setDirection(Direction.Vertical)}
                className={`py-2 px-3 rounded-md text-sm transition-all ${
                    direction === Direction.Vertical 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
            >
                垂直 (Vertical)
            </button>
        </div>
      </div>

      <div className="h-px bg-slate-700" />

      {/* Toggles */}
      <div className="space-y-3">
        <label className="text-sm text-slate-300 font-medium">可视化选项</label>
        
        <button
            onClick={() => setShowMechanics(!showMechanics)}
            className="flex items-center justify-between w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
        >
            <div className="flex items-center gap-3">
                <RefreshCw size={18} className="text-purple-400" />
                <span className="text-sm text-slate-200">显示机械结构</span>
            </div>
            {showMechanics ? <Eye size={16} className="text-slate-400"/> : <EyeOff size={16} className="text-slate-500"/>}
        </button>

        <button
            onClick={() => setShowTrail(!showTrail)}
            className="flex items-center justify-between w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
        >
            <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                    <path d="M4 12 h16 M12 4 v16" strokeDasharray="4 4"/>
                </svg>
                <span className="text-sm text-slate-200">显示运动轨迹</span>
            </div>
            {showTrail ? <Eye size={16} className="text-slate-400"/> : <EyeOff size={16} className="text-slate-500"/>}
        </button>
      </div>
      
      <div className="mt-auto pt-6 text-xs text-slate-500">
        <p>基于 SwingAnimation iOS Widget 方案。</p>
        <p className="mt-1 font-mono text-[10px] opacity-70">ω_inner = ω_outer = -0.5 * ω_middle</p>
      </div>

    </div>
  );
};

export default Controls;