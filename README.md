# 说明

## 新建路由

npx umi g page device/view 将会自动写入 Write: src/pages/products.tsx Write: src/pages/products.less 然后需要手动写入 .umirc.ts 文件

所有业务页面都要在 pages 目录下所有复用模块全部放到 components 下

## 代理

项目目录下创建 .umirc.local.ts 文件设置 proxy 环境

## 写代码优先级

1. 质量，保证功能的可靠性
2. 可读性，你的同事能够很轻松的看懂代码，多写注释，更明确的变量名

## api 命名规范

1. react-quyer 查询键名 常量 小写 与查询函数同名
2. api 函数 采用大驼峰形式

```javascript
// good
export const findRecordsConfig = 'FindRecordsConfig';
// FindRecordsConfig 查询录像配置
export async function FindRecordsConfig(data: { page: number, size: number }) {
  return (
    (await GET) < Record.FindRecordTemplatesResp > (`/records/plans`, data)
  );
}

// GET      findDevices,  getDevice
// POST     addDevice, addDevices
// PUT      editDevice,editDevices
// DELETE   delDevice, delDevices
```

# React 规范

## 组件

1. 组件名采用大驼峰命名法，如 UserList
2. 组件名采用完整单词，不要缩写，如 UserList
3. 组件传参，如果变量名明确简洁，如：

```jsx
// bad
<UserList userDataList={userDataList}/>

// good
<UserList data={userDataList}/>
```

4. 关于弹出框组件建议封装成一个独立的组件，并且采用 forwardRef 的方式 控制
5. 组件导出，建议采用 export default 的方式导出，并且组件名采用大驼峰命名法,这样在导入时不需要解构

```jsx
const AddDeviceView: React.FC<{ ref: any, refresh: () => void }> =
  React.forwardRef(({ refresh }, ref) => {
    useImperativeHandle(ref, () => ({
      setFieldsWithModal: (isUpdate: boolean, v: any) => {
        setIsUpdate(isUpdate);
        form.setFieldsValue(v);
        setOpen(true);
      },
    }));
  });

export default AddDeviceView;
```

6. 如果这个组件尽在当前页面使用，不是通用组件，则推荐在当前页面目录下新建一个 components 文件夹
7. 页面统一以 **View** 结尾，组件平铺在页面上的 以 **Box** 结尾，弹窗组件以 **Modal** 结尾
8. 使用组件标签时 建议使用**单标签**形式

## 标签 以及 属性

1. 如果标签有多个属性，且存在换行，则每个属性都需要换行独占一行

```jsx
// bad - 属性应全部换行，或全部跟组件名写在一行
<Foo superLongParam="bar"
     anotherSuperLongParam="baz" />

// good
<Foo
  superLongParam="bar"
  anotherSuperLongParam="baz"
/>
```

## 事件 以及 方法

1. 如果是复杂的方法建议定义一个 方法，而不是直接写在标签中
2. 如果是人为触发的时间采用 **on+ 事件 + 作用 如 onClickDelete** 如果是其他方式触发可以采用 handle + 作用

## hooks 的使用

1. 如果获取 dom，或者组件实例，变量名采用 组件或者 dom + Ref 的方式 如 userRef
2. **[注意]** 如果一个变量不会控制 dom 刷新，并且需要保留值，需要采用 useRef，而不是一味的 useState

```jsx
const [userDataList, setUserDataList] = useState('我需要在页面上实时显示');
const userRef = useRef('我不需要再页面上实时显示');
```

# javascript 规范

## 常量

1. 常量命名全部大写，单词间用下划线隔开 **(不包含 api)**
2. 页面展示的如平台标题，通用的提示可以写入到 constants 文件中方便统一修改

## 变量

1. 变量名采用小驼峰命名法，如 userName
2. **[强制]** 使用 const 或者 let 生命变量，这样声明不会造成命名全局污染
3. 一个声明语句声明一个变量，避免一次声明多个变量

```javascript
// bad
const foo = 1,
  bar = 2;

// good
const foo = 1;
const bar = 2;
```

4. **[强制]** 声明的变量一定要使用
5. 类型转换 最好采用 String(), Number(), !!（!!是转换成布尔）

## 字符串

1. 字符串拼接尽量采用模板字符串，而不是+号

```javascript
// bad
const nameAge = 'name:' + name + 'age:' + age;

// good
const nameAge = `name:${name}age:${age}`;
```

2. 字符串优先使用单引号，如有需要遵守外双内单

## 数组

1. 推荐使用扩展运算符(...) 简化数组操作
2. 数组拼接:

```javascript
// bad
const array1 = [1, 2].concat(array);

// good
const array1 = [1, 2, ...array];
```

## 对象

1. 创建对象尽量采用{}
2. 对象最后一个属性最好加上逗号(,)

```javascript
// bad
const obj = {
  a: 1,
  b: 2,
};

// good
const obj = {
  a: 1,
  b: 2,
};
```

## 函数

1. 在**tsx，jsx**文件中，函数命名尽量采用 **箭头函数 + 变量接收的方式**

```javascript
// bad
function foo() {}

// good
const foo = () => {};
```

2. 函数参数必须明确类型，

```typescript
// good
const foo = function (name: string, midday: string) {};
```

3. 函数的复杂度不易过高，一个函数只干一件事。

## 注释

1. 建议多加注释
