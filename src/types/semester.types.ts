import { PaginationMeta } from "./api.types";


export type SemesterSortBy = "newest" | "oldest" | "year_asc" | "year_desc";

export interface SemesterItem {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetSemestersQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  year?: number;
  sortBy?: SemesterSortBy;
}

export interface CreateSemesterPayload {
  name: string;
  year: number;
  startDate: string;
  endDate: string;
}

export interface UpdateSemesterPayload {
  name?: string;
  year?: number;
  startDate?: string;
  endDate?: string;
}

export interface SemestersApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMeta;
  data: SemesterItem[];
}

export interface SingleSemesterApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SemesterItem;
}
