import React, { useState } from 'react';
import {
  acceptActivities,
  ActivitiesI,
  getActivitiesAll,
  updateActivities,
} from '../../../services/activites';
import { Button, Form, message, Popconfirm, Tag, Dropdown, Menu } from 'antd';
import moment from 'moment';
import RenderItem from './renderItem';
import prompt from '../../../components/Prompt';
import RenderItemUpdate from './renderItemUpdate';

const Hook = () => {
  const [data, setData] = React.useState<ActivitiesI[]>([]);
  const [form] = Form.useForm();
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
      width: '30%',
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
            <Dropdown.Button
              overlay={
                <React.Fragment>
                  <Menu>
                    <Button
                      style={{ marginRight: 10 }}
                      onClick={() => {
                        prompt({
                          title: 'Text',
                          renderItem: <RenderItemUpdate activity={record} />,
                          // formProps: {
                          //   // form: form,
                          //   // onValuesChange: (changedValues: any, values: any) => {
                          //   //   if (changedValues.department) {
                          //   //     form.setFieldsValue({ section: undefined });
                          //   //   }
                          //   // },
                          // },
                          onOk: (ref, value, close, finish, error) => {
                            const date: string[] = value.Date.map((D: Date) => D.toISOString());
                            const act: ActivitiesI = {
                              name: value.name,
                              description: value.description,
                              location: value.location,
                              section_id: record.section_id,
                              section_name: record.section_name,
                              _id: record._id,
                              picture: record.picture,
                              date: date,
                            };
                            updateActivities(act)
                              .then((res) => {
                                finish();
                                fetch();
                                message.info('update complete!');
                              })
                              .catch(() => message.error('failed!!'))
                              .finally(() => close());
                          },
                        });
                      }}
                    >
                      Update
                    </Button>
                    <Popconfirm
                      placement="topRight"
                      title={'confirm destroy activity'}
                      onConfirm={() => {
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
                      <Button style={{ marginRight: 10 }} danger>
                        Destroy
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      placement="topRight"
                      title={'confirm complete activity'}
                      onConfirm={() => {
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
                        style={{ marginRight: 10 }}
                        // onClick={() => {
                        //   //
                        // }}
                        type="primary"
                      >
                        Complete
                      </Button>
                    </Popconfirm>
                  </Menu>
                </React.Fragment>
              }
            >
              Actions
            </Dropdown.Button>
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
