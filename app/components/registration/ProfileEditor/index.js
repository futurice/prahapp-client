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

import Text from '../../common/MyText';
import Button from '../../common/Button';
import theme from '../../../style/theme';

import Team from '../Team';
import Toolbar from '../RegistrationToolbar';
import {
  putUser,
  updateName,
  updateUserInfo,
  selectTeam,
  reset,
  closeRegistrationView,
} from '../../../actions/registration';
import { isUserLoggedIn, getUserName, getUserInfo } from '../../../reducers/registration';
import { setCity, getCityIdByTeam, getCityId } from '../../../concepts/city';
import { openLoginView } from '../../../concepts/auth';
import { showChooseTeam } from '../../../actions/team';
import * as keyboard from '../../../utils/keyboard';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

class ProfileEditorView extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.isRegistrationViewOpen && this.props.isRegistrationInfoValid) {
        this.onCloseProfileEditor()
        return true;
      }
      return false;
    })
  }


  constructor(props) {
    super(props);
    this.state = { selectedCity: props.selectedCityId || 2 };
  }


  @autobind
  onSelectTeam(id) {
    this.props.selectTeam(id);
    this.scrollToNameSelection();
  }

  @autobind
  onSelectCity(id) {
    this.setState({ selectedCity: id });
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
  onRegister() {
    this.props.putUser();
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

  renderProfileEditor() {
    return (
      <View style={styles.container}>
        <Toolbar icon={'done'}
          iconClick={this.onCloseProfileEditor}
          title='Your Profile' />

        <ScrollView
          ref={view => this.containerScrollViewRef = view}
          showsVerticalScrollIndicator={true}
          style={{ flex:1 }}
        >
          <View style={[styles.innerContainer]}>
            {/* this.renderCitySelect() */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Text style={styles.inputLabelText}>Tribe</Text>
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
            {this.renderNameSelect()}
          </View>
        </ScrollView>

        <View style={styles.bottomButtons}>
          <Button
            onPress={this.onRegister}
            style={styles.modalButton}
            isDisabled={!this.props.isRegistrationInfoValid}>
            Save
          </Button>
        </View>
      </View>
    );
  }

  @autobind
  renderCitySelect() {
    const { selectedCity } = this.state;
    return (
      <View style={styles.inputGroup}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>Your City</Text>
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


  renderNameSelect() {
    return (
      <View style={[styles.inputGroup, { marginBottom:4 }]}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>Information</Text>
        </View>
        <View style={styles.inputFieldWrap}>
          <TextInput
            ref={view => this.nameTextInputRef = view}
            autoCorrect={false}
            autoCapitalize={'words'}
            clearButtonMode={'while-editing'}
            returnKeyType={'done'}
            style={[styles.inputField, styles['inputField_' + Platform.OS]]}
            onFocus={() => {
              keyboard.onInputFocus(this.containerScrollViewRef, this.nameTextInputRef,300);
            }}
            onBlur={() => {
              keyboard.onInputBlur(this.containerScrollViewRef)
            }}
            onChangeText={this.props.updateName}
            value={this.props.userName}
          />
        </View>

        <View style={styles.inputFieldWrap}>
          <TextInput
            multiline={true}
            autoCorrect={false}
            autoCapitalize={'sentences'}
            clearButtonMode={'while-editing'}
            returnKeyType={'done'}
            style={[styles.inputField, styles.textarea, styles['inputField_' + Platform.OS]]}
            onChangeText={this.props.updateUserInfo}
            value={this.props.userInfo}
          />
        </View>
      </View>
    );
  }

  render() {
    const { isUserLogged, isRegistrationViewOpen } = this.props;
    return (
      <Modal
        visible={isUserLogged && isRegistrationViewOpen}
        animationType={'slide'}
        onRequestClose={this.onCloseProfileEditor}
      >
        {this.renderProfileEditor()}
      </Modal>
    );
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
    backgroundColor: '#f2f2f2'
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
    backgroundColor: theme.black,
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
    fontSize: 15,
    color: theme.secondary,
    fontWeight: 'normal',
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
  textarea: {
    height: 100,
  },
  text: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});


const mapDispatchToProps = {
  putUser,
  updateName,
  updateUserInfo,
  reset,
  setCity,
  selectTeam,
  openLoginView,
  closeRegistrationView,
  showChooseTeam
};

const select = store => ({
  isRegistrationViewOpen: store.registration.get('isRegistrationViewOpen'),
  userName: getUserName(store),
  userInfo: getUserInfo(store),
  selectedTeam: store.registration.get('selectedTeam'),
  selectedCityId: getCityIdByTeam(store),
  viewCityId: getCityId(store),
  teams: store.team.get('teams'),
  cities: store.city.get('list'),
  isRegistrationInfoValid: !!getUserName(store),
  isUserLogged: isUserLoggedIn(store)
})

export default connect(select, mapDispatchToProps)(ProfileEditorView);