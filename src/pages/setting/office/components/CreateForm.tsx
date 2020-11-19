import React from 'react';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Cascader, Form } from 'antd'

import { TableListItem } from '../data.d';
import city from '@/assets/china';


export interface CreateFormProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: Partial<TableListItem>) => Promise<void>;
  modalVisible: boolean;
  container: HTMLElement;
}

function filter(inputValue: string, path: any[]) {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}



const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();

  const onChangeOffice = (value: any, selectedOptions: any) => {

    form.setFieldsValue({
      office_province_name: "",
      office_province_code: "",
      office_city_name: "",
      office_city_code: "",
      office_area_name: "",
      office_area_code: "",
    });

    selectedOptions.forEach((element: any, index: any) => {
      switch (index) {
        case 0: {
          form.setFieldsValue({
            office_province_name: element.label,
            office_province_code: element.value,
          });
        }; break
        case 1: {
          form.setFieldsValue({
            office_city_name: element.label,
            office_city_code: element.value,
          });
        }; break
        case 2: {
          form.setFieldsValue({
            office_area_name: element.label,
            office_area_code: element.value,
          });
        }; break
      }
    });


  }

  const onChangeOfficeSign = (value: any, selectedOptions: any) => {
    form.setFieldsValue({
      office_sign_province_name: "",
      office_sign_province_code: "",
      office_sign_city_name: "",
      office_sign_city_code: "",
      office_sign_area_name: "",
      office_sign_area_code: "",
    });

    selectedOptions.forEach((element: any, index: any) => {
      switch (index) {
        case 0: {
          form.setFieldsValue({
            office_sign_province_name: element.label,
            office_sign_province_code: element.value,
          });
        }; break
        case 1: {
          form.setFieldsValue({
            office_sign_city_name: element.label,
            office_sign_city_code: element.value,
          });
        }; break
        case 2: {
          form.setFieldsValue({
            office_sign_area_name: element.label,
            office_sign_area_code: element.value,
          });
        }; break
      }
    });

  }

  return (<ModalForm
    title="新建网点"
    visible={props.modalVisible}
    onFinish={props.onSubmit}
    onVisibleChange={(visible) => props.onCancel(visible)}
    form={form}
    modalProps={ {getContainer: props.container}}

    >
        <ProFormText hidden={true} name="office_province_name"  />
        <ProFormText hidden={true} name="office_province_code"  />
        <ProFormText hidden={true} name="office_city_name"  />
        <ProFormText hidden={true} name="office_city_code"  />
        <ProFormText hidden={true} name="office_area_name"  />
        <ProFormText hidden={true} name="office_area_code"  />

        <ProFormText hidden={true} name="office_sign_province_name"  />
        <ProFormText hidden={true} name="office_sign_province_code"  />
        <ProFormText hidden={true} name="office_sign_city_name"  />
        <ProFormText hidden={true} name="office_sign_city_code"  />
        <ProFormText hidden={true} name="office_sign_area_name"  />
        <ProFormText hidden={true} name="office_sign_area_code"  />
  
        <ProFormText
          name="office_name"
          label="网点名称"
          placeholder="请输入网点名称"
          rules={[{ required: true }]}
        />
        <ProFormText name="office_username" label="网点负责人" placeholder="请输入名称" />
        <ProFormText name="office_user_mobile" label="联系方式" placeholder="请输入联系方式" />
      
        <Form.Item
        label="网点地址"
        name="officeAddress"
        rules={[{ required: true, message: '网点地址必填' }]}
        >
           <Cascader style={{width:"300px"}} options={city} showSearch={{ filter }}  onChange={onChangeOffice}  changeOnSelect  placeholder="网点签收地址" />  
        </Form.Item>
  
        <ProFormText name="office_address" label="详细地址" placeholder="请输入详细地址" />
     
        <Form.Item
        label="网点签收地址"
        name="officeSignAddress"
        rules={[{ required: true, message: '网点签收地址' }]}
        >
       
           <Cascader style={{width:"300px"}} options={city} showSearch={{ filter }}  onChange={onChangeOfficeSign} changeOnSelect  placeholder="网点签收地址" />  
        </Form.Item>
        <ProFormText name="office_sign_address" label="详细地址" placeholder="请输入详细地址" />
      
     
      <ProFormTextArea width="l" name="office_remark" label="备注" />
    </ModalForm >);
};

export default CreateForm;

