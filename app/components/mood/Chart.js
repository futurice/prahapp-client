import React, { Component } from 'react';
import moment from 'moment';
import {
  View,
  Dimensions,
  StyleSheet
} from 'react-native';

import theme from '../../style/theme';
import {
  VictoryChart,
  VictoryAxis,
  VictoryLine
} from 'victory-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class Chart extends Component {

  render() {

    const { cityData, ownData, teamData, limitLineData, height } = this.props;

    const cityDataJS = cityData && cityData.toJS ? cityData.toJS() : null;
    const ownDataJS = ownData && ownData.toJS ? ownData.toJS() : null;
    const teamDataJS = teamData && teamData.toJS ? teamData.toJS() : null;
    const limitLineDataJS = limitLineData ? limitLineData.toJS() : null;

    const xAxisLabels = limitLineDataJS.map(datum => datum.date);

    return (
    <View style={styles.container}>

      <VictoryChart
        padding={0}
        height={height}
        domainPadding={0}
        domain={{y: [0, 100]}}
      >

        <VictoryLine
          x="date"
          labels={['Thermal Whappu']}
          height={height}
          data={limitLineDataJS}
          y={(datum) => datum.value}
          padding={0}
          style={{
            data: {
              stroke: theme.primary,
              strokeWidth: 2,
              strokeDasharray: '5, 5',
            },
            labels: { fontSize: 12 }
          }}
        />


        {cityDataJS &&
        <VictoryLine
          data={cityDataJS}
          height={height}
          x="date"
          y={(datum) => datum.value}
          interpolation="natural"
          padding={0}
          style={{
            data: {
              stroke: theme.dark,
              strokeWidth: 2
            },
            labels: { fontSize: 12 }
          }}
        />
        }
        {teamDataJS &&
        <VictoryLine
          data={teamDataJS}
          height={height}
          x="date"
          y={(datum) => datum.value}
          interpolation="natural"
          padding={0}
          style={{
            data: {
              stroke: theme.accent,
              strokeWidth: 2
            },
            labels: { fontSize: 12 }
          }}
        />
        }

        {ownDataJS &&
        <VictoryLine
          data={ownDataJS}
          height={height}
          x="date"
          y={(datum) => datum.value}
          interpolation="natural"
          padding={0}
          style={{
            data: {
              stroke: theme.white,
              strokeWidth: 2
            },
            labels: { fontSize: 12 }
          }}
        />
        }



        <VictoryAxis
          orientation="left"
          offsetX={width}
          style={{
            axis: { strokeWidth: 0 },
            axisLabel: {fontSize: 16, padding: 20},
            tickLabels: {fontSize: 8, fill: 'rgba(0,0,0,.4)', opacity: 0.9 }
          }}
        />

        <VictoryAxis
          tickValues={xAxisLabels}
          tickFormat={(tick) => xAxisFormatter(xAxisLabels, tick)}
          orientation="bottom"
          offsetY={20}
          padding={0}
          dependentAxis={true}
          style={{
            axis: {stroke: 'rgba(0,0,0,0)'},
            axisLabel: {fontSize: 10, padding: 10},
            tickLabels: {fontSize: 8, padding: 0, fill: 'rgba(0,0,0,.4)',  }
          }}
        />

      </VictoryChart>
    </View>);
  }
};

const xAxisFormatter = (values, tick) => {
  const value = values[tick - 1];

  if (tick === 1 || tick > values.length - 1) {
    return ' ';
  }

  return moment(value, 'YYYY-MM-DD').format('DD');
}

export default Chart;

