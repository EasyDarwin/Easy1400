import { Modal } from 'antd';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ReactJson from 'react-json-view';

export interface InfoModalRef {
  openModal: (data: Cascade.Ext, key: string) => void;
}

const InfoModal: React.FC<{ ref: any }> = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({
    openModal: (data: Cascade.Ext, key: string) => {
      setData(data);
      mapKey.current = key;
      setIsModalOpen(true);
    },
  }));

  const [data, setData] = useState<any>();
  const mapKey = useRef('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Modal
      title="通知详情"
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      footer={null}
      width="60%"
      centered
    >
      <div className=" whitespace-normal overflow-auto">
        <ReactJson
          src={mapKey.current ? data[mapKey.current] : data}
        ></ReactJson>
      </div>
    </Modal>
  );
});

export default InfoModal;
