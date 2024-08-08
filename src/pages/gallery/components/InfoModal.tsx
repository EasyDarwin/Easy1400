import AttributeText from '@/components/attribute/AttributeText';
import { getImgURL } from '@/package/path/path';
import { timeToFormatTime } from '@/package/time/time';
import { Descriptions, Image, Modal, Space, Typography } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import ReactJson from 'react-json-view';
import ColumnItems from './ColumnItems';

export interface IInfoModalRef {
  init: (key: string, info: any) => void;
}

const InfoModal: React.FC<{ ref: any }> = forwardRef<IInfoModalRef>(
  ({}, ref) => {
    useImperativeHandle(ref, () => ({
      init: (v: string, info: any) => {
        setInfo(info);
        const configColumns = ColumnItems?.[v];
        if (!configColumns?.length) {
          setAllData(info);
          setCurrentItems([]);
          setImageData({ SubImageInfoObject: [] });
        }
        setCurrentItems(configColumns);
        getInfoData(info);
        setVisible(true);
        console.log('info', info);
      },
    }));

    const [visible, setVisible] = useState<boolean>(false);
    const [allData, setAllData] = useState<any>({});
    const [info, setInfo] = useState<any>({});
    const [currentItems, setCurrentItems] = useState<any[]>([]);
    const [imageData, setImageData] = useState<Gallery.SubImageList>({
      SubImageInfoObject: [],
    });

    const onCancel = () => {
      setCurrentItems([]);
      setAllData({});
      setInfo({});
      setImageData({ SubImageInfoObject: [] });
      setVisible(false);
    };

    const getInfoData = (data: any) => {
      setAllData(data);
      setImageData(data?.SubImageList || []);
    };

    const getDescItem = (item: any) => {
      let text = allData[item.code];
      if (!text) return '-';
      if (item.format) {
        return item.format[text];
      }
      if (item.type === 'time') {
        return timeToFormatTime(text);
      }
      if (item.attrType) {
        return (
          <AttributeText
            code={item.attrType}
            value={text}
            multiple={item.multiple}
          />
        );
      }
      if (item.type === 'image') {
        return (
          <Image
            src={getImgURL(text)}
            style={{ height: '80px' }}
            preview={{ src: getImgURL(text) }}
            onError={(e: any) => {
              e.target.src = './noImg.png';
            }}
          />
        );
      }
      return text + (item.unit || '');
    };

    return (
      <Modal
        title={info?.device_id ? `设备ID：${info.device_id}` : '详情'}
        open={visible}
        onCancel={onCancel}
        footer={null}
        centered
        width="80%"
      >
        {!!imageData?.SubImageInfoObject?.length && (
          <Image.PreviewGroup>
            <Space size="middle">
              {imageData.SubImageInfoObject.map(
                (item: Gallery.SubImageInfoObject) => (
                  <Image
                    key={item.ImageID}
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
        )}
        <div className="whitespace-normal overflow-auto py-2">
          {currentItems?.length ? (
            <Descriptions title="明细" column={4}>
              {currentItems.map((item: any) => (
                <Descriptions.Item
                  key={item.code}
                  label={item.label}
                  span={item.span || 1}
                >
                  {getDescItem(item)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          ) : (
            <>
              <Typography.Title level={5}>通知结构</Typography.Title>
              <ReactJson collapsed={true} src={allData || {}} />
            </>
          )}
        </div>
      </Modal>
    );
  },
);

export default InfoModal;
