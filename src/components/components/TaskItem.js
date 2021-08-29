import React from "react";
import { View,
    Text,
    Keyboard,
    Pressable,
    StyleSheet,
    TextInput,
    ScrollView,
} 
from "react-native";
import realm,
    {changePriority,
    updateIsDone,
    deleteTask,
    getAllProjects
} 
from "../../Database/Database";
import CheckBox from "../Buttons/CheckBox";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-date-picker"
import {Icon} from "react-native-elements";
import Modal from "react-native-modal";
import sharedStyles from "../../styles/shared";
import FlexLayout from "../Layouts/FlexLayout"
import PropertyItem from "../components/PropertyItem";
import {strings} from "../../translations/translations"
import CustomizingHeaderBar from "../Header/CustomizingHeaderBar";
import ErrorText from "../Text/ErrorText";

const styles = StyleSheet.create({
    container: {
        flex:1,
        borderTopWidth:1.5,
        borderColor:"rgba(28,28,28,0.1)",
        backgroundColor:"rgb(255,255,255)"
    },
    wrapperInRow: {
        flex:1,
        flexDirection:"row",
        alignItems:"center",
    },
    titleTask: {
        flex:1,
        fontSize:14,
        fontFamily:"OpenSansReg",
        color:"#282828",
        overflow:"hidden", 
    },
    modalStyle: {
        height:"100%",
        marginRight:0,
        marginTop:0,
        marginBottom:0,
        backgroundColor:"rgb(255,255,255)",
    },
    modalFooter: {
        alignItems:"center",
        flexDirection:"row",
        width:"100%",
        justifyContent:"space-between"
    },

    wrapperSettingsItem: {
        marginTop:20, 
        paddingLeft:12, 
        paddingRight:12,
        backgroundColor:"rgb(245,245,245)",
    },
    saveCommentBtn:{
        marginTop:20,
        textAlign:"center",
        padding:5,
        marginBottom:5,
        backgroundColor:"rgb(83,211,175)",
        borderRadius:25,
        right:0,    
    },
    
    commentInput:{
        textAlignVertical:"top",
        minHeight:100,
        maxHeight:300,
        borderColor: "rgb(240,240,240)", 
        padding:10,
        borderWidth: 1, 
        borderRadius:25,
        backgroundColor:"rgb(255,255,255)"
    },
    text: {
        fontSize:12,
        fontFamily:"OpenSansReg"
    }
})

