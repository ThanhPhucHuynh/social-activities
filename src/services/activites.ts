import { AxiosResponse } from 'axios';
import api from '../utils/api';

export interface ActivitiesI {
  _id: string;
  name: string;
  description: string;
  date: Date[];
  picture: string[];
  location: string;
  is_complete: boolean;
  section_id: string;
  isAccept: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export const getActivitiesAll = (): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.get(`/activity/all`);
};
