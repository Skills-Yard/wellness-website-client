/**
 * Hardcoded lat/lon for every location offered in the navbar's location
 * dropdown, keyed by the exact display string in `LOCATIONS`. Used to
 * resolve a service zone (see getZones in zoneApi.ts) when the browser's
 * geolocation is unavailable, denied, or simply not what the user wants —
 * picking a location from the dropdown looks itself up here and feeds
 * these coordinates to the zone lookup instead of the device's GPS
 * position. See CartContext.setLocation.
 */
export const LOCATION_COORDINATES: Record<string, { lat: number; lon: number }> = {
    "H37, Block H- Saket, Delhi": { lat: 28.5245, lon: 77.2066 },
    "Connaught Place, New Delhi": { lat: 28.6315, lon: 77.2167 },
    "Lajpat Nagar, New Delhi": { lat: 28.5677, lon: 77.2431 },
    "Vasant Kunj, New Delhi": { lat: 28.5200, lon: 77.1591 },
    "Burari, Delhi": { lat: 28.7495, lon: 77.1996 },
};
