import { Button, Result } from 'antd';
import { Link } from 'umi';
import React from 'react';
import { RouteChildrenProps } from 'react-router';

import styles from './style.less';

const actions = (
  <div className={styles.actions}>

    <Link to="/">
      <Button size="large">
        返回首页
      </Button>
    </Link>
  </div>
);

const UserRegisterResult: React.FC<RouteChildrenProps> = ({location:any}) => {
  return <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title}>
        你的公司：{location.state ? location.state.companyname : "XXX"}注册成功
    </div>
    }
    subTitle="注册成功,欢迎体验"
    extra={actions}
  />
};

export default UserRegisterResult;
