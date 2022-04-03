/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import api from '../utils/api';

export interface DepartmentI {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface OfficerI {
  _id: string;
  code: string;
  name: string;
  email: string;
  birthday: string;
  avatar?: string;
  gender?: string;
  country?: string;
  salary?: number;
  phone?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export const getOfficers = (): Promise<AxiosResponse<OfficerI[], any>> => {
  return api.get(`/officers`);
};
export const resetPW = (email: string): Promise<AxiosResponse<OfficerI[], any>> => {
  return api.put(`/root/password/${email}`);
};
export const AddOfficer = (P: OfficerI): Promise<AxiosResponse<OfficerI[], any>> => {
  return api.post(`/register`, P);
};
export {};
