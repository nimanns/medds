import { Text, View } from "react-native";

export const Option = (props: {
  selected: boolean;
  children: React.ReactNode;
  backgroundColor: string;
  color: string;
}) => {
  return (
    <View
      style={[
        {
          height: 50,
          width: 50,
          borderRadius: 4,
          alignItems: "center",
          justifyContent: "center",
          margin: 3,
          shadowOffset: {
            height: 0,
            width: 0,
          },
          backgroundColor: "#8ba8b979",
          // elevation: 13,
          shadowOpacity: 1,
          shadowRadius: 0.4,
          flex: 1,
        },
        props.selected ? { backgroundColor: props.backgroundColor } : {},
      ]}
    >
      <Text
        style={[
          {
            fontSize: 14,
            textAlign: "center",
            textAlignVertical: "center",
            fontWeight: "bold",
            color: "#111",
            flex: 1,
          },
          props.selected ? { color: props.color } : {},
        ]}
      >
        {" "}
        {props.children}
      </Text>
    </View>
  );
};
