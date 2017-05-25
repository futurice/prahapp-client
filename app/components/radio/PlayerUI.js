import React, { PropTypes, Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native';
import autobind from 'autobind-decorator';

import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import {
  PLAYING,
  STREAMING,
  PAUSED,
  STOPPED,
  ERROR,
  METADATA_UPDATED,
  BUFFERING,
  START_PREPARING,
  BUFFERING_START,
} from '../../constants/RadioStates';

const IOS = Platform.OS === 'ios';
const { width } = Dimensions.get('window');

// Player UI Component
class Player extends Component {

  static defaultProps = {
    radioStationName: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      status: STOPPED,
      song: ''
    };
  }

  componentDidMount() {
    const { setRadioSong, setRadioStatus } = this.props;
    this.subscription = DeviceEventEmitter.addListener(
      'AudioBridgeEvent', (evt) => {
        // We just want meta update for song name
        if (evt.status === METADATA_UPDATED && evt.key === 'StreamTitle') {
          setRadioSong(evt.value);
        } else if (evt.status !== METADATA_UPDATED) {
          // TODO
          // evt can also contain progress & duration
          // check if useful, would be cool
          setRadioStatus(evt.status);
        }
      }
    );

    ReactNativeAudioStreaming.getStatus((error, { status }) => {
      (error) ? console.log(error) : setRadioStatus(status)
    });
  }

  @autobind
  renderPlayerText() {
    const {url, song, radioStationName, isPlaying} = this.props;
    if (!radioStationName) {
      return null;
    }
    if (!url && !song) {
      return <Text style={styles.stationTitle}>{radioStationName.toUpperCase()} IS AVAILABLE SOON</Text>
    }
    if (!!url && !isPlaying) {
      return <Text style={styles.stationTitle}>LISTEN TO {radioStationName.toUpperCase()}</Text>
    }
    if (!!song) {
      return <Text style={styles.songName}>{song}</Text>
    } else if (isPlaying) {
      return <Text style={styles.songName}>{radioStationName.toUpperCase()}</Text>
    }
  }

  render() {
    let icon = null;
    const { status, url, onRadioPress } = this.props;
    const iconStyle = [styles.icon];

    if (!url) {
      iconStyle.push(styles.icon__disabled)
    }

    switch (status) {
      case STREAMING:
      case PLAYING:
        icon = <Icon name="pause-circle-outline" style={iconStyle} />;
        break;
      case ERROR:
      case PAUSED:
      case STOPPED:
        icon = <Icon name="play-circle-outline" style={iconStyle} />;
        break;
      case BUFFERING:
      case BUFFERING_START:
      case START_PREPARING:
        icon = <ActivityIndicator
          size={IOS ? 'small' : 22}
          color={theme.secondary}
          animating={true}
          style={styles.loader}
        />;
        break;
    }

    if (!url) {
      icon = <Icon name="access-time" style={iconStyle} />;
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={onRadioPress}>
        {icon}
        </TouchableOpacity>
        <View style={styles.textContainer}>
          {this.renderPlayerText()}
        </View>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  button: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
  },
  icon: {
    backgroundColor: 'transparent',
    fontSize: 26,
    marginLeft: 5,
    marginRight: 15,
    color: theme.secondary,
  },
  icon__disabled: {
    color: '#ccc'
  },
  loader: {
    marginLeft: 5,
    width: 26,
    marginRight: 15,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 30,
  },
  textLive: {
    color: theme.dark,
  },
  stationTitle: {
    fontWeight: '100',
    fontSize: 10,
    color: theme.dark,
    opacity: 0.8,
  },
  songName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.dark
  }
});

Player.propTypes = {
  url: PropTypes.string,
  status: PropTypes.string,
  song: PropTypes.string,
  setRadioStatus: PropTypes.func,
  setRadioSong: PropTypes.func,
};

export default Player;
