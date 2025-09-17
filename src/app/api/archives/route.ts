import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '5', 10);
  const group = searchParams.get('group');
  const search = searchParams.get('search');

  const sql = neon(process.env.DATABASE_URL!);

  // Build query parts
  let where = [];
  let values: any[] = [];
  let idx = 1;

  if (group) {
    where.push(`"group" = $${idx++}`);
    values.push(group);
  }
  if (search) {
    where.push(`title ILIKE $${idx++}`);
    values.push(`%${search}%`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  // Get total count for pagination
  const countResult = await sql.query(
    `SELECT COUNT(*) FROM pdf_files ${whereClause}`,
    values
  );
  const totalCount = parseInt(countResult[0].count, 10);
  const totalPages = Math.ceil(totalCount / size);

  // Get paginated results
  const offset = page * size;
  const docsResult = await sql.query(
    `SELECT id, title, "group", created_at FROM pdf_files ${whereClause} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx}`,
    [...values, size, offset]
  );

  // Add fileUrl if you have a download endpoint, otherwise just return metadata
  const archivesWithUrl = docsResult.map((doc: any) => ({
    ...doc,
    fileUrl: `/api/archives/${doc.id}/download`,
  }));

  return NextResponse.json({
    archivesWithUrl,
    totalPages,
  });
}
