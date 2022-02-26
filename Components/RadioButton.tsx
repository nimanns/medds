import * as React from "react";
import { Text, View, StyleSheet, ViewStyle } from "react-native";

interface RadioButtonProps {
  selected: boolean;
  style?: ViewStyle;
  children: React.ReactChildren | string;
}

const RadioButton = (props: RadioButtonProps) => {
  return (
    <View
      style={[
        {
          height: 35,
          width: 35,
          borderRadius: 4,
          alignItems: "center",
          margin: 3,
          justifyContent: "center",
          shadowOffset: {
            height: 0,
            width: 0,
          },
          backgroundColor: "#8ba8b979",
          elevation: 13,
          shadowOpacity: 1,
          shadowRadius: 0.4,
          flex: 1,
        },
        props.style,
        props.selected ? { backgroundColor: "#14a3ad" } : {},
      ]}
    >
      <Text
        style={[
          {
            fontSize: 20,
            marginLeft: -12,
            marginTop: 10,
            fontWeight: "bold",
            color: "#111",
            flex: 1,
          },
          props.selected ? { color: "#fff" } : {},
        ]}
      >
        {" "}
        {props.children}
      </Text>
    </View>
  );
};

export default RadioButton;
