import { NextRequest, NextResponse } from 'next/server';

/**
 * Detects whether the incoming request is from a mobile or tablet device
 * by inspecting the User-Agent string.
 */
function isMobileOrTablet(userAgent: string): boolean {
  const mobileRegex =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|kindle|silk|playbook/i;
  return mobileRegex.test(userAgent);
}

/**
 * Middleware config: only run on /admin/* and /teacher/* routes.
 */
export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*'],
};

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  if (isMobileOrTablet(userAgent)) {
    // Redirect to the desktop-only notice page, preserving the attempted path
    const url = request.nextUrl.clone();
    url.pathname = '/desktop-only';
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
