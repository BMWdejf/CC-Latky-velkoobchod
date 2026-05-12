import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

type HandlerCtx = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, ctx: HandlerCtx) {
  return auth.handler().GET(request, ctx);
}

export async function POST(request: NextRequest, ctx: HandlerCtx) {
  return auth.handler().POST(request, ctx);
}
