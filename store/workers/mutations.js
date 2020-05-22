import moment from 'moment';
import { TIME_FORMAT__DDDD } from '../constants';
import defaultWorkingHours from '../../common-data/default-working-hours';

export const INIT = (state, workers) => {
  state.workers = workers;
};

export const RESET = (state, workers) => {
  state.workers = workers;
};

export const SET_PERSONAL_PROFILE = (state, personalInfo) => {
  const days = defaultWorkingHours
    .map((item, index) => ({
      ...item,
      label: moment().isoWeekday(index).format(TIME_FORMAT__DDDD),
    }));

  if (!personalInfo.businessHours) {
    personalInfo.businessHours = JSON.stringify(days);
  }

  state.personalProfile = personalInfo;
};

export const EDIT_PERSONAL_PROFILE = (state, payload) => {
  state.personalProfile = Object.assign(state.personalProfile, payload);
};
