import React, { useRef, useState } from 'react';
import {
  ActivitiesI,
  getActivitiesAll,
  getActivitiesAllforOfficer,
  registerActivities,
} from '../../../services/activites';
import { Button, Typography, Tag, Popconfirm, message, Input, Space, InputRef } from 'antd';
import moment from 'moment';
import { IOfficer } from '../../../redux/types/authI';
import { SearchOutlined } from '@mui/icons-material';
import Highlighter from 'react-highlight-words';

const { Text, Link } = Typography;

const Hook = ({ officer }: { officer: IOfficer }) => {
  const [data, setData] = React.useState<ActivitiesI[]>([]);
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
    getActivitiesAllforOfficer(officer._id)
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
      filters: [
        {
          text: <span>Complete</span>,
          value: 'Complete',
        },
        {
          text: <span>registered</span>,
          value: 'registered',
        },
      ],
      onFilter: (value: any, record: ActivitiesI) => {
        if (value == 'Complete') {
          return record.is_complete == true;
        }
        if (value == 'registered') {
          return record.isRegister == true;
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
        if (record.isRegister) {
          return (
            <Button
              type="primary"
              style={{
                display: 'flex',
              }}
              disabled
            >
              registered
            </Button>
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
