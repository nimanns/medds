import * as React from "react";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import { useMainContext } from "../MainContext";
import styles from "../Styles";
import BackgroundGradient from "./BackgroundGradient";
import Item from "./Item";
interface ProfileScreenProps {}
const ProfileScreen = (props: ProfileScreenProps) => {
  const mainContext = useMainContext();
  const data = mainContext.data;
  const getData = mainContext.fetchData;

  return (
    <View style={styles.container}>
      <BackgroundGradient>
        <View style={styles.mainData}>
          <View style={styles.inputView}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={getData}
                ></RefreshControl>
              }
              style={[
                styles.timeItemsContainer,
                { height: 400, backgroundColor: "transparent" },
              ]}
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {data &&
                data.map((val, ind) => {
                  return <Item key={ind} details={val} index={ind}></Item>;
                })}
              {!data && (
                <View
                  style={[styles.sectionTitle, { width: "90%", margin: 10 }]}
                >
                  <Text style={styles.sectionTitleText}>No entries yet!</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </BackgroundGradient>
    </View>
  );
};

export default ProfileScreen;
