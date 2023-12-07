import { FindDictTypes, findDictTypes } from '@/services/http/dict';
import { ErrorHandle } from '@/services/http/http';
import { PageContainer } from '@ant-design/pro-layout';
import { useQuery } from '@umijs/max';
import { Col, Row } from 'antd';
import { useState } from 'react';
import { DictEmun } from './components/emun';
import { DictType } from './components/type';

export default function Page() {
  // 展开的字典数据
  const [code, setCode] = useState('');

  const { data: dataSource = [] } = useQuery<Dict.TypeItem[]>(
    [findDictTypes],
    () =>
      FindDictTypes(1, 1000, '').then((res) => {
        let items = res.data.items;
        if (items.length > 0) {
          setCode(items[0].code);
        }
        return items;
      }),
    {
      onError: (error: any) => ErrorHandle(error),
    },
  );

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Row>
        <Col span={7}>
          <DictType
            data={dataSource}
            code={code}
            onChangeCode={(v: string) => setCode(v)}
            id={dataSource.filter((v) => v.code === code)[0]?.id ?? 0}
          />
        </Col>
        <Col span={17}>
          <DictEmun code={code} />
        </Col>
      </Row>
    </PageContainer>
  );
}
