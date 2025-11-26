
import React from 'react';
import { Layers, Zap, Code, Calculator } from 'lucide-react';

const MathExplanation: React.FC = () => {
  return (
    <div className="p-6 md:p-10 space-y-12 pb-20">
      
      {/* Introduction */}
      <section>
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
            核心原理：从旋转到平移
        </h3>
        <p className="text-slate-400 leading-relaxed text-sm md:text-base">
          iOS Widget 开发中存在一个著名限制：系统仅支持 <code className="bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded font-mono text-xs">ClockHandRotationEffect</code>（时钟指针旋转动画），而不支持 offset 或 position 动画。
          <strong className="text-slate-200">SwingAnimation</strong> 方案通过嵌套三个圆周运动，利用 <span className="text-cyan-400">摆线 (Cycloid)</span> 数学原理，巧妙地将旋转转化为近似直线的平移运动。
        </p>
      </section>

      {/* The 3-Layer Architecture */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
            <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Layers size={20} className="text-purple-400" />
                三层嵌套架构
            </h4>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-500">1</div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-blue-400">外层容器 (Outer)</div>
                        <div className="text-xs text-slate-500 mt-0.5">顺时针旋转 · 周期 T</div>
                    </div>
                </div>
                <div className="ml-4 pl-4 border-l border-slate-700 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-purple-500 flex items-center justify-center text-xs font-bold text-purple-500">2</div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-purple-400">中层容器 (Middle)</div>
                        <div className="text-xs text-slate-500 mt-0.5">逆时针旋转 · 周期 -T/2 (两倍速)</div>
                    </div>
                </div>
                <div className="ml-8 pl-4 border-l border-slate-700 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-500 flex items-center justify-center text-xs font-bold text-cyan-500">3</div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-cyan-400">内层容器 (Inner)</div>
                        <div className="text-xs text-slate-500 mt-0.5">顺时针旋转 · 周期 T · 内容静止</div>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Calculator size={20} className="text-green-400" />
                数学推导
            </h4>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 h-full flex flex-col justify-center">
                <p className="text-sm text-slate-400 mb-4">
                    为了抵消圆周运动带来的垂直位移，我们需要特定的角速度组合：
                </p>
                <div className="bg-slate-900 rounded p-4 font-mono text-xs md:text-sm text-center border border-slate-800">
                    <div className="grid grid-cols-3 gap-2 mb-2 pb-2 border-b border-slate-800 text-slate-500">
                        <div>Layer</div>
                        <div>Speed</div>
                        <div>Angle</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-slate-300 items-center">
                        <div className="text-blue-400">Outer</div>
                        <div>ω</div>
                        <div>θ</div>
                        
                        <div className="text-purple-400">Middle</div>
                        <div>-2ω</div>
                        <div>-2θ</div>
                        
                        <div className="text-cyan-400">Inner</div>
                        <div>ω</div>
                        <div>θ</div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800 text-green-400 font-bold">
                        Net Rotation = θ + (-2θ) + θ = 0°
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                    结果：内容在整个过程中保持“直立”，且垂直分量相互抵消。
                </p>
            </div>
        </div>
      </section>

      {/* Code Implementation */}
      <section>
        <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <Code size={20} className="text-amber-400" />
            SwiftUI 实现逻辑
        </h4>
        <div className="bg-[#0d1117] rounded-xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="flex items-center px-4 py-2 bg-slate-800/50 border-b border-slate-800 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                <span className="text-xs text-slate-500 ml-2 font-mono">SwingAnimationModifier.swift</span>
            </div>
            <pre className="p-4 text-xs md:text-sm font-mono leading-relaxed overflow-x-auto text-slate-300">
{`// 1. 外层：周期 duration (T)
ZStack(alignment: outerAlignment) {
    Color.clear
    // 2. 中层：周期 -duration/2 (2x 速度反向)
    ZStack(alignment: alignment) {
        Color.clear
        // 3. 内层：周期 duration (T)
        ZStack(alignment: alignment) {
            content
                // 修正内容旋转，使其保持水平
                .clockHandRotationEffect(period: .custom(duration))
        }
        .frame(width: innerDiameter, height: innerDiameter)
        .clockHandRotationEffect(period: .custom(-duration / 2))
    }
    .frame(width: length, height: length)
    .clockHandRotationEffect(period: .custom(duration))
}`}
            </pre>
        </div>
        <p className="text-xs text-slate-500 mt-3">
            注：<code className="text-slate-400">length</code> 和 <code className="text-slate-400">innerDiameter</code> 的精确计算是保证轨迹闭合的关键。
            外层圆直径 = <span className="text-slate-400">|distance| + contentSize</span>。
        </p>
      </section>

    </div>
  );
};

export default MathExplanation;
