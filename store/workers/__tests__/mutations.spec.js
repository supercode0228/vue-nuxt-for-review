import { cloneDeep } from 'lodash';
import moment from 'moment';

import * as mutations from '../mutations';

import { TIME_FORMAT__DDDD } from '../../constants';
import defaultWorkingHours from '../../../common-data/default-working-hours';

describe('Vuex', () => {
  describe('workers module', () => {
    describe('mutations', () => {
      const testState = {
        workers: ['worker 1', 'worker 2'],
      };

      it('INIT', () => {
        const state = { workers: [] };
        const { workers } = testState;

        mutations.INIT(state, workers);
        expect(state).toEqual(testState);
      });

      it('SET_PERSONAL_PROFILE', () => {
        const state = { personalProfile: {} };

        const newInfo = { id: 'worker id', businessHours: 'some working hours' };

        const expectedState = {
          personalProfile: cloneDeep(newInfo),
        };

        mutations.SET_PERSONAL_PROFILE(state, newInfo);
        expect(state).toEqual(expectedState);
      });

      it('SET_PERSONAL_PROFILE with no business hours', () => {
        const state = { personalProfile: {} };

        const newInfo = { id: 'worker id' };

        const businessHours = JSON.stringify(defaultWorkingHours
          .map((item, index) => ({
            ...item,
            label: moment().isoWeekday(index).format(TIME_FORMAT__DDDD),
          })));

        const expectedState = {
          personalProfile: { ...cloneDeep(newInfo), businessHours },
        };

        mutations.SET_PERSONAL_PROFILE(state, newInfo);
        expect(state).toEqual(expectedState);
      });

      it('EDIT_PERSONAL_PROFILE', () => {
        const state = { personalProfile: { id: 'worker id', businessHours: 'some working hours' } };

        const newInfo = { id: 'worker id', businessHours: 'some new working hours' };

        const expectedState = {
          personalProfile: cloneDeep(newInfo),
        };

        mutations.EDIT_PERSONAL_PROFILE(state, newInfo);
        expect(state).toEqual(expectedState);
      });
    });
  });
});
