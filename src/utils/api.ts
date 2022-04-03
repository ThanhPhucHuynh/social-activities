/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ObjectType } from 'typescript';
import { config } from '../config';
import { getAuth } from '../services/auth';

class API {
  private instance: AxiosInstance;

  constructor() {
    const instance: AxiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
    instance.interceptors.response.use(this.handleSuccess, this.handleError);
    instance.interceptors.request.use(
      async (conf) => {
        conf.baseURL = config.Host;
        const auth = getAuth();
        if (auth && conf.headers) {
          conf.headers = {
            Authorization: `Bearer ${auth.token}`,
          };
        }
        // todo something
        return conf;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    this.instance = instance;
  }

  handleSuccess: ((value: AxiosResponse<any, any>) => any) | undefined = (response) => {
    return response;
  };

  handleError: ((error: any) => any) | undefined = (error) => {
    return Promise.reject(error);
  };

  get = (url: string): Promise<AxiosResponse<any, any>> => this.instance.get(url);

  post = (url: string, payload: any): Promise<AxiosResponse<any, any>> =>
    this.instance.post(`${url}`, payload);

  patch = (url: string, payload: ObjectType): Promise<AxiosResponse<any, any>> =>
    this.instance.patch(`${url}`, payload);

  put = (url: string, data?: any): Promise<AxiosResponse<any, any>> =>
    this.instance.put(`${url}`, data);

  delete = (url: string, payload: ObjectType): Promise<AxiosResponse<any, any>> =>
    this.instance.delete(`${url}`, { data: payload });

  upload = (url: string, formData: FormData): Promise<AxiosResponse<any, any>> =>
    this.instance.post(`${url}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  export(url: string) {
    return this.instance.get(`${url}`, {
      responseType: 'blob',
    });
  }
}

export default new API();
