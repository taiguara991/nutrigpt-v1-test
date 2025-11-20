
import React, { useState } from 'react';
import { Meal } from '../types';
import { Icons } from './Icons';

export const MealCard: React.FC<{ meal: Meal; title: string; icon: React.ReactNode }> = ({ meal, title, icon }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md mb-4">
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
                  <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full font-semibold">{meal.time || "00:00"}</span>
              </div>
              <p className="font-bold text-gray-900 leading-tight mt-0.5">{meal.name}</p>
            </div>
          </div>
          <div className="text-right pl-2">
            <p className="text-sm font-bold text-primary-600 whitespace-nowrap">{meal.calories} kcal</p>
            <Icons.ChevronRight className={`w-5 h-5 text-gray-400 transform transition-transform ml-auto mt-1 ${expanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
            <p className="text-gray-600 text-sm italic mb-3">{meal.description}</p>
            
            <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                <div className="bg-orange-50 p-2 rounded">
                    <span className="block font-bold text-orange-700">{meal.protein}g</span>
                    <span className="text-orange-600">Proteína</span>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                    <span className="block font-bold text-blue-700">{meal.carbs}g</span>
                    <span className="text-blue-600">Carbos</span>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                    <span className="block font-bold text-yellow-700">{meal.fats}g</span>
                    <span className="text-yellow-600">Gorduras</span>
                </div>
            </div>

            <div className="mb-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Ingredientes</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                    {meal.ingredients.map((ing, i) => (
                        <li key={i} className="flex justify-between">
                            <span>{ing.item}</span>
                            <span className="text-gray-500 font-medium">{ing.amount}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                <span className="font-semibold">Tempo de preparo:</span> {meal.preparationTime}
            </div>
        </div>
      )}
    </div>
  );
};
