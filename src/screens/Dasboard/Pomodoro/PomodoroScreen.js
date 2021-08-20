import React from 'react';
import { View,Text, Vibration,Pressable,Button,ScrollView,Dimensions,FlatList,StyleSheet,Switch} from 'react-native';
import Modal from 'react-native-modalbox';
import {strings} from '../../../translations/translations'
import {formatTime} from '../../../components/Helpers/helpers';
import FlexLayout from '../../../components/Layouts/FlexLayout';
import ControlsPomodoroButton from '../../../components/Buttons/ControlsPomodoroButton';
import sharedStyles from '../../../styles/shared';
import HeaderBar from '../../../components/Header/HeaderBar';
import { Timer } from '../../../components/Timer';
import SettingsBarHeader from '../../../components/settingsBarHeader';
import SettingsSwitchBar from '../../../components/settingsSwitchBar';
import FlatListSlider from '../../../components/FlatListSlider';
import { Icon } from 'react-native-elements/dist/icons/Icon';

const pomodoroTimeValue = [15,20,25,30,35,40,45,50,55,60,70,80,90];
const breaksTimeValue = [2,5,10,15,20,25,30];
var screen = Dimensions.get('window');

const defaultProps = {
    types: [
        {name: 'Pomodoro', time: 1500},
        {name: 'Short Break', time: 300},
        {name: 'Long Break', time: 600},
    ],
    statuses: [
        {name: 'Playing'},
        {name: 'Paused'},
        {name: 'Finished'},
    ],
}

const styles = StyleSheet.create ( {
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    
    timerValue: {
        fontSize:60,   
        fontFamily:'OpenSansBold',
        color:'#282828'
    },

    settingsModal: {
        backgroundColor: "white",
        height:'70%',
        paddingLeft:25,
        paddingRight:25,
        elevation:24,
    },
    box: {
        width:'100%',
    },
    buttonS: {
        alignItems:'center',
        justifyContent:'center',
        width:60,
        height:35,
    }


})

