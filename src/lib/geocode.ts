// Simple geocoding using OpenStreetMap Nominatim (free, no API key)
export async function geocodePlace(placeName: string): Promise<{ lat: number; lon: number; displayName: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'JyotishApp/1.0' }
    });
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    return null;
  } catch {
    return null;
  }
}
