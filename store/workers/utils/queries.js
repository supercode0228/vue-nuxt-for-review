import axios from 'axios';
import authorize from '../../utils/auth';
import { WORKERS, VERIFY_URL_CHECK, SHOP_OWNER, FBCONNECTLINK, FBEXTRAS, FBTOKEN, CUSTOMER_TOKEN, CALENDARS, GOOGLE_TOKEN, GOOGLE, PUSH_WIZARD, ASSOCIATE, DISASSOCIATE } from '../../endpoints';

const { SCHEDULE_API_ROOT } = process.env;

export const getWorkersListQuery = async () => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${WORKERS}`,
    method: 'get',
    headers: authorize(),
  });

  return data.items;
};

export const getPersonalInfoQuery = async (id) => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${WORKERS}/${id}`,
    method: 'get',
    headers: authorize(),
  });

  return data;
};

export const verifyUserNameUniquenessQuery = async (payload) => {
  const { data } = await axios({
    url: `${process.env.SCHEDULE_API_ROOT}${WORKERS}${VERIFY_URL_CHECK}`,
    method: 'get',
    headers: authorize(),
    params: payload,
  });

  return data;
};

export const updatePersonalProfileQuery = async (id, payload) => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${WORKERS}/${id}`,
    method: 'put',
    headers: authorize(),
    data: payload,
  });

  return data;
};

export const createWorkerStripeCustomerToken = async (id, payload) => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${WORKERS}/${id}${CUSTOMER_TOKEN}`,
    method: 'post',
    headers: authorize(),
    data: payload,
  });

  return data;
};

export const associateFcmToken = async (payload) => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${PUSH_WIZARD}${ASSOCIATE}`,
    method: 'post',
    headers: authorize(),
    data: payload,
  });

  return data.result;
};

export const disassociateFcmToken = async (payload) => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${PUSH_WIZARD}${DISASSOCIATE}`,
    method: 'post',
    headers: authorize(),
    data: payload,
  });

  return data.result;
};

export const getFbConnectLink = async () => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${SHOP_OWNER}${FBCONNECTLINK}`,
    method: 'get',
    headers: authorize(),
  });

  return data.link;
};

export const postShopOwnerFbToken = async (payload) => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${SHOP_OWNER}${FBTOKEN}`,
    method: 'post',
    headers: authorize(),
    data: payload,
  });

  return data;
};

export const getFbExtras = async () => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${SHOP_OWNER}${FBEXTRAS}`,
    method: 'get',
    headers: authorize(),
  });

  return data;
};

export const unsetShopOwnerFbToken = async (payload) => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${SHOP_OWNER}${FBTOKEN}`,
    method: 'delete',
    headers: authorize(),
    data: payload,
  });

  return data;
};

export const resolveGoogleOneTimeTokenAndSave = async (payload) => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${SHOP_OWNER}${CALENDARS}${GOOGLE_TOKEN}`,
    method: 'post',
    headers: authorize(),
    data: payload,
  });

  return data;
};

export const getGoogleCalendarsList = async () => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${SHOP_OWNER}${CALENDARS}${GOOGLE}`,
    method: 'get',
    headers: authorize(),
  });

  return data;
};

export const revokeGoogleToken = async () => {
  const { data } = await axios({
    url: `${SCHEDULE_API_ROOT}${SHOP_OWNER}${CALENDARS}${GOOGLE_TOKEN}`,
    method: 'delete',
    headers: authorize(),
  });

  return data;
};
