import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import ScreenContainer from '../components/ScreenContainer';
import { useLanguage } from '../context/LanguageContext';
import { egyptSmartBins } from '../data/egyptSmartBins';
import { theme } from '../theme';
import { findNearestBin, formatDistance } from '../utils/mapUtils';

const DEFAULT_REGION = {
  latitude: 30.0444,
  longitude: 31.2357,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

export default function MapScreen() {
  const { language, t, textAlign } = useLanguage();
  const [permissionStatus, setPermissionStatus] = useState('loading');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isLocationListVisible, setIsLocationListVisible] = useState(false);

  async function loadLocation() {
    setLocationError('');

    const permissionResponse = await Location.requestForegroundPermissionsAsync();

    if (permissionResponse.status !== 'granted') {
      setPermissionStatus('denied');
      return;
    }

    setPermissionStatus('granted');

    try {
      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });
    } catch {
      setLocationError(t('screens.map.locationUnavailable'));
    }
  }

  useEffect(() => {
    loadLocation();
  }, []);

  const nearestBin = useMemo(() => findNearestBin(userLocation, egyptSmartBins), [userLocation]);

  const region = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      }
    : DEFAULT_REGION;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={[styles.title, { textAlign }]}>{t('screens.map.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>{t('screens.map.description')}</Text>
          <Text style={[styles.helper, { textAlign }]}>{t('screens.map.helper')}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { textAlign }]}>{t('screens.map.nearestTitle')}</Text>
          {nearestBin ? (
            <>
              <Text style={[styles.nearestName, { textAlign }]}>
                {nearestBin.name[language] ?? nearestBin.name.en}
              </Text>
              <Text style={[styles.nearestDistance, { textAlign }]}>
                {t('screens.map.distanceLabel')}: {formatDistance(nearestBin.distanceKm)}
              </Text>
            </>
          ) : permissionStatus === 'loading' ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={theme.colors.primaryStrong} />
              <Text style={[styles.summaryBody, { textAlign }]}>{t('screens.map.loading')}</Text>
            </View>
          ) : (
            <Text style={[styles.summaryBody, { textAlign }]}>
              {locationError || t('screens.map.permissionDescription')}
            </Text>
          )}
        </View>

        <View style={styles.mapCard}>
          <MapView
            initialRegion={region}
            region={region}
            showsCompass
            showsMyLocationButton
            showsUserLocation={permissionStatus === 'granted'}
            style={styles.map}
          >
            {egyptSmartBins.map((bin) => {
              const isNearest = nearestBin?.id === bin.id;

              return (
                <Marker
                  coordinate={{ latitude: bin.latitude, longitude: bin.longitude }}
                  key={bin.id}
                  pinColor={isNearest ? theme.colors.warning : theme.colors.primary}
                  title={bin.name[language] ?? bin.name.en}
                  description={`${bin.city[language] ?? bin.city.en} • ${
                    isNearest
                      ? t('screens.map.nearestMarkerLabel')
                      : t('screens.map.smartBinMarkerLabel')
                  }`}
                />
              );
            })}
          </MapView>
        </View>

        <View style={styles.locationsCard}>
          <View style={styles.locationsHeader}>
            <View style={styles.locationsHeaderText}>
              <Text style={[styles.locationsTitle, { textAlign }]}>
                {t('screens.map.allLocationsTitle')}
              </Text>
              <Text style={[styles.locationsBody, { textAlign }]}>
                {t('screens.map.allLocationsDescription')}
              </Text>
            </View>
            <Pressable
              onPress={() => setIsLocationListVisible((currentValue) => !currentValue)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleButtonLabel}>
                {isLocationListVisible
                  ? t('screens.map.hideLocations')
                  : t('screens.map.showLocations')}
              </Text>
            </Pressable>
          </View>

          {isLocationListVisible ? (
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.locationsList}
            >
              {egyptSmartBins.map((bin) => {
                const isNearest = nearestBin?.id === bin.id;

                return (
                  <View
                    key={bin.id}
                    style={[styles.locationItem, isNearest && styles.locationItemNearest]}
                  >
                    <Text style={[styles.locationName, { textAlign }]}>
                      {bin.name[language] ?? bin.name.en}
                    </Text>
                    <Text style={[styles.locationCity, { textAlign }]}>
                      {bin.city[language] ?? bin.city.en}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          ) : null}
        </View>

        <View style={styles.legendCard}>
          <Text style={[styles.legendTitle, { textAlign }]}>{t('screens.map.legendTitle')}</Text>
          <Text style={[styles.legendBody, { textAlign }]}>{t('screens.map.legendBody')}</Text>
          {permissionStatus !== 'granted' ? (
            <Pressable onPress={loadLocation} style={styles.button}>
              <Text style={styles.buttonLabel}>{t('screens.map.retryLocation')}</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xl,
  },
  heroCard: {
    backgroundColor: theme.colors.primarySurface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.primaryStrong,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
    marginBottom: theme.spacing.sm,
  },
  helper: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.caption,
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  nearestName: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
  },
  nearestDistance: {
    color: theme.colors.warning,
    fontSize: 16,
    fontWeight: '700',
  },
  summaryBody: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginLeft: theme.spacing.sm,
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  mapCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  map: {
    height: 360,
    width: '100%',
  },
  locationsCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  locationsHeader: {
    gap: theme.spacing.md,
  },
  locationsHeaderText: {
    gap: theme.spacing.xs,
  },
  locationsTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 18,
    fontWeight: '700',
  },
  locationsBody: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  toggleButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: theme.spacing.md,
  },
  toggleButtonLabel: {
    color: theme.colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  locationsList: {
    marginTop: theme.spacing.md,
    maxHeight: 240,
  },
  locationItem: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  locationItemNearest: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.warning,
  },
  locationName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationCity: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  legendCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    padding: theme.spacing.lg,
  },
  legendTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  legendBody: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    minHeight: 50,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonLabel: {
    color: theme.colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
