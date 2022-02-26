import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { StyleSheet, StatusBar } from "react-native";

import { width, height } from "../lib/Dimensions";
interface BackgroundGradientProps {
  children: React.ReactNode;
}

const BackgroundGradient = (props: BackgroundGradientProps) => {
  return (
    <LinearGradient
      style={[
        {
          width,
          height: StatusBar.currentHeight
            ? height + StatusBar.currentHeight
            : height,
        },
      ]}
      end={{ x: 0.2, y: 0.8 }}
      colors={["transparent", "#41989e"]}
    >
      <LinearGradient
        style={[
          {
            width,
            height: StatusBar.currentHeight
              ? height + StatusBar.currentHeight
              : height,
          },
        ]}
        end={{ x: 0.4, y: 0.2 }}
        colors={["#0d96f175", "transparent"]}
      >
        <LinearGradient
          style={[
            {
              width,
              height: StatusBar.currentHeight
                ? height + StatusBar.currentHeight
                : height,
            },
          ]}
          end={{ x: 5, y: 1 }}
          colors={["transparent", "#d400ff"]}
        >
          {props.children}
        </LinearGradient>
      </LinearGradient>
    </LinearGradient>
  );
};

export default BackgroundGradient;
