/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-expressions */
import React from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import BackgroundTimer from "react-native-background-timer"
import { differenceInSeconds } from "date-fns"
import { strings } from "../../../translations/translations"
import formatTime from "../../../components/Helpers/helpers"
import FlexLayout from "../../../components/Layouts/FlexLayout"
import TimerController from "../../../components/Timer/TimerController"
// import Timer from "../../../components/Timer/Timer"
import TimerCycle from "../../../components/Timer/TimerCycle"
import colors from "../../../styles/colorsLightTheme"

// const pomodoroTimeValue = [  0.2, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60,70, 80, 90,]
// const breaksTimeValue = [0.2, 2, 5, 10, 15, 20, 25, 30]

const timerProps = {
  types: [
    { name: "Pomodoro", time: 2 },
    { name: "Short Break", time: 20 },
    { name: "Long Break", time: 20 },
  ],
  statuses: [{ name: "Playing" }, { name: "Paused" }, { name: "Finished" }],
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: 50,
    height: "100%",
    paddingBottom: 80,
    backgroundColor: colors.primeColor,
  },

  boldText: {
    fontFamily: "MontserratMedium",
    color: colors.textColor,
  },

  timerValue: {
    fontSize: 60,
    fontFamily: "MontserratBold",
    color: colors.textColor,
  },

  box: {
    width: "100%",
  },
  buttonS: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 35,
  },
})

export default class PomodoroScreen extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      type: timerProps.types[0],
      actualTime: timerProps.types[0].time,
      durationTime: timerProps.types[0].time,
      isPlaying: false,
      interval: null,
      countInterval: 0,
      longBreakInterval: 4,
    }
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  handleCountInterval = () => {
    this.setState((prevState) => ({
      countInterval: prevState.countInterval + 1,
    }))
  }

  handleType = (type) => {
    this.stopTimer()
    this.setState({
      type,
      actualTime: type.time,
      durationTime: type.time,
      isPlaying: false,
    })
  }

  handleTimer = () => {
    if (this.state.isPlaying) {
      this.pauseTimer()
    } else {
      this.startTimer()
    }
  }

  startTimer = () => {
    const startTime = new Date()
    this.setState({
      isPlaying: true,
      interval: BackgroundTimer.setInterval(() => {
        this.timerMechanism(startTime)
      }, 1000),
    })
  }

  pauseTimer = () => {
    this.stopTimer()
    this.setState((prevState) => ({
      isPlaying: false,
      durationTime: prevState.actualTime,
    }))
  }

  skipTimer = () => {
    this.manageTimer()
  }

  resetTimer = () => {
    this.stopTimer()
    this.setState((prevState) => ({
      actualTime: prevState.type.time,
      durationTime: prevState.type.time,
      countInterval: 0,
    }))
  }

  stopTimer = () => {
    BackgroundTimer.clearInterval(this.state.interval)
    this.setState({
      interval: null,
      isPlaying: false,
    })
  }

  manageTimer = () => {
    this.stopTimer()
    if (this.state.type === timerProps.types[0]) {
      this.handleCountInterval()
      this.state.countInterval % this.state.longBreakInterval === 0
        ? this.handleType(timerProps.types[2])
        : this.handleType(timerProps.types[1])
    } else {
      this.handleType(timerProps.types[0])
    }
  }

  timerMechanism = (startTime) => {
    this.state.actualTime < 1
      ? this.manageTimer()
      : /* eslint-disable react/no-access-state-in-setstate */
        this.setState(() => ({
          actualTime:
            this.state.durationTime -
            differenceInSeconds(new Date(), Date.parse(startTime)),
        }))
  }

  render() {
    const timePercent =
      ((this.state.type.time - this.state.actualTime) / this.state.type.time) *
      100

    return (
      <FlexLayout style={{ color: "#282828" }}>
        <View style={styles.wrapper}>
          <TimerCycle
            size="320"
            strokeWidth="18"
            strokeColor="#53D3AF"
            progress={timePercent}
          >
            <Pressable
              onPress={() => this.setIsOpen(!this.state.settingsIsOpen)}
            >
              <Text style={styles.timerValue}>
                {formatTime(this.state.actualTime)}
              </Text>
            </Pressable>

            <Text style={styles.boldText}>
              {this.state.type === timerProps.types[0]
                ? strings("stayFocus")
                : strings("takeBreak")}
              {this.state.type.time / 60} min
            </Text>
          </TimerCycle>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <TimerController
              handleTimer={this.handleTimer}
              skip={this.skipTimer}
              reset={this.resetTimer}
              isPlaying={this.state.isPlaying}
            />
          </View>
          <Text>{this.state.countInterval}</Text>
        </View>
      </FlexLayout>
    )
  }
}
