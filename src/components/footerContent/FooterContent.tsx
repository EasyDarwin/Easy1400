import { LOGIN_PAGE_ROUTE } from '@/constants';
import { cleanStoreage, username } from '@/services/http/http';
import { UserOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Avatar, Button, Dropdown, Popconfirm } from 'antd';
import React from 'react';

const FooterContent: React.FC = () => {
  const handleSignOut = () => {
    cleanStoreage();
    history.push(LOGIN_PAGE_ROUTE);
  };

  const handleEidtPwd = () => {
    history.push(`/user/edit`);
  };

  const items = [
    {
      key: '1',
      label: (
        <div className="text-center" onClick={handleEidtPwd}>
          修改密码
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <Popconfirm
          title="确定退出吗?"
          onConfirm={handleSignOut}
          okText="确定"
          cancelText="取消"
        >
          <div className="text-center">退出登录</div>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="w-full h-full flex justify-end items-center">
      <Dropdown
        className="h-full rounded-none"
        menu={{ items }}
        placement="top"
        trigger={['click']}
      >
        <Button
          className="flex items-center "
          type="text"
          onClick={(e) => e.preventDefault()}
        >
          <Avatar
            size="small"
            style={{ backgroundColor: '#4096ff' }}
            icon={<UserOutlined />}
          >
          </Avatar>
          <span className="text-md font-semibold px-2 ">
            {sessionStorage.getItem(username)}
          </span>
        </Button>
      </Dropdown>
    </div>
  );
};

export default FooterContent;
