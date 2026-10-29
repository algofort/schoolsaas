export function GET() {
  // Liveness only. This deliberately does not claim database/integration readiness.
  return Response.json({ status: "ok", service: "school-management-system", mode: "foundation" });
}
