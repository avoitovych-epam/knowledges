import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!);
  // Query for all unique groups
  const result = await sql.query('SELECT DISTINCT "group" FROM pdf_files');
  // Extract group names into an array
  const groups = result.map((row: Record<string, any>) => row.group);
  return NextResponse.json(groups);
}