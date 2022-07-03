import { Button, Form, Input, Table, DatePicker, message, Select, Tag, Rate } from 'antd';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { IOfficer } from '../../../redux/types/authI';
import { getRegisterActivitiesAll, RegisterActivitiesI } from '../../../services/activites';

const MyActivity = ({ officer }: { officer: IOfficer }) => {
  const [data, setData] = React.useState<RegisterActivitiesI[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getRegisterActivitiesAll(officer._id)
      .then((res) => {
        setData(res.data.reverse());
      })
      .catch(() => message.error('Get activites failed'))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'activityInfo',
      key: 'activityInfo.name',
      render: (text: any, record: any, index: any) => {
        return <>{record.activityInfo.name}</>;
      },
    },
    {
      title: 'date',
      dataIndex: 'activityInfo',
      key: 'activityInfo.date',
      render: (text: any, record: any, index: any) => {
        return (
          <>
            <p>From: {new Date(record.activityInfo.date[0]).toLocaleString()}</p>
            <p>To: {new Date(record.activityInfo.date[1]).toLocaleString()}</p>
          </>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: '',
      render: (text: any, record: RegisterActivitiesI, index: any) => {
        if (record.activityInfo.destroy) {
          return <Tag color={'red'}>DESTROY</Tag>;
        }
        if (record.activityInfo.is_complete) {
          return (
            <React.Fragment>
              <Tag color={'blue'}>COMPLETED</Tag>
              <Rate allowHalf disabled defaultValue={record.rate} />
            </React.Fragment>
          );
        }
        if (record.activityInfo.date) {
          const __startTime = moment(Date.now()).format();
          const __endTime = moment(new Date(record.activityInfo.date[1])).format();

          const __duration = moment.duration(moment(__endTime).diff(__startTime));
          const __hours = __duration.asHours();
          if (__hours < 0) {
            return <Tag color={'red'}>OUTDATE</Tag>;
          }
        }
        return (
          <React.Fragment>
            <Tag color={'gold'}>Processing</Tag>
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
export default MyActivity;
