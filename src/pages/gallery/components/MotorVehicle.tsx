import {
  DelMotorVehicles,
  FindMotorVehicles,
  findMotorVehicles,
} from '@/services/http/gallery';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { Divider, Empty, Flex, Pagination, Spin, message } from 'antd';
import { AxiosResponse } from 'axios';
import { useContext, useState } from 'react';
import CardBox from './CardBox';
import SelectControl from './SelectControl';
import SharedDataContext from './SharedDataContext';

const MotorVehicle: React.FC = () => {
  const sharedData = useContext(SharedDataContext);

  const [pagination, setPagination] = useState<Gallery.Pager>({
    PageRecordNum: 100,
    RecordStartNo: 1,
    DeviceID: sharedData.deviceID || '',
  });

  const { data: galleryList, isLoading: galleryLoading } =
    useQuery<Gallery.MotorVehicleRes>(
      [findMotorVehicles, pagination],
      () =>
        FindMotorVehicles(pagination).then(
          (res: AxiosResponse<Gallery.MotorVehicleRes>) => res.data,
        ),
      {
        onError: ErrorHandle,
      },
    );

  const queryClient = useQueryClient();

  //开启多选 显示复选框
  const [openCheckbox, setOpenCheckbox] = useState<boolean>(false);
  const onOpenCheckbox = () => {
    if (!galleryList?.MotorVehicleListObject.MotorVehicleObject) return;
    setOpenCheckbox(!openCheckbox);
  };

  //多选 删除
  const [checkList, setCheckList] = useState<string[]>([]);
  const onCheck = (id: string) => {
    if (checkList.includes(id)) {
      setCheckList(checkList.filter((item) => item !== id));
    } else {
      setCheckList([...checkList, id]);
    }
  };

  //全选
  const onCheckAll = () => {
    setCheckList(
      galleryList?.MotorVehicleListObject.MotorVehicleObject.map(
        (v: Gallery.MotorVehicleObject) => v.MotorVehicleID,
      ) || [],
    );
  };

  //反选
  const onCheckReverse = () => {
    let list = [...checkList];
    setCheckList(
      galleryList?.MotorVehicleListObject.MotorVehicleObject.filter(
        (v: Gallery.MotorVehicleObject) => !list.includes(v.MotorVehicleID),
      ).map((v: Gallery.MotorVehicleObject) => v.MotorVehicleID) || [],
    );
  };

  const { mutate: delMutates, isLoading: delLoading } = useMutation(
    DelMotorVehicles,
    {
      onSuccess: (res) => {
        message.success('删除成功');
        setCheckList([]);
        queryClient.invalidateQueries([findMotorVehicles]);
      },
      onError: ErrorHandle,
    },
  );

  //单个删除
  const { mutate: delMutate } = useMutation(DelMotorVehicles, {
    onSuccess: (res) => {
      message.success('删除成功');
      setCheckList([]);
      queryClient.invalidateQueries([findMotorVehicles]);
    },
    onError: ErrorHandle,
  });

  return (
    <div>
      <SelectControl
        isLoading={delLoading}
        openCheckbox={openCheckbox}
        confirm={() => {
          delMutates(checkList.join());
        }}
        cancel={() => {}}
        onCheckAll={onCheckAll}
        onCheckReverse={onCheckReverse}
        onOpenCheckbox={onOpenCheckbox}
      />
      <Spin spinning={galleryLoading}>
        <Flex wrap="wrap" gap="small">
          {galleryList?.MotorVehicleListObject.MotorVehicleObject.length ? (
            galleryList?.MotorVehicleListObject.MotorVehicleObject.map(
              (item: Gallery.MotorVehicleObject, idx: any) => (
                <CardBox
                  key={item.MotorVehicleID}
                  data={item}
                  showCheck={openCheckbox}
                  checkList={checkList}
                  infoLableKey={['MotorVehicleID', 'MarkTime']}
                  onCheck={onCheck}
                  onClickDel={delMutate}
                />
              ),
            )
          ) : (
            <Empty
              style={{ width: '100%', height: '100%' }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Flex>
        
        <Divider className="mb-3" />

        <div className="flex justify-end">
          <Pagination
            showSizeChanger
            defaultCurrent={1}
            pageSize={pagination.PageRecordNum}
            current={pagination.RecordStartNo}
            total={galleryList?.MotorVehicleListObject.TotalNum}
            onChange={(RecordStartNo, PageRecordNum) => {
              setPagination({
                ...pagination,
                RecordStartNo,
                PageRecordNum,
              });
            }}
            showTotal={(total) => `共 ${total} 条`}
            pageSizeOptions={[10, 50, 100]}
          />
        </div>
      </Spin>
    </div>
  );
};

export default MotorVehicle;
