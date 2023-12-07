declare namespace Dict {
  type FindTypeResp = {
    items: TypeItem[];
    /**
     * 总数
     */
    total: number;
  };

  type TypeItem = {
    /**
     * 类型编码
     */
    code: string;
    /**
     * 创建时间
     */
    created_at: string;
    /**
     * 字典类型唯一标识符
     */
    id: string;
    /**
     * 是否系统默认，系统默认，不可删除，不可修改
     */
    is_default: boolean;
    /**
     * 类型名称
     */
    name: string;
    /**
     * 升级时间
     */
    updated_at: string;
  };

  type FindDatasResp = {
    items: DataItem[];
    /**
     * 总数
     */
    total: number;
  };

  type DataItem = {
    /**
     * 字典编码
     */
    code?: string;
    /**
     * 创建时间
     */
    created_at?: string;
    /**
     * 是否启用
     */
    enabled?: boolean;
    /**
     * 其它
     */
    flag?: string;
    /**
     * 字典唯一标识
     */
    id: string;
    /**
     * 是否系统参数， true:系统字典，不可操作
     */
    is_default?: boolean;
    /**
     * 标签，显示给用户
     */
    label?: string;
    /**
     * 备注
     */
    remark?: string;
    /**
     * 排序
     */
    sort?: number;
    /**
     * 更新时间
     */
    updated_at?: string;
    /**
     * 值，用于接口参数
     */
    value?: string;
  };

  type AddType = {
    /**
     * 类型编码，唯一标识符
     */
    code: string;
    /**
     * 类型名称，菜单类型名称
     */
    name: string;
  };

  type AddTypeResp = {
    /**
     * 类型编码
     */
    code: string;
    /**
     * 创建时间
     */
    created_at: string;
    /**
     * 字典类型唯一标识符
     */
    id: string;
    /**
     * 类型名称
     */
    name: string;
    /**
     * 更新时间
     */
    updated_at: string;
  };

  type AddData = {
    /**
     * 字典类型
     */
    code: string;
    /**
     * 是否启用， true:启用
     */
    enabled: boolean;
    /**
     * 其它， cn/en 之类的，查询时用于过滤
     */
    flag: string;
    /**
     * 字典标签名
     */
    label: string;
    /**
     * 备注描述
     */
    remark: string;
    /**
     * 排序
     */
    sort: number;
    /**
     * 字典值
     */
    value: string;
  };

  type AddDataResp = {
    /**
     * 字典编码
     */
    code: string;
    /**
     * 创建时间
     */
    created_at: string;
    /**
     * 是否启用
     */
    enabled: boolean;
    /**
     * 其它
     */
    flag: string;
    /**
     * 字典唯一标识符
     */
    id: string;
    /**
     * 是否系统默认，系统字典，不可删除与编辑
     */
    is_default: boolean;
    /**
     * 字典标签
     */
    label: string;
    /**
     * 备注
     */
    remark: string;
    /**
     * 排序
     */
    sort: number;
    /**
     * 更新时间
     */
    updated_at: string;
    /**
     * 字典值
     */
    value: string;
  };

  type EditDataResp = {
    /**
     * 字典编码
     */
    code: string;
    /**
     * 创建时间
     */
    created_at: string;
    /**
     * 是否启用
     */
    enabled: boolean;
    /**
     * 其它
     */
    flag: string;
    /**
     * 字典唯一标识
     */
    id: string;
    /**
     * 是否系统默认
     */
    is_default: boolean;
    /**
     * 字典标签
     */
    label: string;
    /**
     * 备注
     */
    remark: string;
    /**
     * 排序
     */
    sort: number;
    /**
     * 更新时间
     */
    updated_at: string;
    /**
     * 字典值
     */
    value: string;
  };

  type DeleteDictResp = {
    /**
     * 字典唯一标识符
     */
    id: string;
  };

  type EditDictTypeData = {
    name: string;
  };

  type EditDictTypeDataResp = {
    id: string;
  };
}
