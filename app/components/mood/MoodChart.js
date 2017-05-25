'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import theme from '../../style/theme';
import Chart from './Chart';
const { height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class MoodChart extends Component {
  render() {
    const { cityData, ownData, teamData, limitLineData } = this.props;

    return (
      <View style={styles.container}>
        <Chart
          limitLineData={limitLineData}
          cityData={cityData}
          ownData={ownData}
          teamData={teamData}
          height={(height / (IOS ? 2.5 : 2.75)) - 50}
        />
      </View>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    height: height / (IOS ? 2.5 : 2.75),
    paddingTop: 10,
    paddingBottom: 50,
    backgroundColor: theme.secondary
  }
});


export default MoodChart;
