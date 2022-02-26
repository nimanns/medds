import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import { Text, View, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { G, Path } from "react-native-svg";
import { useMainContext } from "../MainContext";
import styles from "../Styles";
import SideEffects from "./SideEffects";
import { MedItem, Time } from "../lib/Types";
import * as Notifications from "expo-notifications";
import Result from "./Result";
import ButtonComp from "./ButtonComp";

interface ItemProps {
  details: MedItem;
  index: number;
}

const analyzeResults = (
  result: number,
  sideEffects: number
): [string, string] => {
  if (result === 1) {
    if (sideEffects <= 2) {
      return ["#68eb7e", "#2cc772"];
    }
    if (sideEffects === 3) {
      return ["#ebbdbd", "#f87d7d"];
    }
  }

  if (result === 2) {
    return ["#ebbdbd", "#f87d7d"];
  }

  return ["#abe2f0", "#74c3ce"];
};

const Item = (props: ItemProps) => {
  const times = JSON.parse(props.details.times) as Array<Time>;
  let length = times.length * 35 + 100;
  if (props.details.side_effects === -1 && props.details.worked === -1) {
    length += 150;
  }
  const [state, setState] = React.useState<boolean>(false);
  const [sideEffectsLevel, setSideEffectsLevel] = React.useState<number>(-1);
  const [result, setResult] = React.useState<number>(-1);
  const [done, setDone] = React.useState<boolean>(false);
  const progress = useSharedValue(0);
  const rotation = useSharedValue("0deg");
  const itemsOpacity = useSharedValue(0);
  const getData = useMainContext().fetchData;
  const db = useMainContext().database;
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      height: progress.value,
    };
  }, []);

  const deleteItem = () => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this entry?",
      [
        {
          text: "No",
          onPress: () => {},
        },
        {
          text: "Yes",
          onPress: () => {
            JSON.parse(props.details.notification_ids).forEach(
              async (val: string) => {
                await Notifications.cancelScheduledNotificationAsync(val);
              }
            );
            db.exec(
              [
                {
                  sql: "DELETE FROM Medds WHERE id = ?",
                  args: [props.details.id],
                },
              ],
              false,
              () => {
                getData();
              }
            );
          },
        },
      ]
    );
  };
  const reanimatedChevronStyle = useAnimatedStyle(() => {
    return {
      borderRadius: 140,
      overflow: "hidden",
      margin: 10,
      transform: [{ rotateX: rotation.value }],
    };
  }, []);

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: itemsOpacity.value,
    };
  }, []);

  const submit = () => {
    if (result < 0) {
      return alert("Please select the result");
    }

    if (sideEffectsLevel < 0) {
      return alert("Please specify the side effects.");
    }

    Alert.alert("Submit the results", "Are you sure you about the results?", [
      {
        text: "No",
        onPress: () => {},
      },
      {
        text: "Yes",
        onPress: () => {
          JSON.parse(props.details.notification_ids).forEach(
            async (val: string) => {
              await Notifications.cancelScheduledNotificationAsync(val);
            }
          );
          db.exec(
            [
              {
                sql: "UPDATE Medds SET side_effects = ?, worked = ? WHERE id = ?",
                args: [sideEffectsLevel, result, props.details.id],
              },
            ],
            false,
            (results) => {
              getData();
            }
          );
        },
      },
    ]);
  };

  React.useEffect(() => {
    if (!state) {
      progress.value = withTiming(0);
      rotation.value = withTiming("0deg") as unknown as string;
      itemsOpacity.value = withTiming(0);
    } else {
      progress.value = withTiming(length);
      rotation.value = withTiming("180deg") as unknown as string;
      itemsOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.ease,
      });
    }
  }, [state]);

  return (
    <View
      key={props.details.id}
      style={[
        styles.timeItem,
        {
          width: "90%",
          height: "auto",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <LinearGradient
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 4,
        }}
        colors={analyzeResults(
          props.details.worked,
          props.details.side_effects
        )}
      >
        <Text
          style={{
            backgroundColor: "#ffffff",
            padding: 5,
            textAlignVertical: "center",
            margin: 5,
            borderRadius: 4,
          }}
        >
          {props.details.name.charAt(0).toUpperCase() +
            props.details.name.slice(1)}
        </Text>
        <View
          style={{
            height: 43,
            display: "flex",
            flexDirection: "row",
            paddingLeft: 10,
          }}
        >
          <Text style={{ textAlignVertical: "center" }}>
            {props.details.side_effects !== -1 && props.details.worked !== -1
              ? ["Positive", "Negative"][props.details.worked - 1] +
                " results with " +
                ["no", "mild", "severe"][props.details.side_effects - 1] +
                " side effects."
              : ""}
          </Text>
          <Animated.View
            style={[
              { backgroundColor: "#89f0db", elevation: 12 },
              reanimatedChevronStyle,
              { marginLeft: "auto" },
            ]}
          >
            <TouchableOpacity
              onPress={() => setState(!state)}
              style={{
                padding: 5,
              }}
            >
              <Svg
                viewBox="0 0 512 512"
                width={13}
                height={13}
                style={[{ marginLeft: "auto", marginRight: "auto" }]}
                fill="black"
              >
                <Path
                  fill="#000"
                  d="M505.183,123.179c-9.087-9.087-23.824-9.089-32.912,0.002l-216.266,216.27L39.729,123.179
	c-9.087-9.087-23.824-9.089-32.912,0.002c-9.089,9.089-9.089,23.824,0,32.912L239.55,388.82c4.364,4.364,10.283,6.816,16.455,6.816
	c6.172,0,12.092-2.453,16.455-6.817l232.721-232.727C514.272,147.004,514.272,132.268,505.183,123.179z"
                />
              </Svg>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              { backgroundColor: "#f148b1", elevation: 12 },
              {
                borderRadius: 140,
                overflow: "hidden",
                margin: 10,
              },
            ]}
          >
            <TouchableOpacity
              onPress={deleteItem}
              style={{
                padding: 5,
              }}
            >
              <Svg
                width={13}
                height={13}
                style={[{ marginLeft: "auto", marginRight: "auto" }]}
                fill="black"
              >
                <G
                  transform="translate(-9.5, -9) matrix(0.793666, 0, 0, 0.822399, 3.34257, 2.74278)"
                  id="imagebot_3"
                >
                  <Path
                    fill="#000000"
                    stroke="#000000"
                    stroke-linecap="round"
                    d="M5.09028,4.85182L27.05888,26.99902"
                  />
                  <Path
                    fill="#000000"
                    stroke="#000000"
                    stroke-linecap="round"
                    d="M5.09028,26.99902L27.05888,4.85182"
                  />
                </G>
              </Svg>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Animated.View
          style={[
            {
              width: "100%",
            },
            reanimatedStyle,
          ]}
        >
          {state && (
            <Animated.View style={[{ alignItems: "center", padding: 10 }]}>
              {times.map((val, ind) => {
                return (
                  <Animated.View
                    key={ind}
                    style={[
                      {
                        backgroundColor: "white",
                        width: "90%",
                        elevation: 4,
                        borderRadius: 4,
                        padding: 4,
                        margin: 5,
                      },
                      opacityStyle,
                    ]}
                  >
                    <Text style={{}} key={ind}>
                      {(val.day === 0
                        ? "Everyday"
                        : [
                            "Sundays",
                            "Mondays",
                            "Tuesdays",
                            "Wednesdays",
                            "Thursdays",
                            "Fridays",
                            "Saturdays",
                          ][val.day - 1]) +
                        " at " +
                        ("0" + val.hour.toString()).slice(-2) +
                        ":" +
                        ("0" + val.minute.toString()).slice(-2)}
                    </Text>
                  </Animated.View>
                );
              })}
              {props.details.side_effects === -1 &&
                props.details.worked === -1 && (
                  <Animated.View
                    style={[
                      {
                        width: "100%",
                        height: 100,
                        margin: 50,
                        justifyContent: "center",
                      },
                      opacityStyle,
                    ]}
                  >
                    {!done && (
                      <ButtonComp
                        onPress={() => {
                          setDone(true);
                        }}
                      >
                        Done
                      </ButtonComp>
                    )}
                    {done && (
                      <>
                        <SideEffects
                          selected={sideEffectsLevel}
                          setSelected={setSideEffectsLevel}
                        ></SideEffects>
                        <Result
                          selected={result}
                          setSelected={setResult}
                        ></Result>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View style={{ alignItems: "center", margin: 10 }}>
                            <TouchableOpacity
                              onPress={() => {
                                setDone(false);
                                setResult(-1);
                                setSideEffectsLevel(-1);
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#ff4111",
                                  width: 40,
                                  height: 40,
                                  borderRadius: 50,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text style={{ fontSize: 14 }}>Cancel</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                          <View style={{ alignItems: "center", margin: 10 }}>
                            <TouchableOpacity onPress={submit}>
                              <View
                                style={{
                                  backgroundColor: "#11ff88",
                                  width: 40,
                                  height: 40,
                                  borderRadius: 50,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text style={{ fontSize: 14 }}>Done</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    )}
                  </Animated.View>
                )}
            </Animated.View>
          )}
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default Item;
