import React from 'react';
import { BrowserRouter as Router, Routes, Route, useRoutes } from 'react-router-dom';
import { Home, LoginPage, NotFound } from '../pages';
import { routes } from './interface';

const routeItems: {
  path?: string;
  element: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null | undefined;
  index?: boolean | undefined;
  key?: React.Key | null | undefined;
  caseSensitive?: boolean | undefined;
  exact?: boolean;
}[] = [
  {
    path: routes.HOME,
    element: <Home />,
  },
  {
    path: routes.NOT_FOUND,
    element: <NotFound />,
  },
  {
    path: routes.LOGIN,
    element: <LoginPage />,
  },
];
const RouteResult = () => useRoutes(routeItems);
const RouterNavigation = () => {
  return (
    <Router>
      <RouteResult />
    </Router>
  );
};

export { RouterNavigation };
