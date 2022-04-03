// {
//     "_id": "6248028a73da13279bccab3e",
//     "name": "CNTT",
//     "created_at": "2022-04-02T08:00:10.997Z",
//     "updated_at": "2022-04-02T08:00:10.997Z"
// },

import { AxiosResponse } from 'axios';
import api from '../utils/api';

export interface DepartmentI {
  _id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const getDepartment = (): Promise<AxiosResponse<DepartmentI[], any>> => {
  return api.get('/department');
};

export {};
