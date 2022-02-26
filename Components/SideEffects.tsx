import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Option } from "./Option";

interface SideEffectsProps {
  setSelected: (id: number) => void;
  selected: number;
}

const SideEffects = (props: SideEffectsProps) => {
  const { selected, setSelected } = props;
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        backgroundColor: "transparent",
      }}
    >
      <Text style={{ textAlignVertical: "center", width: 80 }}>
        Side Effects:
      </Text>
      <TouchableOpacity
        style={{
          width: 55,
          height: 55,
        }}
        onPress={() => {
          setSelected(1);
        }}
      >
        <Option
          selected={selected === 1}
          backgroundColor="#AAD9CD"
          color="white"
        >
          <Text>None</Text>
        </Option>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width: 55, height: 55 }}
        onPress={() => {
          setSelected(2);
        }}
      >
        <Option
          selected={selected === 2}
          backgroundColor="#E8D595"
          color="black"
        >
          <Text>Mild</Text>
        </Option>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width: 55, height: 55 }}
        onPress={() => {
          setSelected(3);
        }}
      >
        <Option
          selected={selected === 3}
          backgroundColor="#f27348"
          color="white"
        >
          <Text>Severe</Text>
        </Option>
      </TouchableOpacity>
    </View>
  );
};

export default SideEffects;
