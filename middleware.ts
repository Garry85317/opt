import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/((?!_next|api/auth).*)(.+)',
};
export async function middleware(req: NextRequest) {
  // Check Edge Config to see if the maintenance page should be shown
  const isInMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE;

  // If in maintenance mode, point the url pathname to the maintenance page
  if (isInMaintenanceMode === 'true') {
    req.nextUrl.pathname = '/maintenance';

    // Rewrite to the url
    return NextResponse.rewrite(req.nextUrl);
  }
  return NextResponse.next();
}
