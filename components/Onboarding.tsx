import React, { useState } from 'react';
import { UserProfile, ActivityLevel, Goal } from '../types';
import { Button } from './ui/Button';
import { Icons } from './Icons';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: 'male',
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    goal: Goal.LOSE_WEIGHT,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    // Basic validation could go here
    onComplete(formData as UserProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
            <Icons.User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crie seu Perfil</h1>
          <p className="text-gray-500 mt-2">Passo {step} de 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Medidas Básicas</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="ex: 30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                <input type="number" name="height" value={formData.height || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="ex: 175" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso Atual (kg)</label>
                <input type="number" name="currentWeight" value={formData.currentWeight || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="ex: 80" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso Meta (kg)</label>
                <input type="number" name="targetWeight" value={formData.targetWeight || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="ex: 75" />
              </div>
            </div>

            <Button fullWidth onClick={nextStep} className="mt-6">Próximo</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Objetivos & Estilo de Vida</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo Principal</label>
              <select name="goal" value={formData.goal} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                {Object.values(Goal).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Atividade</label>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                 {Object.values(ActivityLevel).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={prevStep} className="flex-1">Voltar</Button>
              <Button onClick={nextStep} className="flex-1">Próximo</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personalização</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Região / Localização</label>
              <input type="text" name="region" value={formData.region || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="ex: São Paulo, Brasil" />
              <p className="text-xs text-gray-500 mt-1">Usado para sugerir alimentos locais.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restrições Alimentares</label>
              <textarea name="restrictions" value={formData.restrictions || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-20" placeholder="ex: Vegetariano, Sem Glúten, Sem Lactose..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferências (Opcional)</label>
              <textarea name="preferences" value={formData.preferences || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none h-20" placeholder="ex: Adoro massas, odeio coentro..." />
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={prevStep} className="flex-1">Voltar</Button>
              <Button onClick={handleSubmit} className="flex-1">Criar Plano</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};