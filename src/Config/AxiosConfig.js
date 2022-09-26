import axios from 'axios';
import { store } from '../Redux/store';
import { base_url } from './APIs';

export const instance = axios.create({
  baseURL: base_url,
  timeout: 15000,
});

instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers = store.getState().AuthReducer.user?.token
    ? {
      Authorization: 'Bearer ' + store.getState().AuthReducer.user.token,
    }
    : {}
  return config;
}, function (error) {
  console.warn(error)
  // Do something with request error
  return Promise.reject(error);
});

export const post = async (url, data, config = {}, message = "") => {
  try {
    let request = await instance.post(url, data, config);
    if (request.data.success == true) {
      if (request.data.data)
        return request.data.data;
      else
        alert(request.data.message);
    } else {
      if (request.data.message)
        alert(request.data.message);
      else
        alert(message)

    }
  } catch (error) {
    alert(error);
  }
};

export const get = async (url, config) => {
  try {
    let request = await instance.get(url, config);
    if (request.data.success == true) {
      return request.data.data;
    } else {
      alert(request.data.message);
    }
  } catch (error) {
    alert(error);
  }
};
