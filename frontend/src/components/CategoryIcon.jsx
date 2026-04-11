import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  HeartPulse,
  ReceiptText,
  HandCoins,
  TrendingUp,
  MoreHorizontal,
  Palmtree,
  Home,
  GraduationCap,
  ShieldAlert,
  Heart,
  Wallet,
  Plane,
  Activity,
  CreditCard,
  Banknote,
  Briefcase,
  PiggyBank
} from 'lucide-react';

const CategoryIcon = ({ category, className = "w-4 h-4", size }) => {
  const iconProps = { 
    className, 
    ...(size ? { size } : {}) 
  };

  const lowerCategory = category?.toLowerCase() || '';

  // Transaksi
  if (lowerCategory.includes('makan')) return <Utensils {...iconProps} />;
  if (lowerCategory.includes('transport')) return <Car {...iconProps} />;
  if (lowerCategory.includes('belanja')) return <ShoppingBag {...iconProps} />;
  if (lowerCategory.includes('hiburan')) return <Gamepad2 {...iconProps} />;
  if (lowerCategory.includes('sehat')) return <HeartPulse {...iconProps} />;
  if (lowerCategory.includes('tagihan')) return <ReceiptText {...iconProps} />;
  if (lowerCategory.includes('gaji')) return <HandCoins {...iconProps} />;
  if (lowerCategory.includes('investasi')) return <TrendingUp {...iconProps} />;
  if (lowerCategory.includes('tabungan')) return <PiggyBank {...iconProps} />;
  
  // Goals
  if (lowerCategory.includes('liburan')) return <Plane {...iconProps} />;
  if (lowerCategory.includes('kendaraan') || lowerCategory.includes('mobil') || lowerCategory.includes('motor')) return <Car {...iconProps} />;
  if (lowerCategory.includes('rumah')) return <Home {...iconProps} />;
  if (lowerCategory.includes('pendidikan') || lowerCategory.includes('kuliah') || lowerCategory.includes('sekolah')) return <GraduationCap {...iconProps} />;
  if (lowerCategory.includes('darurat')) return <ShieldAlert {...iconProps} />;
  if (lowerCategory.includes('pensiun')) return <Heart {...iconProps} />;

  // Common keywords
  if (lowerCategory.includes('bonus')) return <Banknote {...iconProps} />;
  if (lowerCategory.includes('internet') || lowerCategory.includes('wifi')) return <Activity {...iconProps} />;
  if (lowerCategory.includes('asuransi')) return <ShieldAlert {...iconProps} />;
  if (lowerCategory.includes('listrik')) return <Activity {...iconProps} />; // Could be Bolt but lucide has Zap
  if (lowerCategory.includes('kerja')) return <Briefcase {...iconProps} />;

  // Default
  return <MoreHorizontal {...iconProps} />;
};

export default CategoryIcon;
