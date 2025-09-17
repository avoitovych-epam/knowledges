import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Helper to parse multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const group = formData.get('group') as string;

  if (!file || !group) {
    return NextResponse.json({ error: 'Missing file or group' }, { status: 400 });
  }

  // Read file as ArrayBuffer and convert to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Use the file name as title, or set your own logic
  const title = file.name;

  const sql = neon(process.env.DATABASE_URL!);
  await sql.query(
    'INSERT INTO pdf_files (title, "group", file) VALUES ($1, $2, $3)',
    [title, group, buffer]
  );

  return NextResponse.json({ status: 'File uploaded successfully' });
}