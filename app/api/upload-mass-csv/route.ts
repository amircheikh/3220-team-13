import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { parseInteger, parseDate } from '../utils';
import { MapMarkerData } from '../types';

const csvFilePath = path.resolve('signals.csv');

export async function GET(): Promise<Response> {
  console.error('This endpoint is disabled');
  return NextResponse.json({ error: 'This endpoint is disabled' }, { status: 500 });

  const results: MapMarkerData[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const geometry = JSON.parse(row.geometry);
        const coordinates = JSON.stringify(geometry.coordinates);

        results.push({
          px: parseInteger(row.px),
          main_street: row.main_street,
          midblock_route: row.midblock_route,
          side1_street: row.side1_street,
          side2_street: row.side2_street,
          private_access: row.private_access,
          additional_info: row.additional_info,
          activationdate: parseDate(row.activationdate),
          signalsystem: row.signalsystem,
          non_system: row.non_system,
          control_mode: row.control_mode,
          pedwalkspeed: row.pedwalkspeed,
          aps_operation: row.aps_operation,
          numberofapproaches: parseInteger(row.numberofapproaches),
          objectid: parseInteger(row.objectid),
          geo_id: parseInteger(row.geo_id),
          node_id: parseInteger(row.node_id),
          audiblepedsignal: row.audiblepedsignal === '1',
          transit_preempt: row.transit_preempt === '1',
          fire_preempt: row.fire_preempt === '1',
          rail_preempt: row.rail_preempt === '1',
          mi_prinx: parseInteger(row.mi_prinx),
          bicycle_signal: row.bicycle_signal === '1',
          ups: row.ups === '1',
          led_blankout_sign: row.led_blankout_sign === '1',
          lpi_north_implementation_date: parseDate(row.lpi_north_implementation_date),
          lpi_south_implementation_date: parseDate(row.lpi_south_implementation_date),
          lpi_east_implementation_date: parseDate(row.lpi_east_implementation_date),
          lpi_west_implementation_date: parseDate(row.lpi_west_implementation_date),
          lpi_comment: row.lpi_comment,
          coordinates,
          isredlightcamera: false,
          isuseradded: false,
        });
      })
      .on('end', async () => {
        try {
          for (const row of results) {
            await sql`
              INSERT INTO MapMarkerData (
                px, main_street, midblock_route, side1_street, side2_street, 
                private_access, additional_info, activationdate, signalsystem, non_system, control_mode, 
                pedwalkspeed, aps_operation, numberofapproaches, objectid, geo_id, node_id, 
                audiblepedsignal, transit_preempt, fire_preempt, rail_preempt, mi_prinx, bicycle_signal, 
                ups, led_blankout_sign, lpi_north_implementation_date, lpi_south_implementation_date, 
                lpi_east_implementation_date, lpi_west_implementation_date, lpi_comment, coordinates, 
                isredlightcamera, isuseradded
              )
              VALUES (
                ${row.px}, ${row.main_street}, ${row.midblock_route}, ${row.side1_street}, 
                ${row.side2_street}, ${row.private_access}, ${row.additional_info}, ${row.activationdate as any}, 
                ${row.signalsystem}, ${row.non_system}, ${row.control_mode}, ${row.pedwalkspeed}, ${row.aps_operation}, 
                ${row.numberofapproaches}, ${row.objectid}, ${row.geo_id}, ${row.node_id}, 
                ${row.audiblepedsignal}, ${row.transit_preempt}, ${row.fire_preempt}, ${row.rail_preempt}, 
                ${row.mi_prinx}, ${row.bicycle_signal}, ${row.ups}, ${row.led_blankout_sign}, 
                ${row.lpi_north_implementation_date as any}, ${row.lpi_south_implementation_date as any}, 
                ${row.lpi_east_implementation_date as any}, ${row.lpi_west_implementation_date as any}, 
                ${row.lpi_comment}, ${row.coordinates}, ${row.isredlightcamera}, ${row.isuseradded}
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
