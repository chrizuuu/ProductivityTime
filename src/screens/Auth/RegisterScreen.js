import React, { useState } from 'react';
import {StyleSheet,View,Image} from 'react-native';
import sharedStyles from '../../styles/shared';
import FlexLayout from '../../components/Layouts/FlexLayout';
import {HeaderTx,SubHeaderTx} from '../../components/Text/index';
import {AuthInputLabel,AuthInput} from '../../components/Inputs/authInput';
import {LinkButton,SubmitButton} from '../../components/Buttons/index';
import {strings,setI18Config} from '../../translations/translations';
import styles from './style';

export default class RegisterScreen  extends React.Component {
  constructor(props) {
    super(props);
    setI18Config();
  }
  
   render(){
    return(
      <FlexLayout>
              <HeaderTx style={sharedStyles.marginBottom25}>{strings("registerHeader")}</HeaderTx>

              <AuthInputLabel style={sharedStyles.marginBottom}>{strings("registerLabelUsername")}</AuthInputLabel>
              <AuthInput 
              type='username'
              style = {styles.input}
              />

              <AuthInputLabel style={sharedStyles.marginBottom5}>{strings("authLabelEmail")}</AuthInputLabel>
              <AuthInput 
              type='email'
              style = {styles.input}
              />
             
             <AuthInputLabel style={sharedStyles.marginBottom5}>{strings("authLabelPassword")}</AuthInputLabel>     
              <AuthInput 
              type='password'
              secureTextEntry
              style = {styles.input}
              />
              
              <View style={styles.submitContainer}>
                <SubmitButton style={styles.submit}>
                        {strings("registerSubmit")}
                </SubmitButton>
              </View>
  
              <LinkButton style = {sharedStyles.marginBottom25} onPress={() => this.props.navigation.navigate('Login')}>
                {strings("registerSignIn")}
              </LinkButton>
                
        </FlexLayout>
  
  );
    }
  }
  
