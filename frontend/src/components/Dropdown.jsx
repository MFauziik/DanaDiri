import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Dropdown = ({ options, value, onChange, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 px-4 rounded-xl bg-white border border-[#e2e8f0] hover:border-[#2f6df6] focus:border-[#2f6df6] outline-none text-sm flex items-center justify-between transition-all duration-200 shadow-sm
          ${isOpen ? 'ring-4 ring-blue-50 border-[#2f6df6]' : ''}
          ${selectedOption ? 'text-[#1f2a44] font-semibold' : 'text-[#98a2b3]'}`}
      >
        <span className="truncate mr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-[#98a2b3] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#2f6df6]" : ""}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 min-w-full bg-white border border-[#edf1f7] rounded-2xl shadow-[0_12px_24px_-4px_rgba(15,23,42,0.12),0_8px_16px_-4px_rgba(15,23,42,0.08)] z-[100] max-h-64 overflow-y-auto overflow-x-hidden p-1.5 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-0.5">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 text-left text-sm rounded-xl transition-all duration-150 flex items-center justify-between group
                  ${value === option.value 
                    ? "bg-blue-50 text-blue-600 font-bold" 
                    : "text-[#475467] hover:bg-gray-50 hover:text-[#1f2a44]"}`}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <Check size={14} className="text-blue-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
