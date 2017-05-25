import DeviceInfo from 'react-native-device-info';
import { AsyncStorage } from 'react-native';
import { isEmpty, isObject } from 'lodash';

import Endpoints from '../constants/Endpoints';
import { version as VERSION_NUMBER } from '../../package.json';
import * as ENV from '../../env';

const USER_UUID = DeviceInfo.getUniqueID();
const API_TOKEN = ENV.API_TOKEN;

const fetchModels = (modelType, params) => {
  let url = Endpoints.urls[modelType];

  if (!isEmpty(params) && isObject(params)) {
    url += '?' + Object.keys(params).map(k => {
      return params[k] ? (encodeURIComponent(k) + '=' + encodeURIComponent(params[k])) : ''
    }).join('&');
  }

  return cachedFetch(url);
};

const fetchMoreFeed = (beforeId, params) => {
  const extendedParams = Object.assign({ beforeId, limit: 20 }, params);

  let url = Endpoints.urls.feed;
  url += '?' + Object.keys(extendedParams).map(k => {
    return encodeURIComponent(k) + '=' + encodeURIComponent(extendedParams[k]);
  }).join('&');

  return cachedFetch(url);
};

const postAction = (params, location, queryParams) => {
  let payload = Object.assign({}, params, { user: DeviceInfo.getUniqueID() });

  // Add location to payload, if it exists
  if (location) {
    payload.location = location;
  }

  return _post(Endpoints.urls.action, payload, queryParams);
};

const postComment = (parentId, params, location, queryParams) => {
  let payload = Object.assign({}, params, { user: DeviceInfo.getUniqueID() });

  // Add location to payload, if it exists
  if (location) {
    payload.location = location;
  }

  return _post(Endpoints.urls.feedItem(parentId), payload, queryParams);
};

const putMood = (params) => {
  let payload = Object.assign({}, params, { user: DeviceInfo.getUniqueID() });

  return _put(Endpoints.urls.mood, payload);
};

const getImages = eventId => {
  return wapuFetch(Endpoints.urls.event(eventId))
    .then(checkResponseStatus)
    .then(response => response.json());
}

const getUserProfile = userId => {
  return wapuFetch(Endpoints.urls.userProfile(userId))
    .then(checkResponseStatus)
    .then(response => response.json());
}

const putUser = payload => {
  return _put(Endpoints.urls.user(payload.uuid), payload);
};

const getUser = uuid => {
  return wapuFetch(Endpoints.urls.user(uuid))
    .then(checkResponseStatus)
    .then(response => response.json());
};

const deleteFeedItem = item => {
  return _delete(Endpoints.urls.feedItem(item.id));
};

const voteFeedItem = payload => {
  return _put(Endpoints.urls.vote, payload)
};

const cachedFetch = (url, opts) => {
  return wapuFetch(url, opts)
  .then(response => {
    // If server responds with error, it is thrown
    if (isErrorResponse(response.status)) {
      const error = new Error(response.statusText);
      error.response = response;
      error.status = response.status;
      throw error;
    }

    return response.json();
  })
  .then(response => {
    return AsyncStorage.setItem(url, JSON.stringify(response))
      .then(() => response);
  })
  .catch(error => {
    if (error.response) {
      // Re-throw server errors
      throw error;
    }

    // In case of a network failure, return data from cache
    console.log('Error catched on API-fetch', error);
    return AsyncStorage.getItem(url)
    .then(value => {
      value = JSON.parse(value);
      if (value != null && !value.error) {
        return Promise.resolve(value);
      } else {
        return Promise.reject(null);
      }
    });
  });
}

// Our own wrapper for fetch. Logs the request, adds required version headers, etc.
// Instead of using fetch directly, always use this.
const wapuFetch = (url, opts) => {
  opts = opts || {};
  opts.headers = opts.headers || {};

  opts.headers['x-client-version'] = VERSION_NUMBER;
  opts.headers['x-user-uuid'] = USER_UUID;
  opts.headers['x-token'] = API_TOKEN;
  return fetch(url, opts);
};

const checkResponseStatus = response => {
  if (response.status >= 200 && response.status < 400) {
    return response;
  } else {
    return response.json()
      .then(res => {
        console.log('Error catched', response.statusText);
        const error = new Error(response.statusText);
        error.response = response;
        error.responseJson = res;
        throw error;
      });
  }
};

function isErrorResponse(status) {
  return status && status >= 400;
}

const _post = (url, body, query) => {
  return wapuFetch(queryParametrize(url, query), {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(checkResponseStatus);
};

const _put = (url, body) => {
  return wapuFetch(url, {
    method: 'put',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(checkResponseStatus);
};

const _delete = (url, body) => {
  return wapuFetch(url, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(checkResponseStatus);
};

const queryParametrize = (url, query) => {
  let queryParametrizedUrl = url;

  if (isObject(query) && !isEmpty(query)) {
    queryParametrizedUrl += '?' + Object.keys(query).map(k => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(query[k]);
    }).join('&');
  }

  return queryParametrizedUrl;
}

export default {
  deleteFeedItem,
  voteFeedItem,
  fetchModels,
  fetchMoreFeed,
  postAction,
  putUser,
  putMood,
  getUser,
  getImages,
  getUserProfile
};
