import Box from '@/components/box/Box';
import { FindCrontab, findCrontab } from '@/services/http/cron';
import { ErrorHandle } from '@/services/http/http';
import {
  LayoutOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useQuery } from '@umijs/max';
import { Button, Popconfirm, Space, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';

export default function Page() {
  const { data, isLoading, refetch } = useQuery(
    [findCrontab],
    () => FindCrontab().then((res) => res.data),
    {
      onError: ErrorHandle,
    },
  );

  const columns: ColumnsType<Cron.Item> = [
    {
      title: '序号',
      align: 'center',
      width: 60,
      render: (text: string, record: Cron.Item, index: number) =>
        `${index + 1}`,
    },
    {
      title: '任务名称',
      dataIndex: 'title',
      width: 120,
    },
    {
      title: '任务描述',
      dataIndex: 'description',
      ellipsis: {
        showTitle: false,
      },
      render(value, record, index) {
        return <Tooltip title={value}>{value}</Tooltip>;
      },
    },
    {
      title: '上次执行时间',
      dataIndex: 'last_time_at',
      align: 'center',
      width: 180,
      render(value, record, index) {
        return `${value == '' ? '-' : value}`;
      },
    },
    {
      title: '执行次数',
      dataIndex: 'count',
      width: 100,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: '执行结果',
      dataIndex: 'result',
      ellipsis: {
        showTitle: true,
      },
      width: 100,
      render(value, record, index) {
        if (value == '') {
          return '-';
        }
        return (
          <Tooltip title={value}>
            <span style={{ color: value == 'OK' ? 'green' : 'red' }}>OK</span>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      render(value, record, index) {
        return (
          <Space>
            {/* TODO: 此处可以要么暂停任务，要么开始任务 */}
            {record.id > 0 ? (
              <Tooltip title="暂停任务">
                <Button danger icon={<StopOutlined />}></Button>
              </Tooltip>
            ) : (
              <Tooltip title="开始任务">
                {/* TODO: 换个图标 */}
                <Button icon={<LayoutOutlined />}></Button>
              </Tooltip>
            )}

            <Tooltip title="立即执行">
              <Button icon={<PlayCircleOutlined />}></Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Box>
        <Popconfirm title="确定要重载所有任务吗？">
          <Button type="primary" icon={<ReloadOutlined />}>
            重载所有任务
          </Button>
        </Popconfirm>
      </Box>
      <Box>
        <Table columns={columns} dataSource={data?.items} pagination={false} />
      </Box>
    </div>
  );
}
