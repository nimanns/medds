import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SQLite from "expo-sqlite";
import { ReactNode } from "react";
import { isDevice } from "expo-device";
import * as Notifications from "expo-notifications";
import { MedItem } from "./lib/Types";

const db = SQLite.openDatabase("medds");
const MainContext = createContext<{
  database: SQLite.WebSQLDatabase;
  expoPushToken: string;
  fetchData: () => void;
  data: MedItem[] | null;
}>({
  database: db,
  expoPushToken: "",
  fetchData: () => {},
  data: null,
});
const getPushToken = () => {
  if (!isDevice) {
    return Promise.reject("Must use physical device for Push Notifications");
  }
  try {
    return Notifications.getPermissionsAsync()
      .then((statusResult) => {
        return statusResult.status !== "granted"
          ? Notifications.requestPermissionsAsync()
          : statusResult;
      })
      .then((statusResult) => {
        if (statusResult.status !== "granted") {
          throw "Failed to get push token for push notification!";
        }
        return Notifications.getExpoPushTokenAsync();
      })
      .then((tokenData) => tokenData.data);
  } catch (error) {
    return Promise.reject("Couldn't check notifications permissions");
  }
};

export function MainContextProvider({ children }: { children: ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [data, setData] = useState<MedItem[] | null>(null);
  const getData = () => {
    db.exec(
      [{ sql: "SELECT * FROM Medds ORDER BY id DESC;", args: [] }],
      true,
      (err, results) => {
        if (results && "rows" in results[0] && results[0].rows.length !== 0) {
          setData(results[0]?.rows as MedItem[]);
        } else {
          setData(null);
        }
      }
    );
  };

  useEffect(() => {
    getData();
    getPushToken().then((pushToken) => {
      if (pushToken) {
        setExpoPushToken(pushToken);
      }
    });
  }, []);
  return (
    <MainContext.Provider
      value={{ database: db, expoPushToken, fetchData: getData, data }}
    >
      {children}
    </MainContext.Provider>
  );
}

export const useMainContext = () => {
  return useContext(MainContext);
};
