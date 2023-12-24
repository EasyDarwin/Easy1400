import { shortenString } from '@/package/string/string';
import { timeToFormatTime } from '@/package/time/time';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Image,
  Popconfirm,
  Tooltip,
} from 'antd';
import React, { useContext, useRef, useState } from 'react';
import SharedDataContext from './SharedDataContext';
import CopyIcon from '@/components/copy/CopyIcon';

interface ICardBoxProps {
  data: any;
  infoLableKey: [string, string, string?];
  showCheck: boolean;
  checkList?: string[];
  offset?: [number | string, number | string];
  onClickImage?: () => void;
  onClickDel: (id: string) => void;
  onCheck: (id: string) => void;
}

const CardBox: React.FC<ICardBoxProps> = ({
  data,
  infoLableKey,
  showCheck,
  checkList,
  offset = [-32, 16],
  onClickImage,
  onClickDel,
  onCheck,
}) => {
  const sharedData = useContext(SharedDataContext);
  const [visible, setVisible] = useState(false);
  const [cover, setConver] = useState({
    url: data.SubImageList?.SubImageInfoObject?.[0]?.Data || '',
    typeId: data.SubImageList?.SubImageInfoObject?.[0]?.Type || '',
    time: data.SubImageList?.SubImageInfoObject?.[0]?.ShotTime || '',
    index: 0,
  });
  const imageList = useRef<any[]>([]);

  const getImgURL = (path: string) => {
    if (path.startsWith('http')) {
      return path;
    }

    return `${window.location.origin}${process.env.BASEURL}${path}`;
  };

  //map对照
  const findObjectByKey = (): string => {
    const label = sharedData.galleryDictTypes[cover.typeId] || '图片';
    return label;
  };

  //开启多选 点击整个box都是选中
  const onCheckbox = () => {
    if (showCheck) {
      onCheck(data[infoLableKey[0]]);
    }
  };

  return (
    <div onClick={onCheckbox} className="my-2 relative z-0">
      {showCheck && (
        <Checkbox
          className="absolute left-2 top-1 z-10"
          onChange={() => onCheck(data[infoLableKey[0]])}
          checked={checkList?.includes(data[infoLableKey[0]])}
        ></Checkbox>
      )}

      <div className="absolute bottom-0 right-0 z-10">
        <Popconfirm
          title="确定删除该图片"
          onConfirm={() => onClickDel(data[infoLableKey[0]])}
          onCancel={() => {}}
          okText="确定"
          cancelText="取消"
        >
          <Button
            shape="circle"
            style={{ border: 'none' }}
            danger
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      </div>

      <Badge
        style={{ boxShadow: 'none' }}
        color="#999"
        count={findObjectByKey()}
        offset={offset}
      >
        <Card
          className="w-52"
          hoverable
          // onClick={onClickImage}
          cover={
            <div className="relative">
              <img
                onClick={() => {
                  if (showCheck) {
                    onCheckbox();
                  } else {
                    setVisible(true);
                  }
                }}
                className="w-full object-cover aspect-[4/3]"
                loading="lazy"
                onError={(e: any) => {
                  e.target.src = './noImg.png';
                }}
                src={`${getImgURL(cover.url)}?w=200`}
              />
              <Image.PreviewGroup
                preview={{
                  visible,
                  onVisibleChange: (value) => {
                    setVisible(value);
                  },
                  onChange: (current, prev) =>
                    setConver({ ...cover, index: current }),
                  current: cover.index,
                }}
                items={imageList.current}
              />

              {infoLableKey[2] && (
                <div className="absolute left-0 bottom-0 px-1 rounded-tr-md overflow-hidden bg-blue-100 bg-opacity-30 text-white  backdrop-blur-lg">
                  {data[infoLableKey[2]] || '未知'}
                </div>
              )}
            </div>
          }
          bodyStyle={{
            padding: '4px 0',
          }}
        >
          <div className="flex items-center">
            {data.SubImageList?.SubImageInfoObject &&
              data.SubImageList?.SubImageInfoObject.map(
                (item: Gallery.SubImageInfoObject, index: number) => {
                  imageList.current.push(getImgURL(item.Data));
                  return (
                    <img
                      key={item.ImageID}
                      height="50px"
                      onError={(e: any) => {
                        e.target.src = './noImg.png';
                      }}
                      onMouseEnter={() => {
                        setConver({
                          ...cover,
                          url: item.Data,
                          typeId: item.Type,
                          time: item.ShotTime,
                          index: index,
                        });
                      }}
                      style={{
                        marginRight: '10px',
                        maxWidth:
                          data.SubImageList?.SubImageInfoObject.length >= 3
                            ? '60px'
                            : '90px',
                        border:
                          cover.url == item.Data ? 'none' : '2px solid white',
                        backgroundColor:
                          cover.url == item.Data ? '#BDBDBD' : 'white',
                        padding: '3px',
                      }}
                      loading="lazy"
                      src={`${getImgURL(item.Data)}?h=40`}
                    />
                  );
                },
              )}
          </div>

          <div>
            <Tooltip title="抓拍时间">
              <span className="px-1 text-md w-full truncate ">
                {timeToFormatTime(cover.time)}
              </span>
            </Tooltip>
          </div>

          <div className="text-slate-400 px-1">
            <Tooltip title={data[infoLableKey[0]]}>
              {shortenString(data[infoLableKey[0]], 20, 4, 14)}
            </Tooltip>
          </div>
        </Card>
      </Badge>
    </div>
  );
};

export default CardBox;
