const API_V1_URL = "/api/v1";

export type ApiSuccess<TData> = {
  success: true;
  data: TData;
};

type ApiError = {
  message?: string;
  error?: { message?: string };
};

export class AuthClientError extends Error {
  constructor(public readonly status: number, public readonly response: unknown) {
    const error = response as ApiError | null;
    super(error?.error?.message ?? error?.message ?? "Request failed. Please try again.");
    this.name = "AuthClientError";
  }
}

type RequestOptions = {
  accessToken?: string;
};

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new AuthClientError(response.status, body);
  return body as TResponse;
}

class AuthClient {
  async get<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
    const response = await fetch(`${API_V1_URL}${path}`, {
      headers: options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : undefined,
    });
    return parseResponse<TResponse>(response);
  }

  async post<TBody, TResponse>(
    path: string,
    body: TBody,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    const response = await fetch(`${API_V1_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return parseResponse<TResponse>(response);
  }
}

export const authClient = new AuthClient();

export type OtpRequestBody = {
  countryCode: string;
  phone: string;
};

export type OtpRequestResponse = ApiSuccess<{ requestId?: string }>;

export type OtpVerifyBody = OtpRequestBody & {
  code: string;
  clientId: string;
  fcmToken: string;
  deviceType: "WEB";
  deviceName: string;
};

export type OtpVerifyResponse = ApiSuccess<{ signupToken: string }>;

export type CreateUserBody = {
  countryCode: string;
  name: string;
  email: string;
  profilePhotoKey: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
};

export type CreateUserResponse = ApiSuccess<{
  tokens: {
    accessToken: string;
    refreshToken?: string;
  };
}>;
