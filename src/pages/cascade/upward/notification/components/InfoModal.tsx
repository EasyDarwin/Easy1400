import { getImgURL } from '@/package/path/path';
import { timeToFormatTime } from '@/package/time/time';
import { findGalleryData } from '@/services/http/gallery';
import { ErrorHandle } from '@/services/http/http';
import { DescriptionsProps, Image, Modal, Spin, Typography } from 'antd';
import { AxiosResponse } from 'axios';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ReactJson from 'react-json-view';

export interface InfoModalRef {
  openModal: (data: Cascade.NotifyItem, key: string) => void;
}

//TODO 这里可以共用一个组件，后面优化
const InfoModal: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    openModal: (data: Cascade.NotifyItem, key: string) => {
      setData(data);
      mapKey.current = key;
      setIsModalOpen(true);
    },
  }));

  const [data, setData] = useState<Cascade.NotifyItem>();
  const mapKey = useRef('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '通知ID',
      children: data?.notification_id,
    },
    {
      key: '2',
      label: mapKey.current == 'DeviceList' ? '设备ID' : '图库ID',
      children: data?.object_id,
    },
    {
      key: '3',
      label: '通知状态',
      children: data?.result,
    },
    {
      key: '4',
      label: '触发时间',
      children: timeToFormatTime(data?.trigger_time ?? ''),
    },
  ];

  const objectKeyList = useRef<string[]>([]);
  const [imgData, setImageData] = useState<Gallery.SubImageList>();
  const [allData, setAllData] = useState();

  const saveData = (url: string) => {
    setIsLoading(true);
    findGalleryData({
      url: url,
      id: data?.object_id ?? '',
    })
      .then((res: AxiosResponse) => {
        setAllData(res.data);
        setIsLoading(false);
        const ImageData =
          res.data[objectKeyList.current[0]][objectKeyList.current[1]];
        if (ImageData.length != 0) {
          setImageData(ImageData[0].SubImageList);
        } else {
          setImageData(undefined);
        }
      })
      .catch((error: Error) => {
        setIsLoading(false);
        ErrorHandle(error);
      });
  };

  useEffect(() => {
    getDataList();
  }, [mapKey.current]);

  // TODO 这里优化，拆分，将图库改造成这种写法

  const getDataList = () => {
    switch (mapKey.current) {
      case 'DeviceList':
        //TODO 这里如果是设备就没有做任何处理 需要修改 采集设备列表
        return;
      case 'FaceObjectList':
        saveData('/VIID/Faces');
        objectKeyList.current = ['FaceListObject', 'FaceObject'];
        return;
      case 'PersonObjectList':
        saveData('/VIID/Persons');
        objectKeyList.current = ['PersonListObject', 'PersonObject'];
        return;
      case 'MotorVehicleObjectList':
        saveData('/VIID/MotorVehicles');
        objectKeyList.current = [
          'MotorVehicleListObject',
          'MotorVehicleObject',
        ];
        return;
      case 'NonMotorVehicleObjectList':
        saveData('/VIID/NonMotorVehicles');
        objectKeyList.current = [
          'NonMotorVehicleListObject',
          'NonMotorVehicleObject',
        ];
        return;
      default:
        return;
    }
  };

  const onCancel = () => {
    mapKey.current = '';
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="通知详情"
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      width="60%"
      centered
    >
      <Spin spinning={isLoading}>
        {mapKey.current !== 'DeviceList' && (
          <div className="flex py-2">
            {imgData?.SubImageInfoObject.map(
              (item: Gallery.SubImageInfoObject) => (
                <div key={item.ImageID} className="mr-5">
                  <Image
                    key={item.ImageID}
                    onError={(e: any) => {
                      e.target.src = './noImg.png';
                    }}
                    src={`${getImgURL(item.Data)}?h=200`}
                    preview={{
                      src: getImgURL(item.Data),
                    }}
                  ></Image>
                </div>
              ),
            )}
          </div>
        )}
        <div className=" whitespace-normal overflow-auto py-2">
          <Typography.Title level={5}>通知结构</Typography.Title>
          <ReactJson collapsed={true} src={allData || {}}></ReactJson>
        </div>
      </Spin>
    </Modal>
  );
});

export default InfoModal;
