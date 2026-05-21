import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  CheckCircle2,
  Receipt,
  Target,
  User,
  Hand,
  PartyPopper,
  ChevronRight,
} from 'lucide-react';

const ONBOARDING_KEY = 'danadiri_onboarding';

const getOnboardingKey = (user) => {
  if (user?.id || user?._id) return `${ONBOARDING_KEY}_${user._id || user.id}`;
  if (user?.email) return `${ONBOARDING_KEY}_${user.email}`;
  return ONBOARDING_KEY;
};

const getOnboardingState = (user) => {
  try {
    const saved = localStorage.getItem(getOnboardingKey(user));
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return {
    dismissed: false,
    completedSteps: [],
    firstVisit: new Date().toISOString(),
  };
};

const saveOnboardingState = (state, user) => {
  localStorage.setItem(getOnboardingKey(user), JSON.stringify(state));
};

export const completeOnboardingStep = (user, stepId) => {
  if (!user || !stepId) return;

  const current = getOnboardingState(user);
  if (current.completedSteps.includes(stepId)) return current;

  const updated = {
    ...current,
    completedSteps: [...current.completedSteps, stepId],
  };

  saveOnboardingState(updated, user);
  return updated;
};

const STEPS = [
  {
    id: 'transaction',
    label: 'Tambah Transaksi',
    description: 'Catat pemasukan atau pengeluaran pertamamu',
    icon: Receipt,
    path: '/transactions',
  },
  {
    id: 'goal',
    label: 'Buat Target',
    description: 'Buat target tabungan untuk tujuanmu',
    icon: Target,
    path: '/goals',
  },
  {
    id: 'profile',
    label: 'Edit Profile',
    description: 'Lengkapi detail profil dan preferensimu',
    icon: User,
    path: '/profile',
  },
  {
    id: 'complete',
    label: 'Selesai',
    description: 'Dashboard siap digunakan',
    icon: PartyPopper,
    path: '/dashboard',
  },
];

const OnboardingWelcome = ({ user }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(() => getOnboardingState(user));
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasPrerequisites =
      state.completedSteps.includes('transaction') &&
      state.completedSteps.includes('goal') &&
      state.completedSteps.includes('profile');

    if (hasPrerequisites && !state.completedSteps.includes('complete')) {
      const newState = {
        ...state,
        completedSteps: [...state.completedSteps, 'complete'],
      };
      setState(newState);
      saveOnboardingState(newState, user);
    }
  }, [state.completedSteps, user]);

  if (state.dismissed) return null;
  if (!isVisible) return null;

  const completedCount = state.completedSteps.length;
  const totalSteps = STEPS.length;
  const progressPercent = (completedCount / totalSteps) * 100;
  const allDone = completedCount === totalSteps;

  const handleDismiss = () => {
    const newState = { ...state, dismissed: true };
    setState(newState);
    saveOnboardingState(newState, user);
    setIsVisible(false);
  };

  const handleStepClick = (step) => {
    navigate(step.path);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 md:p-7 mb-6 shadow-xl shadow-blue-600/15 animate-fade-in-up">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-4 right-20 w-2 h-2 bg-yellow-300/60 rounded-full animate-pulse" />
      <div className="absolute top-12 right-10 w-1.5 h-1.5 bg-sky-300/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 z-10"
        aria-label="Tutup onboarding"
      >
        <X size={16} />
      </button>

      {/* Content */}
      <div className="relative z-[1]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <Sparkles size={18} className="text-yellow-300" />
          </div>
          <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
            {allDone ? 'Setup Selesai!' : 'Panduan Awal'}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight flex items-center gap-2">
          <Hand size={22} className="text-yellow-200" />
          <span>{getGreeting()}, {user?.name?.split(' ')[0] || 'Pengguna'}!</span>
        </h2>
        <p className="text-sm text-blue-100/90 mb-5 max-w-lg leading-relaxed">
          Selamat datang di <span className="font-semibold text-white">DanaDiri</span> — aplikasi
          manajemen keuangan pribadimu. Catat pemasukan, pantau pengeluaran, dan raih target
          tabunganmu dengan mudah.
        </p>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-blue-200">Progress Setup</span>
            <span className="text-xs font-bold text-white">
              {completedCount}/{totalSteps} Langkah
            </span>
          </div>
          <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = state.completedSteps.includes(step.id);
            const isNext = !isCompleted && index === completedCount;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step)}
                className={`relative flex flex-col items-start gap-2 p-3.5 rounded-xl text-left transition-all duration-200 group
                  ${isCompleted
                    ? 'bg-white/15 border border-white/20'
                    : isNext
                      ? 'bg-white/10 border border-white/15 hover:bg-white/20 ring-1 ring-yellow-300/30'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 opacity-60'
                  }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-emerald-400/20' : 'bg-white/10'}`}>
                    {isCompleted ? (
                      <CheckCircle2 size={15} className="text-emerald-300" />
                    ) : (
                      <Icon size={15} className={isNext ? 'text-yellow-300' : 'text-white/50'} />
                    )}
                  </div>
                  {isNext && (
                    <ChevronRight size={14} className="text-yellow-300 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>

                <div>
                  <p className={`text-xs font-semibold mb-0.5 ${isCompleted ? 'text-white/80 line-through' : 'text-white'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-blue-200/70 leading-snug hidden md:block">
                    {step.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWelcome;
