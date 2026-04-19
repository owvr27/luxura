import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);
const REGISTERED_USER_KEY = 'greenbin_registered_user';
const AUTH_SESSION_KEY = 'greenbin_auth_session';
const APP_LOCK_SETTINGS_KEY = 'greenbin_app_lock_settings';

export function AuthProvider({ children }) {
  const [registeredUser, setRegisteredUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [appLockSettings, setAppLockSettings] = useState({
    enabled: false,
    pinCode: '',
  });
  const [isPinRequired, setIsPinRequired] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    async function restoreAuthState() {
      try {
        const [storedRegisteredUser, storedSession, storedAppLockSettings] = await Promise.all([
          AsyncStorage.getItem(REGISTERED_USER_KEY),
          AsyncStorage.getItem(AUTH_SESSION_KEY),
          AsyncStorage.getItem(APP_LOCK_SETTINGS_KEY),
        ]);

        const parsedRegisteredUser = storedRegisteredUser
          ? JSON.parse(storedRegisteredUser)
          : null;
        const parsedSession = storedSession ? JSON.parse(storedSession) : null;
        const parsedAppLockSettings = storedAppLockSettings
          ? JSON.parse(storedAppLockSettings)
          : { enabled: false, pinCode: '' };

        setRegisteredUser(parsedRegisteredUser);
        setCurrentUser(parsedSession);
        setAppLockSettings(parsedAppLockSettings);
        setIsPinRequired(Boolean(parsedSession && parsedAppLockSettings?.enabled));
      } finally {
        setIsHydrated(true);
      }
    }

    restoreAuthState();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const previousAppState = appStateRef.current;

      if (
        (previousAppState === 'background' || previousAppState === 'inactive') &&
        nextAppState === 'active' &&
        currentUser &&
        appLockSettings.enabled
      ) {
        setIsPinRequired(true);
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [appLockSettings.enabled, currentUser]);

  const value = useMemo(
    () => ({
      appLockEnabled: appLockSettings.enabled,
      currentUser,
      hasPinConfigured: Boolean(appLockSettings.pinCode),
      isHydrated,
      isLoggedIn: Boolean(currentUser),
      isPinRequired,
      registeredUser,
      registerUser: async ({ email, fullName, password }) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (registeredUser?.email === normalizedEmail) {
          return { ok: false, error: 'accountExists' };
        }

        const nextUser = {
          email: normalizedEmail,
          fullName: fullName.trim(),
          password,
        };

        setRegisteredUser(nextUser);
        await AsyncStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(nextUser));

        return { ok: true };
      },
      loginUser: async ({ email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!registeredUser || registeredUser.email !== normalizedEmail) {
          return { ok: false, error: 'accountNotFound' };
        }

        if (registeredUser.password !== password) {
          return { ok: false, error: 'wrongPassword' };
        }

        const sessionUser = {
          email: registeredUser.email,
          fullName: registeredUser.fullName,
        };

        setCurrentUser(sessionUser);
        setIsPinRequired(false);
        await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));

        return { ok: true, user: sessionUser };
      },
      logoutUser: async () => {
        setCurrentUser(null);
        setIsPinRequired(false);
        await AsyncStorage.removeItem(AUTH_SESSION_KEY);
      },
      updateProfile: async ({ fullName }) => {
        const nextFullName = fullName.trim();

        const nextRegisteredUser = registeredUser
          ? {
              ...registeredUser,
              fullName: nextFullName,
            }
          : null;

        const nextCurrentUser = currentUser
          ? {
              ...currentUser,
              fullName: nextFullName,
            }
          : null;

        if (nextRegisteredUser) {
          setRegisteredUser(nextRegisteredUser);
          await AsyncStorage.setItem(REGISTERED_USER_KEY, JSON.stringify(nextRegisteredUser));
        }

        if (nextCurrentUser) {
          setCurrentUser(nextCurrentUser);
          await AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextCurrentUser));
        }

        return { ok: true };
      },
      saveAppLockSettings: async ({ enabled, pinCode }) => {
        const nextSettings = {
          enabled,
          pinCode: pinCode ?? appLockSettings.pinCode,
        };

        setAppLockSettings(nextSettings);

        if (!nextSettings.enabled) {
          setIsPinRequired(false);
        }

        await AsyncStorage.setItem(APP_LOCK_SETTINGS_KEY, JSON.stringify(nextSettings));

        return { ok: true };
      },
      unlockWithPin: async (pinCode) => {
        if (!appLockSettings.enabled || !appLockSettings.pinCode) {
          setIsPinRequired(false);
          return { ok: true };
        }

        if (pinCode !== appLockSettings.pinCode) {
          return { ok: false, error: 'invalidPin' };
        }

        setIsPinRequired(false);
        return { ok: true };
      },
    }),
    [appLockSettings, currentUser, isHydrated, isPinRequired, registeredUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
