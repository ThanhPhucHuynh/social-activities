import React, { useState } from 'react';
import { acceptActivities, ActivitiesI, getActivitiesAll } from '../../../services/activites';
import { Button, message, Popconfirm, Tag } from 'antd';
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
              <Popconfirm
                placement="topRight"
                title={'confirm'}
                onConfirm={() => {
                  setIsLoading(true);
                  acceptActivities(record._id)
                    .then(() => {
                      message.success('acceptActivities completed!');
                      fetch();
                    })
                    .catch(() => {
                      message.error('acceptActivities failed');
                    })
                    .finally(() => setIsLoading(false));
                  // setIsLoading(true);
                  // resetPW(record.email)
                  //   .then(() => {
                  //     message.success('reset pw completed!');
                  //   })
                  //   .catch(() => {
                  //     message.error('reset pw failed');
                  //   })
                  //   .finally(() => setIsLoading(false));
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  style={{
                    display: 'flex',
                  }}
                >
                  Accept
                </Button>
              </Popconfirm>
            </React.Fragment>
          );
        }
        return (
          <React.Fragment>
            <Button>Detail</Button>
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
