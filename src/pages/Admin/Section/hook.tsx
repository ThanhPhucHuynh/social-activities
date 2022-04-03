import { Table, Tag, Space } from 'antd';
import React from 'react';
import { SectionI } from '../../../services/department';

const Hook = () => {
  const [data, setData] = React.useState<SectionI[]>([]);

  const columns = [
    // {
    //   title: 'STT',
    //   key: 'index',
    //   render: (text: any, record: any, index: any) => index,
    // },
    // {
    //   title: 'ID',
    //   dataIndex: '_id',
    //   key: '_id',
    // },
    {
      title: 'Section',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'created_at',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    // {
    //   title: 'updated_at',
    //   dataIndex: 'created_at',
    //   key: 'updated_at',
    // },
  ];

  return {
    data,
    setData,
    columns,
  };
};
export default Hook;
