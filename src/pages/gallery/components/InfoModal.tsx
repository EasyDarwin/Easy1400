import { Modal, Typography, Image, Space, Descriptions } from 'antd';
import { forwardRef, useImperativeHandle, useState, useRef, useMemo, useEffect } from 'react';
import { findGalleryData } from '@/services/http/gallery';
import { getImgURL } from '@/package/path/path';
import { timeToFormatTime } from '@/package/time/time';
import { ErrorHandle } from '@/services/http/http';
import { AxiosResponse } from 'axios';
import { ColumnItems } from './ColumnItems'

export interface IInfoModalRef {
  init: (key: string, info: any) => void;
}

const InfoModal: React.FC<{ ref: any }> = forwardRef<IInfoModalRef>(
  ({ }, ref) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [data, setData] = useState<any>({});
    const [key, setKey] = useState<string>('');
    const [imageData, setImageData] = useState<Gallery.SubImageList>({
      SubImageInfoObject: []
    });

    const currentItems = useMemo(() => key ? ColumnItems[key] : [], [key])

    const onCancel = () => {
      setKey('')
      setVisible(false)
    };

    useEffect(() => {
      getInfoData()
    }, [key])

    const getInfoData = () => {
      if (!key) return
      if (data.DeviceID) return

      findGalleryData({
        url: `/VIID/${key}s`,
        id: data?.object_id ?? '',
      })
        .then((res: AxiosResponse) => {
          const currentData = res.data?.[`${key}ListObject`]?.[`${key}Object`] || []
          setData(currentData[0])
          setImageData(currentData[0]?.SubImageList || {});
        })
        .catch((error: Error) => {
          ErrorHandle(error);
        });
    }

    const getDescItem = (item: any) => {
      let text = data[item.code]
      if (!text) return '-'
      if (item.format) return item.format[text]
      if (item.type === 'time') return timeToFormatTime(text)
      if (item.type === 'image')
        return (
          <Image
            src={getImgURL(text)}
            style={{ height: '80px' }}
            preview={{ src: getImgURL(text) }}
            onError={(e: any) => {
              e.target.src = './noImg.png';
            }}
          />
        )
      return text
    }

    useImperativeHandle(ref, () => ({
      init: (key: string, info: any) => {    
        setKey(key)
        if (info.DeviceID) {
          // 图库
          setData(info);
          setImageData(info?.SubImageList || [])
        }
        setVisible(true);
      },
    }));

    return (
      <Modal
        title={data?.DeviceID ? `设备ID：${data.DeviceID}` : '详情'}
        open={visible}
        onCancel={onCancel}
        footer={null}
        centered
        width="80%"
      >
        <Image.PreviewGroup>
          <Space size="middle">
            {imageData.SubImageInfoObject.map(
            // {data?.SubImageList?.SubImageInfoObject.map(
              (item: Gallery.SubImageInfoObject) => (
                <Image
                  key={item.ImageID}
                  // style={{ height: '300px' }}
                  src={`${getImgURL(item.Data)}?h=300`}
                  preview={{
                    src: getImgURL(item.Data),
                  }}
                  onError={(e: any) => {
                    e.target.src = './noImg.png';
                  }}
                />
              ),
            )}
          </Space>
        </Image.PreviewGroup>
        <div className="whitespace-normal overflow-auto py-2">
          <Descriptions title="明细" column={4}>
            {
              currentItems.map((item: any) => (
                <Descriptions.Item key={item.code} label={item.label} span={item.span || 1}>
                  {getDescItem(item)}
                </Descriptions.Item>
              ))
            }
          </Descriptions>
        </div>
      </Modal>
    )
  }
)

export default InfoModal