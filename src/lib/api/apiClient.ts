import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const API_V1_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1`;
console.log("ENV URL: ", process.env.NEXT_PUBLIC_API_BASE_URL);

type ApiError = {
  message?: string;
  error?: {
    message?: string;
  };
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

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_V1_URL,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      },
    });
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

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<TBody, TResponse>(
    url: string,
    body: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const response = await this.client.post<TResponse>(url, body, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<TBody, TResponse>(
    url: string,
    body: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const response = await this.client.put<TResponse>(url, body, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch<TBody, TResponse>(
    url: string,
    body: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    try {
      const response = await this.client.patch<TResponse>(url, body, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const apiClient = new ApiClient();
