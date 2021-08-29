import React from 'react';
import {TouchableOpacity, Image, StyleSheet,View,Text, Pressable} from 'react-native';
import InLineLayout from '../Layouts/InLineLayout';
import sharedStyles from '../../styles/shared';
import {Icon} from 'react-native-elements';

export default PropertyItem = ({valueIcon,valueTitle,valueContainer,_onPress }) => {

    const styles = StyleSheet.create ({
        inlineContainer:{
            justifyContent:'space-between',
            borderWidth:1,
            borderRadius:25,
            height:50,
            borderColor:'rgb(234, 234, 234)',
            paddingVertical:5,
            paddingHorizontal:15,
            backgroundColor:"rgb(255,255,255)",
        },
        valueTextStyle: {
            fontSize:14,
            fontFamily:'OpenSansSemiBold',
            marginLeft:15,
            marginRight:15
        },
    })


  return (
    <Pressable style={sharedStyles.margintop20}>
            <InLineLayout style={styles.inlineContainer}>
                <InLineLayout style={{justifyContent:'flex-start',flex:2,}}>
                    <Icon size={20} name={valueIcon} />
                    <Text style={[styles.valueTextStyle]}> 
                        {valueTitle}
                    </Text>
                </InLineLayout>
                <View style={{flex:3}}>
                    {valueContainer} 
                </View>
            </InLineLayout>
    </Pressable>
  );
}

