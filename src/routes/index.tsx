import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Home, LoginPage, NotFound } from '../pages';
import { loadAuthRequest } from '../redux/actions';
import { RootState } from '../redux/reducers/rootReducer';
import { routes } from './interface';

interface RI {
  path?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    dispatch(loadAuthRequest());
  }, []);

  const routeItems: RI[] = (
    officer
      ? [
          {
            path: routes.HOME,
            element: <Home />,
          },
        ]
      : [
          {
            path: routes.HOME,
            element: <LoginPage />,
          },
        ]
  ).concat({
    path: routes.NOT_FOUND,
    element: <NotFound />,
  });

  return (
    <Router>
      <RouteResult R={routeItems} />
    </Router>
  );
};

export { RouterNavigation };
