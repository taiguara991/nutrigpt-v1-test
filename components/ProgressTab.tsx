
import React, { useState, useEffect } from 'react';
import { ProgressEntry, UserProfile } from '../types';
import { Icons } from './Icons';
import { Button } from './ui/Button';

interface ProgressTabProps {
  profile: UserProfile;
  onUpdate: () => void;
  showToast: (msg: string) => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({ profile, onUpdate, showToast }) => {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newWaist, setNewWaist] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nutrigpt_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ordenar por data (mais recente primeiro)
        setEntries(parsed.sort((a: ProgressEntry, b: ProgressEntry) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (e) {
        console.error("Erro ao ler progresso", e);
      }
    } else {
      // Adiciona o peso inicial do perfil se não houver histórico
      const initialEntry: ProgressEntry = {
        id: 'initial',
        date: new Date().toISOString().split('T')[0],
        weight: profile.currentWeight,
        bmi: calculateBMI(profile.currentWeight, profile.height)
      };
      setEntries([initialEntry]);
      localStorage.setItem('nutrigpt_progress', JSON.stringify([initialEntry]));
    }
  }, [profile]);

  const calculateBMI = (weight: number, heightCm: number) => {
    const heightM = heightCm / 100;
    return parseFloat((weight / (heightM * heightM)).toFixed(1));
  };

  const handleAddEntry = () => {
    if (!newWeight) return;

    const weightVal = parseFloat(newWeight);
    const waistVal = newWaist ? parseFloat(newWaist) : undefined;

    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weight: weightVal,
      waist: waistVal,
      bmi: calculateBMI(weightVal, profile.height)
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('nutrigpt_progress', JSON.stringify(updated));
    
    setNewWeight('');
    setNewWaist('');
    setShowForm(false);
    showToast("Progresso salvo com sucesso!");
    onUpdate(); // Callback opcional se precisar atualizar estado global
  };

  const latest = entries[0] || { weight: profile.currentWeight, bmi: 0 };
  const first = entries[entries.length - 1] || latest;
  const totalChange = latest.weight - first.weight;

  return (
    <div className="space-y-6 pb-20">
      
      {/* Cards Resumo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-semibold">Peso Atual</p>
          <h3 className="text-2xl font-bold text-primary-600">{latest.weight} <span className="text-sm text-gray-400">kg</span></h3>
          <p className={`text-xs font-medium ${totalChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalChange > 0 ? '+' : ''}{totalChange.toFixed(1)} kg total
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-semibold">IMC Atual</p>
          <h3 className="text-2xl font-bold text-blue-600">{latest.bmi}</h3>
          <p className="text-xs text-gray-400">
             {latest.bmi < 18.5 ? 'Abaixo' : latest.bmi < 25 ? 'Normal' : latest.bmi < 30 ? 'Sobrepeso' : 'Obesidade'}
          </p>
        </div>
      </div>

      {/* Ação Adicionar */}
      {!showForm ? (
        <Button fullWidth onClick={() => setShowForm(true)} variant="outline" className="border-dashed border-2">
           <Icons.Plus className="w-5 h-5 mr-2" /> Registrar Peso de Hoje
        </Button>
      ) : (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary-100 animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-3">Novo Registro</h3>
            <div className="flex gap-3 mb-4">
                <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Peso (kg)</label>
                    <input 
                        type="number" 
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="0.0"
                        autoFocus
                    />
                </div>
                <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Cintura (cm)</label>
                    <input 
                         type="number"
                         value={newWaist}
                         onChange={(e) => setNewWaist(e.target.value)}
                         className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                         placeholder="Opcional"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowForm(false)} className="flex-1">Cancelar</Button>
                <Button onClick={handleAddEntry} disabled={!newWeight} className="flex-1">Salvar</Button>
            </div>
        </div>
      )}

      {/* Histórico Visual */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
         <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Icons.ChartBar className="w-5 h-5 text-primary-500" /> Histórico
         </h3>
         
         <div className="space-y-4">
            {entries.map((entry, idx) => (
                <div key={entry.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div>
                        <p className="font-semibold text-gray-700">{entry.weight} kg</p>
                        <p className="text-xs text-gray-400">{new Date(entry.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-600">IMC {entry.bmi}</p>
                        {entry.waist && <p className="text-xs text-gray-400">Cintura: {entry.waist}cm</p>}
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};
