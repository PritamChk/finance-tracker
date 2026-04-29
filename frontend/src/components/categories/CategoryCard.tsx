import React from 'react';
import type { CategoryDTO } from '../../types/category.types';
import CategoryBadge from './CategoryBadge';

interface CategoryCardProps {
  category: CategoryDTO;
  onEdit: (category: CategoryDTO) => void;
  onDelete: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="category-card">
      <div className="category-card-color" style={{ backgroundColor: category.color }} />
      <div className="category-card-body">
        <CategoryBadge category={category} />
        <span className={`category-card-type ${category.type === 'income' ? 'type-income' : 'type-expense'}`}>
          {category.type === 'income' ? 'Income' : 'Expense'}
        </span>
      </div>
      <div className="category-card-actions">
        <button className="btn-icon" onClick={() => onEdit(category)} title="Edit">✏️</button>
        <button className="btn-icon btn-icon-danger" onClick={() => onDelete(category.id)} title="Delete">🗑️</button>
      </div>
    </div>
  );
};

export default CategoryCard;
