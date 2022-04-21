import { useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "../Styles";
import ButtonComp from "./ButtonComp";
import Svg, { G, Rect } from "react-native-svg";
import DateTimePicker, { Event } from "@react-native-community/datetimepicker";
import RadioButton from "./RadioButton";
import { LinearGradient } from "expo-linear-gradient";
import { Time, Times } from "../lib/Types";
import * as Notifications from "expo-notifications";
import { WebSQLDatabase } from "expo-sqlite";
import { useMainContext } from "../MainContext";
import { MessageOptions, showMessage } from "react-native-flash-message";

interface InputFormProps {
  database: WebSQLDatabase | null;
  showMessage: (options: MessageOptions) => void;
}

async function schedulePushNotification(times: Times, name: string) {
  let trigger:
    | Notifications.WeeklyTriggerInput
    | Notifications.DailyTriggerInput
    | null = null;
  let ids = [];
  for (let i = 0; i < times.length; i++) {
    if (times[i].day === 0) {
      trigger = {
        channelId: "default",
        hour: times[i].hour,
        minute: times[i].minute,
        repeats: true,
      } as Notifications.DailyTriggerInput;
    } else {
      trigger = {
        channelId: "default",
        weekday: times[i].day,
        hour: times[i].hour,
        minute: times[i].minute,
        repeats: true,
      } as Notifications.WeeklyTriggerInput;
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to take your medication!",
        body: "Time to take " + name,
      },
      trigger,
    });
    ids.push(id);
  }
  return ids;
}

