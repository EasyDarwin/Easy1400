import Box from '@/components/box/Box';
import { ErrorHandle } from '@/services/http/http';
import { EditConfigs, FindConfigs, findConfigs } from '@/services/http/system';
import { useMutation, useQuery } from '@umijs/max';
import { Alert, Button, Col, Form, Row, message } from 'antd';
import { AxiosResponse } from 'axios';
import NumberInput from './components/NumberInput';

export default function Page() {
  const [form] = Form.useForm<System.EditConfigsReq>();

  const formItemList = [
    {
      label: '人脸',
      name: 'face',
    },
    {
      label: '人员',
      name: 'person',
    },
    {
      label: '机动车',
      name: 'motor_vehicle',
    },
    {
      label: '非机动车',
      name: 'none_motor_vehicle',
    },
    {
      label: '物品',
      name: 'thing',
    },
    {
      label: '图片',
      name: 'picture',
    },
    {
      label: '视频',
      name: 'video',
    },
    {
      label: '文件',
      name: 'file',
    },
  ];

  const { data: configData, isLoading: configLoading } =
    useQuery<System.ConfigsRes>(
      [findConfigs],
      () =>
        FindConfigs().then((res: AxiosResponse<System.ConfigsRes>) => {
          form.setFieldsValue(res.data);
          return res.data;
        }),
      {
        onError: ErrorHandle,
      },
    );

  const { mutate, isLoading: editLoading } = useMutation(EditConfigs, {
    onSuccess: () => {
      message.success('设置成功');
    },
    onError: ErrorHandle,
  });

  return (
    <div>
      <div>
        <Alert
          message="保留时间说明: <= 0 表示永久保留，> 0 表示保留的时长（单位：小时）"
          type="info"
          showIcon
          style={{ width: '700px' }}
        />
        <Box
          style={{ width: '700px', marginTop: '10px', padding: '18px 24px' }}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={(v: System.EditConfigsReq) => {
              mutate(v);
            }}
            onFinishFailed={() => {}}
            autoComplete="off"
          >
            <Row gutter={12}>
              {formItemList.map((item, index) => (
                <Col key={item.name} span={12}>
                  <Form.Item label={item.label} name={item.name}>
                    <NumberInput />
                  </Form.Item>
                </Col>
              ))}
            </Row>
            <Form.Item>
              <Button type="primary" loading={editLoading} htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Box>
      </div>
    </div>
  );
}
