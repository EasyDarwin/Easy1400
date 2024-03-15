import {
  DelNonMotorVehicle,
  DelNonMotorVehicles,
  FindNonMotorVehicles,
  findNonMotorVehicles,
} from '@/services/http/gallery';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { Tooltip,Affix, Checkbox, Divider, Empty, Image,Button,Pagination, Spin, Table, message, Space, Popconfirm } from 'antd';
import { AxiosResponse } from 'axios';
import { useContext, useState } from 'react';
import CardBox from './CardBox';
import SelectControl from './SelectControl';
import SharedDataContext from './SharedDataContext';
import { ColumnsType } from 'antd/es/table';
import { getImgURL } from '@/package/path/path';
import { DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import { timeToFormatTime } from '@/package/time/time';
import useUpdateEffect from '@/hooks/useUpdateEffect';

const MotorVehicle: React.FC = () => {
  const sharedData = useContext(SharedDataContext);
  const [loadings, setLoadings] = useState<string[]>([]);

  const columns: ColumnsType<Gallery.NonMotorVehicleObject> = [
    {
      title: '',
      dataIndex: 'NonMotorVehicleID',
      fixed: true,
      render: (text: string) => {
        return (
          openCheckbox && <Checkbox
            onClick={() => onCheck(text)}
            checked={checkList.includes(text)}
          />
        );
      },
    },
    {
      title: 'ID',
      dataIndex: 'NonMotorVehicleID',
      fixed: true,
    },
    {
      title: '抓拍出现时间',
      dataIndex: 'MarkTime',
      render: (text: string) => (<span>{timeToFormatTime(text)}</span>),
      width: 220
    },
    {
      title: '图片',
      width: 220,
      render: (_, record: Gallery.NonMotorVehicleObject) => (
        <Image.PreviewGroup>
          <Space size="middle">
            {record.SubImageList?.SubImageInfoObject.map(
              (item: Gallery.SubImageInfoObject) => (
                <Image
                  key={item.ImageID}
                  src={`${getImgURL(item.Data)}?h=40`}
                  preview={{
                    src: getImgURL(item.Data),
                  }}
                />
              ),
            )}
          </Space>
        </Image.PreviewGroup>
      ),
    },
    {
      title: '操作',
      fixed: 'right',
      width: 150,
      render: (_, record: Gallery.NonMotorVehicleObject) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button
              type="dashed"
              icon={<TagsOutlined />}
              onClick={() => onDetail(record)}
            />
          </Tooltip>
          <Tooltip title="删除图片">
            <Popconfirm
              title={<p>确定删除图片吗?</p>}
              onConfirm={() => {
                delMutate(record.NonMotorVehicleID);
              }}
            >
              <Button
                type="dashed"
                loading={loadings.includes(record.NonMotorVehicleID)}
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [pagination, setPagination] = useState<Gallery.Pager>({
    PageRecordNum: 100,
    RecordStartNo: 1,
    DeviceID: sharedData.deviceID || '',
    start_at: sharedData.searchTimeValue?.start,
    end_at: sharedData.searchTimeValue?.end,
  });

  const { data: galleryList, isLoading: galleryLoading } =
    useQuery<Gallery.NonMotorVehicleRes>(
      [findNonMotorVehicles, pagination],
      () =>
        FindNonMotorVehicles(pagination).then(
          (res: AxiosResponse<Gallery.NonMotorVehicleRes>) => res.data,
        ),
      {
        onError: ErrorHandle,
      },
    );

  //监听搜索值变化
  useUpdateEffect(() => {
    setPagination({
      ...pagination,
      DeviceID: sharedData.searchIdValue ?? sharedData.deviceID,
      start_at: sharedData.searchTimeValue?.start,
      end_at: sharedData.searchTimeValue?.end,
    });
  }, [sharedData.searchIdValue, sharedData.searchTimeValue]);

  const queryClient = useQueryClient();

  //开启多选 显示复选框
  const [openCheckbox, setOpenCheckbox] = useState<boolean>(false);
  const onOpenCheckbox = () => {
    if (!galleryList?.NonMotorVehicleListObject.NonMotorVehicleObject) return;
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
      galleryList?.NonMotorVehicleListObject.NonMotorVehicleObject.map(
        (v: Gallery.NonMotorVehicleObject) => v.NonMotorVehicleID!,
      ) || [],
    );
  };

  //反选
  const onCheckReverse = () => {
    let list = [...checkList];
    setCheckList(
      galleryList?.NonMotorVehicleListObject.NonMotorVehicleObject.filter(
        (v: Gallery.NonMotorVehicleObject) =>
          !list.includes(v.NonMotorVehicleID!),
      ).map((v: Gallery.NonMotorVehicleObject) => v.NonMotorVehicleID!) || [],
    );
  };

  const confirm = () => {
    delMutates(checkList.join());
  };

  const { mutate: delMutates, isLoading: delLoading } = useMutation(
    DelNonMotorVehicles,
    {
      onSuccess: () => {
        message.success('删除成功');
        setCheckList([]);
        queryClient.invalidateQueries([findNonMotorVehicles]);
      },
      onError: ErrorHandle,
    },
  );

  const { mutate: delMutate } = useMutation(DelNonMotorVehicle, {
    onMutate:(v:string) =>{
      setLoadings([...loadings, v]);
    },
    onSuccess: () => {
      message.success('删除成功');
      queryClient.invalidateQueries([findNonMotorVehicles]);
    },
    onError: ErrorHandle,
  });

  const onDetail = (item: any) => {
    sharedData.openModal('NonMotorvehicle', item)
  }

  return (
    <div>
      <Affix offsetTop={0}>
        <SelectControl
          openCheckbox={openCheckbox}
          confirm={confirm}
          cancel={() => {}}
          onCheckAll={onCheckAll}
          onCheckReverse={onCheckReverse}
          onOpenCheckbox={onOpenCheckbox}
        />
      </Affix>

      <Spin spinning={galleryLoading}>
        {sharedData.viewType === 'card' ? (
          galleryList?.NonMotorVehicleListObject.NonMotorVehicleObject
            .length ? (
            <>
              <div className="grid-fill">
                {galleryList?.NonMotorVehicleListObject.NonMotorVehicleObject.map(
                  (item: Gallery.NonMotorVehicleObject) => (
                    <CardBox
                      key={item.NonMotorVehicleID}
                      showCheck={openCheckbox}
                      checkList={checkList}
                      infoLableKey={['NonMotorVehicleID', 'MarkTime']}
                      offset={[-46, 16]}
                      data={item}
                      onCheck={onCheck}
                      onClickDel={delMutate}
                      onDetail={() => onDetail(item)}
                    />
                  ),
                )}
              </div>
              <Divider />
            </>
          ) : (
            <Empty
              style={{ width: '100%' }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )
        ) : (
          <div className="h-full ">
            <Table
              key={'nomotorTabel'}
              pagination={{
                position: ['none'],
                total: galleryList?.NonMotorVehicleListObject.TotalNum,
                pageSize: pagination.PageRecordNum,
              }}
              columns={columns}
              dataSource={
                galleryList?.NonMotorVehicleListObject.NonMotorVehicleObject
              }
            />
          </div>
        )}

        <div className="flex justify-end mt-3">
          <Pagination
            showSizeChanger
            defaultCurrent={1}
            pageSize={pagination.PageRecordNum}
            current={pagination.RecordStartNo}
            total={galleryList?.NonMotorVehicleListObject.TotalNum}
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
