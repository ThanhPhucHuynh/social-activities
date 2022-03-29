import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { Header } from '../components';
import { Activitie, Home, LoginPage, NotFound } from '../pages';
import Explore from '../pages/Explore';
import Officer from '../pages/Officer';
import Report from '../pages/Report';
import { loadAuthRequest } from '../redux/actions';
import { RootState } from '../redux/reducers/rootReducer';
import { IOfficer } from '../redux/types/authI';
import { RI, routes } from './interface';

const RouteResult = ({ R }: { R: RI[] }) => useRoutes(R);

const routeItems = (officer: IOfficer | null): RI[] =>
  (officer
    ? [
        {
          path: routes.HOME,
          element: <Home officer={officer} />,
        },
      ].concat([
        ...(officer.role === 'admin'
          ? [
              {
                path: '/activities',
                element: <Activitie />,
              },
              {
                path: '/officer',
                element: <Officer />,
              },
              {
                path: '/report',
                element: <Report />,
              },
              {
                path: '/explore',
                element: <Explore />,
              },
            ]
          : []),
        {
          path: '/activities',
          element: <Activitie />,
        },
      ])
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

const RouterNavigation = () => {
  const dispatch = useDispatch();
  const { officer } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadAuthRequest());
  }, []);

  return (
    <Router>
      {officer ? <Header officer={officer} /> : null}
      <RouteResult R={routeItems(officer)} />
    </Router>
  );
};

export { RouterNavigation };
