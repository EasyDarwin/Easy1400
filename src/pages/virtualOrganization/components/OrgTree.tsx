import React, { useEffect, useState, forwardRef, useImperativeHandle, Children } from 'react';
import { Select, Tree, Checkbox, Spin } from 'antd';
import type { GetProps, CheckboxProps } from 'antd';
import { GetGroupList, GetGroupTree, GetGroupDeviceStatus } from '@/services/http/groups';
import { AxiosResponse } from 'axios';

const { DirectoryTree } = Tree;
type DirectoryTreeProps = GetProps<typeof DirectoryTree>;

interface OrgTreeProps {
  ref: any;
  parentInfo?: any;
  onSelectChild?: (v: boolean) => void; // 查询子节点
  onChange?: (id: any, info: Group.GroupItem) => void; // 更新父页面依赖明细及表格
  refreshCount?: (info?: any) => void; // 更新表格 设备数量
}

export interface ITreeRef {
  // info 更新指定节点数据
  refreshTree: (info?: any, reloadType?: any) => void;
  // 根节点
  rootInfo: any;
}

const OrgTree: React.FC<OrgTreeProps> = forwardRef(({ parentInfo, onSelectChild, onChange, refreshCount }, ref) => {
  useImperativeHandle(ref, () => ({
    refreshTree(info?: any, reloadType?: any) {
      // 刷新根节点
      if (reloadType === 'group') {
        getOptions(info.id)
        return
      }
      // 刷新树
      if (reloadType === 'refresh') {
        getTreeData(info, options.find(el => el.id === rootInfo.id))
      }
    },
    rootInfo
  }));

  const [rootInfo, setRootInfo] = useState<any>({})
  const [checked, setChecked] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedKeys, setSelectedKeys] = useState<any[]>([])
  const [options, setOptions] = useState<Group.GroupItem[]>([])
  const [treeData, setTreeData] = useState<any[]>([]);

  // 查询虚拟组织下拉列表数据
  useEffect(() => {
    if (parentInfo) {
      // 设备页面 查询指定根节点下设备树
      getTreeData(parentInfo)
    } else {
      // 虚拟组织页面 查询根节点下拉列表
      getOptions()
    }
  }, [])

  // 选择查询子节点
  const onCheck: CheckboxProps['onChange'] = (e) => {
    const v = e.target.checked
    setChecked(v)
    // 更新 include_child 重新查询设备表格
    onSelectChild?.(v)
  };

  // 组织变化
  const onTreeChange: DirectoryTreeProps['onSelect'] = (keys: any[], info: any) => {
    setSelectedKeys(() => keys)
    // 更新右侧明细及表格
    onChange?.(keys[0], info.node)
  }

  // 根节点变化
  const onSelectChange = (v: any, info: any) => {
    setRootInfo(info)
    setSelectedKeys([v])
    setTimeout(() => {
      getTreeData(info, info)
    }, 0)
    getDeviceCount(v)
  }

  // 查询设备数量
  const getDeviceCount = (v: any) => {
    GetGroupDeviceStatus(v).then(res => {
      const data = res?.data || {}
      refreshCount?.(data)
    })
  }

  // 查询下拉列表
  const getOptions = (selId?: any) => {
    setLoading(true)
    GetGroupList('0').then((res: AxiosResponse) => {
      const data = res?.data || []
      if (data.length) {
        // 设置下拉列表
        setOptions(data)
        if (selId) {
          const sel = data.find((el: any) => el.id === selId)
          onSelectChange(sel.id, sel)
        } else {
          // 默认选中第一个组织节点，查询树
          onSelectChange(data[0].id, data[0])
        }
      } else {
        setRootInfo({})
        setOptions([])
        setTreeData([])
        setSelectedKeys([])
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  /**
  * 平铺数据转树
  * @param { Array } data 数组
  * @param { String } pid 父Id
  */
  const listToTree = (data: any, pid: any) => {
    const result = [] as any;
    data.forEach((item: any) => {
      if (item.pid === pid) {
        const children = listToTree(data, item.id);
        if (children.length) {
            item.children = children;
        }
        result.push(item);
      }
    });
    return result;
}

  // 查询树根目录
  const getTreeData = (info: any, rootInfo?: any) => {
    const obj = parentInfo ? { id: +info.id, name: info.name } : rootInfo
    // 更新右侧明细及表格
    onChange?.(info.id, info)

    setLoading(true)
    // 查询树，默认根节点作为树第一层插入
    GetGroupTree(obj.id).then(res => {
      const data = [{ ...obj, children: listToTree(res?.data, +obj.id) }]
      setTreeData(data)
      if (parentInfo) setSelectedKeys([+obj.id])
    }).catch(() => {
      setTreeData([{ ...obj, children: [] }])
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="tree">
      {onSelectChild && (
        <Checkbox
          className="absolute right-0 z-10"
          checked={checked}
          onChange={onCheck}
          style={{ color: selectedKeys.length && selectedKeys[0] === treeData[0]?.id ? '#fff' : '#333' }}
        >
          含子节点
        </Checkbox>
      )}
      {!parentInfo?.id && (
        <Select
          className="w-full mt-[8px]"
          value={rootInfo.id}
          options={options}
          onChange={onSelectChange}
          fieldNames={{ label: 'name', value: 'id' }}
        />
      )}
      <Spin spinning={loading}>
        <DirectoryTree
          className="mt-[8px]"
          defaultExpandAll
          blockNode
          multiple={false}
          showIcon={false}
          treeData={treeData}
          selectedKeys={selectedKeys}
          fieldNames={{ title: 'name', key: 'id', children: 'children' }}
          onSelect={onTreeChange}
        />
      </Spin>
    </div>
  )
})

export default OrgTree
