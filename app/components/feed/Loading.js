
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from 'react-native';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
  },
  loadMessage: {
    textAlign:'center',
    color:'#999'
  }
});

const Loading = props => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        color={theme.primary}
        animating={true}
        style={styles.activityIndicator}
        size='large' />
      <Text style={ styles.loadMessage}>Loading awesomeness...</Text>
    </View>
  );
};

export default Loading;
