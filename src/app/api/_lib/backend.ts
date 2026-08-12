const API_BASE_URL = (
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL
)?.replace(/\/$/, "");

export async function forwardToBackend(request: Request, path: string) {
  if (!API_BASE_URL) {
    return Response.json(
      { message: "API_BASE_URL or NEXT_PUBLIC_API_BASE_URL is not configured on the server." },
      { status: 500 },
    );
  }

  const headers = new Headers({
    "User-Agent": "Vellora Web Customer Portal",
  });
  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("Cookie", cookie);
  const zoneId = request.headers.get("x-zone-id");
  if (zoneId) headers.set("x-zone-id", zoneId);

  const isBodyRequest = request.method !== "GET" && request.method !== "HEAD";
  let body: string | undefined;
  if (isBodyRequest) {
    // DELETE (and sometimes PUT/PATCH) legitimately send no body at all —
    // e.g. DELETE /cart/items/{id} deletes by path, nothing to parse. Only
    // treat it as an error when something was actually sent but isn't valid
    // JSON; an empty body just forwards through with none.
    const rawBody = await request.text();
    if (rawBody) {
      try {
        JSON.parse(rawBody);
        body = rawBody;
        headers.set("Content-Type", "application/json");
      } catch {
        return Response.json({ message: "A valid JSON body is required." }, { status: 400 });
      }
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

    const responseHeaders = new Headers({
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    });
    const setCookies = response.headers.getSetCookie?.() ?? [];
    for (const setCookie of setCookies) {
      responseHeaders.append("Set-Cookie", setCookie);
    }

    return new Response(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { message: "Unable to reach the authentication service." },
      { status: 502 },
    );
  }
}
