import { APP_STORAGE_KEY } from '../../env';

const ROOT_KEY = APP_STORAGE_KEY;

const tokenKeys = {
  token: `${ROOT_KEY}:token`,
  city: `${ROOT_KEY}:city`,
}

export default tokenKeys
