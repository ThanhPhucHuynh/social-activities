import { IOfficer } from '../redux/types/authI';

const storeAuth = (a: IOfficer) => {
  localStorage.setItem('auth', JSON.stringify(a));
};
const clearAuth = () => {
  localStorage.clear();
};
const getAuth = (): IOfficer | null => {
  const t = localStorage.getItem('auth');
  if (t) {
    return JSON.parse(t);
  }
  return null;
};
export { storeAuth, getAuth, clearAuth };
