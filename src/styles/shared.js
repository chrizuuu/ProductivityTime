import { StatusBar } from 'react-native';
import { StyleSheet} from 'react-native';

const sharedStyles = StyleSheet.create ({
    //MARGIN TOP
    margintop15: {marginTop:15},
    margintop20: {marginTop:20},
    //MARGIN BOTTOM
    marginBottom5: {marginBottom:5},
    marginBottom10: { marginBottom:10},
    marginBottom25: {marginBottom:25},
    
    marginSide25: {
        marginLeft:25,
        marginRight:25,
    },

    borderRadius:{ borderRadius:5},
    padding:{padding:10},

    container: {
        height:'100%',
        width:'100%',
        backgroundColor:'#fff',
    },
    wrapperFlexCenter: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    wrapperFlexSpaceBetween: {
        flex:1,
        justifyContent:'space-between',
    },

    wrapperInLine: {
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'space-between',
    }

})

export default sharedStyles;
