import ActionTypes from '../constants/ActionTypes';

const getMessage = (payload) => {
  switch (payload.type) {
    case ActionTypes.IMAGE: {
      return 'Great shot!';
    }
    case ActionTypes.SIMA: {
      return 'One sima down!';
    }
    case ActionTypes.TEXT: {
      return 'That\'s cool!';
    }
    case ActionTypes.CHECK_IN_EVENT: {
      return '*Check* Whappu hard!';
    }
    case ActionTypes.MOOD: {
      return 'Vibe added!';
    }
  }
};

const getErrorMessage = (payload) => {
  return 'Oh no, an error occurred! :-(';
};

const getRateLimitMessage = (payload) => {
  return 'Hold your horses!'
};

const getInvalidEventMessage = (payload) => {
  return 'Hold your horses! No double check-ins!'
};

export {
  getMessage,
  getErrorMessage,
  getRateLimitMessage,
  getInvalidEventMessage
};
