import { Table, Tag, Space } from 'antd';
import React from 'react';
import { ActivitiesI } from '../../../services/activites';

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
      title: 'updated_at',
      dataIndex: 'created_at',
      key: 'updated_at',
    },
  ];

  return {
    data,
    setData,
    columns,
  };
};
export default Hook;
