'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  ScrollView,
  RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';


import theme from '../style/theme';
import { fetchTeams } from '../actions/team';
import { getCityTeams } from '../reducers/team';
import analytics from '../services/analytics';
import LeaderboardEntry from '../components/competition/LeaderboardEntry';
import Icon from 'react-native-vector-icons/Ionicons';

const VIEW_NAME = 'CompetitionView';

class CompetitionView extends Component {

  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);
  }

  @autobind
  onRefreshFeed(){
    this.props.fetchTeams();
  }

  render() {
    let topscore = 0;
    this.props.teams.map((team) => {
      topscore = Math.max(
        parseInt(team.get('score'), 10), topscore);
    });

    const refreshControl = <RefreshControl
      refreshing={this.props.isRefreshing}
      onRefresh={this.onRefreshFeed}
      colors={[theme.primary]}
      tintColor={theme.primary}
      progressBackgroundColor={theme.light} />;

    return (
      <View style={styles.container}>
        <View style={styles.leaderboardIntro}>
          <View style={styles.leaderboardIconWrap}>
            <Icon name='ios-trophy' style={styles.leaderboardIcon} />
          </View>
          <View style={styles.leaderboardIntroTextWrap}>
            <Text style={styles.leaderboardIntroText}>
            Current Whappu points for each team.
            Be active in the Buzz and lead your team to the victory!
            </Text>
            <Text style={[styles.leaderboardIntroText, styles.leaderboardIntroText__grey]}>
            The competition ends at 12:00PM on 30th of April.
            </Text>
          </View>
        </View>
        <ScrollView style={styles.leaderboard} refreshControl={refreshControl} >
          {this.props.teams.map((team, index) =>
          <LeaderboardEntry key={team.get('id')} topscore={+topscore}
            team={team} position={index + 1} logo={team.get('imagePath')} />
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingBottom: 0,
  },
  leaderboardIntro:{
    flexDirection:'row',
    margin:20,
    marginBottom:0,
    marginTop:5,
    padding: Platform.OS === 'ios' ? 13 : 13,
    paddingLeft:7,
    paddingRight:5,
    justifyContent:'space-between',
    borderBottomWidth:2,
    borderBottomColor:'#eee',
  },
  leaderboardIconWrap:{
    width:62,
    paddingRight:10,
  },
  leaderboardIcon: {
    color: '#FFCC03',
    fontSize:52,
    top: 0,
  },
  leaderboardIntroTextWrap:{
    flex:1,
  },
  leaderboardIntroText:{
    color:'#212121',
    fontSize:11
  },
  leaderboardIntroText__grey:{
    color:'#aaa',
    marginTop:5,
  },
  leaderboard: {
    flex: 1,

  }
});

const mapDispatchToProps = { fetchTeams };

const select = store => {
  return {
    isRefreshing: store.team.get('isRefreshing'),
    teams: getCityTeams(store),
    actionTypes: store.competition.get('actionTypes')
  };
};

export default connect(select, mapDispatchToProps)(CompetitionView);
