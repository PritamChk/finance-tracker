import axios from 'axios';
import type { CategoryDTO, CreateCategoryData, UpdateCategoryData } from '../types/category.types';

const CATEGORIES_API_URL = import.meta.env.VITE_CATEGORIES_API_URL || 'http://localhost:8002';

const categoriesApi = axios.create({
  baseURL: CATEGORIES_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

categoriesApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const categoriesService = {
  async list(userId: number, type?: "income" | "expense"): Promise<CategoryDTO[]> {
    const params = new URLSearchParams({ user_id: String(userId) });
    if (type) params.append('category_type', type);
    const response = await categoriesApi.get<CategoryDTO[]>(`/api/categories?${params.toString()}`);
    return response.data;
  },

  async create(data: CreateCategoryData): Promise<CategoryDTO> {
    const response = await categoriesApi.post<CategoryDTO>('/api/categories', data);
    return response.data;
  },

  async getById(id: number): Promise<CategoryDTO> {
    const response = await categoriesApi.get<CategoryDTO>(`/api/categories/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateCategoryData): Promise<CategoryDTO> {
    const response = await categoriesApi.put<CategoryDTO>(`/api/categories/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await categoriesApi.delete(`/api/categories/${id}`);
  },
};

export default categoriesService;
