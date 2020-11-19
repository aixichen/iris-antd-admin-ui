import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Access, useAccess } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data';
import { queryOffice, updateOffice, addOffice, removeOffice,createApi,updateApi,deleteApi } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: Partial<TableListItem>) => {
  const hide = message.loading('正在添加');
  try {
    await addOffice({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: Partial<TableListItem>) => {
  const hide = message.loading('正在配置');
  try {
    await updateOffice({ ...fields });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {


    await removeOffice({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const proTableContainer = document.getElementById("ant-design-pro-table");

  const access = useAccess();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '网点名称',
      dataIndex: 'office_name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '网点名称为必填项',
          },
        ],
      },
    },
    {
      title: '负责人',
      dataIndex: 'office_username',
    },
    {
      title: '联系方式',
      dataIndex: 'office_user_mobile',
    },
    {
      title: '网点地址',
      dataIndex: 'office_city_name',
      hideInSearch: true,
      hideInForm: true,
      renderText: (val: string, record: TableListItem) => {
        let result = record.office_city_name + record.office_area_name;
        if (result.length <= 0) {
          result = record.office_province_name;
        }
        return result;
      },
    },
    {
      title: '签收地址',
      dataIndex: 'office_city_sign_name',
      hideInSearch: true,
      hideInForm: true,
      renderText: (val: string, record: TableListItem) => {
        let result = record.office_sign_city_name + record.office_sign_area_name;
        if (result.length <= 0) {
          result = record.office_sign_province_name;
        }
        return result;
      },
    },
    {
      title: '备注',
      dataIndex: 'office_remark',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
        <Access accessible={access.canEnable(updateApi)} fallback="修改">
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
            
          >
            修改
          </a></Access>
          <Divider type="vertical" />
          <Access accessible={access.canEnable(deleteApi)} fallback="删除">

            <Popconfirm title="你确定要删除吗?" okText="确定" cancelText="取消" 
            onConfirm={async () => {
              await handleRemove([record]);
              actionRef.current?.reloadAndRest?.();
            }
  
            }
            >
            <a>删除</a>
            </Popconfirm>
          
          </Access>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="createApi" onClick={() => handleModalVisible(true)} disabled={!access.canEnable(createApi)}>
            <PlusOutlined /> 新建
          </Button>
        ]}
        request={(params, sorter, filter) => queryOffice({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;

            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      {proTableContainer && createModalVisible ? (
        <CreateForm
          onCancel={() => handleModalVisible(false)}

          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}

          modalVisible={createModalVisible}
          container={proTableContainer}
         />
      ) : null}
      {proTableContainer&&updateModalVisible ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          container={proTableContainer}
        />
      ) : null}
    </PageContainer>
  );
};

export default TableList;
