import { AxiosResponse } from 'axios';
import api from '../utils/api';

export interface ActivitiesI {
  _id: string;
  name: string;
  description?: string;
  date?: string[];
  picture?: string[];
  location?: string;
  is_complete?: boolean;
  section_id?: string;
  isAccept?: boolean;
  created_by?: string;
  section_name?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by_email?: string;
}

export const getActivitiesAll = (): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.get(`/activity/all`);
};
export const postActivities = (
  activity: ActivitiesI
): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.post(`/activity`, activity);
};
export const acceptActivities = (id: string): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.patch(`/activity/acception`, {
    _id: id,
  });
};
