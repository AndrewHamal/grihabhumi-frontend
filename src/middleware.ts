import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (token) {
        const responseMain = NextResponse.next()
        return responseMain;
    }

    return NextResponse.redirect(new URL('/?login=true', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard', '/account/(.*)'],
}