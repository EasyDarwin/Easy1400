import {
  DelPerson,
  DelPersons,
  FindPersons,
  findPersons,
} from '@/services/http/gallery';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { Divider, Empty, Pagination, Spin, message } from 'antd';
import { AxiosResponse } from 'axios';
import { useContext, useState } from 'react';
import CardBox from './CardBox';
import SelectControl from './SelectControl';
import SharedDataContext from './SharedDataContext';

const Person: React.FC = () => {
  const sharedData = useContext(SharedDataContext);

  const [pagination, setPagination] = useState<Gallery.Pager>({
    PageRecordNum: 100,
    RecordStartNo: 1,
    DeviceID: sharedData.deviceID || '',
  });

  const { data: galleryList, isLoading: galleryLoading } =
    useQuery<Gallery.PersonRes>(
      [findPersons, pagination],
      () =>
        FindPersons(pagination).then(
          (res: AxiosResponse<Gallery.PersonRes>) => {
            return res.data;
          },
        ),
      {
        onError: ErrorHandle,
      },
    );

  const queryClient = useQueryClient();

  //开启多选 显示复选框
  const [openCheckbox, setOpenCheckbox] = useState<boolean>(false);
  const onOpenCheckbox = () => {
    if (!galleryList?.PersonListObject.PersonObject) return;
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
      galleryList?.PersonListObject.PersonObject.map(
        (v: Gallery.PersonObject) => v.PersonID!,
      ) || [],
    );
  };

  //反选
  const onCheckReverse = () => {
    let list = [...checkList];
    setCheckList(
      galleryList?.PersonListObject.PersonObject.filter(
        (v: Gallery.PersonObject) => !list.includes(v.PersonID!),
      ).map((v: Gallery.PersonObject) => v.PersonID!) || [],
    );
  };

  const { mutate: delMutates, isLoading: delLoading } = useMutation(
    DelPersons,
    {
      onSuccess: (res) => {
        message.success('删除成功');
        setCheckList([]);
        queryClient.invalidateQueries([findPersons]);
      },
      onError: ErrorHandle,
    },
  );

  // 单个删除
  const { mutate: delMutate } = useMutation(DelPerson, {
    onSuccess: (res: AxiosResponse) => {
      message.success('删除成功');
      queryClient.invalidateQueries([findPersons]);
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
        <div className="px-6">
          <div className="grid-fill">
            {galleryList?.PersonListObject.PersonObject.length ? (
              galleryList?.PersonListObject.PersonObject.map(
                (item: Gallery.PersonObject) => (
                  <CardBox
                    key={item.PersonID}
                    showCheck={openCheckbox}
                    checkList={checkList}
                    data={item}
                    infoLableKey={['PersonID', 'PersonAppearTime']}
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
          </div>
        </div>

        <Divider className="mb-3" />

        <div className="flex justify-end">
          <Pagination
            showSizeChanger
            defaultCurrent={1}
            pageSize={pagination.PageRecordNum}
            current={pagination.RecordStartNo}
            total={galleryList?.PersonListObject.TotalNum}
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

export default Person;
