'use strict';

import React, { Component } from 'react';

import {
  View,
  Text,
  ListView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal
} from 'react-native';
import moment from 'moment';
import location from '../../services/location';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import EventListItem from '../calendar/CheckInListItem';
import { checkIn, closeCheckInView } from '../../actions/competition';
import { getCurrentCityName } from '../../concepts/city';

import CheckInButton from './CheckInButton';
import theme from '../../style/theme';

const { width } = Dimensions.get('window');

class CheckInActionView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeContentWasFound: false,
      eventContent: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    };
  }

  componentWillReceiveProps({events}) {
    this.getContent(events);
  }

  checkIn(eventId) {
    this.props.checkIn(eventId);
    this.props.closeCheckInView();
  }

  getContent(events) {
    const currentTime = moment();

    const activeEvents = events.filter((event) => {
      if (moment(event.get('startTime')).isBefore(currentTime) && moment(event.get('endTime')).isAfter(currentTime)) {
        return event;
      }
    });

    if (activeEvents.size > 0) {
      this.setState({
        eventContent: activeEvents,
        activeContentWasFound: true,
        dataSource: this.state.dataSource.cloneWithRows(activeEvents.toJS())
      });
    } else {
      this.setState({eventContent: events.get(0), activeContentWasFound: false});
    }
  }

  noActiveEventsView() {
    return (
      <View style={styles.eventContainer}>
          <Image style={{
            height: 180,
            width: 180,
            marginBottom: 0,
            }} source={require('../../../assets/sad-wappu-panda.png')}/>

        <Text style={{fontSize: 40, textAlign: 'center', color: theme.white}}>OH NO!</Text>
        <Text style={[styles.text]}>No ongoing events available in {this.props.city}.</Text>
        <Text style={[styles.text]}>Try again later.</Text>

        <TouchableWithoutFeedback onPress={this.props.closeCheckInView}>
          <View style={[styles.cancelButton, { bottom: 25 }]}>
            <Text style={styles.cancelButtonText}><Icon name="close" style={styles.cancelButtonText} /></Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderEventList() {
    return (
      <View style={styles.eventContainer}>
        <View style={styles.headerContainer}>
          <Icon name="pin-drop" style={{color: theme.accentLight, marginRight: 5 }} size={30}/>
          <Text style={styles.title}>CHECK IN</Text>
        </View>

        <View style={{minHeight: 40}}>
          <Text style={[styles.text, {fontSize: 12, padding: 10}]}>You can only check-in to events if you are in the event area</Text>
        </View>

        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderHeader={this.renderHeader}
          stickyHeaderIndices={[0]}
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderListItem.bind(this)}
          style={styles.listView}
        />

        <TouchableWithoutFeedback onPress={this.props.closeCheckInView}>
          <View style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}><Icon name="arrow-back" style={styles.cancelButtonText} /></Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderListItem(item, sectionId, rowId) {
    const { userLocation } = this.props;
    let validLocation = false;
    let distanceInKm = null;

    if ( userLocation && item.location ) {
      const distance = location.getDiscanceInMeters(userLocation, item.location);
      validLocation = item.radius > distance;
      distanceInKm = location.getDistance(userLocation, item.location);
    }

    return (
      <View>
        <EventListItem currentDistance={distanceInKm} item={item} rowId={+rowId} hideStatus={true}/>
        <CheckInButton validLocation={validLocation} checkIn={() => this.checkIn(item.id)} />
      </View>);
  }

  renderHeader() {
    return (
      <View style={styles.listHeader}>
        <Text style={[styles.title, styles.subtitle]}>ONGOING</Text>
      </View>
    );

  }

  render() {

    const { isCheckInViewOpen } = this.props;

    if (!isCheckInViewOpen) {
      return false;
    }

    return (
      <Modal
        onRequestClose={this.props.closeCheckInView}
        visible={isCheckInViewOpen}
        animationType={'slide'}
      >
        <View style={[styles.container, styles.modalBackgroundStyle]}>
          {this.state.activeContentWasFound
            ? this.renderEventList()
            : this.noActiveEventsView()
          }
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
  },
  modalBackgroundStyle: {
    backgroundColor: theme.secondaryLight
  },
  eventContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  headerContainer: {
    backgroundColor: theme.secondaryLight,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    color: theme.white,
    fontWeight: 'normal',
    paddingLeft: 0,
    fontSize: 30,
  },
  subtitle: {
    fontSize: 18,
    color: theme.secondaryLight
  },
  text: {
    color: theme.light
  },
  header: {
    fontSize: 30,
    color: theme.secondaryLight,
    textAlign: 'center'
  },
  listHeader: {
    alignItems: 'flex-start',
    padding: 10,
    paddingLeft: 20,
    backgroundColor: theme.white,
    alignSelf: 'stretch',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 15,
    left: width / 2 - 26,
    // padding: 5,
    // paddingTop: 10,
    // paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
    borderWidth: 0,
    borderColor: theme.grey,
    backgroundColor: theme.lightgrey,
    width: 52,
    height: 52,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 5,
      width: 0
    }
  },
  cancelButtonText: {
    fontSize: 22,
    color: theme.dark,
  },
  listView: {
    flexGrow: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  emptyStateTitle: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: theme.accentLight
  }
});

const mapDispatchToProps = {
  checkIn,
  closeCheckInView,
};

const select = store => {
  return {
    isCheckInViewOpen: store.competition.get('isCheckInViewOpen'),
    events: store.event.get('list'),
    city: getCurrentCityName(store),
    userLocation: store.location.get('currentLocation')
  };
};

export default connect(select, mapDispatchToProps)(CheckInActionView);
