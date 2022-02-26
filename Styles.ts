import { StatusBar, StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#86a6e2",
  },
  mainData: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight,
  },

  title: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100,
    padding: 10,
    textAlign: "center",
    fontSize: 40,
    color: "black",
    backgroundColor: "#c3cad688",
  },

  description: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#c3cad686",
    fontSize: 20,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100,
    padding: 10,
    textAlign: "center",
    color: "black",
  },

  text: {
    fontSize: 20,
    color: "#2d2e2e",
    fontWeight: "bold",
  },

  input: {
    marginLeft: "auto",
    marginRight: "auto",
    minWidth: 240,
    textAlign: "center",
    width: "100%",
    elevation: 20,
    padding: 6,
    margin: 10,
    color: "#222",
    fontSize: 16,
    backgroundColor: "#7ba8c279",
    borderRadius: 4,
  },

  nima: {
    backgroundColor: "#ff22ff",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 10,
    marginTop: 10,
    backgroundColor: "white",
  },

  paginationWrapper: {
    position: "absolute",
    bottom: 200,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: "#0898A0",
    marginLeft: 10,
  },

  btnView: {
    height: 50,
    width: 100,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    backgroundColor: "black",
    borderRadius: 4,
  },

  inputView: {
    padding: 20,
    borderColor: "#000000",
    // elevation: 12,
    width: "90%",
    margin: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c4faf7a2",
    borderRadius: 4,
  },

  sectionTitle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#57758679",
    width: "100%",
    padding: 10,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 4,
    // elevation: 20,
  },

  sectionTitleBars: {
    height: 4,
    width: "100%",
    backgroundColor: "#c4faf78b",
    flexShrink: 1,
  },

  sectionTitleText: {
    margin: 5,
    marginBottom: 1,
    marginTop: 1,
    textShadowRadius: 4,
    textShadowOffset: { height: 0, width: 0 },
    textShadowColor: "#00000060",
    color: "#000",
    fontSize: 15,
    textAlign: "center",
  },

  btnText: {
    fontSize: 16,
    textAlign: "center",
  },

  timePicker: {
    width: "100%",
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
    marginTop: 10,
  },
  timeItemsContainer: {
    marginTop: 15,
    height: 140,
    width: "100%",
    backgroundColor: "#85b6d379",
    borderRadius: 4,
  },
  timeItem: {
    borderRadius: 4,
    // width: "90%",
    height: 50,
    backgroundColor: "#95cec9",
    margin: 10,
    elevation: 7,
    shadowColor: "#000000c8",

    flexDirection: "row",
  },
  down: {
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 4,
  },

  notDown: {
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 12,
  },
});

export default styles;
