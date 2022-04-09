import React from 'react';
import { IOfficer } from '../../redux/types/authI';

import ActivitiesAdmin from './Admin';
import ActivitiesOfficer from './Officer';

const Activities = ({ officer }: { officer: IOfficer }) => {
  if (officer.role == 'officer') {
    return <ActivitiesOfficer officer={officer} />;
  }
  return <ActivitiesAdmin officer={officer} />;
};

export default Activities;
