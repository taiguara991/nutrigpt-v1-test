import React, { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { UserProfile } from './types';

const App: React.FC = () => {
  // Inicializa o estado lendo diretamente do localStorage (Lazy initialization)
  // Isso garante que o perfil seja verificado ANTES da primeira renderização
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('nutrigpt_profile');
    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        console.error("Erro ao ler perfil salvo", e);
        return null;
      }
    }
    return null;
  });

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('nutrigpt_profile', JSON.stringify(newProfile));
  };

  const handleLogout = () => {
    // Limpa tudo ao sair
    setProfile(null);
    localStorage.removeItem('nutrigpt_profile');
    localStorage.removeItem('nutrigpt_daily_plan');
    localStorage.removeItem('nutrigpt_plan_date');
  };

  if (!profile) {
    return <Onboarding onComplete={handleProfileComplete} />;
  }

  return <Dashboard profile={profile} onLogout={handleLogout} />;
};

export default App;