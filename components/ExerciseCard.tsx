import React, { useState } from 'react';
import { DailyPlan } from '../types';
import { Icons } from './Icons';

export const ExerciseCard: React.FC<{ workout: DailyPlan['workout'] }> = ({ workout }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
          <Icons.Dumbbell className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Treino do Dia</h2>
          <p className="text-sm text-gray-500">{workout.type} • {workout.duration}</p>
        </div>
      </div>

      <div className="space-y-4">
        {workout.exercises.map((ex, i) => (
            <div key={i} className="relative pl-4 border-l-2 border-blue-100 pb-4 last:pb-0">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{ex.name}</h4>
                <div className="flex gap-2 text-xs font-medium text-blue-600 mb-1">
                    <span className="bg-blue-50 px-2 py-0.5 rounded">{ex.sets} Séries</span>
                    <span className="bg-blue-50 px-2 py-0.5 rounded">{ex.reps} Reps</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{ex.instructions}</p>
            </div>
        ))}
      </div>
    </div>
  );
};