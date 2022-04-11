import React, { useState } from 'react';
import { ActivitiesI, getActivitiesAll, registerActivities } from '../../../services/activites';
import { Button, Typography, Tag, Popconfirm, message } from 'antd';
import moment from 'moment';
import { IOfficer } from '../../../redux/types/authI';
const { Text, Link } = Typography;

const Hook = ({ officer }: { officer: IOfficer }) => {
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
      render: (text: any, record: ActivitiesI, index: any) => (
        <React.Fragment>
          <p>{text}</p>
          <Text type="secondary">by {record.created_by_email}</Text>
        </React.Fragment>
      ),
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
        if (record.destroy) {
          return <Tag color={'red'}>DESTROY</Tag>;
        }
        if (record.is_complete) {
          return (
            <React.Fragment>
              <Tag color={'blue'}>COMPLETED</Tag>;
            </React.Fragment>
          );
        }
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
            {/* <Button>Registers</Button> */}
            <Popconfirm
              placement="topRight"
              title={'confirm'}
              onConfirm={() => {
                setIsLoading(true);
                registerActivities(record._id, officer._id)
                  .then(() => {
                    message.success('registerActivities completed!');
                    fetch();
                  })
                  .catch((e) => {
                    message.error('failed: ' + e.response.data.message);
                  })
                  .finally(() => setIsLoading(false));
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
                Registers
              </Button>
            </Popconfirm>
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
