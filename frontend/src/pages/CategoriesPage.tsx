import React, { useState } from 'react';
import type { CategoryDTO } from '../types/category.types';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';

const CategoriesPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const handleCreate = (data: { name: string; type: 'income' | 'expense'; color: string }) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setShowModal(false);
      },
    });
  };

  const handleUpdate = (data: { name: string; type: 'income' | 'expense'; color: string }) => {
    if (!editingCategory) return;
    updateMutation.mutate(
      { id: editingCategory.id, data: { name: data.name, type: data.type, color: data.color } },
      {
        onSuccess: () => {
          setShowModal(false);
          setEditingCategory(null);
        },
      }
    );
  };

  const handleEdit = (category: CategoryDTO) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteRequest = (id: number) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteConfirm = () => {
    if (showDeleteConfirm !== null) {
      deleteMutation.mutate(showDeleteConfirm, {
        onSuccess: () => {
          setShowDeleteConfirm(null);
        },
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1 className="categories-title">Manage Categories</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
        >
          + Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="category-loading">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : (
        <CategoryList
          categories={categories || []}
          filter={filter}
          onFilterChange={setFilter}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h2>
            <CategoryForm
              category={editingCategory}
              onSubmit={editingCategory ? handleUpdate : handleCreate}
              onCancel={handleCloseModal}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}

      {showDeleteConfirm !== null && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Delete Category</h2>
            <p className="modal-text">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="category-form-actions">
              <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
