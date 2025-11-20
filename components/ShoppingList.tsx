import React, { useState } from 'react';
import { Ingredient } from '../types';
import { Icons } from './Icons';

interface ShoppingListProps {
  items: Ingredient[];
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
          <Icons.ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Lista de Compras</h2>
          <p className="text-sm text-gray-500">Para o plano de hoje</p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div 
            key={index} 
            onClick={() => toggleItem(index)}
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                checkedItems[index] 
                ? 'bg-gray-50 border-gray-100 opacity-50' 
                : 'bg-white border-gray-100 hover:border-primary-200'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-colors ${
                checkedItems[index] ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
            }`}>
                {checkedItems[index] && <Icons.Check className="w-3 h-3 text-white" />}
            </div>
            <div className="flex-1 flex justify-between">
                <span className={`text-sm ${checkedItems[index] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {item.item}
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.amount}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};