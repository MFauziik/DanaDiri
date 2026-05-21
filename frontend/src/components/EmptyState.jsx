import { PlusCircle } from 'lucide-react';

// SVG Illustrations for different empty state contexts
const illustrations = {
  transaction: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Wallet */}
      <rect x="55" y="45" width="90" height="65" rx="12" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="2"/>
      <rect x="55" y="45" width="90" height="22" rx="12" fill="#818CF8"/>
      <rect x="115" y="72" width="30" height="20" rx="6" fill="#fff" stroke="#C7D2FE" strokeWidth="1.5"/>
      <circle cx="130" cy="82" r="4" fill="#818CF8"/>
      {/* Coins floating */}
      <circle cx="40" cy="70" r="12" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" opacity="0.8">
        <animate attributeName="cy" values="70;64;70" dur="3s" repeatCount="indefinite"/>
      </circle>
      <text x="36" y="74" fontSize="10" fill="#B45309" fontWeight="bold">$</text>
      <circle cx="160" cy="55" r="10" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="cy" values="55;48;55" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <text x="157" y="59" fontSize="9" fill="#B45309" fontWeight="bold">$</text>
      {/* Arrow */}
      <path d="M100 115 L100 135" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="0;-8" dur="1s" repeatCount="indefinite"/>
      </path>
      <path d="M94 130 L100 138 L106 130" stroke="#CBD5E1" strokeWidth="2" fill="none"/>
    </svg>
  ),
  goals: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Target bullseye */}
      <circle cx="100" cy="75" r="45" fill="#FEF2F2" stroke="#FECACA" strokeWidth="2"/>
      <circle cx="100" cy="75" r="32" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1.5"/>
      <circle cx="100" cy="75" r="18" fill="#FECDD3" stroke="#FB7185" strokeWidth="1.5"/>
      <circle cx="100" cy="75" r="6" fill="#F43F5E"/>
      {/* Arrow hitting target */}
      <line x1="145" y1="35" x2="106" y2="71" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/>
      <polygon points="103,73 108,65 112,70" fill="#10B981"/>
      {/* Sparkles */}
      <circle cx="55" cy="45" r="3" fill="#FBBF24" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="150" cy="110" r="2.5" fill="#818CF8" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="45" cy="100" r="2" fill="#34D399" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.2s" repeatCount="indefinite"/>
      </circle>
      {/* Flag */}
      <line x1="155" y1="95" x2="155" y2="55" stroke="#6366F1" strokeWidth="2"/>
      <path d="M155 55 L175 63 L155 71" fill="#818CF8" opacity="0.8"/>
    </svg>
  ),
  category: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Pie chart */}
      <circle cx="100" cy="80" r="40" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="2"/>
      <path d="M100 80 L100 40 A40 40 0 0 1 134.6 60 Z" fill="#34D399" opacity="0.8"/>
      <path d="M100 80 L134.6 60 A40 40 0 0 1 120 116.6 Z" fill="#818CF8" opacity="0.7"/>
      <path d="M100 80 L120 116.6 A40 40 0 0 1 65.4 100 Z" fill="#FB923C" opacity="0.7"/>
      {/* Center dot */}
      <circle cx="100" cy="80" r="15" fill="white"/>
      <circle cx="100" cy="80" r="5" fill="#64748B"/>
      {/* Small decorative elements */}
      <rect x="40" y="45" width="16" height="12" rx="3" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="1">
        <animate attributeName="y" values="45;41;45" dur="2.5s" repeatCount="indefinite"/>
      </rect>
      <rect x="148" y="105" width="14" height="10" rx="3" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1">
        <animate attributeName="y" values="105;101;105" dur="3s" repeatCount="indefinite"/>
      </rect>
    </svg>
  ),
};

const EmptyState = ({
  type = 'transaction',
  title = 'Belum ada data',
  description = 'Mulai tambahkan data pertamamu',
  ctaText = 'Mulai Sekarang',
  onCtaClick,
  icon: CustomIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 animate-fade-in-up">
      {/* Illustration */}
      <div className="w-44 h-36 mb-5">
        {illustrations[type] || illustrations.transaction}
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold text-slate-700 mb-1.5 text-center">
        {title}
      </h3>
      <p className="text-sm text-slate-400 text-center max-w-xs mb-5 leading-relaxed">
        {description}
      </p>

      {/* CTA Button */}
      {onCtaClick && (
        <button
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          {CustomIcon ? <CustomIcon size={16} /> : <PlusCircle size={16} />}
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
