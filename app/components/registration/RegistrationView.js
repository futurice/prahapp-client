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
import Team from './Team';
import Toolbar from './RegistrationToolbar';
import {
  putUser,
  updateName,
  selectTeam,
  reset,
  generateName,
  dismissIntroduction,
  openRegistrationView,
  closeRegistrationView,
} from '../../actions/registration';
import { isUserLoggedIn } from '../../reducers/registration';
import { setCity, getCityIdByTeam, getCityId } from '../../concepts/city';
import { openLoginView } from '../../concepts/auth';
import { showChooseTeam } from '../../actions/team';
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

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.isRegistrationViewOpen && this.props.isRegistrationInfoValid) {
        this.onCloseProfileEditor()
        return true;
      }
      return false;
    })
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
  onChangeName(name) {
    this.props.updateName(name);
  }

  @autobind
  onSelectTeam(id) {
    this.props.selectTeam(id);
    this.scrollToNameSelection();
  }

  @autobind
  onSelectCity(id) {
    this.setState({
      selectedCity: id
    });
  }

  @autobind
  onGenerateName() {
    this.props.generateName();
  }

  @autobind
  onShowChooseTeam() {
    this.props.showChooseTeam();
  }

  @autobind
  onDismissIntroduction() {
    if (this.props.isRegistrationInfoValid) {
      this.onRegister();
    }
    this.props.dismissIntroduction();
  }

  @autobind
  onClose() {
    this.props.reset();
    // this.props.setCity(this.state.selectedCity);
    this.props.dismissIntroduction();
    this.props.closeRegistrationView();
  }

  @autobind
  onCloseProfileEditor() {
    if (this.props.isRegistrationInfoValid) {
      this.onRegister();
    }
    this.props.closeRegistrationView();
  }

  teamIsValid() {
    const { selectedTeam, teams } = this.props
    const { selectedCity } = this.state;
    const team = teams.find(t => t.get('id') === selectedTeam);

    if (team) {
      return team.get('city') === selectedCity;
    }
    return false;
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

  _renderNameSelectContainer() {
    const simplified = this.props.isIntroductionDismissed;
    const containerStyles = [styles.container, styles.modalBackgroundStyle, simplified && styles.simplified]

    return (
      <View style={containerStyles}>

        <Toolbar icon={'done'}
          iconClick={this.onCloseProfileEditor}
          title='Fill your profile' />

        <ScrollView
          ref={view => this.containerScrollViewRef = view}
          showsVerticalScrollIndicator={true}
          style={{flex:1}}>
          <View style={[styles.innerContainer]}>
            {!simplified && this._renderCitySelect()}
            <View style={styles.inputGroup}>
              <View style={[styles.inputLabel, {backgroundColor: !simplified ? theme.white : '#eee'}]}>
                <Text style={styles.inputLabelText}>Choose your Team</Text>
              </View>

              <View style={[styles.inputFieldWrap, { paddingBottom: 0 }]}>
                <ScrollView style={{flex:1, height: IOS ? 210 : null}}>
                  {this.props.teams.map(team => {
                    if (team.get('city') === this.state.selectedCity) {
                      return <Team
                        key={team.get('id')}
                        name={team.get('name')}
                        teamid={team.get('id')}
                        logo={team.get('imagePath')}
                        selected={this.props.selectedTeam}
                        onPress={this.onSelectTeam.bind(this, team.get('id'))}/>;
                    }}
                  )}
                </ScrollView>
              </View>
            </View>
            {this._renderNameSelect()}
          </View>
        </ScrollView>

        {!simplified && <View style={styles.bottomButtons}>
          <Button
            onPress={this.onRegister}
            style={styles.modalButton}
            isDisabled={!this.props.isRegistrationInfoValid || !this.teamIsValid()}>
            Save
          </Button>
        </View>}
      </View>
    );
  }

  @autobind
  _renderCitySelect() {
    const { selectedCity } = this.state;
    return (
      <View style={styles.inputGroup}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>{`Choose your City`}</Text>
        </View>
        <View style={{flexDirection: 'row', padding: 10, paddingTop: 5 }}>
          {this.props.cities.map((city, i) => {
            const isCitySelected = selectedCity === city.get('id');
            return (
              <View key={i} style={styles.item}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: isCitySelected ? theme.secondary : theme.white}]}
                  onPress={() => this.onSelectCity(city.get('id'))}>
                  <Text style={[styles.text, {color: isCitySelected ? 'white' : theme.midgrey }]}>
                    {city.get('name')}
                  </Text>
                </TouchableOpacity>
              </View>);
            }

          )}
        </View>
      </View>
    );
  }

  _renderNameSelect() {
    return (
      <View style={[styles.inputGroup, {marginBottom:4}]}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>{`Hi there! What's your Whappu name?`}</Text>
        </View>
        <View style={styles.inputFieldWrap}>
          <TextInput
            ref={view => this.nameTextInputRef = view}
            autoCorrect={false}
            autoCapitalize={'words'}
            clearButtonMode={'while-editing'}
            returnKeyType={'done'}
            style={[styles.inputField, styles['inputField_' + Platform.OS]]}
            onChangeText={this.onChangeName}
            onFocus={() => {
              keyboard.onInputFocus(this.containerScrollViewRef, this.nameTextInputRef,300);
            }}
            onBlur={() => {
              keyboard.onInputBlur(this.containerScrollViewRef)
            }}
            value={this.props.name}
          />
        </View>

        <View>
          <TouchableOpacity onPress={this.onGenerateName}>
            <View style={styles.textButton}>
              <Icon name='loop' style={styles.textButtonIcon} />
              <Text style={styles.textButtonText}>Generate wappu name</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
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
          // showDoneButton={this.state.index !== 3 || (this.props.isRegistrationInfoValid && this.teamIsValid())}
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
          {/*
          <View style={[styles.slide, { backgroundColor: '#fff' }]}>
            {this._renderNameSelectContainer()}
          </View>
          */}
        </AppIntro>
      </ModalBox>
    );
  }

  render() {
    const { isUserLogged } = this.props;

    return !isUserLogged || this.props.isRegistrationViewOpen
      ? this.renderAppIntro()
      : null;
    /*
    return (
      !isUserLogged ?
        this.renderAppIntro()
        :
        <Modal
          visible={this.props.isRegistrationViewOpen}
          animationType={'slide'}
          onRequestClose={this.onCloseProfileEditor}
        >
          {this._renderNameSelectContainer()}
        </Modal>
    );
    */
  }

}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:50,
  },
  simplified: {
    paddingBottom: 80,
    alignSelf: 'stretch',
    backgroundColor: theme.secondary
  },
  innerContainer: {
    flex:1,
    paddingTop:15,
    paddingBottom: 50,
    margin: 0,
    borderRadius: 5
  },
  bottomButtons:{
    flex:1,
    flexDirection:'row',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height:50,
    alignItems:'stretch',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  modalButton: {
    borderRadius:0,
    flex:1,
    marginLeft:0,
  },
  modalBackgroundStyle: {
    backgroundColor: '#eee'
  },
  inputGroup:{
    padding: 0,
    backgroundColor:theme.light,
    marginHorizontal:15,
    marginBottom:15,
    elevation:1,
    flex:1,
    borderRadius:5,
    overflow:'hidden'
  },
  item: {
    flex: 1
  },
  button: {
    height: 35,
    borderRadius: 2,
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputLabel:{
    padding: 15,
    paddingTop: 13,
    paddingBottom: 10,
    borderBottomWidth: 0,
    borderColor: '#ddd'
  },
  inputLabelText:{
    fontSize:16,
    color:theme.secondary,
    fontWeight:'bold',
    textAlign: IOS ? 'center' : 'left',
  },
  inputFieldWrap:{
    paddingTop: 5,
    padding:15,
  },
  inputField: {
    height: 40,
    fontSize:16,
  },
  inputField_android: {

  },
  inputField_ios: {
    padding:5,
    backgroundColor: 'rgba(20,20,20,0.05)',
  },
  textButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: IOS ? 'center' : 'flex-start',
    padding: IOS ? 5 : 5,
    paddingLeft:20,
    paddingRight:20,
    marginBottom:15,
  },
  textButtonIcon: {
    color: theme.secondary,
    fontSize:18,
    paddingRight:5
  },
  textButtonText:{
    color: theme.secondary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    textAlign:'center',
    color: theme.white,
    marginTop: 15,
    // marginLeft: IOS ? 25 : 15,
    fontSize: 28
  },
  logo: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    height: 110,
    width: 110
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
  updateName,
  reset,
  setCity,
  selectTeam,
  generateName,
  dismissIntroduction,
  openRegistrationView,
  openLoginView,
  closeRegistrationView,
  showChooseTeam
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
