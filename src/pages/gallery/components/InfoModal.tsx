import { Modal, Typography, Image, Space, Descriptions } from 'antd';
import { forwardRef, useImperativeHandle, useState, useRef, useMemo } from 'react';
import { getImgURL } from '@/package/path/path';
import { timeToFormatTime } from '@/package/time/time';
import { ColumnItems } from './ColumnItems'

export interface IInfoModalRef {
  init: (key: string, info: any) => void;
}

const InfoModal: React.FC<{ ref: any }> = forwardRef<IInfoModalRef>(
  ({ }, ref) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [data, setData] = useState<any>();
    const [key, setKey] = useState<string>('');
    const [imgData, setImageData] = useState<Gallery.SubImageList>();
    const [allData, setAllData] = useState();

    const currentItems = useMemo(() => key ? ColumnItems[key] : [], [key])

    const onCancel = () => {
      setKey('')
      setVisible(false)
    };

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
        setData(info);
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
            {data?.SubImageList?.SubImageInfoObject.map(
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