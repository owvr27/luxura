export function calculateDistanceInKm(from, to) {
  const earthRadiusKm = 6371;
  const latitudeDelta = to.latitude - from.latitude;
  const longitudeDelta = to.longitude - from.longitude;

  const dLat = (latitudeDelta * Math.PI) / 180;
  const dLon = (longitudeDelta * Math.PI) / 180;
  const startLat = (from.latitude * Math.PI) / 180;
  const endLat = (to.latitude * Math.PI) / 180;

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(startLat) * Math.cos(endLat);

  const centralAngle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return earthRadiusKm * centralAngle;
}

export function findNearestBin(userLocation, bins) {
  if (!userLocation || !bins.length) {
    return null;
  }

  return bins.reduce((nearest, currentBin) => {
    const currentDistance = calculateDistanceInKm(userLocation, currentBin);

    if (!nearest || currentDistance < nearest.distanceKm) {
      return {
        ...currentBin,
        distanceKm: currentDistance,
      };
    }

    return nearest;
  }, null);
}

export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  return `${distanceKm.toFixed(2)} km`;
}
