const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, "");

export async function forwardToBackend(request: Request, path: string) {
  if (!API_BASE_URL) {
    return Response.json(
      { message: "API_BASE_URL is not configured on the server." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "A valid JSON body is required." }, { status: 400 });
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "User-Agent": "Vellora Web Customer Portal",
  });
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
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
