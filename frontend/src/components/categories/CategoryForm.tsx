import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CategoryDTO } from '../../types/category.types';

const COLOR_PRESETS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1', '#14b8a6', '#e11d48',
];

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: CategoryDTO | null;
  onSubmit: (data: { name: string; type: 'income' | 'expense'; color: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      type: category?.type || 'expense',
      color: category?.color || '#3b82f6',
    },
  });

  useEffect(() => {
    if (category) {
      setValue('name', category.name);
      setValue('type', category.type);
      setValue('color', category.color);
    }
  }, [category, setValue]);

  const selectedColor = watch('color');

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="category-form">
      <div className="form-group">
        <label className="label" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          className={`input ${errors.name ? 'input-error' : ''}`}
          placeholder="e.g. Groceries, Salary"
          {...register('name')}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label className="label">Type</label>
        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn ${watch('type') === 'income' ? 'type-btn-active' : ''}`}
            onClick={() => setValue('type', 'income')}
          >
            Income
          </button>
          <button
            type="button"
            className={`type-btn ${watch('type') === 'expense' ? 'type-btn-active' : ''}`}
            onClick={() => setValue('type', 'expense')}
          >
            Expense
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="label">Color</label>
        <div className="color-picker">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-swatch ${selectedColor === color ? 'color-swatch-active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setValue('color', color)}
              title={color}
            />
          ))}
        </div>
        <div className="color-input-wrapper">
          <input
            type="text"
            className={`input ${errors.color ? 'input-error' : ''}`}
            placeholder="#3b82f6"
            {...register('color')}
          />
        </div>
        {errors.color && <p className="error-message">{errors.color.message}</p>}
      </div>

      <div className="category-form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
