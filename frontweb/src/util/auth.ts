import jwtDecode from 'jwt-decode';
import { getAuthData } from './storage';

export type Role = 'ROLE_OPERATOR' | 'ROLE_ADMIN'; //enum

export type TokenData = {
  exp: number,
  user_name: string,
  authorities: Role
}

export const hasAnyRoles = (roles: Role[]): boolean => {
  if (roles.length === 0)
    return true;

  const tokenData = getTokenData();

  if (tokenData !== undefined) 
    return roles.some(role => tokenData.authorities.includes(role));

  return false;
}

export const getTokenData = () : TokenData | undefined => {
  try {
    return jwtDecode(getAuthData().access_token) as TokenData;
  } catch (error) {
    return undefined;
  }
}

export const isAuthenticated = (): boolean => {
  const tokenData = getTokenData();
  return (tokenData && tokenData?.exp > (Date.now() / 1000)) ? true : false;
}