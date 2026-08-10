import { API_V1_URL, ApiClient } from "./apiClient";

/** Client scoped to the authentication API. */
// Auth endpoints issue and require a server session cookie in addition to tokens.
export const authClient = new ApiClient(`${API_V1_URL}/auth`, true);
