interface routeI {
  HOME: string;
  NOT_FOUND: string;
  LOGIN: string;
}

const routes: routeI = {
  HOME: '/',
  NOT_FOUND: '*',
  LOGIN: '/login',
};

export { routes };
