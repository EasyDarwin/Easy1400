import Box from '@/components/box/Box';
import { ErrorHandle } from '@/services/http/http';
import { FindStatistics } from '@/services/http/system';
import { Column } from '@ant-design/charts';
import { PageContainer } from '@ant-design/pro-components';
import { useQuery } from '@umijs/max';
import { DatePicker, DatePickerProps } from 'antd';
import { AxiosResponse } from 'axios';
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
      maxWidth: 80,
    },
    label: {
      visible: true,
      style: {
        fill: '#0D0E68',
        fontSize: 12,
        fontWeight: 600,
        opacity: 0.6,
      },
    },
  };

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <PageContainer>
      {/* <Box>
        <DatePicker.RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={onChange}
        />
      </Box> */}
      <Box style={{ width: '700px' }}>
        <Column {...config} />
      </Box>
    </PageContainer>
  );
}
