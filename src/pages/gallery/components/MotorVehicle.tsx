import useUpdateEffect from '@/hooks/useUpdateEffect';
import { getImgURL } from '@/package/path/path';
import { timeToFormatTime } from '@/package/time/time';
import {
  DelMotorVehicles,
  FindMotorVehicles,
  findMotorVehicles,
} from '@/services/http/gallery';
import { ErrorHandle } from '@/services/http/http';
import { DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import {
  Affix,
  Button,
  Checkbox,
  Divider,
  Empty,
  Image,
  Pagination,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tooltip,
  message,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AxiosResponse } from 'axios';
import { useContext, useState } from 'react';
import CardBox from './CardBox';
import SelectControl from './SelectControl';
import SharedDataContext from './SharedDataContext';

interface PagerWithPlateNo extends Gallery.Pager {
  PlateNo?: string;
}

const MotorVehicle: React.FC = () => {
  const sharedData = useContext(SharedDataContext);

  const [loadings, setLoadings] = useState<string[]>([]);

  const columns: ColumnsType<Gallery.MotorVehicleObject> = [
    {
      title: '',
      dataIndex: 'MotorVehicleID',
      fixed: true,
      render: (text: string) => {
        return (
          openCheckbox && (
            <Checkbox
              onClick={() => onCheck(text)}
              checked={checkList.includes(text)}
            />
          )
        );
      },
    },
    {
      title: 'ID',
      dataIndex: 'MotorVehicleID',
      fixed: true,
    },
    {
      title: '车牌',
      dataIndex: 'FaceAppearTime',
      width: 150,
      render: (_, record: Gallery.MotorVehicleObject) => (
        <span>{record.PlateNo ?? '-'}</span>
      ),
    },
    {
      title: '抓拍时间',
      dataIndex: 'MarkTime',
      width: 220,
      render: (text: string) => <span>{timeToFormatTime(text)}</span>,
    },
    {
      title: '图片',
      width: 220,
      render: (_, record: Gallery.MotorVehicleObject) => (
        <Image.PreviewGroup>
          <Space size="middle">
            {record.SubImageList?.SubImageInfoObject.map(
              (item: Gallery.SubImageInfoObject, index: number) => (
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
      render: (_, record: Gallery.MotorVehicleObject) => (
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
                delMutate(record.MotorVehicleID);
              }}
            >
              <Button
                type="dashed"
                loading={loadings.includes(record.MotorVehicleID)}
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [pagination, setPagination] = useState<PagerWithPlateNo>({
    PageRecordNum: 30,
    RecordStartNo: 1,
    DeviceID: sharedData.deviceID || '',
    PlateNo: '',
    start_at: sharedData.searchTimeValue?.start,
    end_at: sharedData.searchTimeValue?.end,
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

  //监听搜索值变化
  useUpdateEffect(() => {
    setPagination({
      ...pagination,
      PlateNo: sharedData.searchPlateNoValue,
      DeviceID: sharedData.searchIdValue ?? sharedData.deviceID,
      start_at: sharedData.searchTimeValue?.start,
      end_at: sharedData.searchTimeValue?.end,
    });
  }, [
    sharedData.searchPlateNoValue,
    sharedData.searchIdValue,
    sharedData.searchTimeValue,
  ]);

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
      onSuccess: () => {
        message.success('删除成功');
        setCheckList([]);
        queryClient.invalidateQueries([findMotorVehicles]);
      },
      onError: ErrorHandle,
    },
  );

  //单个删除
  const { mutate: delMutate } = useMutation(DelMotorVehicles, {
    onMutate: (v: string) => {
      setLoadings([...loadings, v]);
    },
    onSuccess: () => {
      message.success('删除成功');
      setCheckList([]);
      queryClient.invalidateQueries([findMotorVehicles]);
    },
    onError: ErrorHandle,
  });

  const onDetail = (item: any) => {
    sharedData.openModal('MotorVehicle', item)
  }

  return (
    <div>
      <Affix offsetTop={0}>
        <SelectControl
          isLoading={delLoading}
          openCheckbox={openCheckbox}
          confirm={() => {
            delMutates(checkList.join());
          }}
          cancel={() => { }}
          onCheckAll={onCheckAll}
          onCheckReverse={onCheckReverse}
          onOpenCheckbox={onOpenCheckbox}
        />
      </Affix>
      <Spin spinning={galleryLoading}>
        {sharedData.viewType === 'card' ? (
          galleryList?.MotorVehicleListObject.MotorVehicleObject.length ? (
            <>
              <div className="grid-fill">
                {galleryList?.MotorVehicleListObject.MotorVehicleObject.map(
                  (item: Gallery.MotorVehicleObject) => (
                    <CardBox
                      key={item.MotorVehicleID}
                      data={item}
                      showCheck={openCheckbox}
                      checkList={checkList}
                      infoLableKey={['MotorVehicleID', 'MarkTime', 'PlateNo']}
                      offset={[-46, 16]}
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
              key={'motorTabel'}
              rowKey="SourceID"
              pagination={{
                position: ['none'],
                total: galleryList?.MotorVehicleListObject.TotalNum,
                pageSize: pagination.PageRecordNum,
              }}
              columns={columns}
              dataSource={
                galleryList?.MotorVehicleListObject.MotorVehicleObject
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
            total={galleryList?.MotorVehicleListObject.TotalNum}
            onChange={(RecordStartNo, PageRecordNum) => {
              setPagination({
                ...pagination,
                RecordStartNo,
                PageRecordNum,
              });
            }}
            showTotal={(total) => `共 ${total} 条`}
            pageSizeOptions={[10, 30, 50, 100]}
          />
        </div>
      </Spin>
    </div>
  );
};

export default MotorVehicle;
