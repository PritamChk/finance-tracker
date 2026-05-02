export interface CategoryDTO {
  id: number;
  name: string;
  type: "income" | "expense";
  color: string;
  user_id: number;
  created_at: string;
}

export interface CreateCategoryData {
  name: string;
  type: "income" | "expense";
  color: string;
}

export interface UpdateCategoryData {
  name?: string;
  type?: "income" | "expense";
  color?: string;
}
