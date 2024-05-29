import { Modal, Typography, Image, Space, Descriptions } from 'antd';
import { forwardRef, useImperativeHandle, useState, useRef, useMemo, useEffect } from 'react';
import { findGalleryData } from '@/services/http/gallery';
import { getImgURL } from '@/package/path/path';
import { timeToFormatTime } from '@/package/time/time';
import { ErrorHandle } from '@/services/http/http';
import { AxiosResponse } from 'axios';
import ColumnItems from './ColumnItems'
import ReactJson from 'react-json-view';
import AttributeText from '@/components/attribute/AttributeText';

export interface IInfoModalRef {
  init: (key: string, info: any) => void;
}

const InfoModal: React.FC<{ ref: any }> = forwardRef<IInfoModalRef>(
  ({ }, ref) => {
    useImperativeHandle(ref, () => ({
      init: (v: string, info: any) => {
        setVisible(true);
        setInfo(info)

        const configColumns = ColumnItems?.[v]
        if (!configColumns?.length) {
          setAllData(info)
          setCurrentItems([])
          setImageData({ SubImageInfoObject: [] })
          return
        }
        setCurrentItems(configColumns)
        getInfoData(v)
      },
    }));

    const [visible, setVisible] = useState<boolean>(false);
    const [allData, setAllData] = useState<any>({})
    const [info, setInfo] = useState<any>({});
    const [currentItems, setCurrentItems] = useState<any[]>([])
    const [imageData, setImageData] = useState<Gallery.SubImageList>({
      SubImageInfoObject: []
    });

    const onCancel = () => {
      setCurrentItems([])
      setAllData({})
      setInfo({})
      setImageData({ SubImageInfoObject: [] })
      setVisible(false)
    };

    const getInfoData = (key: any) => {
      if (allData.DeviceID) return

      findGalleryData({
        url: `/VIID/${key}s`,
        id: allData?.object_id ?? '',
      })
        .then((res: AxiosResponse) => {
          const currentData = res.data?.[`${key}ListObject`]?.[`${key}Object`]?.[0] || {}
          setAllData(currentData)
          setImageData(currentData?.SubImageList || []);
        })
        .catch((error: Error) => {
          ErrorHandle(error);
        });
    }

    const getDescItem = (item: any) => {
      let text = allData[item.code]
      if (!text) return '-'
      if (item.format) {
        return item.format[text]
      }
      if (item.type === 'time') {
        return timeToFormatTime(text)
      }
      if (item.attrType) {
        return <AttributeText code={item.attrType} value={text} multiple={item.multiple} />
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
        )
      }
      return text + (item.unit || '')
    }

    return (
      <Modal
        title={info?.device_id ? `设备ID：${info.device_id}` : '详情'}
        open={visible}
        onCancel={onCancel}
        footer={null}
        centered
        width="80%"
      >
        {
          !!imageData?.SubImageInfoObject?.length && (
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
          )
        }
        <div className="whitespace-normal overflow-auto py-2">
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
    )
  }
)

export default InfoModal