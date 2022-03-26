import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useRoutes } from 'react-router-dom';
import { Home, LoginPage, NotFound } from '../pages';
import { loadAuthRequest } from '../redux/actions';
import { RootState } from '../redux/reducers/rootReducer';
import { routes } from './interface';

interface RI {
  path?: string;
  element: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null | undefined;
  index?: boolean | undefined;
  key?: React.Key | null | undefined;
  caseSensitive?: boolean | undefined;
  exact?: boolean;
  isAuth?: boolean;
}

const RouteResult = ({ R }: { R: RI[] }) => useRoutes(R);
const RouterNavigation = () => {
  const dispatch = useDispatch();

  const { officer } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    console.log(officer, '?');
    dispatch(loadAuthRequest());
  }, []);
  const routeItems: RI[] = [
    {
      path: routes.HOME,
      element: <Home />,
      isAuth: !!officer,
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
  return (
    <Router>
      <RouteResult R={routeItems} />
    </Router>
  );
};

export { RouterNavigation };
