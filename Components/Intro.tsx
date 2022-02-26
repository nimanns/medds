import * as React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { StatusBar as STBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import PillsSVG from "./PillsSVG";
import styles from "../Styles";
import ButtonComp from "./ButtonComp";

export interface IntroProps {
  setVisited: React.Dispatch<React.SetStateAction<"notknown" | "yes" | "no">>;
}

const setVisited = async () => {
  await AsyncStorage.setItem("Intro", "visited");
};

export function Intro(props: IntroProps) {
  const { width, height } = Dimensions.get("window");
  const [sliderState, setSliderState] = React.useState({ currentPage: 0 });
  const setSliderPage = (event: any) => {
    const { currentPage } = sliderState;
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  const { currentPage: pageIndex } = sliderState;
  return (
    <SafeAreaView style={styles.container}>
      <STBar></STBar>
      <ScrollView
        style={{ flex: 1 }}
        horizontal={true}
        scrollEventThrottle={16}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          setSliderPage(event);
        }}
      >
        <LinearGradient
          style={{ width, height }}
          end={{ x: 0.2, y: 0.8 }}
          colors={["transparent", "#41989ecc"]}
        >
          <Text style={styles.title}>Welcome to Medds!</Text>
          <Text style={styles.description}>
            It's a reminder app for your medications and lets you record the
            results so you'll know which medication doesn't suit you and which
            medications work for you the best!
          </Text>
          <Text></Text>
          <View
            style={{
              width: 90,
              height: 90,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 90,
            }}
          >
            <PillsSVG width={90} height={90}></PillsSVG>
          </View>
        </LinearGradient>
        <LinearGradient
          style={{ width, height }}
          end={{ x: 0.2, y: 0.8 }}
          colors={["transparent", "#41989ecc"]}
        >
          <Text style={styles.description}>
            Fill out the form with the name of the medication and add the times
            throughout the week when you're supposed to take it, then after
            you're done you can record the results and the item shown is going
            to get color coded and provide the description of the result.
          </Text>
          <ButtonComp
            style={{ marginTop: 90 }}
            onPress={() => {
              setVisited();
              props.setVisited("yes");
            }}
          >
            Ok
          </ButtonComp>
        </LinearGradient>
      </ScrollView>
      <View style={styles.paginationWrapper}>
        {Array.from(Array(2).keys()).map((key, index) => (
          <View
            style={[
              styles.paginationDots,
              { opacity: pageIndex === index ? 1 : 0.2 },
            ]}
            key={index}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
