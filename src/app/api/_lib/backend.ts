const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, "");

export async function forwardToBackend(request: Request, path: string) {
  if (!API_BASE_URL) {
    return Response.json(
      { message: "API_BASE_URL is not configured on the server." },
      { status: 500 },
    );
  }

  const headers = new Headers({
    "User-Agent": "Vellora Web Customer Portal",
  });
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);
  const zoneId = request.headers.get("x-zone-id");
  if (zoneId) headers.set("x-zone-id", zoneId);

  const isBodyRequest = request.method !== "GET" && request.method !== "HEAD";
  let body: string | undefined;
  if (isBodyRequest) {
    try {
      body = JSON.stringify(await request.json());
      headers.set("Content-Type", "application/json");
    } catch {
      return Response.json({ message: "A valid JSON body is required." }, { status: 400 });
    }
  }

  const search = new URL(request.url).search;

  try {
    const response = await fetch(`${API_BASE_URL}${path}${search}`, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return Response.json(
      { message: "Unable to reach the authentication service." },
      { status: 502 },
    );
  }
}
