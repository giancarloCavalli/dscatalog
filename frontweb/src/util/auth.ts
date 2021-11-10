import { Role } from 'types/role';
import { getTokenData } from './token';

export const hasAnyRoles = (roles: Role[]): boolean => {
  if (roles.length === 0)
    return true;

  const tokenData = getTokenData();

  if (tokenData !== undefined) 
    return roles.some(role => tokenData.authorities.includes(role));

  return false;
}

export const isAuthenticated = (): boolean => {
  const tokenData = getTokenData();
  return (tokenData && tokenData?.exp > (Date.now() / 1000)) ? true : false;
}