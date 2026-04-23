import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/info", request.url), 307);
}

export const config = {
  matcher: [
    "/((?!info|thank-you|_next/|images/|fonts/|robots\\.txt|favicon\\.ico|pardot-form-styles\\.css).*)",
  ],
};
