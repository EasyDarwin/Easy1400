import { Divider, Empty, Flex, Pagination, Spin, message } from 'antd';
import { useContext, useState } from 'react';

import { DelFace, DelFaces, FindFace, findFace } from '@/services/http/gallery';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { AxiosResponse } from 'axios';

import CardBox from './CardBox';
import SelectControl from './SelectControl';
import SharedDataContext from './SharedDataContext';

const Face: React.FC = () => {
  const sharedData = useContext(SharedDataContext);
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<Gallery.Pager>({
    PageRecordNum: 100,
    RecordStartNo: 1,
    DeviceID: sharedData.deviceID || '',
  });

  const { data: galleryList, isLoading: galleryLoading } =
    useQuery<Gallery.FindRes>(
      [findFace, pagination],
      () =>
        FindFace(pagination).then(
          (res: AxiosResponse<Gallery.FindRes>) => res.data,
        ),
      {
        onError: ErrorHandle,
      },
    );

  //开启多选 显示复选框
  const [openCheckbox, setOpenCheckbox] = useState<boolean>(false);
  const onOpenCheckbox = () => {
    if (!galleryList?.FaceListObject.FaceObject) return;
    setOpenCheckbox(!openCheckbox);
  };

  //多选
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
      galleryList?.FaceListObject.FaceObject.map(
        (v: Gallery.FaceObject) => v.FaceID,
      ) || [],
    );
  };

  //反选
  const onCheckReverse = () => {
    let list = [...checkList];
    setCheckList(
      galleryList?.FaceListObject.FaceObject.filter(
        (v: Gallery.FaceObject) => !list.includes(v.FaceID),
      ).map((v: Gallery.FaceObject) => v.FaceID) || [],
    );
  };

  const { mutate: delMutates, isLoading: delFacesLoading } = useMutation(
    DelFaces,
    {
      onSuccess: (res: AxiosResponse<Gallery.FaceDeleteRes>) => {
        message.success('删除成功');
        setCheckList([]);
        queryClient.invalidateQueries([findFace]);
      },
      onError: ErrorHandle,
    },
  );

  // 单个删除
  const { mutate: delMutate } = useMutation(DelFace, {
    onSuccess: (res: AxiosResponse) => {
      message.success('删除成功');
      queryClient.invalidateQueries([findFace]);
    },
    onError: ErrorHandle,
  });

  return (
    <div>
      <SelectControl
        isLoading={delFacesLoading}
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
          {galleryList?.FaceListObject.FaceObject.length ? (
            galleryList?.FaceListObject.FaceObject.map(
              (item: Gallery.FaceObject) => (
                <CardBox
                  key={item.FaceID}
                  data={item}
                  showCheck={openCheckbox}
                  checkList={checkList}
                  infoLableKey={['FaceID', 'FaceAppearTime']}
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

        <Divider className='mb-3'/>

        <div className="flex justify-end">
          <Pagination
            showSizeChanger
            defaultCurrent={1}
            pageSize={pagination.PageRecordNum}
            current={pagination.RecordStartNo}
            total={galleryList?.FaceListObject.TotalNum}
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
      {/* <Preview ref={PreviewRef} /> */}
    </div>
  );
};

export default Face;
