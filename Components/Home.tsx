import { SafeAreaView, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../Styles";
import InputForm from "./InputForm";
import { useMainContext } from "../MainContext";
import FlashMessage, { showMessage } from "react-native-flash-message";
import BackgroundGradient from "./BackgroundGradient";

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};
type HomeProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation, route }: HomeProps) => {
  const db = useMainContext().database;
  const loadDataCallback = useCallback(async () => {
    db.exec(
      [{ sql: "SELECT * FROM Medds", args: [] }],
      true,
      (err, result: any) => {}
    );
    try {
      const createTableQuery = `CREATE TABLE IF NOT EXISTS Medds(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        notification_ids TEXT NOT NULL,
        times TEXT NOT NULL,
        worked INTEGER,
        side_effects INTEGER
      );`;
      db.exec(
        [{ sql: createTableQuery, args: [] }],
        false,
        (err, result) => {}
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundGradient>
        <View style={styles.mainData}>
          <InputForm database={db || null} showMessage={showMessage} />
          <FlashMessage
            style={{ paddingTop: 50 }}
            position="top"
          ></FlashMessage>
        </View>
      </BackgroundGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;
