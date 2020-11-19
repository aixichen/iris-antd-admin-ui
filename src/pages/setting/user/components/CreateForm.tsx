import React from 'react';
import { Modal } from 'antd';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  container:any
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel ,container } = props;

  return (
    <Modal
      destroyOnClose
      title="新建规则"
      width={420}
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      keyboard={false}
      maskClosable={false}
      getContainer={container}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
