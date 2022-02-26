import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Option } from "./Option";

interface ResultProps {
  setSelected: (id: number) => void;
  selected: number;
}

const Result = (props: ResultProps) => {
  const { selected, setSelected } = props;
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Text style={{ textAlignVertical: "center", width: 80 }}>Result:</Text>
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
          color="black"
        >
          <Text>:)</Text>
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
          backgroundColor="#f27348"
          color="black"
        >
          <Text>:(</Text>
        </Option>
      </TouchableOpacity>
    </View>
  );
};

export default Result;
