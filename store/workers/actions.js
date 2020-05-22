import injectData from '../../utils/inject-data';
import {
  getWorkersListQuery,
  getPersonalInfoQuery,
  verifyUserNameUniquenessQuery,
  updatePersonalProfileQuery,
  postShopOwnerFbToken,
  getFbExtras,
  createWorkerStripeCustomerToken,
} from './utils/queries';
import axios from 'axios';
import { STATISTICS, WORKERS } from '../endpoints';
import authorize from '../utils/auth';

export const init = async ({ commit, rootState }) => {
  const workers = await getWorkersListQuery();

  const availableServices = rootState.services.services;
  const availableProducts = rootState.products.products;

  workers.forEach((worker) => {
    injectData('services', worker, availableServices);
    injectData('products', worker, availableProducts);
  });

  commit('INIT', workers);
};

export const getPersonalInfo = async ({ rootState, commit }) => {
  const { id } = rootState.user;
  const personalInfo = await getPersonalInfoQuery(id);

  commit('SET_PERSONAL_PROFILE', personalInfo);

  return personalInfo;
};

export const savePersonalInfo = async ({ state, rootState, commit }) => {
  const { id } = rootState.user;
  const { personalProfile } = state;

  const updatedPersonalInfo = await updatePersonalProfileQuery(id, personalProfile);

  commit('SET_PERSONAL_PROFILE', updatedPersonalInfo);
  commit('user/SET_USERNAME', updatedPersonalInfo.realUsername, { root: true });
  commit('user/SET_PROFILE_IMAGE', updatedPersonalInfo.profilePicUrl, { root: true });

  return updatedPersonalInfo;
};

export const editPersonalInfo = ({ commit }, payload) => {
  commit('EDIT_PERSONAL_PROFILE', payload);
};

export const verifyUserNameUniqueness = async (context, userName) => {
  const payload = { term: userName };

  const response = await verifyUserNameUniquenessQuery(payload);

  return response;
};

export const setShopOwnerInfoToken = async (context, tokenInfo) => {
  const response = await postShopOwnerFbToken(tokenInfo);

  return response;
};

export const getShopOwnerFbExtras = async () => {
  const response = await getFbExtras();

  return response;
};

export const getStatistics = (context, payload) => {
  const statistics = axios({
    url: `${process.env.SCHEDULE_API_ROOT}${WORKERS}/${payload.id}${STATISTICS}/${payload.from}/${payload.to}`,
    method: 'get',
    headers: authorize(),
  });

  return statistics;
};

export const createCustomerToken = async ({ rootState }, payload) => {
  const { id } = rootState.user;
  const response = await createWorkerStripeCustomerToken(id, payload);
  return response;
};
