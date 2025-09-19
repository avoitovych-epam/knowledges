import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function DELETE(request: Request) {
  // Extract id from the URL
  const { pathname } = new URL(request.url);
  const parts = pathname.split('/');
  const id = parts[parts.length - 1];

  const sql = neon(process.env.DATABASE_URL!);

  // Delete the document by id
  await sql.query('DELETE FROM pdf_files WHERE id = $1', [id]);

  return NextResponse.json({ status: 'deleted' });
}
