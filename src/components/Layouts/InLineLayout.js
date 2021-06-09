import React from 'react';
import {View} from 'react-native';
import sharedStyles from '../../styles/shared';

const InLineLayout = ({children,style}) => {
    return (
        <View style={[sharedStyles.wrapperInLine,{...style}]}>
            {children}
        </View>
    )
}

export default InLineLayout