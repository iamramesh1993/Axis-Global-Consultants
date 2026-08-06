import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllLeadsForExport, leadsToCsv } from "@/lib/leads-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    // 404 rather than 401: an unauthenticated caller learns nothing about
    // whether this endpoint exists.
    return new NextResponse("Not found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const rows = await getAllLeadsForExport({
    country: searchParams.get("country") || undefined,
    intake: searchParams.get("intake") || undefined,
    q: searchParams.get("q")?.trim() || undefined,
  });

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(leadsToCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="axis-leads-${stamp}.csv"`,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
