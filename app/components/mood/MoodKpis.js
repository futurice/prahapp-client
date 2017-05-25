'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';

import { isNil } from 'lodash';
import { VictoryPie } from 'victory-native';
import theme from '../../style/theme';

const IOS = Platform.OS === 'ios';

class MoodKpis extends Component {

  render() {
    const { kpiValues, teamName, cityName } = this.props;

    const KPI_VALUES = ['ratingPersonal', 'ratingTeam', 'ratingCity'];
    const KPI_LABELS = ['You', teamName || 'Team', cityName || 'City'];
    const KPI_COLORS = [theme.white, theme.accent, theme.dark];

    return (
      <View style={styles.container}>
        <Text style={styles.title}>VIBES TODAY</Text>
        <View style={styles.data}>
        {KPI_VALUES.map((value, index) =>
          <View style={styles.col} key={value}>
            <View style={styles.doughnut}>
            <VictoryPie
              data={[
                {label: '+', value: kpiValues.get(value)},
                {label: '-', value: 100 - kpiValues.get(value) }
              ]}
              style={{
                data: {
                fill: (d) => {
                  const isBackground = d.label === '-';
                  if (isBackground) {
                    return '#eee';
                  }
                  return d.y > 50 ? theme.primary : theme.secondary
                }},
                labels: { fontSize: 0, opacity: 0 }
              }}
              innerRadius={39}
              padding={0}
              width={84}
              height={84}
              x="label"
              y={(datum) => datum.value}
            />
            </View>
            <Text style={[styles.kpi, { color: kpiValues.get(value) > 50 ? theme.primary : theme.secondary }]}>
              {!isNil(kpiValues.get(value)) ? `${kpiValues.get(value)}%` : 'N/A'}
            </Text>
            <View style={styles.label}>
              <View style={[styles.bullet, { backgroundColor: KPI_COLORS[index] }]} />
              <Text style={styles.labelText}>{KPI_LABELS[index] || ''}</Text>
            </View>
          </View>
        )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingTop: IOS ? 0 : 30,
    paddingBottom: IOS ? 10 : 0,
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  data: {
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: IOS ? 20 : 15,
    color: theme.subtlegrey,
  },
  doughnut: {
    position: 'absolute',
    left: 24,
    top: IOS ? 0 : 2,
  },
  col: {
    minWidth: 94,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 40,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 94,
    minWidth: 94,
    maxWidth: 94,
  },
  labelText: {
    color: theme.dark,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  kpi: {
    color: theme.secondary,
    fontWeight: '300',
    fontFamily: !IOS ? 'sans-serif-light' : undefined,
    fontSize: 18,
    textAlign: 'center',
    right: -1, // percentage sign
    marginTop: 12,
  },
  bullet: {
    borderWidth: 2,
    borderColor: '#ddd',
    marginLeft: -15,
    marginRight: 5,
    top: 2,
    backgroundColor: theme.secondary,
    width: 11,
    height: 11,
    borderRadius: 6
  }
});

export default MoodKpis;

