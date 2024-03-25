import { findCascadeShare, FindCascadeShare, DeleteCascadeShare } from '@/services/http/cascade';
import { ErrorHandle } from '@/services/http/http';
import { PlusOutlined, FormOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { useMutation, useQuery, useParams } from '@umijs/max';
import {
  Button,
  Tooltip,
  Table,
  Typography,
  message,
  Space,
  Popconfirm,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AxiosResponse } from 'axios';
import React, { useRef, useState } from 'react';
import FunctionBar, { ButtonList } from '@/components/bar/FunctionBar';
import Box from '@/components/box/Box';
import InfoModal, { IInfoModalRef } from './components/InfoModal';

interface IDeviceFrom {
  setFieldsValue: (data?: Device.APEObject, isEdit?: boolean) => void;
}

const View: React.FC = () => {
  const infoModalRef = useRef<IInfoModalRef>();
  const platformID = useParams().platform_id ?? '';
  const [loadings, setLoadings] = useState<string[]>([]);
  const columns: ColumnsType<Cascade.DeviceShareItem> = [
    { title: '设备id', dataIndex: 'APEID', align: 'center', width: 180, fixed: true },
    { title: '设备名称', dataIndex: 'Name', align: 'center', width: 180 },
    {
      title: '人脸',
      dataIndex: 'Face',
      align: 'center',
      width: 120,
      render: (text: string) => text ? '已开启' : '未开启'
    },
    {
      title: '人员',
      dataIndex: 'Person',
      align: 'center',
      width: 120,
      render: (text: string) => text ? '已开启' : '未开启'
    },
    {
      title: '机动车',
      dataIndex: 'MotorVehicle',
      align: 'center',
      width: 120,
      render: (text: string) => text ? '已开启' : '未开启'
    },
    {
      title: '非机动车',
      dataIndex: 'NonMotorVehicle',
      align: 'center',
      width: 120,
      render: (text: string) => text ? '已开启' : '未开启'
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (_: any, record: Cascade.DeviceShareItem) => (
        <Space>
          {/* <Tooltip title="编辑">
            <Button
              icon={<FormOutlined />}
              onClick={() => {
                infoModalRef.current?.openModal(record, true)
              }}
            />
          </Tooltip> */}
          <Tooltip title="删除">
            <Popconfirm
              title={
                <p>
                  确定删除
                  <span className="text-red-500">{record.APEID}</span>
                  吗?
                </p>
              }
              onConfirm={() => {
                deleteMute(record.ID);
              }}
            >
              <Button
                loading={loadings.includes(record.APEID)}
                type="dashed"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const {
    data: deviceData,
    isLoading: deviceListLoading,
    refetch,
  } = useQuery<[]>(
    [findCascadeShare, platformID],
    () => FindCascadeShare(platformID).then((res: any) => res.data),
    {
      onError: ErrorHandle,
    },
  );
  // 删除
  const { mutate: deleteMute } = useMutation(
    DeleteCascadeShare,
    {
      onMutate: (v: string) => {
        setLoadings([...loadings, v]);
      },
      onSuccess(res: AxiosResponse) {
        message.success('删除成功');
        setLoadings((v) => v.filter((item) => item !== res.data.id));
        refetch();
      },
      onError: (error: Error) => {
        setLoadings([]);
        ErrorHandle(error);
      },
    }
  );
  // 批量删除
  const { mutate: mulDeleteMute, isLoading: deleteLoading } =
    useMutation(
      DeleteCascadeShare,
      {
        onSuccess() {
          message.success('批量删除成功');
          refetch();
        },
        onError: (error: Error) => {
          ErrorHandle(error);
        },
      }
    );
  //多选
  const [selected, setSelected] = useState<React.Key[]>([]);

  const btnPositionComponet = (
    <>
      {!!selected?.length && (
        <Typography.Text type="secondary" className="ml-3">
          已勾选 {selected?.length} 项
        </Typography.Text>
      )}
    </>
  );

  const funcBtnList: ButtonList[] = [
    {
      label: '返回',
      icon: <ArrowLeftOutlined />,
      onClick: () => {
        history.back();
      }
    },
    {
      label: '添加',
      loading: false,
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => {
        infoModalRef.current?.openModal()
      },
    },
    // {
    //   label: '批量删除',
    //   loading: deleteLoading,
    //   type: 'primary',
    //   danger: true,
    //   icon: <PlusOutlined />,
    //   disabled: !selected?.length,
    //   isPopConfirm: true,
    //   popConfirmTitle: <span>确定删除已选择设备吗？</span>,
    //   onClick: () => {
    //     mulDeleteMute(selected?.join(','))
    //   },
    // },
  ];

  return (
    <PageContainer title={process.env.PAGE_TITLE}>
      <Box>
        <FunctionBar
          span={[24, 0]}
          btnChannle={funcBtnList}
          btnPosition={btnPositionComponet}
          rigthChannleClass="flex justify-end"
        />
      </Box>
      <Box>
        <Table
          loading={deviceListLoading}
          rowKey={'ID'}
          scroll={{ x: '100%' }}
          columns={columns}
          dataSource={deviceData}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selected,
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelected(selectedRowKeys)
            },
          }}
          pagination={false}
        />
      </Box>
      <InfoModal ref={infoModalRef} />
    </PageContainer>
  );
};

export default View;
