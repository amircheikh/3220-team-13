import { QueryResultRow, sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    let response: QueryResultRow;
    if(id) response = await sql`DELETE FROM mapmarkerdata WHERE id=${parseInt(id)};`
    else throw Error('Field: id must be provided')

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
