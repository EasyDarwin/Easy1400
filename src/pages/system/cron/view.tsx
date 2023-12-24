import { useState } from 'react';

import {
  CheckCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@umijs/max';
import { Button, Popconfirm, Space, Table, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';

import Box from '@/components/box/Box';
import {
  EditExecCrontab,
  EditReloadCrontab,
  EditStartCrontab,
  EditStopCrontab,
  FindCrontab,
  findCrontab,
} from '@/services/http/cron';
import { ErrorHandle } from '@/services/http/http';
import { AxiosResponse } from 'axios';

export default function Page() {
  const {
    data: cronList,
    isLoading: cronLoading,
    refetch,
  } = useQuery<Cron.FindResponse>(
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
      ellipsis: {
        showTitle: false,
      },
      width:240
    },
    {
      title: '任务描述',
      dataIndex: 'description',
      ellipsis: {
        showTitle: false,
      },
      render(text) {
        return <Tooltip title={text}>{text}</Tooltip>;
      },
    },
    {
      title: '下次执行时间',
      dataIndex: 'next_time_at',
      align: 'center',
      width: 180,
      render(value) {
        return `${value == '' ? '-' : value}`;
      },
    },
    {
      title: '上次执行时间',
      dataIndex: 'last_time_at',
      align: 'center',
      width: 180,
      render(text:string) {
        return `${text == '' ? '-' : text}`;
      },
    },
    {
      title: '执行次数',
      dataIndex: 'count',
      align: 'center',
      width: 140,
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: '执行结果',
      dataIndex: 'result',
      align: 'center',
      ellipsis: {
        showTitle: true,
      },
      width: 140,
      render(text) {
        if (text == '') {
          return '-';
        }
        return (
          <Tooltip title={text}>
            <span className={text == 'OK' ? 'text-green-500' : 'text-red-500'}>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 140,
      render(_, record:Cron.Item) {
        return (
          <Space>
            {record.id > 0 ? (
              <Tooltip title="暂停任务">
                <Popconfirm
                  title={
                    <p>
                      确定 暂停
                      <span className="text-red-500"> {record.key} </span>
                      任务吗?
                    </p>
                  }
                  okButtonProps={{
                    loading: stopLoadings.includes(record.key),
                  }}
                  onConfirm={() => {
                    stopMutate(record.key);
                  }}
                >
                  <Button
                    loading={stopLoadings.includes(record.key)}
                    danger
                    icon={<StopOutlined />}
                  ></Button>
                </Popconfirm>
              </Tooltip>
            ) : (
              <Tooltip title="开始任务">
                <Button
                  onClick={() => {
                    startMutate(record.key);
                  }}
                  loading={startLoadings.includes(record.key)}
                  icon={<CheckCircleOutlined />}
                ></Button>
              </Tooltip>
            )}

            <Tooltip title="立即执行">
              <Button
                loading={execLoadings.includes(record.key)}
                onClick={() => {
                  execMutate(record.key);
                }}
                icon={<PlayCircleOutlined />}
              ></Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  //立即执行
  const [execLoadings, setExecLoadings] = useState<string[]>([]);
  const { mutate: execMutate } = useMutation(EditExecCrontab, {
    onMutate: (v: string) => {
      setExecLoadings([...execLoadings, v]);
    },
    onSuccess(data: AxiosResponse<{ key: string }>) {
      message.success('执行成功');
      setExecLoadings((v) => v.filter((item) => item !== data.data.key));
      refetch();
    },
    onError: (error: Error) => {
      setExecLoadings([]);
      ErrorHandle(error);
    },
  });

  //暂停执行
  const [stopLoadings, setStopLoading] = useState<string[]>([]);
  const { mutate: stopMutate } = useMutation(EditStopCrontab, {
    onMutate: (v: string) => {
      setStopLoading([...stopLoadings, v]);
    },
    onSuccess(data: AxiosResponse<{ key: string }>) {
      message.success('执行成功');
      setStopLoading((v) => v.filter((item) => item !== data.data.key));
      refetch();
    },
    onError: (error: Error) => {
      setStopLoading([]);
      ErrorHandle(error);
    },
  });

  //启动执行
  const [startLoadings, setStartLoading] = useState<string[]>([]);
  const { mutate: startMutate } = useMutation(EditStartCrontab, {
    onMutate: (v: string) => {
      setStartLoading([...startLoadings, v]);
    },
    onSuccess(data: AxiosResponse<{ key: string }>) {
      message.success('执行成功');
      setStartLoading((v) => v.filter((item) => item !== data.data.key));
      refetch();
    },
    onError: (error: Error) => {
      setStartLoading([]);
      ErrorHandle(error);
    },
  });

  //重载定时任务
  const { mutate: reloadMutate,isLoading:reloadLoading } = useMutation(EditReloadCrontab, {
    onSuccess() {
      message.success('重载成功');
      refetch();
    },
    onError: ErrorHandle,
  });

  return (
    <div>
      <Box>
        <Popconfirm
          onConfirm={() => {
            reloadMutate();
          }}
          title="确定要重载所有任务吗？"
        >
          <Button loading={reloadLoading} type="primary" icon={<ReloadOutlined />}>
            重载所有任务
          </Button>
        </Popconfirm>
      </Box>
      <Box>
        <Table
          loading={cronLoading}
          columns={columns}
          dataSource={cronList?.items}
          pagination={false}
        />
      </Box>
    </div>
  );
}
