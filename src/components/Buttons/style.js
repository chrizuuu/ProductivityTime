import { StyleSheet} from 'react-native';

const styleButton = StyleSheet.create ({
    button: {
        width:'100%',
        height:40,
        fontSize:16,
        justifyContent:'center',
    }, 
    buttonText: {
        fontWeight:'700',
        textAlign:'center',
    },
    linkText: {
        fontSize:14,
        opacity:0.8,
    },

    buttonControls: {
        width:60,
        height:60,
        fontSize:16,
        justifyContent:'center',
        backgroundColor:'#1976D2',
        borderRadius:50,
        margin:10,
    }, 


});

export default styleButton;