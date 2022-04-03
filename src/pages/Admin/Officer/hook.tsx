import { Popconfirm, message, Input, Form, Tag, Space, Tooltip, Avatar, Button } from 'antd';
import React from 'react';
import prompt from '../../../components/Prompt';
import { OfficerI } from '../../../services/officer';
import Reset from './reset';

const Hook = () => {
  const [data, setData] = React.useState<OfficerI[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const columns = [
    {
      title: 'Code',
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: OfficerI) => {
        return (
          <>
            <Tooltip
              placement="top"
              title={
                <>
                  <Avatar size={40} alt={name} src={record.avatar} />
                </>
              }
            >
              {name}
            </Tooltip>
          </>
        );
      },
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <>
          <Tag
            color={role === 'admin' ? 'green' : role === 'root' ? 'volcano' : 'geekblue'}
            key={role}
          >
            {role.toUpperCase()}
          </Tag>
        </>
      ),
    },
    {
      title: 'gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: OfficerI) => <Reset record={record} />,
    },
  ];

  return {
    data,
    setData,
    columns,
  };
};
export default Hook;
