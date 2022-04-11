import { Box } from '@mui/material';
import { Button, Form, Input, Table, DatePicker, message, Select } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import prompt from '../../../components/Prompt';
import { IOfficer } from '../../../redux/types/authI';
import { getActivitiesAll } from '../../../services/activites';
import { getDepartment, getSection, SectionI } from '../../../services/department';
import { DepartmentI } from '../../../services/officer';
import Hook from './hook';
const { RangePicker } = DatePicker;
const { Option } = Select;
const rangeConfig = {
  rules: [{ type: 'array' as const, required: true, message: 'Please select time!' }],
};
const MyActivity = () => {
  return <React.Fragment>MyActivity</React.Fragment>;
};
export default MyActivity;
