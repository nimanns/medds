import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
} from "react-native";
import styles from "../Styles";

interface ButtonCompProps {
  onPress: () => void;
  children: React.ReactChildren | string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const ButtonComp = (props: ButtonCompProps) => {
  const [isDown, setIsDown] = React.useState<boolean>(false);
  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        setIsDown(true);
      }}
      onPressOut={() => {
        setIsDown(false);
      }}
      onPress={props.onPress}
    >
      <View
        style={[
          styles.btnView,
          props.style,
          isDown ? styles.down : styles.notDown,
        ]}
      >
        <LinearGradient
          end={{ x: 0.2, y: 0.8 }}
          start={{ x: 0.6, y: 0.9 }}
          colors={isDown ? ["#57b6ce", "#14a3ad"] : ["#68d9f5", "#43cfda"]}
          style={{
            borderRadius: 4,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={[styles.btnText, props.textStyle]}>
            {props.children}
          </Text>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ButtonComp;
