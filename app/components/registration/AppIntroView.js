'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import AppIntro from 'react-native-app-intro';

import Text from '../common/MyText';
import theme from '../../style/theme';
import Button from '../../components/common/Button';
import InstructionView from './InstructionView';
import SkipView from './SkipView';
import IntroView from './IntroView';
import ModalBox from 'react-native-modalbox';
import {
  putUser,
  reset,
  dismissIntroduction,
  closeRegistrationView,
} from '../../actions/registration';
import { isUserLoggedIn } from '../../reducers/registration';
import { getCityIdByTeam, getCityId } from '../../concepts/city';
import { openLoginView } from '../../concepts/auth';
import * as keyboard from '../../utils/keyboard';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

class RegistrationView extends Component {
  propTypes: {
    name: PropTypes.string.isRequired,
    teams: PropTypes.any,
    selectedTeam: PropTypes.number.isRequired,
    isRegistrationViewOpen: PropTypes.bool.isRequired,
    isRegistrationInfoValid: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      showSkipButton: false,
      selectedCity: props.selectedCityId || 2,
      index: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isRegistrationViewOpen && nextProps.isRegistrationViewOpen) {

      const startingSelectedCity = nextProps.isRegistrationInfoValid
        ? nextProps.selectedCityId
        : nextProps.viewCityId;

      this.setState({ selectedCity: startingSelectedCity || 2 });
    }
  }

  @autobind
  onRegister() {
    this.props.putUser();
  }

  @autobind
  onSelectCity(id) {
    this.setState({ selectedCity: id });
  }


  @autobind
  onClose() {
    this.props.reset();
    this.props.dismissIntroduction();
    this.props.closeRegistrationView();
  }

  changeSlide(index) {
    this.setState({
      showSkipButton: index > 0,
      index
    });
  }


  @autobind
  scrollToNameSelection() {
    const regScroll = this.containerScrollViewRef;
    if (regScroll && !IOS) {
      setTimeout(() => {
        regScroll.scrollTo({x: 0, y: 2000, animated: true});
      }, 750);
    }
  }

  renderAppIntro() {

    return (
      <ModalBox
        isOpen={true || this.props.isRegistrationViewOpen}
        swipeToClose={false}
        backdropPressToClose={false}
        animationDuration={0}
      >
        <AppIntro
          skipBtnLabel={<Text style={{ fontWeight: '500', fontSize: 18 }}>SKIP</Text>}
          doneBtnLabel={<Text style={{ fontWeight: '500', fontSize: 18, lineHeight: IOS ? 22 : 32 }}>SKIP</Text>}
          onSkipBtnClick={this.onClose}
          onDoneBtnClick={this.onClose}
          showSkipButton={false}
          // showDoneButton={SOME_CONDITION}
          showDoneButton={false}
          onSlideChange={(index) => this.changeSlide(index)}
          defaultIndex={this.state.index}
          leftTextColor={theme.blue2}
          rightTextColor={theme.blue2}
          activeDotColor={theme.blue2}
          nextBtnLabel={<Icon name="chevron-right" style={{ lineHeight: IOS ? 40 : 40 }} size={32} />}
          style={{backgroundColor: theme.yellow }}
          dotColor={'rgba(0, 0, 0, .3)'}>
          {/* Slide 1 */}
          <IntroView style={styles.slide} selectedCity={this.state.selectedCity} onSelect={this.onSelectCity} cities={this.props.cities} />

          {/* Slide 2
          <View style={[styles.slide, styles.slideIntro]} >
            <View style={styles.topArea} level={10} >
              <View style={styles.iconWrap}>
                <Image style={styles.bgImage} source={require('../../../assets/patterns/sea.png')} />
                <Icon style={styles.icon} name={'face'} />
                <Icon style={styles.subIcon} name={'chat-bubble-outline'} />
                <Icon style={[styles.subIcon, { top: IOS ? -20 : 0, left: IOS ? 65 : 70, fontSize: IOS ? 50 : 35 }]} name={'event'} />
                <Icon style={[styles.subIcon, { top: 20, left: IOS ? -15 : 0, fontSize: 50 }]} name={'photo-camera'} />
              </View>
            </View>
            <View level={-10} >
              <InstructionView simplified={true} closeRegistrationView={this.onClose} />
            </View>
          </View>
          */}

          {/* Slide 3 */}
          <View style={[styles.slide, styles.slideIntro]} >
            <View style={styles.topArea} level={10} >
              <View style={styles.iconWrap}>
                <Image style={styles.subImage} source={require('../../../assets/chilicorn.png')} />
                {/*
                <Image style={styles.bgImage} source={require('../../../assets/patterns/sea.png')} />
                <Icon style={styles.icon} name={'people-outline'} />
                <Icon style={[styles.subIcon, { left: 115, top: IOS ? -15 : 0, }]} name={'wb-sunny'} />
                */}
              </View>
            </View>
            <View level={-10} >
              <SkipView onPressProfileLink={() => {
                this.onClose();
                this.props.openLoginView();
              }}
              />
            </View>
          </View>

        </AppIntro>
      </ModalBox>
    );
  }

  render() {
    const { isUserLogged } = this.props;

    return !isUserLogged ? this.renderAppIntro() : null;
  }

}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:50,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: theme.yellow,
    padding: 0,
  },
  text: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Slide top

  slideIntro: {
    backgroundColor: theme.yellow,
    paddingTop: height / 2.3,
  },
  topArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
    flexGrow: 1,
    backgroundColor: theme.yellow,
    minHeight: height / 2.3,
    // alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  iconWrap: {
    // overflow: 'hidden',
    position: 'absolute',
    width: IOS ? 190 : 210,
    height: IOS ? 190 : 210,
    borderRadius: IOS ? 95 : 105,
    left: width / 2 - 105,
    top: IOS ? width / 6 : width / 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  subImage: {
    width: width - 150,
    height: width - 150,
    left: 0,
    bottom: 0,
    position: 'relative',
    zIndex: 2,
  },
  icon: {
    // width: 200,
    // left: width / 2 - 100,
    // top: 50,
    // position: 'absolute',
    textAlign: 'center',
    opacity: 1,
    backgroundColor: theme.transparent,
    fontSize: 150,
    width: 150,
    height: 150,
    // tintColor: theme.white,
    color: theme.blue2,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.blue1,
    fontSize: IOS ? 90 : 60,
    left: IOS ? 140 : 135,
    top: IOS ? -5 : 10,
    position: 'absolute'
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 190,
    height: 190,
    borderRadius: 95,
    overflow: 'hidden',
    bottom: 0,
    opacity: 0.3
  },
});

const mapDispatchToProps = {
  putUser,
  reset,
  dismissIntroduction,
  openLoginView,
  closeRegistrationView,
};

const select = store => {

  return {
    isIntroductionDismissed: store.registration.get('isIntroductionDismissed'),
    isRegistrationViewOpen: store.registration.get('isRegistrationViewOpen'),
    name: store.registration.get('name'),
    selectedTeam: store.registration.get('selectedTeam'),
    selectedCityId: getCityIdByTeam(store),
    viewCityId: getCityId(store),
    teams: store.team.get('teams'),
    cities: store.city.get('list'),
    isChooseTeamViewOpen: store.team.get('isChooseTeamViewOpen'),
    isRegistrationInfoValid: !!store.registration.get('name') &&
      !!store.registration.get('selectedTeam'),
    isUserLogged: isUserLoggedIn(store)
  };
};

export default connect(select, mapDispatchToProps)(RegistrationView);
