import { FindDownwardNotificationJson } from '@/services/http/cascade';
import { Descriptions, DescriptionsProps, Image, Modal, Spin } from 'antd';
import { AxiosResponse } from 'axios';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ReactJson from 'react-json-view';

export interface InfoModalRef {
  openModal: (data: Cascade.DownwardNotificationItem) => void;
}

//TODO 这里因为接口需求，需要根据不同字段取出不同的值
const InfoModal: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    openModal: (data: Cascade.DownwardNotificationItem) => {
      getJson(data.Path);
      setData(data);
      setIsModalOpen(true);
    },
  }));

  const [data, setData] = useState<Cascade.DownwardNotificationItem>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '订阅ID',
      children: data?.SubscribeID,
    },

    {
      key: '2',
      label: '触发时间',
      children: data?.CreatedAt,
    },
  ];

  const objectKeyList = useRef<string[]>([]);
  const [imgData, setImageData] = useState<Gallery.SubImageList>();
  const key = useRef('');
  const getJson = (url: string) => {
    FindDownwardNotificationJson(url).then((res: AxiosResponse) => {
      getDataList(res.data.InfoIDs);
      key.current = res.data.InfoIDs;
      const ImageData =
        res.data[objectKeyList.current[0]][objectKeyList.current[1]][
          objectKeyList.current[2]
        ];
      if (ImageData.length != 0) {
        setImageData(ImageData[0].SubImageList);
      } else {
        setImageData(undefined);
      }
    });
  };

  const getDataList = (key: string) => {
    switch (key) {
      case 'DeviceList':
        return;
      case 'FaceObjectList':
        objectKeyList.current = [
          'FaceObjectList',
          'FaceListObject',
          'FaceObject',
        ];
        return;
      case 'PersonObjectList':
        objectKeyList.current = [
          'PersonObjectList',
          'PersonListObject',
          'PersonObject',
        ];
        return;
      case 'MotorVehicleObjectList':
        objectKeyList.current = [
          'MotorVehicleObjectList',
          'MotorVehicleListObject',
          'MotorVehicleObject',
        ];
        return;
      case 'NonMotorVehicleObjectList':
        objectKeyList.current = [
          'NonMotorVehicleObjectList',
          'NonMotorVehicleListObject',
          'NonMotorVehicleObject',
        ];
        return;
      default:
        return;
    }
  };

  const onCancel = () => {
    key.current = ''
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
      <Spin spinning={isLoading} />
      {key.current !== 'DeviceList' && (
        <>
          <div className="py-4">
            <Descriptions column={2} items={items} />
          </div>
          <div className="flex justify-evenly">
            {imgData?.SubImageInfoObject.map(
              (item: Gallery.SubImageInfoObject) => (
                <Image
                  key={item.ImageID}
                  onError={(e: any) => {
                    e.target.src = './noImg.png';
                  }}
                  style={{ height: '200px' }}
                  src={`data:image/jpeg;base64,${item.Data}`}
                ></Image>
              ),
            )}
          </div>
        </>
      )}
      {key.current === 'DeviceList' && (
        <div className=" whitespace-normal overflow-auto">
          <ReactJson src={data || {}}></ReactJson>
        </div>
      )}
    </Modal>
  );
});

export default InfoModal;
