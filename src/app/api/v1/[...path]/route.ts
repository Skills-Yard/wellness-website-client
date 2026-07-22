import { forwardToBackend } from "@/src/app/api/_lib/backend";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const backendPath = `/api/v1/${path.map(encodeURIComponent).join("/")}`;
  return forwardToBackend(request, backendPath);
}
