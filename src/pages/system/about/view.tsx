import Box from '@/components/box/Box';
import { Watermark } from 'antd';

const View = () => {
  return (
    <Watermark gap={[300,300]} font={{color:'rgba(190,190,190,.3)	'}} content="安徽羚通科技有限公司">
      <Box>
        <h2 className="py-3">关于我们 :</h2>
        <p className="indent-8 leading-8 subpixel-antialiased whitespace-normal font-mono text-lg">
          <a
            className="text-blue-600 "
            href="https://lnton.com/"
            target="_blank"
            rel="noreferrer"
          >
            安徽羚通科技有限公司
          </a>
          （简称“羚通科技”）是一家专注于音视频算法、算力、云平台的高科技人工智能企业。
          公司基于视频分析技术、视频智能传输技术、远程监测技术以及智能语音融合技术等，
          拥有多款可支持ONVIF、RTSP、GB/T28181等多协议、多路数的音视频智能分析服务器/云平台。
          公司产品广泛应用于教育、银行、农业、交通、石油、工业环境监控、智能安防、企业等众多领域。
        </p>
      </Box>
      <Box>
        <h2 className="py-3">联系我们 :</h2>
        <div className="flex justify-between items-center flex-wrap">
          <div className="w-[500px]">
            <p className="indent-8 subpixel-antialiased whitespace-normal font-mono text-lg">
              电话：188-5511-5353 / 188-5511-7272
            </p>
            <p className="indent-8 subpixel-antialiased whitespace-normal font-mono text-lg">
              邮箱：babosa@lnton.com
            </p>
            <p className="indent-8 subpixel-antialiased whitespace-normal font-mono text-lg">
              公众号：LNTON羚通科技
            </p>
            <p className="indent-8 subpixel-antialiased whitespace-normal font-mono text-lg">
              视频号：LNTON羚通科技
            </p>
            <p className="indent-8 subpixel-antialiased whitespace-normal font-mono text-lg">
              公司总部：安徽省合肥市高新区中安创谷A2栋513
            </p>
            <p className="indent-8 subpixel-antialiased whitespace-normal font-mono text-lg">
              产研中心：安徽省合肥市高新区科学大道120号
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <span className="text-center">
              <img className="w-52 h-52" src="./羚通公众号.jpg" />
              <p>羚通公众号</p>
            </span>
            <span className="text-center">
              <img className="w-52 h-52" src="./羚通视频号.jpg" />
              <p>羚通视频号</p>
            </span>
          </div>
        </div>
      </Box>
    </Watermark>
  );
};

export default View;
