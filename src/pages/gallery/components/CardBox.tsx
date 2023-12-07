import { shortenString } from '@/package/string/string';
import { timeToFormatTime } from '@/package/time/time';
import {
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Badge, Card, Checkbox, Image, Popconfirm, Tooltip } from 'antd';
import React, { useContext, useRef, useState } from 'react';
import SharedDataContext from './SharedDataContext';

interface ICardBoxProps {
  data: any;
  infoLableKey: [string, string];
  showCheck: boolean;
  checkList?: string[];
  onClickImage?: () => void;
  onClickDel: (id: string) => void;
  onCheck: (id: string) => void;
}

const CardBox: React.FC<ICardBoxProps> = ({
  data,
  infoLableKey,
  showCheck,
  checkList,
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

  //TODO 这里会不会影响，性能，考虑使用map对照
  const findObjectByKey = () => {
    let obj = sharedData.galleryDictTypes.find(
      (item: Dict.DataItem) => item.value === cover.typeId,
    );
    return obj?.label || '图片';
  };

  return (
    <div className="mx-1 relative">
      {showCheck && (
        <Checkbox
          className="absolute left-2 top-1 z-20"
          onChange={() => onCheck(data[infoLableKey[0]])}
          checked={checkList?.includes(data[infoLableKey[0]])}
        ></Checkbox>
      )}
      <Badge
        style={{ boxShadow: 'none' }}
        color="#999"
        count={findObjectByKey()}
        offset={[-32, 16]}
      >
        <Card
          className="w-52"
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <Popconfirm
              key="delete"
              title="确定删除该图片"
              onConfirm={() => onClickDel(data[infoLableKey[0]])}
              onCancel={() => {}}
              okText="确定"
              cancelText="取消"
            >
              <DeleteOutlined style={{ color: '#f5222d' }} />
            </Popconfirm>,
          ]}
          hoverable
          // onClick={onClickImage}
          cover={
            <>
              <img
                onClick={() => setVisible(true)}
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
                  onChange: (current, prev) => setConver({...cover,index:current}),
                  current:cover.index
                }}
                items={imageList.current}
              />
            </>
          }
          bodyStyle={{
            padding: '4px 0',
          }}
        >
          <div>
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

          <div className="mt-1 px-1 text-md w-full truncate">
            {shortenString(data[infoLableKey[0]], 20, 4, 16)}
          </div>
          <div>
            <Tooltip title="抓拍时间">
              <span className="text-slate-400 px-1">
                {timeToFormatTime(cover.time)}
              </span>
            </Tooltip>
          </div>
        </Card>
      </Badge>
    </div>
  );
};

export default CardBox;
