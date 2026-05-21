import { useState } from 'react';

const Tooltip = ({ children, text, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800',
  };

  const arrowBorder = {
    top: 'border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'border-l-transparent border-r-transparent border-t-transparent',
    left: 'border-t-transparent border-b-transparent border-r-transparent',
    right: 'border-t-transparent border-b-transparent border-l-transparent',
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && text && (
        <div
          className={`absolute z-[100] ${positionClasses[position]} pointer-events-none animate-tooltip-in`}
        >
          <div className="relative bg-slate-800 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
            {text}
            <div
              className={`absolute w-0 h-0 border-[5px] ${arrowClasses[position]} ${arrowBorder[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
