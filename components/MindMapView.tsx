import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import type { MindMapData, Point, Problem } from '../types';
import { translations } from '../translations';

interface MindMapViewProps {
  data: MindMapData;
  t: (key: keyof typeof translations.en) => string;
  onNodeClick: (type: 'central' | 'problem' | 'idea', title: string, id: string, description?: string) => void;
  selectedNodeId?: string;
}

interface Connection {
    from: string;
    to: string;
}

const Node: React.FC<{ 
    id: string; 
    children: React.ReactNode; 
    className?: string;
    onClick?: () => void;
    isSelected?: boolean;
}> = ({ id, children, className = '', onClick, isSelected }) => (
  <div 
    id={id} 
    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    className={`
        node-item 
        cursor-pointer 
        transition-all duration-300 ease-out 
        hover:-translate-y-1 hover:shadow-xl 
        active:scale-95
        ${isSelected ? 'ring-4 ring-cyan-200 dark:ring-cyan-800' : ''}
        ${className}
    `}
  >
    {children}
  </div>
);

const Line: React.FC<{ from: Point; to: Point }> = ({ from, to }) => {
    // Smoother cubic bezier for organic feel
    const midY = (from.y + to.y) / 2;
    const pathData = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
    return <path d={pathData} strokeWidth="1.5" fill="none" className="line-path stroke-slate-300 dark:stroke-slate-600" strokeDasharray="4 4" />;
};


const MindMapView: React.FC<MindMapViewProps> = ({ data, t, onNodeClick, selectedNodeId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, Point>>(new Map());

  const calculatePositions = useCallback(() => {
    if (!containerRef.current) return;
    
    const newPositions = new Map<string, Point>();
    const nodes = containerRef.current.querySelectorAll('.node-item');
    const containerRect = containerRef.current.getBoundingClientRect();
    
    nodes.forEach(node => {
      const rect = node.getBoundingClientRect();
      const id = node.id;
      if (!id) return;

      const fromPoint: Point = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height,
      };
      
      const toPoint: Point = {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
      }

      newPositions.set(`${id}-from`, fromPoint);
      newPositions.set(`${id}-to`, toPoint);
    });

    setNodePositions(newPositions);
  }, [data]);

  useLayoutEffect(() => {
    // Small delay to ensure DOM is rendered before calculating positions
    const timer = setTimeout(calculatePositions, 50);
    window.addEventListener('resize', calculatePositions);
    return () => {
        window.removeEventListener('resize', calculatePositions);
        clearTimeout(timer);
    }
  }, [calculatePositions, data]);

  const connections: Connection[] = [];
  data.problems.forEach((problem, pIndex) => {
    const problemId = `problem-${pIndex}`;
    connections.push({ from: 'central-topic', to: problemId });
    problem.businessIdeas.forEach((_, bIndex) => {
      const ideaId = `idea-${pIndex}-${bIndex}`;
      connections.push({ from: problemId, to: ideaId });
    });
  });

  return (
    <div ref={containerRef} className="relative min-w-[1200px] min-h-[800px] w-full h-full flex flex-col items-center p-20 overflow-visible" onClick={() => { /* Click background to deselect? Passed from parent usually */ }}>
        <style>{`
          .node-item, .line-path {
            animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {connections.map((conn, index) => {
          const fromPos = nodePositions.get(`${conn.from}-from`);
          const toPos = nodePositions.get(`${conn.to}-to`);
          if (fromPos && toPos) {
            return <Line key={index} from={fromPos} to={toPos} />;
          }
          return null;
        })}
      </svg>
      
      {/* Visual Layout Structure */}
      <div className="flex flex-col items-center gap-24 relative" style={{ zIndex: 1 }}>
        
        {/* Level 1: Central Topic */}
        <Node 
            id="central-topic" 
            isSelected={selectedNodeId === 'central-topic'}
            onClick={() => onNodeClick('central', data.centralTopic, null)}
            className="bg-yellow-300 dark:bg-yellow-500 border border-yellow-400 dark:border-yellow-600 rounded-full py-4 px-8 shadow-lg min-w-[200px] max-w-md z-10"
        >
          <h2 className="text-xl font-bold text-slate-900 text-center leading-tight">{data.centralTopic}</h2>
        </Node>

        <div className="flex flex-wrap justify-center items-start gap-16">
          {data.problems.map((problem: Problem, pIndex: number) => {
             const problemId = `problem-${pIndex}`;
             return (
                <div key={pIndex} className="flex flex-col items-center gap-16">
                
                {/* Level 2: Problems */}
                <Node 
                    id={problemId} 
                    isSelected={selectedNodeId === problemId}
                    onClick={() => onNodeClick('problem', problem.problemTitle, null)}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full py-3 px-6 shadow-md min-w-[180px] max-w-xs z-10"
                >
                    <p className="font-semibold text-slate-700 dark:text-slate-200 text-center">{problem.problemTitle}</p>
                </Node>

                {/* Level 3: Ideas */}
                <div className="flex flex-col items-center gap-6">
                    {problem.businessIdeas.map((idea, bIndex) => {
                        const ideaId = `idea-${pIndex}-${bIndex}`;
                        return (
                            <Node 
                                key={bIndex} 
                                id={ideaId} 
                                isSelected={selectedNodeId === ideaId}
                                onClick={() => onNodeClick('idea', idea.title, idea.id, idea.description)}
                                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm hover:shadow-md min-w-[220px] max-w-[260px] text-left group"
                            >
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{idea.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{idea.description}</p>
                            </Node>
                        );
                    })}
                </div>
                </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default MindMapView;