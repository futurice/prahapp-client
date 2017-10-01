import { fetchActionTypes } from '../actions/competition';
import { fetchEvents } from '../actions/event';
import { fetchFeed } from '../actions/feed';
import { fetchTeams } from '../actions/team';
import { getUser } from '../actions/registration';


// # Action types
const APP_CONTENT_LOADED = 'APP_CONTENT_LOADED';


// # Actions

// Load all content ig. after successful login
export const fetchAppContent = () => dispatch =>
  Promise.all([
    dispatch(fetchActionTypes()),
    dispatch(getUser()),
    dispatch(fetchFeed()),
    dispatch(fetchEvents()),
    dispatch(fetchTeams()),
  ])
  .then(() => dispatch({ type: APP_CONTENT_LOADED }));
