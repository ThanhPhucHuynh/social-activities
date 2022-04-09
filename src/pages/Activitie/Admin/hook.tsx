import React from 'react';
import { ActivitiesI } from '../../../services/activites';
import { Button } from 'antd';

const Hook = () => {
  const [data, setData] = React.useState<ActivitiesI[]>([]);

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (text: any, record: any, index: any) => index,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'date',
      dataIndex: 'date',
      key: 'date',
      render: (text: any, record: any, index: any) => 'date',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text: any, record: any, index: any) => (
        <React.Fragment>
          <Button>Add Department</Button>
        </React.Fragment>
      ),
    },
  ];

  return {
    data,
    setData,
    columns,
  };
};

export default Hook;
