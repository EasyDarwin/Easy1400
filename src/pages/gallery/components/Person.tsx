import { getImgURL } from '@/package/path/path';
import { timeToFormatTime } from '@/package/time/time';
import {
  DelPerson,
  DelPersons,
  FindPersons,
  findPersons,
} from '@/services/http/gallery';
import { ErrorHandle } from '@/services/http/http';
import { DeleteOutlined } from '@ant-design/icons';
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
import useUpdateEffect from '@/hooks/useUpdateEffect';

const Person: React.FC = () => {
  const sharedData = useContext(SharedDataContext);
  const [loadings, setLoadings] = useState<string[]>([]);

  const columns: ColumnsType<Gallery.PersonObject> = [
    {
      title: '',
      dataIndex: 'PersonID',
      render: (text: string) => {
        return (
          openCheckbox && (
            <Checkbox
              onClick={() => onCheck(text)}
              checked={checkList.includes(text)}
            ></Checkbox>
          )
        );
      },
    },
    {
      title: 'ID',
      dataIndex: 'PersonID',
    },
    {
      title: '人员出现时间',
      dataIndex: 'PersonAppearTime',
      render: (text: string) => <span>{timeToFormatTime(text)}</span>,
    },
    {
      title: '人员消失时间',
      dataIndex: 'PersonDisAppearTime',
      render: (text: string) => <span>{timeToFormatTime(text)}</span>,
    },
    {
      title: '图片',
      render: (_, record: Gallery.PersonObject) => (
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
      ),
    },
    {
      title: '操作',
      fixed: 'right',
      render: (_, record: Gallery.PersonObject) => (
        <Space size="middle">
          <Tooltip title="删除图片">
            <Popconfirm
              title={<p>确定删除图片吗?</p>}
              onConfirm={() => {
                delMutate(record.PersonID);
              }}
            >
              <Button
                type="dashed"
                loading={loadings.includes(record.PersonID)}
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
      onSuccess: () => {
        message.success('删除成功');
        setCheckList([]);
        queryClient.invalidateQueries([findPersons]);
      },
      onError: ErrorHandle,
    },
  );

  // 单个删除
  const { mutate: delMutate } = useMutation(DelPerson, {
    onMutate: (v: string) => {
      setLoadings([...loadings, v]);
    },
    onSuccess: (res: AxiosResponse) => {
      message.success('删除成功');
      queryClient.invalidateQueries([findPersons]);
    },
    onError: ErrorHandle,
  });
  return (
    <div>
      <Affix offsetTop={0}>
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
      </Affix>

      <Spin spinning={galleryLoading}>
        {sharedData.viewType === 'card' ? (
          galleryList?.PersonListObject.PersonObject.length ? (
            <>
              <div className="grid-fill">
                {galleryList?.PersonListObject.PersonObject.map(
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
              key={'personTabel'}
              pagination={{
                position: ['none'],
                total: galleryList?.PersonListObject.TotalNum,
                pageSize: pagination.PageRecordNum,
              }}
              columns={columns}
              dataSource={galleryList?.PersonListObject.PersonObject}
            />
          </div>
        )}

        <div className="flex justify-end mt-3">
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
