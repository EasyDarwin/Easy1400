import Box from '@/components/box/Box';
import CopyIcon from '@/components/copy/CopyIcon';
import { ErrorHandle } from '@/services/http/http';
import { FindSystemInfo } from '@/services/http/system';
import { useQuery } from '@umijs/max';
import { Descriptions, DescriptionsProps } from 'antd';
import { AxiosResponse } from 'axios';

const View = () => {
  const { data, isLoading } = useQuery(
    ['info'],
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
          {data?.username ?? ''}
          <CopyIcon value={data?.username} />
        </span>
      ),
    },
    {
      key: '2',
      label: '视图库密码',
      children: (
        <span>
          {data?.password ?? ''}
          <CopyIcon value={data?.password} />
        </span>
      ),
    },
    {
      key: '3',
      label: '服务器启动时间',
      children: (
        <span>
          {data?.start_at ?? ''}
          <CopyIcon value={data?.start_at} />
        </span>
      ),
    },
    {
      key: '4',
      label: '版本号',
      children: (
        <span>
          {data?.version ?? ''}
          <CopyIcon value={data?.version} />
        </span>
      ),
    },
    {
      key: '5',
      label: '服务器地址',
      children: (
        <span>
          {data?.host ?? ''}
          <CopyIcon value={data?.host} />
        </span>
      ),
    },
    {
      key: '6',
      label: '服务器端口',
      children: (
        <span>
          {data?.port ?? ''}
          <CopyIcon value={data?.port} />
        </span>
      ),
    },
  ];

  return (
    <Box style={{ width: '600px' }}>
      <Descriptions column={2} title="系统信息" items={items} />
    </Box>
  );
};

export default View;
