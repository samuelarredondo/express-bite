import React from 'react';
import { ProductCategory } from '../../../core/domain/types';

interface CategoryFiltersProps {
  activeCategory: ProductCategory | 'todos';
  onSelectCategory: (category: ProductCategory | 'todos') => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  activeCategory,
  onSelectCategory
}) => {
  const categories: Array<{ id: ProductCategory | 'todos'; label: string }> = [
    { id: 'todos', label: 'Todos' },
    { id: 'comida', label: 'Comidas' },
    { id: 'bebida', label: 'Bebidas' },
    { id: 'snacks', label: 'Snacks' }
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
      {categories.map(cat => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
