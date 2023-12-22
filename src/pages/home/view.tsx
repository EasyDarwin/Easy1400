import Box from '@/components/box/Box';
import { ErrorHandle } from '@/services/http/http';
import { FindStatistics } from '@/services/http/system';
import { Column } from '@ant-design/charts';
import { PageContainer } from '@ant-design/pro-components';
import { useQuery } from '@umijs/max';
import { DatePicker, DatePickerProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { AxiosResponse } from 'axios';
import moment from 'moment';
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

  const handleRangePickerChange = (
    dates: DatePickerProps['value'] | RangePickerProps['value'],
    dateStrings: [string, string] | string,
  ) => {
    if (dateStrings.length === 2 && dates && dateStrings[0] !== dateStrings[1]) {
      const [startStr, endStr] = dateStrings;
      const startTimestamp = Math.floor(moment(startStr).valueOf() / 1000);
      const endTimestamp = Math.floor(moment(endStr).valueOf() / 1000);
      setQuery({ ...query, start: startTimestamp, end: endTimestamp });
    }
  };

  return (
    <PageContainer>
      <Box style={{ width: '700px' }}>
        <DatePicker.RangePicker
          format="YYYY-MM-DD"
          onChange={handleRangePickerChange}
        />
      </Box>
      <Box style={{ width: '700px' }}>
        <Column {...config} />
      </Box>
    </PageContainer>
  );
}
