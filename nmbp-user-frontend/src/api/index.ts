import api from "./axiosConfig";

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: unknown;
  config: unknown;
  request?: unknown;
}

export const get = async <T>(
  url: string,
  config = {},
): Promise<ApiResponse<T>> => {
  const response = await api.get<T>(url, config);
  return response;
};

export const post = async <T>(
  url: string,
  data: unknown,
  config = {},
): Promise<ApiResponse<T>> => {
  const response = await api.post<T>(url, data, config);
  return response;
};

export const put = async <T>(
  url: string,
  data: unknown,
  config = {},
): Promise<ApiResponse<T>> => {
  const response = await api.put<T>(url, data, config);
  return response;
};

export const del = async <T>(
  url: string,
  config = {},
): Promise<ApiResponse<T>> => {
  const response = await api.delete<T>(url, config);
  return response;
};

export const patch = async <T>(
  url: string,
  data: unknown,
  config = {},
): Promise<ApiResponse<T>> => {
  const response = await api.patch<T>(url, data, config);
  return response;
};