const InputForm = (props: InputFormProps) => {
  const [name, setName] = useState<string>("");
  const [selected, setSelected] = useState<number>(-1);
  const [arr, setArr] = useState<string[] | null>(null);
  const [timesArr, setTimesArr] = useState<Times | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [time, setTime] = useState<number[]>([-1, -1]);
  const [daily, setDaily] = useState<boolean>(false);
  const getData = useMainContext().fetchData;
  const nameInput = useRef<TextInput>(null);
  const onChange = (event: Event, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (!selectedTime) return setShowTimePicker(false);
    const hourAndMinute = selectedTime?.toTimeString().split(" ")[0].split(":");
    setTime([parseInt(hourAndMinute[0]), parseInt(hourAndMinute[1])]);
  };
  const addTime = () => {
    if (name === "") {
      return alert("Please type in the medication name");
    }
    if (selected === -1) {
      return alert("Please select a weekday");
    }
    if (time[0] < 0 || time[1] < 0) {
      return alert("Please choose a time");
    }
    const selectedTime: Time = {
      day: daily ? 0 : selected,
      hour: time[0],
      minute: time[1],
    };

    if (
      timesArr
        ?.map((val: Time) => {
          return JSON.stringify(val);
        })
        .includes(JSON.stringify(selectedTime))
    ) {
      return alert("You've already specified that time.");
    }
    if (timesArr) {
      setTimesArr([...timesArr, selectedTime]);
    } else {
      setTimesArr([selectedTime]);
    }
    setTime([-1, -1]);
    setSelected(-1);
    setDaily(false);
    if (arr) {
      setArr([
        ...arr,
        (daily
          ? "Everyday"
          : [
              "Sundays",
              "Mondays",
              "Tuesdays",
              "Wednesdays",
              "Thursdays",
              "Fridays",
              "Saturdays",
            ][selected - 1]) +
          " at " +
          ("0" + time[0].toString()).slice(-2) +
          ":" +
          ("0" + time[1].toString()).slice(-2),
      ]);
    } else {
      setArr([
        (daily
          ? "Everyday"
          : [
              "Sundays",
              "Mondays",
              "Tuesdays",
              "Wednesdays",
              "Thursdays",
              "Fridays",
              "Saturdays",
            ][selected - 1]) +
          " at " +
          ("0" + time[0].toString()).slice(-2) +
          ":" +
          ("0" + time[1].toString()).slice(-2),
      ]);
    }

    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const addToDatabase = async () => {
    if (name === "") {
      return alert("Please type in the medication name");
    }

    if (!timesArr || timesArr?.length === 0) {
      return alert("You haven't specified the times.");
    }

    props.database?.exec(
      [
        {
          sql: "SELECT * FROM Medds WHERE name = ?",
          args: [name.toLowerCase().trim()],
        },
      ],
      true,
      async (err, results) => {
        if (results && "rows" in results[0] && results[0].rows.length !== 0) {
          return alert("You've already entered that med.");
        } else {
          const ids = await schedulePushNotification(timesArr, name);

          props.database?.exec(
            [
              {
                sql: "INSERT INTO Medds (name, notification_ids, times, worked, side_effects) VALUES (?,?,?,?,?)",
                args: [
                  name.toLowerCase().trim(),
                  JSON.stringify(ids),
                  JSON.stringify(timesArr),
                  -1,
                  -1,
                ],
              },
            ],
            false,
            (err, result) => {
              getData();
              setName("");
              setTimesArr([]);
              setSelected(-1);
              setTime([-1, -1]);
              setDaily(false);
              setArr([]);
              nameInput?.current?.clear();
              showMessage({
                message: `Successfully added ${name} to the list of medications!`,
                type: "info",
                backgroundColor: "#0898A0",
              });
            }
          );
        }
      }
    );
  };

  return (
    <>
      <View style={styles.inputView}>
        <TextInput
          ref={nameInput}
          onChangeText={(val) => {
            setName(val);
          }}
          placeholderTextColor={"#222"}
          selectionColor={"#70b5e4"}
          style={styles.input}
          placeholder="Name of the medication"
        ></TextInput>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 10,
            margin: 0,
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <TouchableOpacity
            style={{ width: 40, height: 40 }}
            onPress={() => {
              if (daily) return;
              setSelected(1);
            }}
          >
            <RadioButton selected={daily || selected === 1}>Su</RadioButton>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 40, height: 40 }}
            onPress={() => {
              if (daily) return;
              setSelected(2);
            }}
          >
            <RadioButton selected={daily || selected === 2}>Mo</RadioButton>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 40, height: 40 }}
            onPress={() => {
              if (daily) return;
              setSelected(3);
            }}
          >
            <RadioButton selected={daily || selected === 3}>Tu</RadioButton>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 40, height: 40 }}
            onPress={() => {
              if (daily) return;
              setSelected(4);
            }}
          >
            <RadioButton selected={daily || selected === 4}>We</RadioButton>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 40, height: 40 }}
            onPress={() => {
              if (daily) return;
              setSelected(5);
            }}
          >
            <RadioButton selected={daily || selected === 5}>Th</RadioButton>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 40, height: 40 }}
            onPress={() => {
              if (daily) return;
              setSelected(6);
            }}
          >
            <RadioButton selected={daily || selected === 6}>Fr</RadioButton>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: 40, height: 40 }}
            onPress={() => {
              if (daily) return;
              setSelected(7);
            }}
          >
            <RadioButton selected={daily || selected === 7}>Sa</RadioButton>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            width: 90,
            height: 40,
          }}
          onPress={() => {
            setDaily(!daily);
            if (!daily) {
              setSelected(0);
            } else {
              setSelected(-1);
            }
          }}
        >
          <View
            style={[
              {
                width: 90,
                height: 40,
                backgroundColor: "black",
                borderRadius: 4,
                elevation: 20,
              },
            ]}
          >
            <LinearGradient
              end={{ x: 0.2, y: 0.8 }}
              start={{ x: 0.6, y: 0.9 }}
              colors={!daily ? ["#cccccc", "#cacaca"] : ["#68d9f5", "#43cfda"]}
              style={{
                width: 90,
                height: 40,
                borderRadius: 4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Everyday</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <ButtonComp
          onPress={() => {
            setShowTimePicker(true);
          }}
          textStyle={{ fontSize: 29 }}
        >
          ⏰
        </ButtonComp>
        {showTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onChange}
          />
        )}
        <ScrollView
          style={styles.timeItemsContainer}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={true}
          ref={scrollViewRef}
        >
          {arr?.map((e, ind) => {
            return (
              <View
                key={ind}
                style={[
                  styles.timeItem,
                  { marginBottom: ind === arr.length - 1 ? 10 : 0 },
                ]}
              >
                <Text
                  style={{
                    width: "100%",
                    height: "100%",
                    textAlignVertical: "center",
                    paddingLeft: 20,
                    borderRadius: 4,
                  }}
                >
                  {e}
                </Text>
                <TouchableOpacity
                  style={{
                    width: 15,
                    height: 15,
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginRight: 10,
                    marginLeft: "auto",
                  }}
                  onPress={() => {
                    setTimesArr(
                      timesArr
                        ? timesArr.filter((val, index) => {
                            return index !== ind;
                          })
                        : null
                    );
                    setArr(
                      arr.filter((val, index) => {
                        return index !== ind;
                      })
                    );
                  }}
                >
                  <Svg viewBox="0 0 84.853 84.853">
                    <G id="layer1" transform="translate(-153.29 -132.79)">
                      <G
                        id="g2762"
                        transform="matrix(.70711 -.70711 .70711 .70711 -66.575 189.71)"
                        fill="red"
                      >
                        <Rect
                          id="rect1872"
                          y="165.22"
                          width="100"
                          x="145.71"
                          height="20"
                        />
                        <Rect
                          id="rect1874"
                          transform="rotate(90)"
                          height="20"
                          width="100"
                          y="-205.71"
                          x="125.22"
                        />
                      </G>
                    </G>
                  </Svg>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        <ButtonComp onPress={addTime}>Add Time</ButtonComp>
      </View>
      <ButtonComp onPress={addToDatabase}>Add Medicince</ButtonComp>
    </>
  );
};

export default InputForm;
