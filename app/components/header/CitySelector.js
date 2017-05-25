import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  Easing,
  Platform,
  TouchableHighlight
} from 'react-native'

import autobind from 'autobind-decorator';
import { connect } from 'react-redux';

import {
  setCity,
  getCityList,
  getCityId,
  getCityPanelShowState,
} from '../../concepts/city';

import theme from '../../style/theme';

const cityIcons = {
  'helsinki': require('../../../assets/cities/icon-ota-amfi-accent.png'),
  'tampere': require('../../../assets/cities/icon-tampere-accent.png')
};

const IOS = Platform.OS === 'ios';
const { width } = Dimensions.get('window');

class CitySelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wrapAnimation: new Animated.Value(0),
      contentAnimation: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.animateWrap();
  }

  animateWrap() {
    Animated.timing(
      this.state.wrapAnimation,
      {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(0.75)
      }
      ).start(() => {
        Animated.timing(
          this.state.contentAnimation,
          {
            toValue: 1,
            duration: 250,
            easing: Easing.elastic(2)
          }
          ).start();
      });
  }

  @autobind
  renderCitySelection(city, index) {
    const { currentCity } = this.props;
    const isActive = city.get('id') === currentCity;
    return (
      <View style={styles.filterBtnWrap} key={city.get('id')}>
        <View style={styles.filterBtn}>
          <TouchableHighlight
            style={styles.buttonInner}
            underlayColor={theme.secondaryLight}
            onPress={() => this.props.setCity(city.get('id')) }>
            <Image
              source={(city.get('name') || '').toLowerCase() === 'tampere'
                ? cityIcons.tampere
                : cityIcons.helsinki
              }
              style={styles.cityIcon}
            />
            {/*<MdIcon name={city.get('id') === 3 ? 'domain' : 'location-city'} style={styles.filterIcon} />*/}
          </TouchableHighlight>
        </View>
        <Text style={[styles.filterText, isActive ? styles.activeText : {}]}>{city.get('name')}</Text>
      </View>
    );
  }


  render() {
    const { cities, showCitySelection } = this.props;
    const { wrapAnimation, contentAnimation } = this.state;

    if (!showCitySelection) {
      return <View />;
    }

    return (
    <Animated.View style={[styles.citySelector, {
      transform: [
        // { scale: wrapAnimation },
        { translateY: wrapAnimation.interpolate({ inputRange: [0, 0.3, 1], outputRange: [-80, 0, 0]}) },
        { translateX: wrapAnimation.interpolate({ inputRange: [0, 1], outputRange: [-40, 0]}) }
      ],
      top: wrapAnimation.interpolate({ inputRange: [0, 1], outputRange: IOS ? [30, 70] : [30, 56]}),
      right: wrapAnimation.interpolate({ inputRange: [0, 1], outputRange: [30, 0]}),
      height: wrapAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 170]}),
      width: wrapAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, width]}),
      borderRadius: wrapAnimation.interpolate({ inputRange: [0, 0.9, 1], outputRange: [300, 300, 0]})
    }]}>

      <Animated.View style={[styles.content,
        {
         opacity: contentAnimation,
         transform: [{ scale: contentAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1]}) }]
        }
      ]}>
        {cities.map(this.renderCitySelection)}
      </Animated.View>
    </Animated.View>
    );
  }
};

var styles = StyleSheet.create({
  citySelector: {
    transform: [{ scale: 0 }, { translateY: -80 }, { translateX: -40 }],
    backgroundColor: '#FFF',
    position: 'absolute',
    justifyContent: 'center',
    elevation: 2,
    right: IOS ? null : 0,
    left: IOS ? 0 : null,
    top: IOS ? 70 : 56,
    shadowColor: '#000000',
    shadowOpacity: 0.075,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
  },
  content: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  filterBtnWrap: {
    width: 70,
  },
  filterBtn: {
    overflow: 'hidden',
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.secondary,
  },
  buttonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    flex:1,
    justifyContent:'center',
    alignItems: 'center'
  },
  filterText: {
    color: theme.midgrey,
    fontSize: 14,
    paddingTop: 8,
    textAlign: 'center',
  },
  activeText: {
    color: theme.secondary,
    fontWeight: 'bold',
  },
  filterIcon: {
    color: theme.white,
    fontSize: 33,
  },
  cityIcon: {
    top: -3,
    width: 50,
    height: 50,
  }
});


const mapDispatchToProps = { setCity };

const select = state => {
  return {
    showCitySelection: getCityPanelShowState(state),
    currentCity: getCityId(state),
    cities: getCityList(state),
  }
};

export default connect(select, mapDispatchToProps)(CitySelector);
