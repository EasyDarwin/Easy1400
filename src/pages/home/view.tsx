import Box from '@/components/box/Box';
import { Column } from '@ant-design/charts';
import { PageContainer } from '@ant-design/pro-components';

export default function Page() {
  const data = [
    {
      type: '家具家电',
      sales: 38,
    },
    {
      type: '粮油副食',
      sales: 52,
    },
    {
      type: '生鲜水果',
      sales: 61,
    },
    {
      type: '美容洗护',
      sales: 145,
    },
    {
      type: '母婴用品',
      sales: 48,
    },
    {
      type: '进口食品',
      sales: 38,
    },
    {
      type: '食品饮料',
      sales: 38,
    },
    {
      type: '家庭清洁',
      sales: 38,
    },
  ];
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
    data,
    padding: 'auto',
    xField: 'type',
    yField: 'sales',
    meta: {
      type: { alias: '类别' },
      sales: { alias: '销售额(万)' },
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
  return (
    <PageContainer>
      <div style={{ maxWidth: '600px' }}>
        <Box>
          <Column {...config} />
        </Box>
      </div>
    </PageContainer>
  );
}
