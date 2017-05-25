'use strict';

const CHANGE_TAB = 'CHANGE_TAB';

const changeTab = (newTab) => ({ type: CHANGE_TAB, payload: newTab })

export {
  CHANGE_TAB,
  changeTab
};
