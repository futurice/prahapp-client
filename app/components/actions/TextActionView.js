'use strict';

import React, { PropTypes, Component } from 'react';

import {
  View,
  Text,
  TextInput,
  Platform,
  Dimensions,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import Button from '../../components/common/Button';
import theme from '../../style/theme';
// import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons'

import * as CompetitionActions from '../../actions/competition';
const IOS = Platform.OS === 'ios';

const { width, height } = Dimensions.get('window');


class TextActionView extends Component {
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    isTextActionViewOpen: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      formAnimation: new Animated.Value(1),
      okAnimation: new Animated.Value(0)
    }
  }

  showOK() {
    Animated.spring(this.state.okAnimation, {toValue:1, duration:250}).start();
    Animated.timing(this.state.formAnimation, {toValue:0, duration:100}).start();
  }

  hideOK() {
    this.state.formAnimation.setValue(1);
    this.state.okAnimation.setValue(0);
  }

  @autobind
  onChangeText(text) {
    this.setState({text: text});
  }

  @autobind
  onCancel() {
    this.setState({text: ''});
    this.props.dispatch(CompetitionActions.closeTextActionView());
  }

  @autobind
  onSendText() {

    if (!this.state.text.length) {
      this.onCancel();
      return;
    }

    this.showOK()
    setTimeout(() => {
      this.props.dispatch(CompetitionActions.postText(this.state.text));
      this.setState({text: ''});
      this.props.dispatch(CompetitionActions.closeTextActionView());

      // reset values for the next time
      setTimeout(() => {
        this.hideOK();
      },100);

    }, 600);

  }

  render() {

    const { isTextActionViewOpen } = this.props;

    if (!isTextActionViewOpen) {
      return false;
    }

    return (
      <Modal
        onRequestClose={this.onCancel}
        visible={isTextActionViewOpen}
        animationType={'slide'}
      >
        <View style={[styles.container, styles.modalBackgroundStyle]}>

          <Animated.View style={[styles.okView, { opacity: this.state.okAnimation}]}>
            <Animated.View style={[styles.okWrap,
              {opacity: this.state.okAnimation, transform:[{ scale: this.state.okAnimation }]}
            ]}>
              <Icon name='done' style={styles.okSign} />
            </Animated.View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.okText}>Let's publish your message...</Text>
            </View>
          </Animated.View>


          <Animated.View style={[styles.innerContainer, {opacity:this.state.formAnimation}]}>
          <KeyboardAvoidingView behavior={IOS ? 'position' : 'height'} keyboardVerticalOffset={IOS ? -100 : 30} style={styles.inputContainer}>
          {/*
            <View>
              <View style={styles.title}>
                <Icon name='textsms' style={styles.titleIcon} />
                <Text style={styles.titleText}> Post Text</Text>
              </View>
            </View>
          */}
            <TextInput
              autoFocus={true}
              multiline={true}
              autoCapitalize={'sentences'}
              underlineColorAndroid={'transparent'}
              clearButtonMode={'while-editing'}
              returnKeyType={'send'}
              blurOnSubmit={true}
              onSubmitEditing={this.onSendText}
              style={styles.inputField}
              onChangeText={this.onChangeText}
              numberOfLines={3}
              maxLength={151}
              placeholderTextColor={'rgba(255,255,255, 0.65)'}
              placeholder="Say something..."
              value={this.state.text} />


          {/*
            <View style={styles.bottomInfo}>
              <Text style={styles.bottomInfoText}>
                How is it going?
              </Text>
            </View>
          */}

            <View style={styles.bottomButtons}>
              <Button
                onPress={this.onCancel}
                style={styles.cancelButton}>
                Cancel
              </Button>

              <Button
                onPress={this.onSendText}
                style={styles.modalButton}
                isDisabled={!this.state.text}>
                Post
              </Button>
            </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center'
  },
  innerContainer: {
    padding: IOS ? 10 : 0,
    paddingBottom: 10,
    flex:1,
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title:{
    padding: 10,
    paddingBottom: 100,
    paddingTop: 0,
    backgroundColor:'transparent',
    flexDirection: 'row',
    justifyContent: IOS ? 'center' : 'center',
  },
  titleText:{
    fontSize: 20,
    color: theme.primary,
    fontWeight: 'bold',
    textAlign: IOS ? 'center' : 'left',
  },
  titleIcon:{
    top:5,
    fontSize:20,
    marginRight:5,
    color:theme.primary,
  },
  bottomButtons:{
    flexDirection: 'row',
    alignItems: IOS ? 'stretch' : 'flex-end',
    justifyContent: IOS ? 'center' : 'flex-end',
    position: 'absolute',
    bottom: IOS ? 0 : 10,
    right: 0,
    left: 0,
    padding: 20,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopWidth: IOS ? 0 : 1,
    borderTopColor:'rgba(0,0,0,.1)',
  },
  modalButton: {
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#999',
  },
  modalBackgroundStyle: {
    backgroundColor: theme.blue2
  },
  inputField: {
    fontSize: 18,
    margin: 0,
    marginLeft: 10,
    marginTop: IOS ? 110 : 0,
    color:'#FFF',
    textAlign: 'center',
    height: 220,
    width: width - 40,
  },
  bottomInfo:{
    padding: 15,
    paddingBottom:10,
    paddingTop:5,
    backgroundColor: 'transparent'
  },
  bottomInfoText:{
    textAlign: IOS ? 'center' : 'left',
    fontSize: 12,
    color: 'rgba(255,255,255,.7)'
  },
  okView: {
    position: 'absolute',
    top: IOS ? height / 2 - 140 : 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  okWrap:{
    position: 'relative',
    overflow: 'visible',
    borderWidth: 5,
    borderColor: theme.light,
    paddingTop: 32,
    borderRadius: 70,
    width: 140,
    height: 140,
    opacity: 0,
    transform: [{scale: 0}]
  },
  okSign:{
    fontSize: 65,
    color: theme.light,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  okText:{
    color: theme.light,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 15
  }
});

const select = store => {
  return {
    isTextActionViewOpen: store.competition.get('isTextActionViewOpen')
  };
};

export default connect(select)(TextActionView);
