import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  const sql = neon(process.env.DATABASE_URL!);

  // Parse the request body to get the array of ids
  const { ids } = await request.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No ids provided' }, { status: 400 });
  }

  // Build the parameterized query for bulk delete
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
  await sql.query(`DELETE FROM pdf_files WHERE id IN (${placeholders})`, ids);

  return NextResponse.json({ status: 'bulk deleted', count: ids.length });
}
