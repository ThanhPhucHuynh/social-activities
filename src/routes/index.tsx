import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import { Home, NotFound } from "../pages";
import { routes } from "./interface";

const routeItems: {
  path?: string;
  element:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined;
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
];
const RouteResult = () => {
  const routes = useRoutes(routeItems);
  return routes;
};
const RouterNavigation = () => {
  //   const routeResult = useRoutes(routeItems);
  return (
    <Router>
      {/* {routeItems.map((item, i) => (
        <Route key={i} {...item} />
      ))} */}
      <RouteResult />
    </Router>
  );
};

export { RouterNavigation };