export default class TaskItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputTitle: this.task.title,
            errorTitleStatus: false,
            inputComment: this.task.comment,
            errorCommentStatus: false,
            taskPageIsOpen: false,
            taskDeadlineDatePicker:false,
        }
    }
    task = realm.objectForPrimaryKey("Task",this.props.item_id)

    changeCommentHandler = (value) => {
        this.setState({inputComment:value})
    }

    changeTitleHandler = (value) => {
        this.setState({inputTitle:value})
    }

    submitCommentHandler = () => {
        if (this.state.inputComment !== "" & this.state.inputComment.trim().length > 0) {
            realm.write(() => {
                this.task.comment = this.state.inputComment
            })
            this.setState({
                errorCommentStatus:false
            })
            Keyboard.dismiss()
        }
        else {
            this.setState({
                errorCommentStatus:true
            })
        }
    }

    submitTitleHandler = () => {
        if (this.state.inputTitle !== "" & this.state.inputTitle.trim().length > 0) {
            realm.write(() => {
                this.task.title = this.state.inputTitle;
            })       
            Keyboard.dismiss()
            this.setState({
                errorTitleStatus:false
            })
        }
        else {
            this.setState({
                errorTitleStatus:true
            })
        }
    }
    
    setTaskPageIsOpen = (visible) => {
        this.setState({
            taskPageIsOpen: visible
        })
    }

    saveProject = (value) => {
        realm.write(() => {
            let taskToDelete = this.task.project.tasks.indexOf(this.task)
            this.task.project.tasks.splice(taskToDelete,1)
            value.tasks.push(this.task)
            this.task.project = value
        })
    }

    setDeadlineDate = (value) => {
        realm.write(() => {
            this.task.deadlineDate = value
        })
    }
    render() {
        let priorityTaskStatus = this.task.priority === true
            ? 
                {color:"rgb(83,211,175)",
                icon:"star"}
            : 
                {color:"rgba(48,48,48,0.3)",
                icon:"star-border"}

        let isDoneTaskOpacity = this.task.isDone === true
            ? 0.4
            : 1
        let projects = realm.objects("Project")
        return (
            <>
                <ScrollView keyboardShouldPersistTaps={"always"}>
                    <Pressable  onPress={() => this.setTaskPageIsOpen(!this.state.taskPageIsOpen)}>          
                        <View style={[styles.container,{opacity: isDoneTaskOpacity,}]}>
                            <View style={[sharedStyles.padding10, styles.wrapperInRow]}> 
                                <CheckBox 
                                    status={this.task.isDone} 
                                    onChange={() =>updateIsDone(this.task)}
                                    style={{marginRight:20}} 
                                />                                    
                                <Text             
                                    numberOfLines={1}
                                    style={styles.titleTask}
                                >
                                    {this.task.title}
                                </Text> 
                                <Icon 
                                    type="material" 
                                    name={priorityTaskStatus.icon}
                                    iconStyle = {{
                                        marginLeft:15,
                                        color:priorityTaskStatus.color
                                    }} 
                                    size={28} 
                                    onPress = {() => changePriority(this.task)}
                                />
                            </View>
                        </View>    

                        <Modal 
                            animationIn="slideInRight"
                            animationOut="slideOutRight"
                            swipeDirection="right"
                            isVisible={this.state.taskPageIsOpen} 
                            onSwipeComplete={() => this.setTaskPageIsOpen(!this.state.taskPageIsOpen)}
                            onBackdropPress={() => this.setTaskPageIsOpen(!this.state.taskPageIsOpen)}
                            style={styles.modalStyle} 
                        >
                            <FlexLayout>

                                <CustomizingHeaderBar
                                    style={sharedStyles.paddingSide25}
                                    leftSide={
                                        <CheckBox 
                                            status={this.task.isDone} 
                                            onChange={() =>updateIsDone(this.task)}
                                            style={{marginRight:20}} 
                                        />  
                                    }
                                    centerSide={
                                        <>
                                            <TextInput 
                                                style={[styles.titleTask,{marginLeft:25}]}
                                                name="input"
                                                maxLength={100}
                                                defaultValue={this.task.title}
                                                onChangeText = {(input) => this.changeTitleHandler(input)}
                                                onSubmitEditing={() => {
                                                    this.submitTitleHandler()
                                                }}
                                            />    
                                            {this.state.errorTitleStatus === true ? (
                                                <ErrorText errorValue={strings("inputEmptyError")} />
                                            ) : null  } 
                                        </>
                                    }
                                    rightSide={
                                        <Icon 
                                            type="material" 
                                            name={priorityTaskStatus.icon}
                                            iconStyle = {{
                                                color:priorityTaskStatus.color
                                            }} 
                                            size={28} 
                                            onPress = {() => changePriority(this.task)}
                                        />
                                     }
                                />

                                <FlexLayout style={styles.wrapperSettingsItem}>
                                {     /* <PropertyItem
                                        valueIcon = "calendar-today"
                                        valueTitle = {strings("taskPropertyDate")}
                                        value = {this.task.deadlineDate.toLocaleDateString() + " " + this.task.deadlineDate.toLocaleTimeString()}
                                    />
                                */ }
                                       
                                    <PropertyItem                         
                                        valueIcon = "outlined-flag"
                                        valueTitle = {strings("taskPropertyProject")}
                                        valueContainer = {
                                            <>
                                                <Picker  
                                                    style={{textAlign:'right',opacity:1}}
                                                    onValueChange={(itemValue) =>
                                                        this.saveProject(itemValue)
                                                    }>
                                                        <Picker.Item  
                                                            style={{fontSize:15,color:'#242424'}} 
                                                            label={this.task.project.title} v
                                                            value={this.task.project}
                                                            enabled={false}  
                                                        />
                                                        {projects.map((item) => 
                                                            <Picker.Item 
                                                                style={{fontSize:13}} 
                                                                key={item._id} 
                                                                label={item.title} 
                                                                value={item}  
                                                            />
                                                        )}
                                                </Picker>
                                            </>
                                        }
                                    /> 
                                    <PropertyItem 
                                        valueIcon="today"
                                        valueTitle={strings("taskPropertyDate")}
                                        onPress={() => this.setState({
                                            taskDeadlineDatePicker:!this.state.taskDeadlineDatePicker
                                        })}
                                        valueContainer = {
                                            <Text>
                                                { this.task.deadlineDate? this.task.deadlineDate.toLocaleDateString() + ' ' + this.task.deadlineDate.toLocaleTimeString() : ''}    
                                            </Text>
                                        }
                                    />
                                    <DatePicker
                                        style={{
                                            alignSelf:'flex-end',
                                            display: this.state.taskDeadlineDatePicker ? 'flex' : 'none',
                                            backgroundColor:'rgb(255,255,255)',
                                        }}
                                        date={this.task.deadlineDate? this.task.deadlineDate : new Date()}
                                        onDateChange={(value) => this.setDeadlineDate(value)}
                                    />
                                    

                                    <Text 
                                        style={styles.saveCommentBtn}
                                        onPress={() => {
                                            this.submitCommentHandler()
                                        }}
                                    >
                                        {strings("saveComment")} 
                                    </Text>

                                    <TextInput 
                                        style={styles.commentInput}
                                        name="input"
                                        multiline={true}
                                        maxLength={1000}
                                        defaultValue={this.task.comment}
                                        onChangeText = {(input) => this.changeCommentHandler(input)}
                                        placeholder={strings("addComment")}
                                    />                                             
                                        {this.state.errorCommentStatus === true 
                                        ? (
                                            <ErrorText errorValue={strings("inputEmptyError")} />
                                        ) 
                                        : null  } 

                                    <Text style={[sharedStyles.padding10,styles.text]}>
                                        {strings("taskCreatedAt")}{this.task.createdDate.toLocaleDateString() + " " + this.task.createdDate.toLocaleTimeString()}
                                    </Text>
                                </FlexLayout>

                                <View style={[styles.modalFooter,sharedStyles.padding10]}>
                                    <Icon 
                                        name="arrow-forward" 
                                        color="#484848"
                                        size={28} 
                                        onPress={() => this.setTaskPageIsOpen(!this.state.taskPageIsOpen)} 
                                    />
                                    <Icon 
                                        name="delete-outline" 
                                        color="#EE5436"
                                        size={28} 
                                        onPress={() => deleteTask(this.task)}
                                    />
                                </View>

                            </FlexLayout>
                        </Modal>
                    </Pressable>     
                </ScrollView>
            </>
        );
    }
}
