interface routeI {
  HOME: string;
  NOT_FOUND: string;
}

const routes: routeI = {
  HOME: "/",
  NOT_FOUND: "*",
};

export { routes };
