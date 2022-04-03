/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import api from '../utils/api';

export interface DepartmentI {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface SectionI {
  _id: string;
  name: string;
  department_id: string;
  department_name?: string;
  created_at?: string;
  updated_at?: string;
}

export const getDepartment = (): Promise<AxiosResponse<DepartmentI[], any>> => {
  return api.get('/department');
};
export const addDepartment = ({ name }: { name: string }): Promise<AxiosResponse<any, any>> => {
  return api.post('/department', { name });
};

export const getSection = ({
  idDPM,
}: {
  idDPM: string;
}): Promise<AxiosResponse<SectionI[], any>> => {
  return api.get(`/section/${idDPM}`);
};
export const addSection = (s: SectionI): Promise<AxiosResponse<any, any>> => {
  return api.post('/section', s);
};
export {};
