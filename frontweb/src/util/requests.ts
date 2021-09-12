import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';

type LoginResponse = {
  access_token: string,
  token_type: string,
  expires_in: number,
  scope: string,
  userFirsName: string,
  userId: number
}

export const BASE_URL = process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:8080';
const LOGIN_URL = '/oauth/token'
const tokenKey = 'authData';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID ?? 'dscatalog'; // In an official application, this value must be stored in an environment variable
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET ?? 'dscatalog123';

const basicHeader = () => `Basic ${window.btoa(CLIENT_ID+':'+CLIENT_SECRET)}`;

type LoginData = {
  username: string,
  password: string
}

export const requestBackendLogin = (loginData: LoginData) => {

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: basicHeader(),
  }

  const data = qs.stringify({ // generates the urlencoded equivalent to this object
    ...loginData,  
    grant_type: 'password'
  })

  return axios({method: 'POST', baseURL: BASE_URL, url: LOGIN_URL, data, headers});
}

export const requestBackend = (config: AxiosRequestConfig) => {

  const headers = config.withCredentials ? {
    ...config.headers,
    Authorization: `Bearer ${getAuthData().access_token}`
  } : config.headers;

  return axios({...config, baseURL: BASE_URL, headers});
}

export const saveAuthData = (obj: LoginResponse) => {
  localStorage.setItem(tokenKey, JSON.stringify(obj));
}

export const getAuthData = () => {
  const str = localStorage.getItem(tokenKey) ?? '{}';
  return JSON.parse(str) as LoginResponse;
}
