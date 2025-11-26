import React, { useEffect, useRef, useState } from 'react';
import { Direction } from '../types';

interface SimulationCanvasProps {
  duration: number;
  distance: number;
  direction: Direction;
  isPlaying: boolean;
  showMechanics: boolean;
  showTrail: boolean;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  duration,
  distance,
  direction,
  isPlaying,
  showMechanics,
  showTrail,
}) => {
  const [time, setTime] = useState(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  // Reset trail when configs change
  useEffect(() => {
    trailRef.current = [];
  }, [direction, distance]);

  const animate = () => {
    if (!isPlaying) {
      startTimeRef.current = Date.now() - time * 1000;
      return;
    }

    const now = Date.now();
    // Calculate elapsed time in seconds
    const elapsed = (now - startTimeRef.current) / 1000;
    
    setTime(elapsed);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // --- Math Logic matching the SwingAnimation logic ---
  
  // Calculate cycle progress (0 to 1)
  const cycle = (time % duration) / duration;
  const angleRad = cycle * 2 * Math.PI;
  const angleDeg = cycle * 360;

  // Configuration Constants
  const contentSize = 60; // Size of the widget content (cyan circle)
  
  // Based on the swift code: 
  // let length = abs(distance) + extendLength
  // In our visualizer, we treat 'extendLength' as the contentSize for simplicity
  const extendLength = contentSize;
  const outerDiameter = Math.abs(distance) + extendLength;
  const outerRadius = outerDiameter / 2;
  
  // let innerDiameter = (length + extendLength) / 2
  const innerDiameter = (outerDiameter + extendLength) / 2;
  const innerRadius = innerDiameter / 2;
  
  // Middle Layer Size (which is the outerDiameter in code, but conceptually the middle ring)
  // The structure is:
  // Layer 1 (Outer Container): Size = distance + size.
  // Layer 2 (Middle Container): Size = innerDiameter.
  
  // Let's replicate the transform hierarchy exactly.
  // 1. Outer Rotation (Period T) -> Speed w
  // 2. Middle Rotation (Period -T/2) -> Speed -2w
  // 3. Inner Rotation (Period T) -> Speed w
  
  const rot1 = angleDeg;          // Outer
  const rot2 = angleDeg * -2;     // Middle (2x speed, reverse)
  const rot3 = angleDeg;          // Inner

  // Offsets based on alignment
  // If Direction Horizontal:
  // Outer Alignment: Trailing (Right) if distance > 0
  // Middle Alignment: Leading (Left) if distance > 0
  // Inner Alignment: Leading (Left) if distance > 0
  
  // To simulate "Alignment" in SVG, we translate the child group relative to the parent center.
  // ZStack(alignment: .leading) means the child is at x = -radius.
  
  const isVert = direction === Direction.Vertical;
  
  // Visualize Layout:
  // Center (0,0)
  //  -> Rotate(rot1)
  //    -> Translate(AlignOffset1) (The anchor point of the next layer)
  //      -> Rotate(rot2)
  //        -> Translate(AlignOffset2)
  //          -> Rotate(rot3)
  //            -> Draw Content
  
  // Calculate Offsets (Radii distances)
  // The distance between the center of the Outer circle and the center of the Middle circle
  // is (OuterRadius - MiddleRadius) if aligned to one side.
  // Wait, let's look at the Swift logic:
  // Middle Circle (size: length) is inside Outer ZStack.
  // Inner Circle (size: innerDiameter) is inside Middle ZStack.
  
  // R1 = Outer Radius = outerDiameter / 2
  // R2 = Middle Radius = innerDiameter / 2
  // R3 = Content Radius = contentSize / 2
  
  // Vector 1 Length (Outer Center -> Middle Center)
  // Aligned Leading: Offset is -(R1 - R2)
  // Aligned Trailing: Offset is +(R1 - R2)
  
  // Vector 2 Length (Middle Center -> Inner Center)
  // Aligned Leading: Offset is -(R2 - R3)
  
  const r1 = outerRadius;
  const r2 = innerRadius;
  const r3 = contentSize / 2;
  
  // The mechanism works because the "arms" have equal length.
  // Arm 1 = r1 - r2.
  // Arm 2 = r2 - r3.
  // For straight line, Arm 1 must equal Arm 2.
  // (d + s)/2 - (d + 2s)/4 = (2d + 2s - d - 2s)/4 = d/4 ?
  // Let's check the Math:
  // L = d + s.  R_outer = (d+s)/2.
  // D_inner = (L + s)/2 = (d + 2s)/2. R_mid = (d + 2s)/4.
  // Content = s. R_content = s/2.
  
  // Offset 1 (Outer Center to Mid Center) = R_outer - R_mid = (2d + 2s)/4 - (d + 2s)/4 = d/4.
  // Offset 2 (Mid Center to Content Center) = R_mid - R_content = (d + 2s)/4 - 2s/4 = d/4.
  
  // Yes! Both arms are length d/4. 
  // 2 * (d/4) * 2 (peak to peak) = d. Total travel distance is d. Perfect.
  
  const armLength = distance / 4; 
  
  // Coordinate transformations for visualizer
  const center = { x: 400, y: 300 };
  
  // Calculate dynamic position for trail
  // x = arm * cos(t) + arm * cos(t - 2t) = arm * cos(t) + arm * cos(-t) = 2*arm*cos(t)
  // This produces linear motion.
  
  // Adjust based on direction
  const axis = isVert ? 90 : 0; // Rotate whole system 90deg for vertical
  
  const currentX = center.x + (isVert ? 0 : 2 * armLength * Math.cos(angleRad));
  const currentY = center.y + (isVert ? 2 * armLength * Math.cos(angleRad) : 0);
  
  if (showTrail && isPlaying) {
    if (trailRef.current.length > 200) trailRef.current.shift();
    trailRef.current.push({ x: currentX, y: currentY });
  }

  // Visual Colors
  const colorOuter = "#3b82f6"; // Blue 500
  const colorMiddle = "#a855f7"; // Purple 500
  const colorInner = "#06b6d4"; // Cyan 500

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative">
        
      <svg className="w-full h-full" viewBox="0 0 800 600">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#grid)" />
        
        {/* Helper Lines (The "Wall") */}
        <line 
            x1={isVert ? center.x - 100 : center.x - distance/2 - contentSize/2} 
            y1={isVert ? center.y - distance/2 - contentSize/2 : center.y - 100} 
            x2={isVert ? center.x + 100 : center.x - distance/2 - contentSize/2} 
            y2={isVert ? center.y - distance/2 - contentSize/2 : center.y + 100} 
            stroke="#64748b" 
            strokeDasharray="4"
        />
        <line 
            x1={isVert ? center.x - 100 : center.x + distance/2 + contentSize/2} 
            y1={isVert ? center.y + distance/2 + contentSize/2 : center.y - 100} 
            x2={isVert ? center.x + 100 : center.x + distance/2 + contentSize/2} 
            y2={isVert ? center.y + distance/2 + contentSize/2 : center.y + 100} 
            stroke="#64748b" 
            strokeDasharray="4"
        />

        {/* Trail */}
        {showTrail && (
            <polyline 
                points={trailRef.current.map(p => `${p.x},${p.y}`).join(' ')} 
                fill="none" 
                stroke="#22d3ee" 
                strokeWidth="2"
                strokeOpacity="0.5"
            />
        )}

        {/* --- THE MECHANISM --- */}
        <g transform={`translate(${center.x}, ${center.y}) rotate(${isVert ? 90 : 0})`}>
          
          {/* Layer 1: Outer (Static Frame relative to world, but rotates internally) */}
          <g transform={`rotate(${rot1})`}>
             {/* Visual: Arm 1 (Ghost) */}
             {showMechanics && (
                 <>
                    <circle r={r1} fill="none" stroke={colorOuter} strokeWidth="1" strokeDasharray="4" opacity="0.3" />
                    <line x1="0" y1="0" x2={armLength} y2="0" stroke={colorOuter} strokeWidth="2" />
                    <circle r="4" fill={colorOuter} />
                 </>
             )}

             {/* Move to edge of Layer 1 to attach Layer 2 */}
             <g transform={`translate(${armLength}, 0)`}>
                
                {/* Layer 2: Middle */}
                <g transform={`rotate(${rot2})`}>
                    {showMechanics && (
                        <>
                           <circle r={r2} fill="none" stroke={colorMiddle} strokeWidth="1" strokeDasharray="4" opacity="0.3" />
                           <line x1="0" y1="0" x2={armLength} y2="0" stroke={colorMiddle} strokeWidth="2" />
                           <circle r="4" fill={colorMiddle} />
                        </>
                    )}

                    {/* Move to edge of Layer 2 to attach Layer 3 */}
                    <g transform={`translate(${armLength}, 0)`}>
                        
                        {/* Layer 3: Inner */}
                        <g transform={`rotate(${rot3})`}>
                            
                            {/* The Actual Content */}
                            <circle 
                                r={contentSize / 2} 
                                fill="url(#cyanGradient)" 
                                stroke={showMechanics ? "#fff" : "none"}
                                strokeWidth="2"
                                className="drop-shadow-lg"
                            />
                            {/* Direction Indicator on the content to prove it doesn't rotate */}
                            <path d="M -10 0 L 0 -10 L 10 0 M 0 -10 L 0 10" stroke="white" strokeWidth="2" opacity={showMechanics ? 1 : 0} />
                            
                        </g>
                    </g>
                </g>
             </g>
          </g>
        </g>

        {/* Gradients */}
        <defs>
            <radialGradient id="cyanGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0891b2" />
            </radialGradient>
        </defs>

      </svg>
      
      {/* Overlay Info */}
      <div className="absolute top-4 left-4 font-mono text-xs text-slate-400 pointer-events-none">
        <div>时间: {time.toFixed(2)}s</div>
        <div>旋转 1 (外层): {rot1.toFixed(0)}°</div>
        <div>旋转 2 (中层): {rot2.toFixed(0)}°</div>
        <div>旋转 3 (内层): {rot3.toFixed(0)}°</div>
        <div className="mt-2 text-cyan-400">净旋转角度: {(rot1 + rot2 + rot3).toFixed(0)}°</div>
      </div>
    </div>
  );
};

export default SimulationCanvas;