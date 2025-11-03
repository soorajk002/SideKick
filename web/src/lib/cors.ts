import { NextResponse } from 'next/server'

/**
 * CORS configuration for API routes
 * Allows the Zoom app to make requests to the web dashboard API
 */
export function corsHeaders(origin?: string | null) {
  // Allow requests from Zoom app domains and any Vercel preview deployments
  const allowedOrigins = [
    'https://side-kick-frontend-v5cy.vercel.app',
    'https://applications.zoom.us',
    'https://zoom.us',
    /https:\/\/.*\.vercel\.app$/,
  ]

  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins for now
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }

  return headers
}

/**
 * Handle OPTIONS preflight request
 */
export function handleCorsOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  })
}

/**
 * Wrap a response with CORS headers
 */
export function corsResponse(data: any, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...corsHeaders(),
      ...(init?.headers || {}),
    },
  })
}
