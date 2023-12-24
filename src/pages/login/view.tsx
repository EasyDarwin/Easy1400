import { WELCOME_MESSAGE } from '@/constants/index';
import { ErrorHandle, getToken, setToken } from '@/services/http/http';
import { GetCaptcha, Login, getCaptcha } from '@/services/http/login';
import { Button, Form, Input, notification } from 'antd';

import { history, useMutation, useQuery } from '@umijs/max';
import './view.less';

interface ILoginParams {
  username: string;
  password: string;
  captcha: string;
}

export default function Page() {
  const [form] = Form.useForm();
  const token = getToken();

  // useEffect(() => {
  //   if (!token) return;
  //   setTimeout(() => {
  //     history.push('/apps');
  //   }, 800);
  // }, []);

  //计算当前时间 显示登录问候
  const welcomeMessage = () => {
    let welcomeText: { message: string; description: string } = {
      message: '',
      description: '',
    };
    const currentTime = new Date().getHours();
    if (currentTime >= 0 && currentTime < 12) {
      welcomeText = WELCOME_MESSAGE.morning;
    } else if (currentTime >= 12 && currentTime < 14) {
      welcomeText = WELCOME_MESSAGE.noon;
    } else if (currentTime >= 14 && currentTime < 18) {
      welcomeText = WELCOME_MESSAGE.afternoon;
    } else {
      welcomeText = WELCOME_MESSAGE.night;
    }
    setTimeout(() => {
      notification.success({
        message: welcomeText.message,
        description: welcomeText.description,
        duration: 3,
      });
    }, 500);
  };

  const {
    data: captchaData,
    isLoading: captchaLoading,
    refetch,
  } = useQuery<Logins.CaptchaRes>(
    [getCaptcha],
    () => GetCaptcha().then((res) => res.data as Logins.CaptchaRes),
    {
      refetchInterval: 280000,
    },
  );

  const { mutate: handleLogin, isLoading: loginLoading } = useMutation(Login, {
    onSuccess: (res: any) => {
      setToken(res.data.token, res.data.user.id,res.data.user.username);
      history.push('/home');
      welcomeMessage();
    },
    onError: (error:Error) => {
      refetch();
      ErrorHandle(error);
    },
  });

  return (
    <div className="w-screen h-screen  bg-round-light">
      <div className=" xl:w-[500px] xl:h-[600px] h-[550px] w-[350px] rounded-2xl absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 bg-white flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
          <h2 className=" mt-8 text-center text-2xl font-bold tracking-wider leading-9 text-gray-900">
            GA/T1400视图库管理系统
          </h2>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Form
            className="space-y-6"
            layout="vertical"
            form={form}
            onFinish={(v: ILoginParams) => {
              let data = { ...v,username:v.username.trim(),password:v.password.trim(), captcha_id: captchaData!.captcha_id };
              handleLogin(data);
            }}
          >
            <div>
              <div className="mt-2">
                <Form.Item label="账户" name="username">
                  <Input />
                </Form.Item>
              </div>
            </div>

            <div>
              <div className="mt-2">
                <Form.Item label="密码:" name="password">
                  <Input.Password autoComplete="current-password" />
                </Form.Item>
              </div>
            </div>

            <div>
              <div className="mt-2 flex justify-between items-center">
                <Form.Item label="验证码:" name="captcha">
                  <Input
                    className="xl:w-[280px]"
                    autoComplete="current-password"
                  />
                </Form.Item>
                <div className="ml-1">
                  <img
                    className="object-cover w-24 h-8 mt-1.5"
                    src={captchaData?.base64}
                    onClick={() => refetch()}
                  />
                </div>
              </div>
            </div>
            <div>
              <Button
                htmlType="submit"
                className="flex w-full h-9 justify-center items-center border-slate-50 rounded-md bg-indigo-600 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                loading={loginLoading}
              >
                登录
              </Button>
            </div>
          </Form>

          <p className="mt-10 text-center text-sm text-gray-500">
            版本号 {`${process.env.WEB_VERSION}`}
          </p>
        </div>
      </div>
    </div>
  );
}
