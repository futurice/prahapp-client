  'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  Text,
  Platform,
  PropTypes,
  ActivityIndicator,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';


import _ from 'lodash';
import moment from 'moment';

import analytics from '../../services/analytics';
import location from '../../services/location';
import theme from '../../style/theme';
import { fetchAnnouncements } from '../../actions/announcement';
import { fetchEvents } from '../../actions/event';
import EventListItem from './EventListItem';
import AnnouncementListItem from './AnnouncementListItem';
import EventDetail from './EventDetailView';
import Button from '../common/Button';

const IOS = Platform.OS === 'ios';
const VIEW_NAME = 'TimelineList';
const ANNOUNCEMENTS_SECTION = 'announcements';
const PAST_EVENTS_SECTION = 'past_events';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.light,
  },
  loaderText:{
    color:'#aaa',
  },
  reloadButton:{
    marginTop:20,
    width: 100
  },
  reloadButtonText:{
    fontSize:30,
    color:theme.secondary,
    fontWeight:'bold',
  },
  listView: {
    flexGrow: 1,
    paddingTop: IOS ? 0 : 0,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    backgroundColor: IOS ? 'rgba(255,255,255,.88)' : 'transparent',
    opacity: IOS ? 1 : 1,
    padding: IOS ? 15 : 35,
    paddingLeft:15,
    flexGrow: 1,
  },
  sectionHeaderAnnouncement: {
    backgroundColor: IOS ? 'rgba(255,255,255,.88)' : 'transparent',
    marginTop: 0,
    padding: IOS ? 20 : 15,
    flexGrow: 1,
  },
  sectionHeaderAnnouncementText:{
    backgroundColor: 'transparent',
    color: theme.secondary
  },
  sectionHeaderText: {
    textAlign: 'left',
    fontWeight: IOS ? 'bold' : 'bold',
    fontSize: IOS ? 18 : 16,
    color: IOS ? theme.secondary : theme.secondary
  }
});

