import React, { useEffect, useState } from 'react';
import { Checkbox, Col, Form, Input, Modal, Row, Select, Upload } from 'antd';
import { TableListItem } from '../data';
import { OptionType } from '@/services/data';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getApiServer, imageFileCompression } from '@/utils/utils';
import { getAllUserRole, getIsDisableOption, getUserTypeOption } from '../service';
import { UploadChangeParam } from 'antd/lib/upload';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: TableListItem) => void;
  container: HTMLElement;
}

const getBase64=(img: Blob, callback: (arg0: string | ArrayBuffer | null) => any)=> {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const handleGetRoleOption = async () => {
  try {
    const response = await getAllUserRole();
    let role: OptionType[] = [];
    if (response.success) {
      role = response.data;
    }

    return role;
  } catch (error) {
    return [];
  }
};

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onSubmit,container } = props;
  const [form] = Form.useForm();

  const [setpUserTypeOption,setSetpUserTypeOption]=useState<OptionType[]>([]);
  const [setpUserIsDisableOption,setSetpUserIsDisableOption]=useState<OptionType[]>([]);
  const [setpRoleOption,setSetpRoleOption]=useState<OptionType[]>([]);
  const [setpLoading,setSetpLoading]=useState<boolean>(false);
  const [setpAvatar,setSetpAvatar]=useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const optionValue = await getUserTypeOption();
      setSetpUserTypeOption(optionValue);
    };
    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const optionValue = await handleGetRoleOption();
      setSetpRoleOption(optionValue);
    };
    fetchData();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const optionValue = await getIsDisableOption();
      setSetpUserIsDisableOption(optionValue);
    };
    fetchData();
  }, [])

 const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
     setSetpLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      if( info.file.response&&info.file.response.success){
        setSetpLoading(false);
        setSetpAvatar(info.file.response.data.url)
        form.setFieldsValue({avatar:info.file.response.data.url});
      }else if (info.file.originFileObj){
        getBase64(info.file.originFileObj, imageUrl =>{
     
          setSetpLoading(false);
          if(typeof imageUrl ==="string")
          setSetpAvatar(imageUrl);
        });
      }
    }
  }

  const uploadButton = (
    <div>
      {setpLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>)

  return (
    <Modal
      destroyOnClose
      title="新建用户"
      width={"60%"}
      visible={modalVisible}
      onCancel={() => onCancel()}
      keyboard={false}
      maskClosable={false}
      getContainer={container}
      onOk={()=>form.submit()}
    >
      <Form<TableListItem> form={form} onFinish={onSubmit}>
        <Form.Item name="id" hidden />
        <Form.Item name="fin_id" hidden />
        <Form.Item name="fin_name" hidden />
        <Form.Item name="plate_car_type" hidden />
        <Form.Item name="avatar" hidden />


        <Row gutter={[4, 0]}>
          <Col span={8}>
            <Form.Item label="用户名称" name="username" rules={[{ required: true }]}>
              <Input placeholder="用户名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="联系电话" name="usermobile" rules={[{ required: true }]} >
              <Input placeholder="联系电话" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="登录密码" name="password" rules={[{ required: true }]}>
              <Input placeholder="登录密码" />
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={[4, 0]}>
          <Col span={8}>
            <Form.Item label="用户类型" name="user_type" rules={[{ required: true }]} >
              <Select options={setpUserTypeOption} getPopupContainer={() => container} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="用户状态" name="is_disable" rules={[{ required: true }]}>
              <Select options={setpUserIsDisableOption} getPopupContainer={() => container} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[4, 0]}>
          <Col span={24}>
            <Form.Item label="用户权限" name="role_ids" >
              <Checkbox.Group options={setpRoleOption} />
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={[4, 0]}>
          <Col span={4}>

            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={`${getApiServer()}/api/upload`}
              beforeUpload={imageFileCompression}
              onChange={handleChange}
            >
              {setpAvatar ? <img src={setpAvatar} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Col>

          <Col span={20}>
            <Form.Item label="简介" name="intro" >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[4, 0]}>
          <Col span={24}>
            <Form.Item label="备注" name="user_remark">
              <Input />
            </Form.Item>
          </Col>
        </Row>



      </Form>
    </Modal>
  );
};

export default CreateForm;
