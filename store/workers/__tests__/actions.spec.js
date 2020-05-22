import { cloneDeep } from 'lodash';

import * as actions from '../actions';
import * as queries from '../utils/queries';
import injectData from '../../../utils/inject-data';

jest.mock('axios');
jest.mock('../utils/queries');
jest.mock('../../../utils/inject-data');

describe('Vuex', () => {
  describe('workers module', () => {
    describe('actions', () => {
      const rootState = {
        user: {
          id: 'user id 1',
        },
        services: {
          products: [],
        },
        products: {
          products: [],
        },
        workers: {
          workers: [],
          personalProfile: {
            id: 'user id 1',
            realUsername: 'username 1',
            profilePicUrl: 'link',
          },
        },
      };

      describe('init', () => {
        it('should obtain workers, populate it with services and products and commit it to the store', async () => {
          const workersData = [
            { id: 'worker id 1', services: [], products: [] },
            { id: 'worker id 2', services: [], products: [] },
          ];

          queries.getWorkersListQuery.mockResolvedValueOnce(cloneDeep(workersData));

          const commit = jest.fn();

          await actions.init({ commit, rootState });

          expect(injectData).toBeCalledTimes(4);
          expect(commit).toBeCalledWith('INIT', workersData);
        });
      });

      describe('getPersonalInfo', () => {
        it('should obtain personal info for the current user and commit "SET_PERSONAL_PROFILE" mutation with the data', async () => {
          const personalInfo = {
            id: 'user id 1',
            firstname: 'name',
          };

          queries.getPersonalInfoQuery.mockResolvedValueOnce(cloneDeep(personalInfo));

          const commit = jest.fn();

          const result = await actions.getPersonalInfo({ commit, rootState });

          expect(queries.getPersonalInfoQuery).toBeCalledWith('user id 1');
          expect(commit).toBeCalledWith('SET_PERSONAL_PROFILE', personalInfo);
          expect(result).toEqual(personalInfo);
        });
      });

      describe('savePersonalInfo', () => {
        it('should save personal info for the current user and update user info in the stores', async () => {
          const state = cloneDeep(rootState.workers);

          const personalInfo = {
            id: 'user id 1',
            realUsername: 'username 1',
            profilePicUrl: 'link',
          };

          queries.updatePersonalProfileQuery.mockResolvedValueOnce(cloneDeep(personalInfo));

          const commit = jest.fn();

          const result = await actions.savePersonalInfo({ state, commit, rootState });

          expect(queries.updatePersonalProfileQuery).toBeCalledWith('user id 1', personalInfo);
          expect(commit).toBeCalledWith('SET_PERSONAL_PROFILE', personalInfo);
          expect(commit).toBeCalledWith('user/SET_USERNAME', personalInfo.realUsername, { root: true });
          expect(commit).toBeCalledWith('user/SET_PROFILE_IMAGE', personalInfo.profilePicUrl, { root: true });
          expect(result).toEqual(personalInfo);
        });
      });

      describe('editPersonalInfo', () => {
        it('should commit "EDIT_PERSONAL_PROFILE" mutation', async () => {
          const payload = 'some payload info';

          const commit = jest.fn();

          await actions.editPersonalInfo({ commit }, payload);

          expect(commit).toBeCalledWith('EDIT_PERSONAL_PROFILE', payload);
        });
      });

      describe('verifyUserNameUniqueness', () => {
        it('should call api for checking if the passed username is unique', async () => {
          const userName = 'some username';

          const resultResponse = 'some response here';

          queries.verifyUserNameUniquenessQuery.mockResolvedValueOnce(cloneDeep(resultResponse));

          const result = await actions.verifyUserNameUniqueness({}, userName);

          expect(queries.verifyUserNameUniquenessQuery).toBeCalledWith({ term: userName });
          expect(result).toEqual(resultResponse);
        });
      });
    });
  });
});
