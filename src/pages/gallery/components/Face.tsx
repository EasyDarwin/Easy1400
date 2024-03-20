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
import { useContext, useState } from 'react';
import { DelFace, DelFaces, FindFace, findFace } from '@/services/http/gallery';
import { ErrorHandle } from '@/services/http/http';
import { useMutation, useQuery, useQueryClient } from '@umijs/max';
import { AxiosResponse } from 'axios';

import useUpdateEffect from '@/hooks/useUpdateEffect';
import { getImgURL } from '@/package/path/path';
import { timeToFormatTime } from '@/package/time/time';
import { DeleteOutlined, TagsOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import '../index.less';
import CardBox from './CardBox';
import SelectControl from './SelectControl';
import SharedDataContext from './SharedDataContext';

const Face: React.FC = () => {
  const sharedData = useContext(SharedDataContext);
  const queryClient = useQueryClient();

  const [loadings, setLoadings] = useState<string[]>([]);

  const columns: ColumnsType<Gallery.FaceObject> = [
    {
      title: '',
      dataIndex: 'FaceID',
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
      dataIndex: 'FaceID',
      fixed: true,
    },
    {
      title: '人脸出现时间',
      dataIndex: 'FaceAppearTime',
      width: 220,
      render: (text: string) => <span>{timeToFormatTime(text)}</span>,
    },
    {
      title: '人脸消失时间',
      dataIndex: 'FaceDisAppearTime',
      width: 220,
      render: (text: string) => <span>{timeToFormatTime(text)}</span>,
    },
    {
      title: '图片',
      width: 220,
      render: (_, record: Gallery.FaceObject) => (
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
      render: (text, record: Gallery.FaceObject) => (
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
                delMutate(record.FaceID);
              }}
            >
              <Button
                type="dashed"
                loading={loadings.includes(record.FaceID)}
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
    PageRecordNum: 20,
    RecordStartNo: 1,
    DeviceID: sharedData.deviceID || '',
    start_at: sharedData.searchTimeValue?.start,
    end_at: sharedData.searchTimeValue?.end,
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

  //监听搜索值变化
  useUpdateEffect(() => {    
    setPagination({
      ...pagination,
      DeviceID: sharedData.searchIdValue ?? sharedData.deviceID,
      start_at: sharedData.searchTimeValue?.start,
      end_at: sharedData.searchTimeValue?.end,
    });
  }, [sharedData.searchIdValue, sharedData.searchTimeValue]);

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
    onMutate: (v: string) => {
      setLoadings([...loadings, v]);
    },
    onSuccess: (res: AxiosResponse) => {
      message.success('删除成功');
      queryClient.invalidateQueries([findFace]);
    },
    onError: ErrorHandle,
  });

  const onDetail = (item: any) => {
    sharedData.openModal('Face', item)
  }

  return (
    <div>
      <Affix offsetTop={0}>
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
      </Affix>
      <Spin spinning={galleryLoading}>
        {sharedData.viewType === 'card' ? (
          galleryList?.FaceListObject.FaceObject.length ? (
            <>
              <div className="grid-fill">
                {galleryList?.FaceListObject.FaceObject.map(
                  (item: Gallery.FaceObject) => (
                    <CardBox
                      key={item.FaceID}
                      data={item}
                      showCheck={openCheckbox}
                      checkList={checkList}
                      infoLableKey={['FaceID', 'FaceAppearTime']}
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
          <div className="h-full">
            <Table
              key={'faceTabel'}
              rowKey="SourceID"
              pagination={{
                position: ['none'],
                total: galleryList?.FaceListObject.TotalNum,
                pageSize: pagination.PageRecordNum,
              }}
              columns={columns}
              dataSource={galleryList?.FaceListObject.FaceObject}
            />
          </div>
        )}

        <div className="flex justify-end mt-3">
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
            pageSizeOptions={[10, 30, 50, 100]}
          />
        </div>
      </Spin>
      {/* <Preview ref={PreviewRef} /> */}
    </div>
  );
};

export default Face;
