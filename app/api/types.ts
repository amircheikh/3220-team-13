export interface MapMarkerData {
  id?: number;
  px: number | null;
  main_street: string;
  midblock_route: string;
  side1_street: string;
  side2_street: string;
  private_access: string;
  additional_info: string;
  activationdate: Date | null;
  signalsystem: string;
  non_system: string;
  control_mode: string;
  pedwalkspeed: string;
  aps_operation: string;
  numberofapproaches: number | null;
  objectid: number | null;
  geo_id: number | null;
  node_id: number | null;
  audiblepedsignal: boolean;
  transit_preempt: boolean;
  fire_preempt: boolean;
  rail_preempt: boolean;
  mi_prinx: number | null;
  bicycle_signal: boolean;
  ups: boolean;
  led_blankout_sign: boolean;
  lpi_north_implementation_date: Date | null;
  lpi_south_implementation_date: Date | null;
  lpi_east_implementation_date: Date | null;
  lpi_west_implementation_date: Date | null;
  lpi_comment: string;

  // Coordinates are very weird since they're stored in the db as: '[[longitude, latitude]]'. Not sure why this happened when originally uploading all the markers. So you'll notice throughout the code that accesing lat and long coordinates is a little strange:
  // long coordinate: marker.coordinates[0][0]
  // lat coordinate: marker.coordinates[0][1]
  coordinates: string;

  isredlightcamera: boolean;
  isuseradded: boolean;
}
