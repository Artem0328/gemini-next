import { request } from '@/config/request';

export interface LoginFrom {
  username: string;
  password: string;
  is_ldap: boolean;
  is_oidc: boolean;
}

export function signIn(login: LoginFrom) {
  return request.post(login.is_ldap ? '/ldap' : '/login', { data: login });
}

export function systemRegisterState() {
  return request.get('/fetch');
}

export function getOIDCState() {
  return request.get('/oidc/state');
}
