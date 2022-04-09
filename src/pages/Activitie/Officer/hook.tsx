import React, { useState } from 'react';
import { ActivitiesI, getActivitiesAll } from '../../../services/activites';
import { Button, Popconfirm, Tag } from 'antd';
import moment from 'moment';

const Hook = () => {
  const [data, setData] = React.useState<ActivitiesI[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const fetch = () => {
    setIsLoading(true);
    getActivitiesAll()
      .then((res) => {
        setData(res.data.reverse());
      })
      .finally(() => setIsLoading(false));
  };
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
      title: 'Section',
      dataIndex: 'section_name',
      key: 'section_name',
    },
    {
      title: 'description',
      dataIndex: 'description',
      key: 'description',
      width: 400,
    },
    {
      title: 'date',
      dataIndex: 'date',
      key: 'date',
      render: (text: any, record: any, index: any) => {
        return (
          <>
            <p>From: {new Date(record.date[0]).toLocaleString()}</p>
            <p>To: {new Date(record.date[1]).toLocaleString()}</p>
          </>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text: any, record: ActivitiesI, index: any) => {
        if (record.date) {
          const __startTime = moment(Date.now()).format();
          const __endTime = moment(new Date(record.date[1])).format();

          const __duration = moment.duration(moment(__endTime).diff(__startTime));
          const __hours = __duration.asHours();
          if (__hours < 0) {
            return <Tag color={'red'}>OUTDATE</Tag>;
          }
        }

        if (!record.isAccept) {
          return (
            <React.Fragment>
              <Button
                type="primary"
                disabled
                style={{
                  display: 'flex',
                }}
              >
                Request by {record.created_by_email}
              </Button>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment>
            <Button>Registers</Button>
          </React.Fragment>
        );
      },
    },
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
