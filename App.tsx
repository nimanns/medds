import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { StatusBar as STBar } from "expo-status-bar";
import HomeScreen from "./Components/Home";
import { Intro } from "./Components/Intro";
import ProfileScreen from "./Components/Profile";

import { MainContextProvider } from "./MainContext";

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)

async function getData() {
  const data = await AsyncStorage.getItem("Intro");
  return data;
}

const Drawer = createDrawerNavigator();

export default function App() {
  const [name, setName] = useState("");
  const [visited, setVisited] = useState<"notknown" | "yes" | "no">("notknown");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    getData().then((data) => {
      if (data === "visited") {
        setVisited("yes");
      } else {
        setVisited("no");
      }
    });

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener(setNotification);

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotification(response.notification);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    (visited === "no" && <Intro setVisited={setVisited}></Intro>) ||
    (visited !== "notknown" && (
      <>
        <MainContextProvider>
          <NavigationContainer>
            <STBar />
            <Drawer.Navigator
              screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: "#8de2f1",
                drawerActiveTintColor: "#000000",
                drawerContentContainerStyle: {
                  backgroundColor: "#3cd2f8",
                  paddingBottom: 10,
                },
                gestureEnabled: true,
                drawerStyle: {
                  backgroundColor: "#096d7a44",
                  shadowColor: "#000",
                },
              }}
            >
              <Drawer.Screen name="Home" component={HomeScreen} />
              <Drawer.Screen name="Profile" component={ProfileScreen} />
            </Drawer.Navigator>
            {/* <Stack.Navigator screenOptions={{ gestureEnabled: true }}>
            <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
            />
            <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Profile" }}
            />
          </Stack.Navigator> */}
          </NavigationContainer>
        </MainContextProvider>
      </>
    ))
  );
}
