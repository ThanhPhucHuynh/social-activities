import React, { useEffect } from 'react';
import { Table, Tag, Space } from 'antd';
import Hook from './hook';
import { getDepartment } from '../../../services/department';
import { Box } from '@mui/material';
import { Button, Radio } from 'antd';

const DepartmentA = () => {
  const { columns, data, setData } = Hook();
  useEffect(() => {
    getDepartment().then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  }, []);
  return (
    <React.Fragment>
      DepartmentA
      <Box>
        <Button type="primary">ADD Department</Button>
        <Table rowKey={(a) => a._id} columns={columns} dataSource={data} />
      </Box>
    </React.Fragment>
  );
};
export default DepartmentA;
