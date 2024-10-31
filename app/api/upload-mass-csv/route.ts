import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { parseInteger, parseDate } from '../utils';

const csvFilePath = path.resolve('signals.csv'); // This is the path to the csv file that will be uploaded. Note: this file can be deleted after the endpoint runs since all the data will be stored on our database

// This endpoint was used to originally populate the MapMarkerData table from the csv file provided by the City of Toronto. We used the 'traffic signals' csv file since this has all 2000+ traffic signals in Toronto.
export async function GET() {
  // We want to disable the endpoint right now in order to prevent uploading duplicate data by accident
  console.error('This endpoint is disabled');
  NextResponse.json({ error: 'This endpoint is disabled' }, { status: 500 });
  return;

  const results: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const geometry = JSON.parse(row.geometry);
        const coordinates = JSON.stringify(geometry.coordinates);

        results.push({
          PX: parseInteger(row.PX),
          MAIN_STREET: row.MAIN_STREET,
          MIDBLOCK_ROUTE: row.MIDBLOCK_ROUTE,
          SIDE1_STREET: row.SIDE1_STREET,
          SIDE2_STREET: row.SIDE2_STREET,
          PRIVATE_ACCESS: row.PRIVATE_ACCESS,
          ADDITIONAL_INFO: row.ADDITIONAL_INFO,
          ACTIVATIONDATE: parseDate(row.ACTIVATIONDATE),
          SIGNALSYSTEM: row.SIGNALSYSTEM,
          NON_SYSTEM: row.NON_SYSTEM,
          CONTROL_MODE: row.CONTROL_MODE,
          PEDWALKSPEED: row.PEDWALKSPEED,
          APS_OPERATION: row.APS_OPERATION,
          NUMBEROFAPPROACHES: parseInteger(row.NUMBEROFAPPROACHES),
          OBJECTID: parseInteger(row.OBJECTID),
          GEO_ID: parseInteger(row.GEO_ID),
          NODE_ID: parseInteger(row.NODE_ID),
          AUDIBLEPEDSIGNAL: row.AUDIBLEPEDSIGNAL === '1',
          TRANSIT_PREEMPT: row.TRANSIT_PREEMPT === '1',
          FIRE_PREEMPT: row.FIRE_PREEMPT === '1',
          RAIL_PREEMPT: row.RAIL_PREEMPT === '1',
          MI_PRINX: parseInteger(row.MI_PRINX),
          BICYCLE_SIGNAL: row.BICYCLE_SIGNAL === '1',
          UPS: row.UPS === '1',
          LED_BLANKOUT_SIGN: row.LED_BLANKOUT_SIGN === '1',
          LPI_NORTH_IMPLEMENTATION_DATE: parseDate(row.LPI_NORTH_IMPLEMENTATION_DATE),
          LPI_SOUTH_IMPLEMENTATION_DATE: parseDate(row.LPI_SOUTH_IMPLEMENTATION_DATE),
          LPI_EAST_IMPLEMENTATION_DATE: parseDate(row.LPI_EAST_IMPLEMENTATION_DATE),
          LPI_WEST_IMPLEMENTATION_DATE: parseDate(row.LPI_WEST_IMPLEMENTATION_DATE),
          LPI_COMMENT: row.LPI_COMMENT,
          coordinates,
          isRedLightCamera: false,
          isUserAdded: false,
        });
      })
      .on('end', async () => {
        try {
          for (const row of results) {
            await sql`
              INSERT INTO MapMarkerData (
                PX, MAIN_STREET, MIDBLOCK_ROUTE, SIDE1_STREET, SIDE2_STREET, 
                PRIVATE_ACCESS, ADDITIONAL_INFO, ACTIVATIONDATE, SIGNALSYSTEM, NON_SYSTEM, CONTROL_MODE, 
                PEDWALKSPEED, APS_OPERATION, NUMBEROFAPPROACHES, OBJECTID, GEO_ID, NODE_ID, 
                AUDIBLEPEDSIGNAL, TRANSIT_PREEMPT, FIRE_PREEMPT, RAIL_PREEMPT, MI_PRINX, BICYCLE_SIGNAL, 
                UPS, LED_BLANKOUT_SIGN, LPI_NORTH_IMPLEMENTATION_DATE, LPI_SOUTH_IMPLEMENTATION_DATE, 
                LPI_EAST_IMPLEMENTATION_DATE, LPI_WEST_IMPLEMENTATION_DATE, LPI_COMMENT, coordinates, 
                isRedLightCamera, isUserAdded
              )
              VALUES (
                ${row.PX}, ${row.MAIN_STREET}, ${row.MIDBLOCK_ROUTE}, ${row.SIDE1_STREET}, 
                ${row.SIDE2_STREET}, ${row.PRIVATE_ACCESS}, ${row.ADDITIONAL_INFO}, ${row.ACTIVATIONDATE}, 
                ${row.SIGNALSYSTEM}, ${row.NON_SYSTEM}, ${row.CONTROL_MODE}, ${row.PEDWALKSPEED}, ${row.APS_OPERATION}, 
                ${row.NUMBEROFAPPROACHES}, ${row.OBJECTID}, ${row.GEO_ID}, ${row.NODE_ID}, 
                ${row.AUDIBLEPEDSIGNAL}, ${row.TRANSIT_PREEMPT}, ${row.FIRE_PREEMPT}, ${row.RAIL_PREEMPT}, 
                ${row.MI_PRINX}, ${row.BICYCLE_SIGNAL}, ${row.UPS}, ${row.LED_BLANKOUT_SIGN}, 
                ${row.LPI_NORTH_IMPLEMENTATION_DATE}, ${row.LPI_SOUTH_IMPLEMENTATION_DATE}, 
                ${row.LPI_EAST_IMPLEMENTATION_DATE}, ${row.LPI_WEST_IMPLEMENTATION_DATE}, 
                ${row.LPI_COMMENT}, ${row.coordinates}, ${row.isRedLightCamera}, ${row.isUserAdded}
              );
            `;
          }
          resolve(NextResponse.json({ message: 'Data inserted successfully' }));
        } catch (error) {
          console.error('Error inserting data:', error);
          reject(NextResponse.json({ error: 'Error inserting data' }, { status: 500 }));
        }
      });
  });
}
