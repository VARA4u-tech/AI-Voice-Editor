import { NextResponse } from "next/server";

export function middleware(request: Request) {
  // Pass through all requests. CORS is now handled natively in next.config.mjs
  return NextResponse.next();
}
