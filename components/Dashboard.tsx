
import React, { useState, useEffect } from 'react';
import { DailyPlan, UserProfile } from '../types';
import { MealCard } from './MealCard';
import { ShoppingList } from './ShoppingList';
import { ExerciseCard } from './ExerciseCard';
import { ChatTab } from './ChatTab';
import { ProgressTab } from './ProgressTab';
import { Icons } from './Icons';
import { Button } from './ui/Button';
import { Toast } from './ui/Toast';
import { generateDailyPlan } from '../services/geminiService';

interface DashboardProps {
  profile: UserProfile;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'meals' | 'shopping' | 'exercise' | 'chat' | 'progress'>('meals');
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type?: 'success'|'info'|'error'} | null>(null);

  // Data do sistema formatada para exibição correta no cabeçalho
  const systemDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  const showToast = (msg: string, type: 'success'|'info'|'error' = 'info') => {
      setToast({ msg, type });
  };

  const fetchPlan = async (forceNew: boolean = false) => {
    setLoading(true);
    setError(null);

    const todayKey = new Date().toLocaleDateString('pt-BR');
    const savedPlanJson = localStorage.getItem('nutrigpt_daily_plan');
    let cachedPlan: DailyPlan | null = null;

    if (savedPlanJson) {
        try {
            cachedPlan = JSON.parse(savedPlanJson);
        } catch(e) {
            console.error("Erro parse cache", e);
        }
    }
    
    // Verifica cache: 
    // 1. Se não for forçado
    // 2. Se a data for de hoje
    // 3. Se existe um plano
    // 4. CRÍTICO: Se o plano tem a propriedade 'time' (novo schema), senão regenera
    const isSchemaValid = cachedPlan && cachedPlan.meals?.breakfast?.time;

    if (!forceNew && cachedPlan) {
        const savedPlanDate = localStorage.getItem('nutrigpt_plan_date');
        if (savedPlanDate === todayKey && isSchemaValid) {
            setPlan(cachedPlan);
            setLoading(false);
            return;
        }
    }

    try {
      // Se não tinha plano válido ou era antigo, gera um novo
      const newPlan = await generateDailyPlan(profile, cachedPlan);
      setPlan(newPlan);
      
      localStorage.setItem('nutrigpt_daily_plan', JSON.stringify(newPlan));
      localStorage.setItem('nutrigpt_plan_date', todayKey);
      
      if (forceNew) showToast("Novo plano gerado com sucesso!", "success");

    } catch (err) {
      setError("Falha ao gerar plano. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Preparando seu dia...</h2>
        <p className="text-gray-500">Definindo os melhores horários para suas refeições...</p>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-50 p-4 rounded-full text-red-500 mb-4">
            <Icons.Flame className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ops!</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => fetchPlan(true)}>Tentar Novamente</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {toast && (
          <Toast 
            message={toast.msg} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
      )}

      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-6 py-4 shadow-sm flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-primary-800">NutriGPT</h1>
            {/* Usa systemDate para garantir a data correta independente da IA */}
            <p className="text-xs text-gray-500 capitalize">{systemDate}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={onLogout} 
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Sair e apagar dados"
            >
                <Icons.Settings className="w-6 h-6" />
            </button>
        </div>
      </div>

      {/* Summary Stats & Content */}
      <div className="p-6">
        
        {/* Frase Motivacional */}
        {activeTab === 'meals' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl border border-orange-200">
                 <p className="text-sm text-orange-800 italic font-medium text-center">"{plan.motivationalQuote}"</p>
            </div>
        )}

        {activeTab !== 'chat' && activeTab !== 'progress' && (
          <div className="bg-primary-600 rounded-2xl p-6 text-white shadow-lg mb-6 animate-fade-in">
              <div className="flex justify-between items-end mb-4">
                  <div>
                      <p className="text-primary-100 text-sm font-medium mb-1">Meta Diária</p>
                      <h2 className="text-4xl font-bold">{plan.totalCalories} <span className="text-xl font-normal text-primary-200">kcal</span></h2>
                  </div>
                  <div className="bg-primary-500/30 p-2 rounded-lg backdrop-blur-sm">
                      <Icons.Flame className="w-6 h-6 text-white" />
                  </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-primary-500/30 pt-4">
                  <div className="text-center">
                      <span className="block font-bold text-lg">{plan.macroTargets.protein}g</span>
                      <span className="text-xs text-primary-200 uppercase tracking-wider">Proteína</span>
                  </div>
                  <div className="text-center border-l border-primary-500/30">
                      <span className="block font-bold text-lg">{plan.macroTargets.carbs}g</span>
                      <span className="text-xs text-primary-200 uppercase tracking-wider">Carbos</span>
                  </div>
                  <div className="text-center border-l border-primary-500/30">
                      <span className="block font-bold text-lg">{plan.macroTargets.fats}g</span>
                      <span className="text-xs text-primary-200 uppercase tracking-wider">Gorduras</span>
                  </div>
              </div>
          </div>
        )}

        {/* Content Tabs */}
        <div className="space-y-6">
            {activeTab === 'meals' && (
                <div className="animate-fade-in">
                    <MealCard 
                        meal={plan.meals.breakfast} 
                        title="Café da Manhã" 
                        icon={<Icons.Utensils className="w-5 h-5" />} 
                    />
                    <MealCard 
                        meal={plan.meals.lunch} 
                        title="Almoço" 
                        icon={<Icons.Utensils className="w-5 h-5" />} 
                    />
                    <MealCard 
                        meal={plan.meals.snack} 
                        title="Lanche da Tarde" 
                        icon={<Icons.Utensils className="w-5 h-5" />} 
                    />
                    <MealCard 
                        meal={plan.meals.dinner} 
                        title="Jantar" 
                        icon={<Icons.Utensils className="w-5 h-5" />} 
                    />
                    
                    {/* Tips Section */}
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mt-6">
                        <h3 className="text-yellow-800 font-bold mb-2 flex items-center gap-2">
                            <span>💡</span> Dicas do Dia
                        </h3>
                        <ul className="list-disc list-inside text-sm text-yellow-800/80 space-y-1">
                            {plan.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6">
                         <Button variant="outline" fullWidth onClick={() => fetchPlan(true)} className="flex items-center justify-center gap-2">
                            <Icons.Refresh className="w-4 h-4" /> Gerar Novo Cardápio
                         </Button>
                    </div>
                </div>
            )}

            {activeTab === 'shopping' && (
                <div className="animate-fade-in">
                    <ShoppingList items={plan.shoppingList} />
                </div>
            )}

            {activeTab === 'exercise' && (
                <div className="animate-fade-in">
                    <ExerciseCard workout={plan.workout} />
                </div>
            )}

            {activeTab === 'chat' && (
                <div className="animate-fade-in">
                    <ChatTab profile={profile} plan={plan} />
                </div>
            )}
            
            {activeTab === 'progress' && (
                <div className="animate-fade-in">
                    <ProgressTab profile={profile} onUpdate={() => {}} showToast={showToast} />
                </div>
            )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-2 sm:px-6 z-50">
        <div className="flex justify-around items-center h-16">
            <button 
                onClick={() => setActiveTab('meals')}
                className={`flex flex-col items-center gap-1 w-full ${activeTab === 'meals' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Icons.Utensils className="w-6 h-6" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Dieta</span>
            </button>
            <button 
                onClick={() => setActiveTab('shopping')}
                className={`flex flex-col items-center gap-1 w-full ${activeTab === 'shopping' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Icons.ShoppingBag className="w-6 h-6" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Lista</span>
            </button>
            <button 
                onClick={() => setActiveTab('exercise')}
                className={`flex flex-col items-center gap-1 w-full ${activeTab === 'exercise' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Icons.Dumbbell className="w-6 h-6" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Treino</span>
            </button>
            <button 
                onClick={() => setActiveTab('progress')}
                className={`flex flex-col items-center gap-1 w-full ${activeTab === 'progress' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Icons.ChartBar className="w-6 h-6" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Progresso</span>
            </button>
            <button 
                onClick={() => setActiveTab('chat')}
                className={`flex flex-col items-center gap-1 w-full ${activeTab === 'chat' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Icons.ChatBubble className="w-6 h-6" />
                <span className="text-[10px] font-medium uppercase tracking-wide">Chat</span>
            </button>
        </div>
      </div>
    </div>
  );
};
