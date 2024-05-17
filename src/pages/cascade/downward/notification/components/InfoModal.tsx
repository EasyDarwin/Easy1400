import { FindDownwardNotificationJson } from '@/services/http/cascade';
import { Image, Modal, Typography, Space, Descriptions } from 'antd';
import { getImgURL } from '@/package/path/path';
import { timeToFormatTime } from '@/package/time/time';
import { AxiosResponse } from 'axios';
import ColumnItems from '@/pages/gallery/components/ColumnItems'
import React, {
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import ReactJson from 'react-json-view';
import { getAttrConfig, setAttrConfig } from "@/services/store/local";
import AttributeText from '@/components/attribute/AttributeText';

export interface InfoModalRef {
  openModal: (data: Cascade.DownwardNotificationItem) => void;
}

const InfoModal: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    openModal: (data: Cascade.DownwardNotificationItem) => {
      getJson(data.Path);
      setData(data);
      setIsModalOpen(true);
    },
  }));

  const [data, setData] = useState<any>({});
  const [allData, setAllData] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItems, setCurrentItems] = useState<any[]>([])

  const [imageData, setImageData] = useState<Gallery.SubImageList>();

  const getJson = (url: string) => {
    FindDownwardNotificationJson(url).then((res: AxiosResponse) => {
      const type = res.data.InfoIDs?.replace('ObjectList', '')
      const configColumns = ColumnItems?.[type]
      if (!configColumns?.length) {
        setAllData(res.data)
        setCurrentItems([])
        setImageData({ SubImageInfoObject: [] })
        return
      }
      const item = res.data[type + 'ObjectList']?.[type + 'ListObject']?.[type + 'Object']?.[0] || {}
      setData(item)
      setCurrentItems(configColumns)
      setImageData(item.SubImageList || [])
    });
  };

  const getDescItem = (item: any) => {
    let text = data[item.code]
    if (!text) return '-'
    if (item.format) return item.format[text]
    if (item.type === 'time') return timeToFormatTime(text)
    if (item.type === 'attribute') return <AttributeText code={item.code} value={text} />
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


  const onCancel = () => {
    setCurrentItems([])
    setAllData({})
    setImageData({ SubImageInfoObject: [] })
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={data.DeviceID ? `设备ID：${data.DeviceID}` : '详情'}
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      centered
      width="60%"
    >
      {
        !!imageData?.SubImageInfoObject?.length && (
          <Image.PreviewGroup>
            <Space size="middle">
                {imageData?.SubImageInfoObject.map(
                  (item: Gallery.SubImageInfoObject) => (
                    <Image
                      key={item.ImageID}
                      style={{ height: '300px' }}
                      src={`data:image/jpeg;base64,${item.Data}`}
                      // src={`${getImgURL(item.Data)}?h=300`}
                      preview={{
                        src: `data:image/jpeg;base64,${item.Data}`
                        // src: getImgURL(item.Data),
                      }}
                      onError={(e: any) => {
                        e.target.src = './noImg.png';
                      }}
                    />
                  ),
                )}
    
            </Space>
          </Image.PreviewGroup>
        )
      }
      <div className=" whitespace-normal overflow-auto py-2">
      {
        currentItems?.length ? (
          <Descriptions title="明细" column={4}>
            {
              currentItems.map((item: any) => (
                <Descriptions.Item key={item.code} label={item.label} span={item.span || 1}>
                  {getDescItem(item)}
                </Descriptions.Item>
              ))
            }
          </Descriptions>
        ) : (
          <>
            <Typography.Title level={5}>通知结构</Typography.Title>
            <ReactJson collapsed={true} src={allData || {}} />
          </>
        )
      }
      </div>
    </Modal>
  );
});

export default InfoModal;