export default class PomodoroScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          type: defaultProps.types[0],
          time: defaultProps.types[0].time,
          playing: false,
          status: null, 
          interval:null,
          countInterval:0,
          autoBreakStart:false,
          autoLongBreakInterval:4,
          autoPomodoroStart:false,
          settingsIsOpen:false,
      }
    }  

    //
    handlePomodoro = () => {
        this.stopTimer() 
        Vibration.vibrate(100,100,100)
        if(this.state.type === defaultProps.types[0]) {
            this.handleCountInterval()
            if((this.state.countInterval % this.state.autoLongBreakInterval) === 0) this.handleType(defaultProps.types[2]);
            else this.handleType(defaultProps.types[1]);
            this.state.autoBreakStart ? this.startTimer() : this.setState({status:defaultProps.statuses[2].name})
        } else {
            this.handleType(defaultProps.types[0])
            this.state.autoPomodoroStart ? this.startTimer() : this.setState({status:null})

        }
    }

    //
    handleCountInterval = () =>{
        this.setState({ 
            countInterval: ++this.state.countInterval
        })    
    }

    //DONE
    timer = () => {
        this.state.time < 1 ? this.handlePomodoro() : this.setState(prevState => ({ time: --prevState.time}))
    }

    //DONE
    startTimer = () => { 
        this.setState ({
            status: defaultProps.statuses[0].name,
            playing: true,
            interval: setInterval(this.timer,1000),
        })
    }

    stopTimer = () => {
        clearInterval(this.state.interval)
        this.setState({
            interval:null,
        })
    };

    //
    resetTimer = () => {
        this.stopTimer()
        this.setState({
            time: this.state.type.time,
            playing:false,
            status:null,
            countInterval:0,
        })

    }

    skipTimer = () => {
        this.handlePomodoro()
    }
 
    //DONE
    pauseTimer = () => { 
        if (this.state.playing){
            this.stopTimer() 
            this.setState({
                status:defaultProps.statuses[1].name,
                playing: false,
            })
        }else {
            this.startTimer()
        }
    }

    setIsOpen = (visible) => {
        this.setState({
            settingsIsOpen: visible
        })
    }

    changeDefaultProps = (type,value) => {
        defaultProps.types[type].time = value * 60
        this.resetTimer()
    }

    changeIntervals = (value) => {
        this.setState({
            autoLongBreakInterval:value
        })        
        this.resetTimer()
    }

    changeAutoPomodoroStart = value => {
        this.setState({
            autoPomodoroStart:value
        })
        this.resetTimer()
    }

    changeAutoBreakStart = value => {
        this.setState({
            autoBreakStart:value
        })
        this.resetTimer()
    }

    //
    handleType = type => { 
        this.stopTimer();
        this.setState({ 
            type: type, 
            time: type.time,
            playing:false, 
            status: null
        });
    }


    render() {
        let timePercent = ((this.state.type.time - this.state.time)/this.state.type.time) * 100

      return (
        <FlexLayout style={{color:'#282828'}}> 
                <HeaderBar 
                    screenName='Pomodoro timer' 
                    headerTextSize={20}
                    leftIcon = {
                        <>
                            <Pressable  >
                                <Icon name='poll'  />
                            </Pressable>
                        </>   
                    }
                    rightIcon = {
                        <>
                            <Pressable onPress={() => this.setIsOpen(!this.state.settingsIsOpen)} >
                                <Icon name='settings' />
                            </Pressable>
                        </>
                    }
                />
                <View style = {[
                    sharedStyles.wrapperFlexSpaceBetween,
                    {alignItems:'center',
                    paddingTop:50,
                    paddingBottom:50,}
                ]}>
                    <View style={{
                        height:'20%',
                        alignItems:'center',
                        justifyContent:'center'
                    }}>
                        <Text style={{
                            paddingBottom:5,
                            fontFamily:'OpenSansSemiBold',
                            color:'#B2B2B2',
                        }}>
                            {strings("currentTask")}
                        </Text>
                        <Text style={{
                            fontSize:18,
                            fontFamily:'OpenSansExtraBold',
                            color:'#434343'
                        }}>
                            Pomodoro mobile app design
                        </Text>
                </View>

                
                <Timer 
                    size = '280' 
                    strokeWidth = '10' 
                    strokeColor="#53D3AF" 
                    progress ={timePercent} 
                    >
                    <Pressable  onPress={() => this.setIsOpen(!this.state.settingsIsOpen)}>
                            <Text style={styles.timerValue}>
                                {formatTime(this.state.time)}
                            </Text>
                    </Pressable>

                    { this.state.type === defaultProps.types[0] 
                    ? 
                        <Text style={{
                            fontFamily:'OpenSansBold',
                            color:'#434343'
                        }}>
                            {this.state.autoLongBreakInterval - (this.state.countInterval % this.state.autoLongBreakInterval)}       
                            {strings("toLongBreak")}
                        </Text>
                        : 
                        <Text style={{
                            fontFamily:'OpenSansBold',
                            color:'#434343'
                        }}>
                            Coffee Time!
                        </Text>
                     }
                </Timer>
                
                <View style={{alignItems:'center'}}>
                        <Text style={{
                            color:'#434343',
                            fontFamily:'OpenSansReg',
                            fontSize:16,
                        }}> 
                            {this.state.type === defaultProps.types[0]
                            ? strings("stayFocus") 
                            : strings("takeBreak") }{this.state.type.time/60} min 
                        </Text>
                </View>

                <ControlsPomodoroButton
                        start = {this.startTimer}
                        pause= {this.pauseTimer}
                        skip = {this.skipTimer}
                        reset= {this.resetTimer}
                        status = {this.state.status}
                    />
            </View>


            
            <Modal 
                coverScreen={true} 
                backButtonClose={true} 
                isOpen={this.state.settingsIsOpen} 
                onClosed={() => this.setIsOpen(!this.state.settingsIsOpen)}  
                on style={[styles.settingsModal]} 
                position={"bottom"} 
                ref={"modal6"} 
                swipeThreshold={60} 
                swipeArea={40}
            >
                <HeaderBar 
                    screenName='Pomodoro Settings'
                    headerTextSize={20}
                    rightIcon = {
                        <>
                            <Pressable onPress={() => this.setIsOpen(!this.state.settingsIsOpen)} >
                                <Icon name='close' />
                            </Pressable>
                        </>
                    }
                />
                <View>
                    <View>
                        <SettingsBarHeader 
                            settingsName="Focus"
                            settingsValue={(defaultProps.types[0].time)/60}  
                        />
                        <FlatListSlider 
                        data={pomodoroTimeValue}
                        currentValue={defaultProps.types[0].time/60}
                        onPress={value => this.changeDefaultProps(0,value)}
                        showIndicator={false} 

                        />
                    </View>

                    <View>
                        <SettingsBarHeader 
                            style={{paddingTop:30}}                        
                            settingsName="Short Break"
                            settingsValue={(defaultProps.types[1].time)/60} 
                        />

                        <FlatListSlider 
                        data={breaksTimeValue}
                        currentValue={defaultProps.types[1].time/60}
                        onPress={value => this.changeDefaultProps(1,value)}
                        showIndicator={false} 

                        />
                    </View>

                    <View>
                        <SettingsBarHeader 
                            style={{paddingTop:30}}
                            settingsName="Long Break"
                            settingsValue={(defaultProps.types[2].time)/60} 
                        />
                        <FlatListSlider 
                            data={breaksTimeValue}
                            currentValue={defaultProps.types[2].time/60}
                            onPress={value => this.changeDefaultProps(2,value)}
                            showIndicator={false} 

                        />

                    </View>

                    <View>
                        <SettingsBarHeader 
                            style={{paddingTop:30}}
                            settingsName='Long Break Intervals'
                            settingsValue={this.state.autoLongBreakInterval}
                        />
                        <FlatListSlider 
                            data={[1,2,3,4,5,6,7,8,9,10,11,12]}
                            currentValue = {this.state.autoLongBreakInterval}
                            onPress={this.changeIntervals}
                            showIndicator={false} 
                        />
                    </View>
                        
                        <SettingsSwitchBar
                            style={{paddingTop:30}}
                            settingsName='Auto start pomodoro?'
                            switchValue={this.state.autoPomodoroStart}
                            onValueChange={(value)=> this.changeAutoPomodoroStart(value)}
                         />
                        <SettingsSwitchBar
                            style={{paddingTop:30}}                     
                            settingsName='Auto start breaks?'
                            switchValue={this.state.autoBreakStart}
                            onValueChange={(value)=> this.changeAutoBreakStart(value)}
                        />

                    </View>
            </Modal>
        </FlexLayout>
      );
    }
  }
