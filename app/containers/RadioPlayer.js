'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
  SegmentedControlIOS,
  BackHandler
} from 'react-native';
import { findIndex } from 'lodash';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  getRadioMode,
  getRadioStatus,
  getRadioName,
  getRadioStations,
  getActiveStationId,
  getActiveStation,
  getNowPlaying,
  toggleRadioBar,
  setRadioSong,
  setRadioStatus,
  setRadioStationActive,
  onRadioPress,
  isRadioPlaying
} from '../concepts/radio';
import theme from '../style/theme';
import autobind from 'autobind-decorator';
import PlayerUI from '../components/radio/PlayerUI';
import PlatformTouchable from '../components/common/PlatformTouchable';
import ModalBackgroundView from '../components/common/ModalBackgroundView';
import RadioWebsiteLink from '../components/radio/RadioWebsiteLink';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  PLAYING,
  STREAMING,
  PAUSED,
  STOPPED,
  ERROR,
  BUFFERING,
  START_PREPARING,
  BUFFERING_START,
} from '../constants/RadioStates';

const IOS = Platform.OS === 'ios';
const { height, width } = Dimensions.get('window');

const PLAYER_HEIGHT_EXPANDED = IOS ? height - 60 - 50 : height - 134;
const PLAYER_HEIGHT = IOS ? 40 : 40;

class RadioPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerHeight: new Animated.Value(PLAYER_HEIGHT),
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.closeOnBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.closeOnBack);
  }

  @autobind
  closeOnBack() {
    if (this.props.expanded) {
      this.close()
      return true;
    }
    return false;
  }

  @autobind
  toggle() {
    const nextState = !this.props.expanded;
    if (!nextState) {
      return;
    }

    this.animateRadioBar(nextState);
    this.props.toggleRadioBar(nextState);
  }

  @autobind
  close() {
    this.animateRadioBar(false);
    this.props.toggleRadioBar(false);
  }

  animateRadioBar(nextState) {
      Animated.spring(this.state.playerHeight,
        { duration: 250, toValue: nextState ? PLAYER_HEIGHT_EXPANDED : PLAYER_HEIGHT}).start();
  }

  @autobind
  onRadioButtonPress() {
    const radioEnabled = !!this.props.currentStation.get('stream');

    if (radioEnabled) {
      this.props.onRadioPress()
    }

  }

  @autobind
  changeRadioStationTabIOS(event, stationsTabs) {
    const { stations } = this.props;
    const index = event.nativeEvent.selectedSegmentIndex;
    const nextStation = stations.find(s => s.get('name') === stationsTabs[index]);
    this.props.setRadioStationActive(nextStation.get('id'))
  }

  renderExpandedContent() {
    const { stations, activeStationId, currentStation, nowPlaying, status } = this.props;

    const url = currentStation.get('stream');

    const buttonStyle = [styles.button];
    if (!url) {
      buttonStyle.push(styles.button__disabled)
    }

    let icon = null;
    switch (status) {
      case STREAMING:
      case PLAYING:
      case BUFFERING:
      case BUFFERING_START:
      case START_PREPARING:
        icon = <Icon name="pause" style={styles.playIcon} />;
        break;
      case ERROR:
      case PAUSED:
      case STOPPED:
        icon = <Icon name="play-arrow" style={styles.playIcon} />;
        break;
    }

    if (!url) {
      icon = <Icon name="access-time" style={styles.playIcon} />
    }

    const stationsTabs = stations ? stations.map(s => s.get('name')).toJS() : [];

    return (
      <ModalBackgroundView blurType="light" style={styles.containerExpanded}>
        {IOS ?
        <View style={styles.iosTabs}>
          <SegmentedControlIOS
            tintColor={theme.secondary}
            selectedIndex={findIndex(stationsTabs, stationName => stationName === currentStation.get('name'))}
            values={stationsTabs}
            onChange={(event) => this.changeRadioStationTabIOS(event, stationsTabs)}
          />
        </View>
        :
        <View style={styles.tabs}>
          {!!stations && stations.map((station, index) =>
            <PlatformTouchable key={index} delayPressIn={0} onPress={() => this.props.setRadioStationActive(station.get('id'))}>
              <View key={index} style={[styles.tab, station.get('id') === activeStationId ? styles.tab__active : {}]}>
                  <Text style={styles.tabText}>{station.get('name')}</Text>
              </View>
            </PlatformTouchable>
          )}
        </View>
        }

        <View style={styles.radioContent}>
          <View style={styles.radioProgram}>
            <Text style={styles.programTitle}>
              {nowPlaying.get('programTitle') || ' '}
            </Text>

            <Text style={styles.programHost}>
              {url
              ? nowPlaying.get('programHost') || ' '
              : `${currentStation ? currentStation.get('name', 'Radio') : 'Radio'} is Available Soon`
              }
            </Text>

            <TouchableHighlight underlayColor={url ? theme.secondaryLight : theme.grey} onPress={this.onRadioButtonPress} style={buttonStyle}>
              <Text style={styles.buttonText}>
                {icon}
              </Text>
            </TouchableHighlight>
          </View>

          {!!currentStation.get('website') && <RadioWebsiteLink currentStation={currentStation} />}
        </View>

        <TouchableOpacity onPress={this.close} style={styles.close} activeOpacity={IOS ? 0.3 : 0.6} >
          <Icon name="expand-less" style={styles.closeArrow} />
        </TouchableOpacity>
      </ModalBackgroundView>
    )
  }

  formatSongTitle(nowPlaying) {
    const host = nowPlaying.get('programHost') || '';
    const title = nowPlaying.get('programTitle') || '';

    if (!title && !host) {
      return null;
    }

    return title || host;
  }

  render() {
    const { playerHeight } = this.state;
    const { expanded, isPlaying, status, nowPlaying, currentStation } = this.props;

    return (
      <Animated.View style={[styles.container, !expanded ? styles.containerCompact : {}, { height: playerHeight }]}>
        {expanded && this.renderExpandedContent()}

        {(IOS || !expanded) && <TouchableOpacity
        activeOpacity={1}
        onPress={this.toggle}
        style={styles.pressable}>
          <PlayerUI
            setRadioStatus={this.props.setRadioStatus}
            setRadioSong={this.props.setRadioSong}
            radioStationName={currentStation ? currentStation.get('name') : ''}
            status={status}
            onRadioPress={this.props.onRadioPress}
            song={this.formatSongTitle(nowPlaying)}
            url={currentStation ? currentStation.get('stream') : ''}
            isPlaying={isPlaying}
          />
        </TouchableOpacity>
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderStyle: 'solid',
    borderBottomWidth: IOS ? 1 : 0,
    borderBottomColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    height: PLAYER_HEIGHT,
    zIndex: 0,
    top: IOS ? 20 : 0,
    backgroundColor: IOS ? 'rgba(255, 255, 255, .2)' : theme.white,
    overflow: 'hidden',
    elevation: 2,
  },
  containerCompact: {
    backgroundColor: theme.white
  },
  pressable: {
    paddingRight: 10,
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },

  // expanded
  containerExpanded: {

    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    elevation: 2,
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: IOS ? theme.transparent : theme.white
  },
  close: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 0,
    paddingBottom: IOS ? 14 : 11,
    width: 60,
    alignItems: 'flex-end',
  },
  closeArrow: {
    fontSize: 33,
    paddingRight: 10,
    color: 'rgba(0, 0, 0, .4)',
    backgroundColor: 'transparent'
  },
  iosTabs: {
    margin: 15,
  },
  tabs: {
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: IOS ? 0 : 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingTop: 2,
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  tabText: {
    paddingRight: 20,
    paddingLeft: 20,
    padding: 10,
    color: theme.secondary
  },
  tab__active: {
    borderBottomColor: theme.secondary
  },
  radioContent: {
    backgroundColor: theme.transparent,
    flexGrow: 1,
  },
  radioProgram: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 2,
    backgroundColor: 'transparent',
    paddingBottom: 50,
  },
  programHost: {
    color: 'rgba(0, 0, 0, .5)',
    fontWeight: '500',
    fontSize: 16,
  },
  programTitle: {
    padding: 7,
    paddingTop: 0,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 21,
    color: theme.black,
  },
  button: {
    marginTop: 25,
    backgroundColor: theme.secondary,
    height: width / 3,
    width: width / 3,
    borderRadius: width / 6,
    elevation: 2,
    borderWidth: 0,
    borderColor: '#f6f6f6',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      height: 7,
      width: 0
    },
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    backgroundColor: 'transparent',
    fontSize: 100,
    fontWeight: 'bold',
    color: theme.white
  },
  playIcon: {
    fontSize: width / 6,
  },
  button__disabled: {
    backgroundColor: theme.grey,
  }

});

const mapDispatchToProps = {
  setRadioStatus,
  setRadioSong,
  setRadioStationActive,
  toggleRadioBar,
  onRadioPress,
}

const mapStateToProps = createStructuredSelector({
  name: getRadioName,
  status: getRadioStatus,
  nowPlaying: getNowPlaying,
  isPlaying: isRadioPlaying,
  expanded: getRadioMode,
  stations: getRadioStations,
  activeStationId: getActiveStationId,
  currentStation: getActiveStation,
});

export default connect(mapStateToProps, mapDispatchToProps)(RadioPlayer);

