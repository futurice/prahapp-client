'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

import {
  getOwnMoodData,
  getTeamMoodData,
  getCityMoodData,
  getLimitLineData,
  getCurrentTeamName,
  getKpiValues,
  isMoodLoading,
  fetchMoodData
} from '../concepts/mood';

import Notification from '../components/common/Notification';
import MoodChart from '../components/mood/MoodChart';
import MoodKpis from '../components/mood/MoodKpis';
import MoodSlider from '../components/mood/MoodSlider';
import Fab from '../components/common/Fab';
import theme from '../style/theme';
import autobind from 'autobind-decorator';
import { openRegistrationView } from '../actions/registration';
import { getCurrentCityName } from '../concepts/city';
import Icon from 'react-native-vector-icons/Ionicons';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

class MoodView extends Component {

  componentDidMount() {
    this.props.fetchMoodData()
  }

  @autobind
  navigateToMoodSlider() {
    if (!this.props.isRegistrationInfoValid) {
      this.props.openRegistrationView();
    } else {
      this.props.navigator.push({
        showName: true,
        component: MoodSlider,
        name: 'Whappu Vibe today',
        hideNavButton: true
      });
    }
  }

  render() {
    const { cityMoodData, ownMoodData, teamMoodData, limitLineData, moodKpiValues,
      isNotificationVisible, notificationText, cityName, teamName, isLoading } = this.props;


    return (
      <View style={styles.container} >

        <ActivityIndicator style={styles.loader} animating={isLoading} size={'large'} color={theme.accentLight} />
        <MoodChart cityData={cityMoodData} ownData={ownMoodData} teamData={teamMoodData} limitLineData={limitLineData} />

        <Fab
          onPress={this.navigateToMoodSlider}
          styles={styles.button}
          disabled={false}
          underlayColor={theme.white}
        >
          <Text style={styles.buttonText}>
            ADD VIBE
          </Text>
        </Fab>

        <Fab
          onPress={this.props.fetchMoodData}
          styles={styles.buttonSmall}
          disabled={false}
          underlayColor={theme.white}
        >
          <Text style={styles.smallButtonText}>
            <Icon name={IOS ? 'ios-refresh' : 'md-refresh'} size={IOS ? 24 : 22} />
          </Text>
        </Fab>

        <MoodKpis kpiValues={moodKpiValues} cityName={cityName} teamName={teamName} />

        <Notification visible={isNotificationVisible} topOffset={IOS ? 20 : 0}>
          {notificationText}
        </Notification>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: IOS ? 20 : 0,
    backgroundColor: theme.white,
  },
  loader: {
    width: 50,
    position: 'absolute',
    zIndex: 3,
    left: width / 2 - 25,
    top: 50,
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    top: IOS ? (height / 2.5) - 20 : (height / 2.75) - 40,
    zIndex: 2,
    left: (width / 2) - 40,
    backgroundColor: theme.white,
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
  },
  buttonSmall: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    right: 25,
    zIndex: 2,
    top: IOS ? (height / 2.5) - 0 : (height / 2.75) - 20,
    backgroundColor: theme.stable,
    width: 40,
    height: 40,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
  },
  smallButtonText: {
    color: theme.midgrey,
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 9,
  },
  buttonText: {
    color: theme.secondary,
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  }
});

const mapDispatchToProps = { fetchMoodData, openRegistrationView };

const mapStateToProps = state => {
  const isRegistrationInfoValid = state.registration.get('name') !== '' &&
    state.registration.get('selectedTeam') > 0;
  return {
    cityMoodData: getCityMoodData(state),
    ownMoodData: getOwnMoodData(state),
    teamMoodData: getTeamMoodData(state),
    limitLineData: getLimitLineData(state),
    moodKpiValues: getKpiValues(state),
    cityName: getCurrentCityName(state),
    teamName: getCurrentTeamName(state),
    isLoading: isMoodLoading(state),
    isNotificationVisible: state.competition.get('isNotificationVisible'),
    notificationText: state.competition.get('notificationText'),
    isRegistrationInfoValid
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MoodView);

