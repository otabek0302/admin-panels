interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryRequest {
  name: string;
}

interface CategoryResponse {
  categories: Category[];
  total: number;
}

export type { Category, CategoryRequest, CategoryResponse };