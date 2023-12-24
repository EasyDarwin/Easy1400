import Box from '@/components/box/Box';
import { LOGIN_PAGE_ROUTE } from '@/constants';
import { ErrorHandle, cleanStoreage, username } from '@/services/http/http';
import { EditUserPwd } from '@/services/http/login';
import { history, useMutation } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';

interface IEditPwd {
  password: string;
  new_password: string;
  confirm_password: string;
}

const View = () => {
  const [form] = Form.useForm();

  const { mutate, isLoading } = useMutation(EditUserPwd, {
    onSuccess: () => {
      message.success('修改成功');
      setTimeout(() => {
        cleanStoreage();
        history.push(LOGIN_PAGE_ROUTE);
      }, 500);
    },
    onError: ErrorHandle,
  });

  return (
    <>
      <Box style={{ width: '600px', marginTop: '10px', padding: '18px' }}>
        <Form
          layout="vertical"
          form={form}
          onFinish={(v: IEditPwd) => {
            if (v.new_password !== v.confirm_password)
              return message.error('两次密码不一致');
            let userid = sessionStorage.getItem(username);

            if (!userid) return message.error('请先登录');
            const data = {
              id: userid,
              password: v.password,
              new_password: v.new_password,
            };
            mutate(data);
          }}
        >
          <Form.Item label="旧密码" name="password">
            <Input></Input>
          </Form.Item>
          <Form.Item label="新密码" name="new_password">
            <Input></Input>
          </Form.Item>
          <Form.Item label="确认新密码" name="confirm_password">
            <Input></Input>
          </Form.Item>
          <Form.Item>
            <Button loading={isLoading} type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </>
  );
};

export default View;
