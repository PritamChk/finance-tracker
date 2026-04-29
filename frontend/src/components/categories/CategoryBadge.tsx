import React from 'react';
import type { CategoryDTO } from '../../types/category.types';

interface CategoryBadgeProps {
  category: CategoryDTO;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <span
      className="category-badge"
      style={{ backgroundColor: `${category.color}20`, color: category.color, borderColor: category.color }}
    >
      {category.name}
    </span>
  );
};

export default CategoryBadge;
