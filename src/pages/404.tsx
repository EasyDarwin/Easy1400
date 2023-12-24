import { Button, Result } from "antd";
import React from "react";
import { history } from "umi";

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="该路径不存在."
    extra={
      <Button type="primary" onClick={() => history.push("/")}>
        Back Home
      </Button>
    }
  />
);

export default NoFoundPage;
