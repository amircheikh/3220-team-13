import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

//This is pureley test code. You can reuse this for other routes
//All this does is take in a string for field1 and field2 and adds it to the TestTable on the db

//Access using: http://localhost:3000/api/test-db?field1=hello&field2=world  :  Obv replace 'hello' and 'world' with whatever you wanna add
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const field1 = searchParams.get('field1');
  const field2 = searchParams.get('field2');

  try {
    if (!field1 || !field2) throw new Error('Provide field1 and field2');
    await sql`INSERT INTO TestTable (Field1, Field2) VALUES (${field1}, ${field2});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const testTable = await sql`SELECT * FROM TestTable;`;
  return NextResponse.json({ testTable }, { status: 200 });
}
