import { Button, Form, Input, Table, DatePicker, message, Space, InputRef, Tag, Rate } from 'antd';
import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import { IOfficer } from '../../../redux/types/authI';
import {
  ActivitiesI,
  getOfficerOfActivitiesAll,
  getRegisterActivitiesAll,
  rateAPI,
  RegisterActivitiesI,
} from '../../../services/activites';
import { SearchOutlined } from '@mui/icons-material';
import Highlighter from 'react-highlight-words';

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
    onFilter: (value: any, record: any) => {
      const a = dataIndex.split('.');
      const b = a !== 1 ? record[a[0]][a[1]] : record[dataIndex];

      return b.toString().toLowerCase().includes(value.toLowerCase());
    },

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
      ...getColumnSearchProps('officerInfo.email'),
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
            <Tag color={'blue'}>COMPLETED</Tag>
            <Rate
              //   allowHalf
              onChange={(a) => {
                setIsLoading(true);
                rateAPI(record._id, a)
                  .then(() => {
                    message.success('Update rate completed');
                  })
                  .catch(() => message.error('Failed'))
                  .finally(() => setIsLoading(false));
              }}
              defaultValue={record.rate}
            />
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
