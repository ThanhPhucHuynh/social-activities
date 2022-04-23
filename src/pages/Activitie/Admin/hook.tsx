import React, { useRef, useState } from 'react';
import {
  acceptActivities,
  ActivitiesI,
  completeActivities,
  destroyActivities,
  getActivitiesAll,
  updateActivities,
} from '../../../services/activites';
import {
  Button,
  Form,
  message,
  Popconfirm,
  Tag,
  Dropdown,
  Menu,
  Typography,
  Input,
  InputRef,
  Space,
} from 'antd';
import moment from 'moment';
import RenderItem from './renderItem';
import prompt from '../../../components/Prompt';
import RenderItemUpdate from './renderItemUpdate';
import { SearchOutlined } from '@mui/icons-material';
import Highlighter from 'react-highlight-words';
import MyOfficer from './listOfficer';

const { Text, Link } = Typography;

const Hook = () => {
  const [data, setData] = React.useState<ActivitiesI[]>([]);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef | null>(null);

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size={'small'}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText('');
  };
  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

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
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Section',
      dataIndex: 'section_name',
      key: 'section_name',
      ...getColumnSearchProps('section_name'),
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
      width: '30%',
      ...getColumnSearchProps('description'),
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
      filters: [
        {
          text: <span>Complete</span>,
          value: 'Complete',
        },
        {
          text: <span>Not complete</span>,
          value: 'Not complete',
        },
        {
          text: <span>Outdate</span>,
          value: 'Outdate',
        },
      ],
      onFilter: (value: any, record: ActivitiesI) => {
        if (value == 'Complete') {
          return record.is_complete == true;
        }
        if (value == 'Outdate' && record.date) {
          const __startTime = moment(Date.now()).format();
          const __endTime = moment(new Date(record.date[1])).format();

          const __duration = moment.duration(moment(__endTime).diff(__startTime));
          const __hours = __duration.asHours();

          return __hours < 0;
        }
        if (value == 'Not complete') {
          return record.is_complete != true;
        }
        return true;
      },
      render: (text: any, record: ActivitiesI, index: any) => {
        if (record.destroy) {
          return <Tag color={'red'}>DESTROY</Tag>;
        }
        if (record.is_complete) {
          return (
            <React.Fragment>
              <Tag color={'blue'}>COMPLETED</Tag>
              <Button
                type="ghost"
                style={{
                  display: 'flex',
                }}
                onClick={() => {
                  prompt({
                    title: 'List Officer',
                    renderItem: <MyOfficer activity={record} />,
                    formProps: {
                      // form: form,
                      // onValuesChange: (changedValues: any, values: any) => {
                      //   if (changedValues.department) {
                      //     form.setFieldsValue({ section: undefined });
                      //   }
                      // },
                    },
                    onOk: (ref, value, close, finish, error) => {
                      // const sec: SectionI = JSON.parse(value.section);
                      // const date: string[] = value.Date.map((D: Date) => D.toISOString());
                      // const act: ActivitiesI = {
                      //   name: value.name,
                      //   description: value.description,
                      //   location: value.location,
                      //   section_id: sec._id,
                      //   section_name: sec.name,
                      //   picture: [],
                      //   _id: '',
                      //   date: date,
                      // };
                      // postActivities(act)
                      //   .then((res) => {
                      //     finish();
                      //     fetch();
                      //     message.info('ADD complete!');
                      //   })
                      //   .catch(() => message.error('failed!!'))
                      //   .finally(() => close());
                    },
                  });
                }}
              >
                Rate
              </Button>
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
                        setIsLoading(true);
                        destroyActivities(record._id)
                          .then(() => {
                            message.success('destroyActivities ac completed!');
                            fetch();
                          })
                          .catch(() => {
                            message.error('destroyActivities ac failed');
                          })
                          .finally(() => setIsLoading(false));
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
                        setIsLoading(true);
                        completeActivities(record._id)
                          .then(() => {
                            message.success('completeActivities pw completed!');
                            fetch();
                          })
                          .catch(() => {
                            message.error('completeActivities pw failed');
                          })
                          .finally(() => setIsLoading(false));
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
                    <Button
                      type="default"
                      style={{
                        display: 'flex',
                      }}
                      onClick={() => {
                        prompt({
                          title: 'List Officer',
                          renderItem: <MyOfficer activity={record} isComplete={false} />,
                          formProps: {
                            // form: form,
                            // onValuesChange: (changedValues: any, values: any) => {
                            //   if (changedValues.department) {
                            //     form.setFieldsValue({ section: undefined });
                            //   }
                            // },
                          },
                          onOk: (ref, value, close, finish, error) => {
                            // const sec: SectionI = JSON.parse(value.section);
                            // const date: string[] = value.Date.map((D: Date) => D.toISOString());
                            // const act: ActivitiesI = {
                            //   name: value.name,
                            //   description: value.description,
                            //   location: value.location,
                            //   section_id: sec._id,
                            //   section_name: sec.name,
                            //   picture: [],
                            //   _id: '',
                            //   date: date,
                            // };
                            // postActivities(act)
                            //   .then((res) => {
                            //     finish();
                            //     fetch();
                            //     message.info('ADD complete!');
                            //   })
                            //   .catch(() => message.error('failed!!'))
                            //   .finally(() => close());
                          },
                        });
                      }}
                    >
                      List
                    </Button>
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
