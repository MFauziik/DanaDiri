import React from 'react';
import {
  Utensils, Car, ShoppingBag, Gamepad2, HeartPulse, ReceiptText, 
  HandCoins, TrendingUp, MoreHorizontal, Palmtree, Home, 
  GraduationCap, ShieldAlert, Heart, Wallet, Plane, Activity, 
  CreditCard, Banknote, Briefcase, PiggyBank, Coffee, Zap, Droplets, Phone, Building, Receipt, 
  CupSoda, Wifi, Gift, Handshake
} from 'lucide-react';

const CategoryIcon = ({ category, className = "w-4 h-4", size }) => {
  const iconProps = { className, ...(size ? { size } : {}) };
  const lowerCategory = category?.toLowerCase() || '';

  // Precise mappings for new categories
  if (lowerCategory === 'penghasilan') return <Wallet {...iconProps} />;
  if (lowerCategory === 'investasi') return <TrendingUp {...iconProps} />;
  if (lowerCategory === 'jual tanah' || lowerCategory === 'kos-kosan') return <Home {...iconProps} />;
  if (lowerCategory === 'tunjangan' || lowerCategory === 'pencairan dana') return <Banknote {...iconProps} />;
  if (lowerCategory === 'uang saku') return <HandCoins {...iconProps} />;
  if (lowerCategory === 'bisnis') return <Handshake {...iconProps} />;
  if (lowerCategory === 'bonus') return <Banknote {...iconProps} />;
  if (lowerCategory === 'hadiah') return <Gift {...iconProps} />;
  
  if (lowerCategory === 'jajan' || lowerCategory === 'makanan' || lowerCategory.includes('makan')) return <Coffee {...iconProps} />;
  if (lowerCategory === 'minuman') return <CupSoda {...iconProps} />;
  if (lowerCategory === 'tagihan listrik') return <Zap {...iconProps} />;
  if (lowerCategory === 'tagihan air') return <Droplets {...iconProps} />;
  if (lowerCategory === 'tagihan telepon') return <Phone {...iconProps} />;
  if (lowerCategory === 'internet') return <Wifi {...iconProps} />;
  if (lowerCategory === 'spp') return <Building {...iconProps} />;
  
  if (lowerCategory.includes('gaji')) return <Wallet {...iconProps} />;
  if (lowerCategory.includes('belanja')) return <ShoppingBag {...iconProps} />;
  if (lowerCategory.includes('hiburan')) return <Gamepad2 {...iconProps} />;
  if (lowerCategory.includes('sehat')) return <HeartPulse {...iconProps} />;
  if (lowerCategory.includes('tagihan')) return <Receipt {...iconProps} />;
  if (lowerCategory.includes('transport')) return <Car {...iconProps} />;
  if (lowerCategory.includes('tabungan')) return <PiggyBank {...iconProps} />;
  
  // Goals
  if (lowerCategory.includes('liburan')) return <Plane {...iconProps} />;
  if (lowerCategory.includes('kendaraan') || lowerCategory.includes('mobil') || lowerCategory.includes('motor')) return <Car {...iconProps} />;
  if (lowerCategory.includes('rumah')) return <Home {...iconProps} />;
  if (lowerCategory.includes('pendidikan') || lowerCategory.includes('kuliah') || lowerCategory.includes('sekolah')) return <GraduationCap {...iconProps} />;
  if (lowerCategory.includes('darurat')) return <ShieldAlert {...iconProps} />;
  if (lowerCategory.includes('pensiun')) return <Heart {...iconProps} />;
  
  // Custom keywords
  if (lowerCategory.includes('bonus')) return <Banknote {...iconProps} />;
  if (lowerCategory.includes('internet') || lowerCategory.includes('wifi')) return <Activity {...iconProps} />;
  if (lowerCategory.includes('asuransi')) return <ShieldAlert {...iconProps} />;
  if (lowerCategory.includes('kerja')) return <Briefcase {...iconProps} />;

  // Default
  return <MoreHorizontal {...iconProps} />;
};

export default CategoryIcon;
