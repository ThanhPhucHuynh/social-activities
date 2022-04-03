/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Activitie } from '../pages';
// import { IOfficer } from '../redux/types/authI';

export type ElementI =
  | Element
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | null
  | undefined;
export interface RI {
  path?: string;
  element:
    | Element
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined;
  index?: boolean | undefined;
  key?: React.Key | null | undefined;
  caseSensitive?: boolean | undefined;
  exact?: boolean;
  isAuth?: boolean;
}

const routes = {
  HOME: '/',
  NOT_FOUND: '*',
  LOGIN: '/login',
};

// const pagesAdmin = ['Activities', 'Officer', 'Report', 'Explore'];
// const pagesOfficer = ['Activities'];

const privateRoute = (): {
  officerR: RI[];
  adminR: RI[];
} => ({
  officerR: [
    {
      path: '/activities',
      element: <Activitie />,
    },
  ],
  adminR: [],
});

export { routes, privateRoute };
