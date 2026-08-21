import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

// Use the same-origin Next.js proxy so browsers never call the backend cross-origin.
export const API_V1_URL = "/api/v1";

type ApiError = {
  message?: string;
  error?: {
    message?: string;
  };
};

/** Options shared by every request made through the application's API client. */
export type ApiRequestConfig = AxiosRequestConfig & {
  accessToken?: string;
};

type RetryableRequestConfig = AxiosRequestConfig & { _retriedAfterRefresh?: boolean };

let refreshRequest: Promise<string | null> | null = null;

const getAuthorizationHeader = (headers: AxiosRequestConfig["headers"]) => {
  if (!headers) return undefined;
  if (typeof (headers as { get?: (name: string) => string | undefined }).get === "function") {
    return (headers as { get: (name: string) => string | undefined }).get("Authorization");
  }
  return (headers as Record<string, string | undefined>).Authorization;
};

const refreshAccessToken = async () => {
  if (typeof window === "undefined") return null;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  if (!refreshRequest) {
    refreshRequest = axios
      .post<{ data?: { accessToken?: string; refreshToken?: string } }>(
        "/api/v1/auth/refresh",
        { refreshToken },
        { withCredentials: true },
      )
      .then((response) => {
        const tokens = response.data.data;
        if (!tokens?.accessToken) return null;

        localStorage.setItem("accessToken", tokens.accessToken);
        if (tokens.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
        return tokens.accessToken;
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("isUserLoggedIn");
        return null;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly response: unknown,
  ) {
    const error = response as ApiError | null;

    super(
      error?.error?.message ??
        error?.message ??
        "Request failed. Please try again.",
    );

    this.name = "ApiClientError";
  }
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL = API_V1_URL, withCredentials = false) {
    this.client = axios.create({
      baseURL,
      withCredentials,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      },
    });
  }

  private buildConfig(config?: ApiRequestConfig): AxiosRequestConfig {
    const { accessToken, headers, ...requestConfig } = config ?? {};

    return {
      ...requestConfig,
      headers: {
        ...headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    };
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      throw new ApiClientError(
        axiosError.response?.status ?? 500,
        axiosError.response?.data,
      );
    }

    throw error;
  }

  private async retryAfterRefresh<T>(error: unknown): Promise<T | null> {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) return null;

    const request = error.config as RetryableRequestConfig | undefined;
    if (!request || request._retriedAfterRefresh || request.url?.endsWith("/refresh")) return null;
    if (!getAuthorizationHeader(request.headers)) return null;

    const accessToken = await refreshAccessToken();
    if (!accessToken) return null;

    request._retriedAfterRefresh = true;
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await this.client.request<T>(request);
    return response.data;
  }

  async get<T>(path: string, config?: ApiRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(path, this.buildConfig(config));
      return response.data;
    } catch (error) {
      const response = await this.retryAfterRefresh<T>(error);
      if (response) return response;
      this.handleError(error);
    }
  }

  async post<TBody, TResponse>(
    path: string,
    body: TBody,
    config?: ApiRequestConfig,
  ): Promise<TResponse> {
    try {
      const response = await this.client.post<TResponse>(path, body, this.buildConfig(config));

      return response.data;
    } catch (error) {
      const response = await this.retryAfterRefresh<TResponse>(error);
      if (response) return response;
      this.handleError(error);
    }
  }

  async put<TBody, TResponse>(
    path: string,
    body: TBody,
    config?: ApiRequestConfig,
  ): Promise<TResponse> {
    try {
      const response = await this.client.put<TResponse>(path, body, this.buildConfig(config));

      return response.data;
    } catch (error) {
      const response = await this.retryAfterRefresh<TResponse>(error);
      if (response) return response;
      this.handleError(error);
    }
  }

  async patch<TBody, TResponse>(
    path: string,
    body: TBody,
    config?: ApiRequestConfig,
  ): Promise<TResponse> {
    try {
      const response = await this.client.patch<TResponse>(path, body, this.buildConfig(config));

      return response.data;
    } catch (error) {
      const response = await this.retryAfterRefresh<TResponse>(error);
      if (response) return response;
      this.handleError(error);
    }
  }

  async delete<T>(path: string, config?: ApiRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(path, this.buildConfig(config));

      return response.data;
    } catch (error) {
      const response = await this.retryAfterRefresh<T>(error);
      if (response) return response;
      this.handleError(error);
    }
  }
}

export const apiClient = new ApiClient();

// The backend now paginates every list endpoint (default 20/page, 100 max)
// instead of returning everything in one call — see wellness-backend's
// PaginationQueryDto. Screens here still expect a complete array (e.g.
// useBookings, useServiceItems just take `.data` and render/filter it
// as-is), so this walks every backend page and concatenates: same
// "give me everything" contract they were built against, correct as a
// resource grows past one page instead of silently truncating at 20.
export async function fetchAllPaginated<TItem>(
  fetchPage: (page: number, limit: number) => Promise<{ data?: TItem[] | null; pagination?: { totalPages: number } }>,
  limit = 100,
): Promise<TItem[]> {
  const first = await fetchPage(1, limit);
  const items = [...(first.data ?? [])];
  const totalPages = first.pagination?.totalPages ?? 1;
  for (let page = 2; page <= totalPages; page++) {
    const next = await fetchPage(page, limit);
    items.push(...(next.data ?? []));
  }
  return items;
}
