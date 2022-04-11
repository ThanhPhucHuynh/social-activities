import { Button, Form, Input, Table, DatePicker, message, Select, Tag, Rate } from 'antd';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { IOfficer } from '../../../redux/types/authI';
import {
  ActivitiesI,
  getOfficerOfActivitiesAll,
  getRegisterActivitiesAll,
  RegisterActivitiesI,
} from '../../../services/activites';

const MyOfficer = ({ activity }: { activity: ActivitiesI }) => {
  const [data, setData] = React.useState<RegisterActivitiesI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getOfficerOfActivitiesAll(activity._id)
      .then((res) => {
        setData(res.data.reverse());
      })
      .catch(() => message.error('Get MyOfficer failed'))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'officerInfo',
      key: 'officerInfo.name',
      render: (text: any, record: any, index: any) => {
        return <>{record.officerInfo.name}</>;
      },
    },
    {
      title: 'email',
      dataIndex: 'officerInfo',
      key: 'officerInfo.email',
      render: (text: any, record: any, index: any) => {
        return <>{record.officerInfo.email}</>;
      },
    },
    {
      title: 'Rate',
      dataIndex: '',
      render: (text: any, record: RegisterActivitiesI, index: any) => {
        return (
          <React.Fragment>
            <Tag color={'blue'}>COMPLETED</Tag>;
            <Rate allowHalf disabled defaultValue={record.rate} />
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Table loading={isLoading} rowKey={(a) => a?._id} columns={columns} dataSource={data} />
    </React.Fragment>
  );
};
export default MyOfficer;
