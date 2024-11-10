import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { parseInteger, parseDate } from '../utils';
import { MapMarkerData } from '../types';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const markerData: Partial<MapMarkerData> = {
      px: parseInteger(data.px),
      main_street: data.main_street,
      midblock_route: data.midblock_route,
      side1_street: data.side1_street,
      side2_street: data.side2_street,
      private_access: data.private_access,
      additional_info: data.additional_info,
      activationdate: parseDate(data.activationdate),
      signalsystem: data.signalsystem,
      non_system: data.non_system,
      control_mode: data.control_mode,
      pedwalkspeed: data.pedwalkspeed,
      aps_operation: data.aps_operation,
      numberofapproaches: parseInteger(data.numberofapproaches),
      objectid: parseInteger(data.objectid),
      geo_id: parseInteger(data.geo_id),
      node_id: parseInteger(data.node_id),
      audiblepedsignal: data.audiblepedsignal || false,
      transit_preempt: data.transit_preempt || false,
      fire_preempt: data.fire_preempt || false,
      rail_preempt: data.rail_preempt || false,
      mi_prinx: parseInteger(data.mi_prinx),
      bicycle_signal: data.bicycle_signal || false,
      ups: data.ups || false,
      led_blankout_sign: data.led_blankout_sign || false,
      lpi_north_implementation_date: parseDate(data.lpi_north_implementation_date),
      lpi_south_implementation_date: parseDate(data.lpi_south_implementation_date),
      lpi_east_implementation_date: parseDate(data.lpi_east_implementation_date),
      lpi_west_implementation_date: parseDate(data.lpi_west_implementation_date),
      lpi_comment: data.lpi_comment,
      coordinates: `[[${data.coordinates[0][0]}, ${data.coordinates[0][1]}]]`, //(see comment in /app/api/types.ts)
      isredlightcamera: data.isredlightcamera || false,
      isuseradded: data.isuseradded || false,
    };

    if (data.id) {
      // Update existing marker if an ID is provided
      await sql`
        UPDATE mapmarkerdata
        SET
          px = ${markerData.px},
          main_street = ${markerData.main_street},
          midblock_route = ${markerData.midblock_route},
          side1_street = ${markerData.side1_street},
          side2_street = ${markerData.side2_street},
          private_access = ${markerData.private_access},
          additional_info = ${markerData.additional_info},
          activationdate = ${markerData.activationdate as any},
          signalsystem = ${markerData.signalsystem},
          non_system = ${markerData.non_system},
          control_mode = ${markerData.control_mode},
          pedwalkspeed = ${markerData.pedwalkspeed},
          aps_operation = ${markerData.aps_operation},
          numberofapproaches = ${markerData.numberofapproaches},
          objectid = ${markerData.objectid},
          geo_id = ${markerData.geo_id},
          node_id = ${markerData.node_id},
          audiblepedsignal = ${markerData.audiblepedsignal},
          transit_preempt = ${markerData.transit_preempt},
          fire_preempt = ${markerData.fire_preempt},
          rail_preempt = ${markerData.rail_preempt},
          mi_prinx = ${markerData.mi_prinx},
          bicycle_signal = ${markerData.bicycle_signal},
          ups = ${markerData.ups},
          led_blankout_sign = ${markerData.led_blankout_sign},
          lpi_north_implementation_date = ${markerData.lpi_north_implementation_date as any},
          lpi_south_implementation_date = ${markerData.lpi_south_implementation_date as any},
          lpi_east_implementation_date = ${markerData.lpi_east_implementation_date as any},
          lpi_west_implementation_date = ${markerData.lpi_west_implementation_date as any},
          lpi_comment = ${markerData.lpi_comment},
          coordinates = ${markerData.coordinates},
          isredlightcamera = ${markerData.isredlightcamera},
          isuseradded = ${markerData.isuseradded}
        WHERE id = ${data.id};
      `;
      return NextResponse.json({ message: 'Marker updated successfully' });
    } else {
      // Insert new marker if no ID is provided
      await sql`
        INSERT INTO mapmarkerdata (
          px, main_street, midblock_route, side1_street, side2_street, 
          private_access, additional_info, activationdate, signalsystem, non_system, control_mode, 
          pedwalkspeed, aps_operation, numberofapproaches, objectid, geo_id, node_id, 
          audiblepedsignal, transit_preempt, fire_preempt, rail_preempt, mi_prinx, bicycle_signal, 
          ups, led_blankout_sign, lpi_north_implementation_date, lpi_south_implementation_date, 
          lpi_east_implementation_date, lpi_west_implementation_date, lpi_comment, coordinates, 
          isredlightcamera, isuseradded
        )
        VALUES (
          ${markerData.px}, ${markerData.main_street}, ${markerData.midblock_route}, ${markerData.side1_street}, 
          ${markerData.side2_street}, ${markerData.private_access}, ${markerData.additional_info}, 
          ${markerData.activationdate as any}, ${markerData.signalsystem}, ${markerData.non_system}, 
          ${markerData.control_mode}, ${markerData.pedwalkspeed}, ${markerData.aps_operation}, 
          ${markerData.numberofapproaches}, ${markerData.objectid}, ${markerData.geo_id}, ${markerData.node_id}, 
          ${markerData.audiblepedsignal}, ${markerData.transit_preempt}, ${markerData.fire_preempt}, 
          ${markerData.rail_preempt}, ${markerData.mi_prinx}, ${markerData.bicycle_signal}, 
          ${markerData.ups}, ${markerData.led_blankout_sign}, 
          ${markerData.lpi_north_implementation_date as any}, ${markerData.lpi_south_implementation_date as any}, 
          ${markerData.lpi_east_implementation_date as any}, ${markerData.lpi_west_implementation_date as any}, 
          ${markerData.lpi_comment}, ${markerData.coordinates}, ${markerData.isredlightcamera}, ${
        markerData.isuseradded
      }
        );
      `;
      return NextResponse.json({ message: 'New marker inserted successfully' });
    }
  } catch (error) {
    console.error('Error updating or inserting marker:', error);
    return NextResponse.json({ error: 'Error updating or inserting marker' }, { status: 500 });
  }
}
