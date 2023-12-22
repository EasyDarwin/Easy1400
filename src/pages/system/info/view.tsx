import Box from '@/components/box/Box';
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
      children: data.username,
    },
    {
      key: '2',
      label: '视图库密码',
      children: data.password,
    },
    {
      key: '3',
      label: '服务器启动时间',
      children: data.start_at,
    },
    {
      key: '4',
      label: '版本号',
      children: data.version,
    },
  ];

 

  return (
    <Box style={{width:'600px'}}>
      <Descriptions column={2} title="系统信息" items={items} />
    </Box>
  );
};

export default View;
