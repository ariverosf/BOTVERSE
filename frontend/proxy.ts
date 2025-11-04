import { NextResponse, type NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value || '';

  if (accessToken && ["/auth/login", "/auth/register"].includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const isProtectedRoute = !pathname.startsWith('/auth') && !pathname.startsWith('/public')
  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|api).*)',
}