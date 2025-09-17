import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const sql = neon(process.env.DATABASE_URL!);
  const id = params.id;

  // Fetch the file from the database
  const result = await sql.query('SELECT file FROM pdf_files WHERE id = $1', [id]);
  if (!result.length) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBuffer = result[0].file;

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="document.pdf"',
    },
  });
}