class TimelineList extends Component {
  propTypes: {
    announcements: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    eventsFetchState: PropTypes.any
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    }
  }

  componentWillReceiveProps({ events, announcements }) {
    if (announcements === this.props.announcements && events === this.props.events) {
      return;
    }

    this.updateListItems(events, announcements);
  }

  componentDidMount() {
    this.getViewContent();
    this.updateListItems(this.props.events, this.props.announcements);
    analytics.viewOpened(VIEW_NAME);
  }

  @autobind
  getViewContent() {
    // TODO: ...should these be throttled?
    this.props.fetchEvents();
    this.props.fetchAnnouncements();
  }

  @autobind
  navigateToSingleEvent(model) {
    const currentDistance = model.location.latitude !== 0 & model.location.longitude !== 0 ?
      location.getDistance(this.props.userLocation, model.location) : null;

    const startDay = moment(model.startTime).format('ddd D.M.')

    this.props.navigator.push({
      showName: true,
      component: EventDetail,
      name: startDay,
      currentDistance: currentDistance,
      model
    });
  }

  updateListItems(eventsData, announcementData) {

    let announcements = announcementData.toJS()
      .map(item => {
        item.timelineType = 'announcement';
        return item;
      });

    const now = moment();
    let events = eventsData
      .filter(item => moment(item.get('endTime')).isSameOrAfter(now))
      .map(item => {
        item.set('timelineType', 'event');
        return item;
      }).toJS()

    let pastEvents = eventsData
      .filter(item => moment(item.get('endTime')).isBefore(now))
      .map(item => {
        item.set('timelineType', PAST_EVENTS_SECTION);
        return item;
      }).toJS()


    let listSections = _.groupBy(events,
      event => moment(event.startTime).startOf('day').unix());

    // Set flag for last of day if more than one event
    _.map(listSections || [], eventsPerDay => {
      if (eventsPerDay.length > 1) {
        eventsPerDay[eventsPerDay.length - 1].lastOfDay = true;
      }
    });

    const eventSectionsOrder = _.orderBy(_.keys(listSections));

    let listOrder;

    // Add announcements
    if (announcements.length > 0) {
      // Add the announcements-section to the listSections
      listSections[ANNOUNCEMENTS_SECTION] = announcements;
      // Make the order to be that the first section is the announcements, then comes event sections
      listOrder = [ANNOUNCEMENTS_SECTION, ...eventSectionsOrder];
    } else {
      listOrder = [...eventSectionsOrder]
    }

    // Past events
    if (pastEvents.length > 0) {
      listSections[PAST_EVENTS_SECTION] = pastEvents;
      listOrder.push(PAST_EVENTS_SECTION);
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(listSections, listOrder)
    });
  }

  renderLoadingView() {
    // TODO: platform-specific if-else
    return <View style={styles.container}>
      <ActivityIndicator
        color={theme.primary}
        animating={true}
        style={{ alignItems: 'center', justifyContent: 'center', height: 80 }}
        size='large' />
      <Text style={styles.loaderText}>Loading events...</Text>
    </View>;
  }

  @autobind
  renderSectionHeader(sectionData, sectionId) {
    let sectionCaption = '';
    const sectionStartMoment = moment.unix(sectionId);

    // # Caption
    // Announcement-section
    if (sectionId === ANNOUNCEMENTS_SECTION) {
      sectionCaption = 'Announcement';
    }
    else if (sectionId === PAST_EVENTS_SECTION) {
      sectionCaption = 'Past Events';
    }
    // Day-sections
    else if (sectionStartMoment.isSame(moment(), 'day')) {
      sectionCaption = 'Today';
    } else if (sectionStartMoment.isSame(moment().add(1, 'day'), 'day')) {
      sectionCaption = 'Tomorrow';
    } else {
      sectionCaption = moment.unix(sectionId).format('ddd D.M.');
    }
    sectionCaption = sectionCaption.toUpperCase();

    // # Style
    const headerStyle = (sectionId === ANNOUNCEMENTS_SECTION) ?
      styles.sectionHeaderAnnouncement : styles.sectionHeader;
    const headerTextStyle = (sectionId === ANNOUNCEMENTS_SECTION) ?
      styles.sectionHeaderAnnouncementText : {};

    return <View style={headerStyle}>
      <Text style={[styles.sectionHeaderText,headerTextStyle]}>{sectionCaption}</Text>
    </View>;
  }

  @autobind
  renderListItem(item, sectionId, rowId) {
    switch (item.timelineType) {
      case 'announcement':
        return <AnnouncementListItem item={item} />;

      default:
        const currentDistance = item.location.latitude !== 0 && item.location.longitude !== 0 ?
          location.getDistance(this.props.userLocation, item.location) : null;
        return <EventListItem
          item={item}
          rowId={+rowId}
          pastEvent={sectionId === PAST_EVENTS_SECTION}
          currentDistance={currentDistance}
          handlePress={() => this.navigateToSingleEvent(item)}
        />;
    }
  }

  render() {
    switch (this.props.eventsFetchState) {
      case 'loading':
        return this.renderLoadingView();
      case 'failed':
        return (
          <View style={styles.container}>
            <Text style={styles.loaderText}>Could not get events :(</Text>
            <Button
              onPress={this.getViewContent}
              style={styles.reloadButton}
            >
              Reload
            </Button>
          </View>
        );
      default:
        return <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderListItem}
          style={styles.listView}
        />;
    }
  }
}

const mapDispatchToProps = { fetchEvents, fetchAnnouncements };

const select = store => {
  return {
    announcements: store.announcement.get('list'),
    events: store.event.get('list'),
    eventsFetchState: store.event.get('listState'),
    userLocation: store.location.get('currentLocation')
  }
};

export default connect(select, mapDispatchToProps)(TimelineList);
