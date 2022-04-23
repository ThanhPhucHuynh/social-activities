import { Table, Tag, Space, Button, message, Popconfirm } from 'antd';
import React, { useState } from 'react';
import { getSection, SectionI } from '../../../services/department';
import api from '../../../utils/api';

const Hook = (idDPM: string) => {
  const [data, setData] = React.useState<SectionI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = () => {
    setIsLoading(true);
    getSection({ idDPM: idDPM })
      .then((res) => {
        if (res.data) {
          setData(res.data.reverse());
        }
        return;
      })
      .finally(() => setIsLoading(false));
  };

  const columns = [
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
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: SectionI) => {
        const a = (x: boolean) => {
          api
            .get(`/section/disable/${record._id}/${x}`)
            .then(() => {
              message.success('completed.');
              fetch();
            })
            .catch(() => message.error('completed.'));
        };
        if (record?.disable == true) {
          return (
            <Space size="middle">
              <Popconfirm
                placement="topRight"
                title={'confirm'}
                onConfirm={() => {
                  a(false);
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button>enable</Button>
              </Popconfirm>
            </Space>
          );
        }
        return (
          <Space size="middle">
            <Popconfirm
              placement="topRight"
              title={'confirm'}
              onConfirm={() => {
                a(true);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button>disable</Button>
            </Popconfirm>
          </Space>
        );
      },
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
    fetch,
    isLoading,
    setIsLoading,
  };
};
export default Hook;
