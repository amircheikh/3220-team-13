import { QueryResultRow, sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = searchParams.get('count');

  try {
    let response: QueryResultRow[]; 

    /*
    We want to return the table's contents in decending order. 
    This is because adding a marker adds it to the END of the table.
    If we show the last 300 markers by default, users will see the marker update right away when adding one.
    */

    if (count) response = (await sql`SELECT * FROM MapMarkerData LIMIT ${parseInt(count)} ORDER BY id DESC;`).rows;
    else response = (await sql`SELECT * FROM MapMarkerData ORDER BY id DESC;`).rows;

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
