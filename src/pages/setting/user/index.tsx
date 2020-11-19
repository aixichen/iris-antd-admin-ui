import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Checkbox, Drawer, Tag, Select, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { FormInstance } from 'antd/lib/form';
import { Access, useAccess } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { OfficeSelect, Role, TableListItem, UserIsDisableOption } from './data.d';
import { query, getAllUserRole, getAllUserOffice, update, add, remove, createApi, updateApi, deleteApi } from './service';


/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await add({ ...fields });
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
    await update({ ...fields });
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
    await remove({
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

const handleGetRole = async () => {

  try {
    const response = await getAllUserRole();
    let role: Role[] = []
    if (response.success) {
      role = response.data
    }

    return role;
  } catch (error) {

    return [];
  }

};

const handleGetOffice = async () => {

  try {
    const response = await getAllUserOffice();
    let office: OfficeSelect[] = []
    if (response.success) {
      office = response.data
    }

    return office;
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
  const [role, setRole] = useState<Role[]>([]);
  const [officeSelect, setOfficeSelect] = useState<OfficeSelect[]>([]);
  const proTableContainer = document.getElementById("ant-design-pro-table");

  const access = useAccess()

  const userIsDisableOption: UserIsDisableOption[] = [{
    name: "允许登录",
    value: 0,
  }, {
    name: "禁止登录",
    value: 1,
  }
  ]

  useEffect(() => {
    const fetchData = async () => {
      let tempRole: React.SetStateAction<Role[]> = [];
      tempRole = await handleGetRole();
      setRole(tempRole);
    }
    fetchData();

  }, [])


  useEffect(() => {
    const fetchOfficeSelectData = async () => {
      let tempOfficeSelect: React.SetStateAction<OfficeSelect[]> = [];
      tempOfficeSelect = await handleGetOffice();
      setOfficeSelect(tempOfficeSelect);

    }
    fetchOfficeSelectData();
  }, [])


  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户名称',
      dataIndex: 'username',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '用户名称为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '联系方式',
      dataIndex: 'usermobile',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '联系方式为必填项',
          },
        ],
      },
    },
    {
      title: '登录密码',
      dataIndex: 'Password',
      hideInTable: true,
      hideInSearch: true,

    },
    {
      title: '员工状态',
      dataIndex: 'is_disable',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '员工状态为必填项',
          },
        ],
      },
      renderFormItem: (tempRender, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return <Select {...rest}>
            {userIsDisableOption && userIsDisableOption.map(item => (
              <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
            ))}

          </Select>;
        }
        // eslint-disable-next-line no-param-reassign
        tempRender.valueEnum = {
          0: "允许登录",
          1: "禁止登录"

        };
        return defaultRender(tempRender);
      },
      render: (_, record) => {
        const tempUserIsDisableOption = userIsDisableOption.filter((item) => record.is_disable === item.value);

        return (
          <div>
            {tempUserIsDisableOption.map(item => {
              return (<Tag key={item.value} color="success">{item.name}</Tag>);
            }
            )}
          </div>
        );
      },
    },
    {
      title: '简介',
      dataIndex: 'introduction',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      valueType: 'avatar',
      hideInSearch: true,
    },
    {
      title: '网点名称',
      dataIndex: 'user_office_id',
      valueType: "select",
      request: async () => {
        return handleGetOffice()
      },
      render: (_, record) => {
        let tempOfficeSelect: OfficeSelect[] = [];
        if (officeSelect) {
          tempOfficeSelect = officeSelect.filter((item) => record.user_office_id === item.value);
        }

        return (
          <div>
            {tempOfficeSelect.map(item => {
              return (<Tag key={item.value} color="success">{item.label}</Tag>);
            }
            )}
          </div>
        );
      },
    },
    {
      title: '角色',
      dataIndex: 'role_ids',
      hideInSearch: true,
      renderFormItem: (_, { type, defaultRender, ...rest }) => {
        if (type === 'form') {
          return <Checkbox.Group options={role} {...rest} />;
        }
        return defaultRender(_);
      },
      render: (_, record) => {
        const tempRolePermission = role.filter((item) => record.role_ids.indexOf(item.value) >= 0);
        return (
          <div>
            {tempRolePermission.map(item => {
              return (<Tag key={item.value} color="success">{item.label}</Tag>);
            }
            )}
          </div>
        );
      },
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
    <PageContainer >
      <ProTable<TableListItem>
        headerTitle="用户管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key="createApi" type="primary" onClick={() => handleModalVisible(true)} disabled={!access.canEnable(createApi)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => query({ ...params, sorter, filter })}
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

              let user_office_name = ""
              if (officeSelect) {
                const tempOfficeSelectIndex = officeSelect.findIndex(item => item.value === value.user_office_id);
                if (tempOfficeSelectIndex >= 0) {
                  user_office_name = officeSelect[tempOfficeSelectIndex].label;
                }
              }

              const tempValue: TableListItem = {
                ...value,
                user_office_name
              }
              const success = await handleAdd(tempValue);
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
        <UpdateForm onCancel={() => handleUpdateModalVisible(false)} updateModalVisible={updateModalVisible} value={stepFormValues} updateRef={updateRef} >

          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {

              let user_office_name = ""
              if (officeSelect) {
                const tempOfficeSelectIndex = officeSelect.findIndex(item => item.value === value.user_office_id);
                if (tempOfficeSelectIndex >= 0) {
                  user_office_name = officeSelect[tempOfficeSelectIndex].label;
                }
              }


              const tempValue: TableListItem = {
                ...value,
                id: stepFormValues.id,
                user_office_name
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
          {row?.username && (
            <ProDescriptions<TableListItem>
              column={2}
              title={row?.username}
              request={async () => ({
                data: row || {},
              })}
              params={{
                id: row?.username,
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
