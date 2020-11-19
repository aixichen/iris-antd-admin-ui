import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Checkbox, Drawer, Tag, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { FormInstance } from 'antd/lib/form';
import { Access, useAccess } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { RolePermission, TableListItem } from './data.d';
import { queryRule, getAllRulePermission, updateRule, addRule, removeRule, createApi, updateApi, deleteApi } from './service';


/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
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
const handleUpdate = async (fields: TableListItem) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({ ...fields });
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
    await removeRule({
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

const handleGetRolePermission = async () => {

  try {
    const response = await getAllRulePermission();
    let rolePermission: RolePermission[] = []
    if (response.success) {
      rolePermission = response.data
    }

    return rolePermission;
  } catch (error) {

    return [];
  }

};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<TableListItem>();
  const actionRef = useRef<ActionType>();
  const updateRef = useRef<FormInstance>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [rolePermission, setRolePermisson] = useState<RolePermission[]>([]);

  const proTableContainer = document.getElementById("ant-design-pro-table");
  const access = useAccess()

  useEffect(() => {
    const fetchData = async () => {
      let tempRolePermission: React.SetStateAction<RolePermission[]> = [];
      tempRolePermission = await handleGetRolePermission();
      setRolePermisson(tempRolePermission);
    }
    fetchData();
  }, [])


  const columns: ProColumns<TableListItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '角色名称为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '简介',
      dataIndex: 'display_name',
      valueType: 'textarea',
    },
    {
      title: '详细介绍',
      dataIndex: 'description',
      valueType: 'textarea',
    },

    {
      title: '创建时间',
      dataIndex: 'created_at',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '权限列表',
      dataIndex: 'role_permission',
      hideInSearch: true,
      hideInTable: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return <Checkbox.Group options={rolePermission} {...rest} />;
        }
        return defaultRender(_);
      },
      render: (_, record) => {
        const tempRolePermission = rolePermission.filter((item) => record.role_permission.indexOf(item.value) >= 0);
        return (
          <div>
            {tempRolePermission.map(item => {
              return (<Tag color="success">{item.label}</Tag>);
            }
            )}
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Access accessible={access.canEnable(updateApi)} fallback="编辑">
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }}
            >
              编辑
          </a>
          </Access>

          <Divider type="vertical" />
          <Access accessible={access.canEnable(deleteApi)} fallback="删除">
            <Popconfirm title="你确定要删除吗?" okText="确定" cancelText="取消"
              onConfirm={async () => {
                await handleRemove([record]);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
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
        headerTitle="角色管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="createApi" onClick={() => handleModalVisible(true)} disabled={!access.canEnable(createApi)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
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
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      {proTableContainer && createModalVisible ? (
        <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} container={proTableContainer}>
          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              const success = await handleAdd(value);
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="key"
            type="form"
            columns={columns}
          />
        </CreateForm>
      ) : null}

      {proTableContainer && updateModalVisible && stepFormValues && updateRef ? (
        <UpdateForm onCancel={() => handleUpdateModalVisible(false)} updateModalVisible={updateModalVisible} value={stepFormValues} updateRef={updateRef} container={proTableContainer} >

          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              const tempValue = {
                ...value,
                id: stepFormValues.id
              }

              const success = await handleUpdate(tempValue);
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="key"
            type="form"
            formRef={updateRef}
            columns={columns}

          />
        </UpdateForm>
      ) : null}
      {proTableContainer ? (
        <Drawer
          width={600}
          visible={!!row}
          onClose={() => {
            setRow(undefined);
          }}
          closable={false}
          getContainer={proTableContainer}
        >
          {row?.name && (
            <ProDescriptions<TableListItem>
              column={2}
              title={row?.name}
              request={async () => ({
                data: row || {},
              })}
              params={{
                id: row?.name,
              }}
              columns={columns}
            />
          )}
        </Drawer>
      ) : null}

    </PageContainer>
  );
};

export default TableList;
