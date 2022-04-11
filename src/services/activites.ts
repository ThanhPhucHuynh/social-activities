import { AxiosResponse } from 'axios';
import api from '../utils/api';
import { OfficerI } from './officer';

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
  destroy?: boolean;
  isRegister?: boolean;
}

export const getActivitiesAll = (): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.get(`/activity/all`);
};
export const getActivitiesAllforOfficer = (
  id: string
): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.get(`/activity/all/${id}`);
};
export const postActivities = (
  activity: ActivitiesI
): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.post(`/activity`, activity);
};
export const updateActivities = (
  activity: ActivitiesI
): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.put(`/activity`, activity);
};
export const acceptActivities = (id: string): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.patch(`/activity/acception`, {
    _id: id,
  });
};
export const destroyActivities = (id: string): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.patch(`/activity/destroy`, {
    _id: id,
  });
};
export const completeActivities = (id: string): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.patch(`/activity/complete`, {
    _id: id,
  });
};

export const registerActivities = (
  activityId: string,
  officerId: string
): Promise<AxiosResponse<ActivitiesI[], any>> => {
  return api.post(`/activity/register`, {
    activityId: activityId,
    officerId: officerId,
  });
};

export interface RegisterActivitiesI {
  _id: string;
  activityId: string;
  officerId: string;
  isAccept: boolean;
  acceptBy: string;
  rate: 0;
  isComplete: boolean;
  created_at: string;
  updated_at: string;
  officerInfo: OfficerI;
  activityInfo: ActivitiesI;
}
export const getRegisterActivitiesAll = (
  id: string
): Promise<AxiosResponse<RegisterActivitiesI[], any>> => {
  return api.get(`/register/officer/info/${id}`);
};
export const getOfficerOfActivitiesAll = (
  id: string
): Promise<AxiosResponse<RegisterActivitiesI[], any>> => {
  return api.get(`/register/activity/info/${id}`);
};
