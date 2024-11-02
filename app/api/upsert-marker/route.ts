import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { parseInteger, parseDate } from '../utils';
import { MapMarkerData } from '../types';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const markerData: Partial<MapMarkerData> = {
      PX: parseInteger(data.PX),
      MAIN_STREET: data.MAIN_STREET,
      MIDBLOCK_ROUTE: data.MIDBLOCK_ROUTE,
      SIDE1_STREET: data.SIDE1_STREET,
      SIDE2_STREET: data.SIDE2_STREET,
      PRIVATE_ACCESS: data.PRIVATE_ACCESS,
      ADDITIONAL_INFO: data.ADDITIONAL_INFO,
      ACTIVATIONDATE: parseDate(data.ACTIVATIONDATE),
      SIGNALSYSTEM: data.SIGNALSYSTEM,
      NON_SYSTEM: data.NON_SYSTEM,
      CONTROL_MODE: data.CONTROL_MODE,
      PEDWALKSPEED: data.PEDWALKSPEED,
      APS_OPERATION: data.APS_OPERATION,
      NUMBEROFAPPROACHES: parseInteger(data.NUMBEROFAPPROACHES),
      OBJECTID: parseInteger(data.OBJECTID),
      GEO_ID: parseInteger(data.GEO_ID),
      NODE_ID: parseInteger(data.NODE_ID),
      AUDIBLEPEDSIGNAL: data.AUDIBLEPEDSIGNAL === '1',
      TRANSIT_PREEMPT: data.TRANSIT_PREEMPT === '1',
      FIRE_PREEMPT: data.FIRE_PREEMPT === '1',
      RAIL_PREEMPT: data.RAIL_PREEMPT === '1',
      MI_PRINX: parseInteger(data.MI_PRINX),
      BICYCLE_SIGNAL: data.BICYCLE_SIGNAL === '1',
      UPS: data.UPS === '1',
      LED_BLANKOUT_SIGN: data.LED_BLANKOUT_SIGN === '1',
      LPI_NORTH_IMPLEMENTATION_DATE: parseDate(data.LPI_NORTH_IMPLEMENTATION_DATE),
      LPI_SOUTH_IMPLEMENTATION_DATE: parseDate(data.LPI_SOUTH_IMPLEMENTATION_DATE),
      LPI_EAST_IMPLEMENTATION_DATE: parseDate(data.LPI_EAST_IMPLEMENTATION_DATE),
      LPI_WEST_IMPLEMENTATION_DATE: parseDate(data.LPI_WEST_IMPLEMENTATION_DATE),
      LPI_COMMENT: data.LPI_COMMENT,
      coordinates: data.coordinates,
      isRedLightCamera: data.isRedLightCamera || false,
      isUserAdded: data.isUserAdded || false,
    };

    if (data.id) {
      // Update existing marker if an ID is provided
      // NOTE: If a field is not provided, it will be overwritten with NULL. I don't think this would be a problem if you edit a marker thru the UI
      await sql`
        UPDATE MapMarkerData
        SET
          PX = ${markerData.PX},
          MAIN_STREET = ${markerData.MAIN_STREET},
          MIDBLOCK_ROUTE = ${markerData.MIDBLOCK_ROUTE},
          SIDE1_STREET = ${markerData.SIDE1_STREET},
          SIDE2_STREET = ${markerData.SIDE2_STREET},
          PRIVATE_ACCESS = ${markerData.PRIVATE_ACCESS},
          ADDITIONAL_INFO = ${markerData.ADDITIONAL_INFO},
          ACTIVATIONDATE = ${markerData.ACTIVATIONDATE as any},
          SIGNALSYSTEM = ${markerData.SIGNALSYSTEM},
          NON_SYSTEM = ${markerData.NON_SYSTEM},
          CONTROL_MODE = ${markerData.CONTROL_MODE},
          PEDWALKSPEED = ${markerData.PEDWALKSPEED},
          APS_OPERATION = ${markerData.APS_OPERATION},
          NUMBEROFAPPROACHES = ${markerData.NUMBEROFAPPROACHES},
          OBJECTID = ${markerData.OBJECTID},
          GEO_ID = ${markerData.GEO_ID},
          NODE_ID = ${markerData.NODE_ID},
          AUDIBLEPEDSIGNAL = ${markerData.AUDIBLEPEDSIGNAL},
          TRANSIT_PREEMPT = ${markerData.TRANSIT_PREEMPT},
          FIRE_PREEMPT = ${markerData.FIRE_PREEMPT},
          RAIL_PREEMPT = ${markerData.RAIL_PREEMPT},
          MI_PRINX = ${markerData.MI_PRINX},
          BICYCLE_SIGNAL = ${markerData.BICYCLE_SIGNAL},
          UPS = ${markerData.UPS},
          LED_BLANKOUT_SIGN = ${markerData.LED_BLANKOUT_SIGN},
          LPI_NORTH_IMPLEMENTATION_DATE = ${markerData.LPI_NORTH_IMPLEMENTATION_DATE as any},
          LPI_SOUTH_IMPLEMENTATION_DATE = ${markerData.LPI_SOUTH_IMPLEMENTATION_DATE as any},
          LPI_EAST_IMPLEMENTATION_DATE = ${markerData.LPI_EAST_IMPLEMENTATION_DATE as any},
          LPI_WEST_IMPLEMENTATION_DATE = ${markerData.LPI_WEST_IMPLEMENTATION_DATE as any},
          LPI_COMMENT = ${markerData.LPI_COMMENT},
          coordinates = ${markerData.coordinates},
          isRedLightCamera = ${markerData.isRedLightCamera},
          isUserAdded = ${markerData.isUserAdded}
        WHERE id = ${data.id};
      `;
      return NextResponse.json({ message: 'Marker updated successfully' });
    } else {
      // Insert new marker if no ID is provided
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
          ${markerData.PX}, ${markerData.MAIN_STREET}, ${markerData.MIDBLOCK_ROUTE}, ${markerData.SIDE1_STREET}, 
          ${markerData.SIDE2_STREET}, ${markerData.PRIVATE_ACCESS}, ${markerData.ADDITIONAL_INFO}, 
          ${markerData.ACTIVATIONDATE as any}, ${markerData.SIGNALSYSTEM}, ${markerData.NON_SYSTEM}, 
          ${markerData.CONTROL_MODE}, ${markerData.PEDWALKSPEED}, ${markerData.APS_OPERATION}, 
          ${markerData.NUMBEROFAPPROACHES}, ${markerData.OBJECTID}, ${markerData.GEO_ID}, ${markerData.NODE_ID}, 
          ${markerData.AUDIBLEPEDSIGNAL}, ${markerData.TRANSIT_PREEMPT}, ${markerData.FIRE_PREEMPT}, 
          ${markerData.RAIL_PREEMPT}, ${markerData.MI_PRINX}, ${markerData.BICYCLE_SIGNAL}, 
          ${markerData.UPS}, ${markerData.LED_BLANKOUT_SIGN}, 
          ${markerData.LPI_NORTH_IMPLEMENTATION_DATE as any}, ${markerData.LPI_SOUTH_IMPLEMENTATION_DATE as any}, 
          ${markerData.LPI_EAST_IMPLEMENTATION_DATE as any}, ${markerData.LPI_WEST_IMPLEMENTATION_DATE as any}, 
          ${markerData.LPI_COMMENT}, ${markerData.coordinates}, ${markerData.isRedLightCamera}, ${
        markerData.isUserAdded
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
