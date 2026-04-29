import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoriesService from '../services/categories.service';
import type { CategoryDTO, CreateCategoryData, UpdateCategoryData } from '../types/category.types';

export function useCategories(userId: number, type?: "income" | "expense") {
  return useQuery<CategoryDTO[]>({
    queryKey: ['categories', userId, type],
    queryFn: () => categoriesService.list(userId, type),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategory(id: number) {
  return useQuery<CategoryDTO>({
    queryKey: ['category', id],
    queryFn: () => categoriesService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory(userId: number) {
  const queryClient = useQueryClient();
  return useMutation<CategoryDTO, Error, CreateCategoryData>({
    mutationFn: (data) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', userId] });
    },
  });
}

export function useUpdateCategory(userId: number) {
  const queryClient = useQueryClient();
  return useMutation<CategoryDTO, Error, { id: number; data: UpdateCategoryData }>({
    mutationFn: ({ id, data }) => categoriesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', userId] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
}

export function useDeleteCategory(userId: number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', userId] });
    },
  });
}
