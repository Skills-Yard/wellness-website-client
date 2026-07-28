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

  async get<T>(path: string, config?: ApiRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(path, this.buildConfig(config));
      return response.data;
    } catch (error) {
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
      this.handleError(error);
    }
  }

  async delete<T>(path: string, config?: ApiRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(path, this.buildConfig(config));

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const apiClient = new ApiClient();
