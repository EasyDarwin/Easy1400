import Box from '@/components/box/Box';
import CopyIcon from '@/components/copy/CopyIcon';
import { onCopyValue } from '@/package/copy/copy';
import { datePickerToTimestamp } from '@/package/time/time';
import { ErrorHandle } from '@/services/http/http';
import {
  FindLinkData,
  findLinkData,
  FindStatistics,
  FindSystemInfo,
  findSystemInfo,
} from '@/services/http/system';
import { Column } from '@ant-design/charts';
import { PageContainer } from '@ant-design/pro-components';
import { useQuery } from '@umijs/max';
import {
  Button,
  DatePicker,
  DatePickerProps,
  Descriptions,
  DescriptionsProps,
  Typography,
} from 'antd';

import { RangePickerProps } from 'antd/es/date-picker';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function Page() {
  const [query, setQuery] = useState({
    start: 0,
    end: 0,
    device_id: '',
  });

  const { data: statisticsData, isLoading } = useQuery<System.Statistics>(
    ['statistics', query],
    () => FindStatistics(query).then((res: AxiosResponse) => res.data),
    {
      onError: ErrorHandle,
    },
  );

  const { data: infoData, isLoading: infoLoading } =
    useQuery<System.SystemInfo>(
      [findSystemInfo],
      () => FindSystemInfo().then((res: AxiosResponse) => res.data),
      {
        onError: ErrorHandle,
      },
    );

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '视图库用户名',
      children: (
        <span>
          {infoData?.username ?? ''}
          <CopyIcon value={infoData?.username ?? ''} />
        </span>
      ),
    },
    {
      key: '2',
      label: '视图库密码',
      children: (
        <span>
          {infoData?.password ?? ''}
          <CopyIcon value={infoData?.password ?? ''} />
        </span>
      ),
    },
    {
      key: '3',
      label: '服务器启动时间',
      children: (
        <span>
          {infoData?.start_at ?? ''}
          <CopyIcon value={infoData?.start_at ?? ''} />
        </span>
      ),
    },
    {
      key: '4',
      label: '版本号',
      children: (
        <span>
          {infoData?.version ?? ''}
          <CopyIcon value={infoData?.version ?? ''} />
        </span>
      ),
    },
    {
      key: '5',
      label: '服务器地址',
      children: (
        <span>
          {infoData?.host ?? ''}
          <CopyIcon value={infoData?.host ?? ''} />
        </span>
      ),
    },
    {
      key: '6',
      label: '服务器端口',
      children: (
        <span>
          {infoData?.port ?? ''}
          <CopyIcon value={infoData?.port ?? ''} />
        </span>
      ),
    },
  ];

  const { data: linkData } = useQuery([findLinkData], () => FindLinkData().then((res: AxiosResponse<System.LinkData>) => res.data), {
    onError: ErrorHandle,
  })

  const collectionItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '接入设备总数',
      children: (
        <span>
          {linkData?.devices.count ?? ''}
          <CopyIcon value={String(linkData?.devices.count)} />
        </span>
      ),
    },
    {
      key: '2',
      label: '在线设备数',
      children: (
        <span>
          {linkData?.devices.online_count ?? ''}
          <CopyIcon value={String(linkData?.devices.online_count)} />
        </span>
      ),
    },
    {
      key: '3',
      label: '上级平台总数',
      children: (
        <span>
          {linkData?.cascade.count ?? ''}
          <CopyIcon value={String(linkData?.cascade.count)} />
        </span>
      ),
    },
    {
      key: '4',
      label: '在线上级平台数',
      children: (
        <span>
          {linkData?.cascade.online_count ?? ''}
          <CopyIcon value={String(linkData?.cascade.online_count)} />
        </span>
      ),
    },
    {
      key: '5',
      label: '下级平台总数',
      children: (
        <span>
          {linkData?.platform.count ?? ''}
          <CopyIcon value={String(linkData?.platform.count)} />
        </span>
      ),
    },
    {
      key: '6',
      label: '在线下级平台数',
      children: (
        <span>
          {linkData?.platform.online_count ?? ''}
          <CopyIcon value={String(linkData?.platform.online_count)} />
        </span>
      ),
    },
    {
      key: '7',
      label: '向上推送数',
      children: (
        <span>
          {linkData?.notifications ?? ''}
          <CopyIcon value={String(linkData?.notifications)} />
        </span>
      ),
    },
    {
      key: '8',
      label: '下级接受数',
      children: (
        <span>
          {linkData?.subscription ?? ''}
          <CopyIcon value={String(linkData?.subscription)} />
        </span>
      ),
    }
  ]



  const config = {
    title: {
      visible: true,
      text: '基础柱状图-图形标签',
    },
    description: {
      visible: true,
      text: '基础柱状图图形标签默认位置在柱形上部\u3002',
    },
    forceFit: true,
    data: statisticsData?.items ?? [],
    padding: 'auto',
    xField: 'title',
    yField: 'count',

    style: {
      maxWidth: 40,
    },
    label: {
      visible: true,
      style: {
        fill: '#0D0E68',
        fontSize: 12,
        maxWidth: 80,
        opacity: 0.6,
      },
    },
  };

  const onOk = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
  ) => {
    if (Array.isArray(value) && value.length === 2) {
      const time = datePickerToTimestamp(value)
      setQuery({ ...query, start: time?.start ?? 0, end: time?.end ?? 0 });
    }
  };

  //一键复制信息
  const onClickCopyInfo = () => {
    let data = {
      platform_id: infoData?.username ?? '',
      user_name: infoData?.username ?? '',
      remote_port: Number(infoData?.port ?? 0),
    };
    onCopyValue(JSON.stringify(data))
  }

  return (
    <PageContainer>
      <Box style={{ width: '500px' }}>
        <DatePicker.RangePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          defaultValue={[dayjs().startOf('day'), dayjs().endOf('day')]}
          onOk={onOk}
        />
      </Box>
      <div className="flex">
        <Box style={{ width: '500px' }}>
          <Typography.Title level={5}>资源采集数量</Typography.Title>
          <Column {...config} />
        </Box>
        <Box style={{ width: '600px', marginLeft: '22px' }}>
          <Descriptions column={2} title="系统信息" items={items} />
          <Button onClick={onClickCopyInfo}>一键复制</Button>
          <Descriptions className='mt-4' column={2} title="采集信息" items={collectionItems} />
        </Box>
      </div>
    </PageContainer>
  );
}
