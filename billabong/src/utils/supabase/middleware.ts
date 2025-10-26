import { NextResponse, type NextRequest } from 'next/server';
import { createLogger } from '@/shared/lib/logger';

import { createClient } from './server';

const logger = createLogger({
  prefix: '[MIDDLEWARE: SupabaseMiddleware]',
});

export const updateSession = async (request: NextRequest): Promise<NextResponse> => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.

  // Create an unmodified response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (request.nextUrl.pathname.startsWith('/api/integrations/shopify/generate-jwt')) {
    logger.debug('Handling server-to-server request for JWT generation...');
    const sharedSecret = request.headers.get('x-shared-secret');

    // If the secret is missing or incorrect, block the request immediately.
    if (sharedSecret !== process.env.LECXA_SHOPIFY_SHARED_SECRET) {
      logger.warn('Unauthorized attempt to access generate-jwt endpoint.');
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // The secret is valid. Allow the request to proceed to the API route.
    return NextResponse.next();
  }

  // --- FLOW 1: SHOPIFY EMBEDDED APP API VALIDATION ---
  // THis flow handles the case where the request is coming from a Shopify embedded app.
  // It verifies the Shopify session token and enriches the request with user information.
  // This is a security measure to ensure that only authenticated requests from Shopify can access the API.

  if (request.nextUrl.pathname.startsWith('/api/integrations/shopify-extension')) {
    throw new Error('Shopify embedded app flow not implemented yet.');
  }

  //For public routes, we don't need to authenticate
  if (request.nextUrl.pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  const supabase = await createClient();

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (request.nextUrl.pathname === '/' && !user) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // all good, let them through
  if (request.nextUrl.pathname === '/' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
};

// /**
//  * Verifies a Shopify session token.
//  * In a real application, this would use a library like `@shopify/shopify-api` or a JWT library
//  * to decode and cryptographically verify the token using your app's secret key.
//  * @param token - The JWT session token from the Authorization header.
//  * @returns A promise that resolves with the session payload if valid, otherwise null.
//  */
// async function verifyShopifySessionToken(token: string): Promise<{ active: boolean; dest: string; sub: string } | null> {
//   // --- PRODUCTION NOTE ---
//   // This is a mock verification. Replace this with actual JWT verification.
//   // Example using a JWT library:
//   // try {
//   //   const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET!);
//   //   return { active: true, dest: decoded.dest, sub: decoded.sub };
//   // } catch (error) {
//   //   return null;
//   // }

//   logger.debug("Verifying Shopify Session Token...");
//   if (token) {
//     // For demonstration, we assume a valid token and extract a mock shop domain.
//     // The 'dest' claim in a real token contains the shop URL (e.g., "https://your-store.myshopify.com").
//     return { active: true, dest: 'https://mock-shop.myshopify.com', sub: 'mock-user-id' };
//   }

//   return null;
// }
