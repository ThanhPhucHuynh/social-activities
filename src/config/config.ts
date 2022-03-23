const config: {
  Host: string;
} = {
  Host: process.env.REACT_APP_HOST || 'http://127.0.0.1',
};
console.log(config);

export default config;
