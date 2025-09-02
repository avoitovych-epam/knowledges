import { NextResponse } from 'next/server';
import { createPdfTable } from '../../lib/data';

export async function GET() {
  await createPdfTable();
  return NextResponse.json({ status: 'Table created or already exists.' });
}
