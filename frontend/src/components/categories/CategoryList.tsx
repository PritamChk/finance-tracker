import React from 'react';
import type { CategoryDTO } from '../../types/category.types';
import CategoryCard from './CategoryCard';

interface CategoryListProps {
  categories: CategoryDTO[];
  filter: "all" | "income" | "expense";
  onFilterChange: (filter: "all" | "income" | "expense") => void;
  onEdit: (category: CategoryDTO) => void;
  onDelete: (id: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  filter,
  onFilterChange,
  onEdit,
  onDelete,
}) => {
  const filtered = filter === 'all'
    ? categories
    : categories.filter((c) => c.type === filter);

  return (
    <div>
      <div className="category-filters">
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button
            key={f}
            className={`category-filter-btn ${filter === f ? 'category-filter-btn-active' : ''}`}
            onClick={() => onFilterChange(f)}
          >
            {f === 'all' ? 'All' : f === 'income' ? 'Income' : 'Expense'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="category-empty">
          <p>No categories found.</p>
          <p className="category-empty-subtext">Click "Add Category" to create your first one.</p>
        </div>
      ) : (
        <div className="category-grid">
          {filtered.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
