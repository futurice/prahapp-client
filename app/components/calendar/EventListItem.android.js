'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from 'react';
import {
  Image,
  PropTypes,
  StyleSheet,
  Dimensions,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import time from '../../utils/time';
import theme from '../../style/theme';
const placholderImage = require('../../../assets/patterns/sea.png');

const styles = StyleSheet.create({
  gridListItem: {
    flexGrow: 1,
    paddingLeft:97,
    backgroundColor:'#fff',
  },

  gridListItemImgWrap: {
    height: 80,
    width: Dimensions.get('window').width - 130,
    position: 'relative',
    backgroundColor: theme.yellow
  },
  gridListItemImg: {
    width: Dimensions.get('window').width - 130,
    height: 80,
    borderRadius: 2
  },
  gridListItemContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 15,
    paddingBottom:25,
    paddingTop:0,

  },
  gridListItemTitle: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#000',
    paddingBottom:10,
    marginTop:3,
  },

  gridListItemMeta: {
    position:'absolute',
    left:15,
    top:3,
    flex:1
  },
  gridListItemPlace: {
    marginTop:10,
    fontSize: 13,
    color: '#888'
  },
  gridListItemDistance: {
    color:'#888',
    fontSize:14,
  },
  gridListItemTime: {
    fontSize: 14,
    color: theme.blue2,
    fontWeight:'normal'
  },
  gridListItemTimeEnd: {
    color:'#888',
  },
  gridListItemDay: {
    fontWeight:'bold'
  },
  pastTime: {
    color: '#888'
  },
  gridListItemIconsWrapper: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: -5,
    marginBottom: 5,
  },
  gridListItemIcon: {
    color: '#888',
    fontWeight:'normal',
    fontSize: 12
  },
  gridListItemIcon__alert: {
    color: theme.blue2
  },
  timeline: {
    position:'absolute',
    top:0,
    bottom:0,
    left:78,
    width:2,
    backgroundColor:'#eee'
  },
  timelineCircle: {
    backgroundColor: theme.blue2,
    borderColor:theme.light,
    position:'absolute',
    left:66,
    borderWidth:3,
    width:26,
    height:26,
    borderRadius:13,
    top:0
  },
  pastCircle: {
    backgroundColor: theme.grey,
  },
  timelineCircleInner: {
    borderRadius:7,
    width:14,
    height:14,
    backgroundColor:theme.light,
    top:3,
    left:3
  }
});

export default class EventListItem extends Component {
  propTypes: {
    item: PropTypes.object.isRequired,
    handlePress: PropTypes.func.isRequired,
    rowId: PropTypes.number
  }

  render() {
    const { item, hideStatus, pastEvent } = this.props;
    const timepoint = time.formatEventTime(item.startTime, item.endTime);
    // const coverImage = item.coverImage ? item.coverImage.replace('https://', 'http://') : '';
    const { coverImage } = item;

    return <TouchableNativeFeedback onPress={this.props.handlePress}  delayPressIn={100} background={TouchableNativeFeedback.SelectableBackground()}>
      <View style={styles.gridListItem}>

        <View style={styles.gridListItemContent}>
          <Text style={styles.gridListItemTitle}>{item.name}</Text>

          {!hideStatus &&
            <View style={[styles.gridListItemIconsWrapper,
              {marginBottom: timepoint.onGoing || timepoint.startsSoon ? 5 : 0}
            ]}>
              {!pastEvent && timepoint.onGoing && <Text style={[styles.gridListItemIcon, styles.gridListItemIcon__alert]}>Ongoing!</Text>}
              {!pastEvent && timepoint.startsSoon && <Text style={[styles.gridListItemIcon, styles.gridListItemIcon__alert]}>Starts soon!</Text>}
            </View>
          }

          <View style={styles.gridListItemImgWrap}>
            <Image
              source={coverImage ? { uri: coverImage } : placholderImage}
              style={styles.gridListItemImg} />

          </View>

          <Text style={styles.gridListItemPlace}>{item.locationName} {this.props.currentDistance}</Text>

        </View>

        {!item.lastOfDay && <View style={styles.timeline} />}
        <View style={[styles.timelineCircle, pastEvent ? styles.pastCircle : {}]}>
          <View style={styles.timelineCircleInner} />
        </View>

        <View style={styles.gridListItemMeta}>
            <Text style={[styles.gridListItemTime, pastEvent ? styles.pastTime : {}]}>{timepoint.time}</Text>
            <Text style={[styles.gridListItemTime, styles.gridListItemTimeEnd]}>{timepoint.endTime}</Text>
        </View>

      </View>
    </TouchableNativeFeedback>;
  }
}
