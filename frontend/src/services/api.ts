const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ApiResponse<T> {
  data: T;
  status: number;
}

interface ApiError {
  message: string;
  status: number;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.detail || errorData.message || "Request failed",
        status: res.status,
      };
      throw error;
    }

    const data = await res.json();
    return { data: data as T, status: res.status };
  } catch (err) {
    if ((err as ApiError).status) {
      throw err;
    }
    throw {
      message: "Network error. Please try again.",
      status: 0,
    } as ApiError;
  }
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  return request<T>("GET", path);
}

export async function apiPost<T>(
  path: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return request<T>("POST", path, body);
}

export async function apiPut<T>(
  path: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return request<T>("PUT", path, body);
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  return request<T>("DELETE", path);
}
