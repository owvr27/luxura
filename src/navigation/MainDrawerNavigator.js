import { createDrawerNavigator } from '@react-navigation/drawer';
import LanguageToggleButton from '../components/LanguageToggleButton';
import { useLanguage } from '../context/LanguageContext';
import HelpScreen from '../screens/HelpScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VerifyScreen from '../screens/VerifyScreen';
import { theme } from '../theme';

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator() {
  const { isRTL, t } = useLanguage();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveBackgroundColor: theme.colors.primarySoft,
        drawerActiveTintColor: theme.colors.primaryStrong,
        drawerInactiveTintColor: theme.colors.textSecondary,
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '700',
          marginLeft: -12,
        },
        drawerPosition: isRTL ? 'right' : 'left',
        drawerStyle: {
          backgroundColor: theme.colors.surface,
          width: 280,
        },
        headerRight: () => <LanguageToggleButton />,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.primaryStrong,
        headerTitleAlign: isRTL ? 'right' : 'left',
        headerTitleStyle: {
          fontWeight: '700',
        },
        sceneStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ drawerLabel: t('navigation.home'), title: t('navigation.home') }}
      />
      <Drawer.Screen
        name="Verify"
        component={VerifyScreen}
        options={{ drawerLabel: t('navigation.verify'), title: t('navigation.verify') }}
      />
      <Drawer.Screen
        name="Map"
        component={MapScreen}
        options={{ drawerLabel: t('navigation.map'), title: t('navigation.map') }}
      />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{ drawerLabel: t('navigation.history'), title: t('navigation.history') }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ drawerLabel: t('navigation.profile'), title: t('navigation.profile') }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{
          drawerLabel: t('navigation.help'),
          title: t('navigation.help'),
        }}
      />
    </Drawer.Navigator>
  );
}
