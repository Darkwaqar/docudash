import appJson from "./app.json";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { createContext, Fragment, ReactNode, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  Headline,
  ActivityIndicator,
  Provider as PaperProvider,
} from "react-native-paper";
import SignedInStack from "./src/signed-in/Stack";
import SignedOutStack from "./src/signed-out/Stack";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useAppSettings } from "./src/components/AppSettings";
import { AlertsProvider } from "react-native-paper-alerts";
import FormProvider from "./src/context/FormProvider";
import HomeNavigation from "./src/signed-in/Stack";
import useCachedResources from "./src/hooks/useCachedResources";

/**
 * Types
 */
type User = FirebaseAuthTypes.User | null;

/**
 * Contexts
 */
export const UserContext = createContext<User>(null);

function App(): JSX.Element {
  const [initializing, setInitializing] = useState(true);
  const [listenUser, setListenUser] = useState(false);
  const [user, setUser] = useState<User>(null);
  const appSettings = useAppSettings();

  /** Listen for auth state changes */
  useEffect(() => {
    const authListener = auth().onAuthStateChanged((result) => {
      setUser(result);
      if (initializing && !listenUser) {
        setInitializing(false);
        setListenUser(true);
      }
    });

    return () => {
      if (authListener) {
        authListener();
      }
    };
  }, [initializing, listenUser]);

  /** Listen for user changes */
  useEffect(() => {
    let userListener: () => void;

    if (listenUser) {
      // TODO @react-native-firebase/auth provides `onUserChanged` which is this and more.
      // what else can we add and still be web-compatible?
      userListener = auth().onIdTokenChanged((result) => {
        setUser(result);
      });
    }

    return () => {
      if (userListener) {
        userListener();
      }
    };
  }, [listenUser]);

  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return <></>;
  } else {
    if (initializing) {
      let waiting = true;
      setTimeout(() => {
        waiting = false;
      }, 1000);

      return (
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: appSettings.currentTheme.colors.background },
          ]}
        >
          {!waiting && (
            <Fragment>
              <Headline
                style={[
                  styles.padded,
                  { color: appSettings.currentTheme.colors.text },
                ]}
              >
                {appSettings.t("loading")}...
              </Headline>
              <ActivityIndicator
                size={"large"}
                theme={{
                  ...appSettings.currentTheme,
                  colors: { primary: appSettings.currentTheme.colors.primary },
                }}
              />
            </Fragment>
          )}
        </View>
      );
    }
  }
  function container(children: ReactNode | ReactNode[]) {
    return (
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <PaperProvider theme={appSettings.currentTheme}>
          {/* @ts-ignore */}
          <AlertsProvider>
            <NavigationContainer
              linking={{
                prefixes: ["localhost"],
                config: {
                  screens: {
                    // Our signed-out stack has these:
                    SignIn: "",
                    CreateAccount: "account/create",
                    ForgotPassword: "account/password/forgot",
                    PhoneSignIn: "account/phone/login",
                    // Used as catch-all - there is a "Home" in signed-in and signed-out stacks!
                    NotFound: "*",

                    Details: "details", // included from Luna template app
                    User: "user",
                    UserProfile: "profile",
                    UserSettings: "profile/edit",
                    Documents: "documents",
                    Signature: "documents/signature",
                  },
                },
              }}
              documentTitle={{
                formatter: (options, route) =>
                  `${appJson.expo.displayName}${
                    options?.title || route?.name
                      ? " - " + options?.title ?? route?.name
                      : " "
                  }`,
              }}
              theme={appSettings.currentTheme}
            >
              {children}
            </NavigationContainer>
          </AlertsProvider>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return container(
    user ? (
      <UserContext.Provider value={user}>
        <FormProvider>
          <HomeNavigation />
        </FormProvider>
      </UserContext.Provider>
    ) : (
      <SignedOutStack />
    )
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    // alignSelf: 'center',
    alignItems: "center",
    // textAlignVertical: true,
  },
  padded: {
    padding: 40,
  },
});

export default App;
