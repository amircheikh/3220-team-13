import { QueryResultRow, sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = searchParams.get('count');

  try {
    let response: QueryResultRow[];
    if (count) response = (await sql`SELECT * FROM MapMarkerData LIMIT ${parseInt(count)} ORDER BY id;`).rows;
    else response = (await sql`SELECT * FROM MapMarkerData ORDER BY id;`).rows;

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
