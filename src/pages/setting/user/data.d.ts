export interface Role {
  value:number;
  name:string;
  label:string;
  description:string;
}

export interface OfficeSelect {
  value:number;
  label:string;
}

export interface UserIsDisableOption {
  value:number;
  name:string;
}

export interface TableListItem {
  id: number;
  username: string;
  company_id: number;
  company_name: string;
  user_office_id: number;
  user_office_name: string;
  introduction: string;
  display_name: string;
  description: string;
  avatar: string;
  roles: string[];
  role_ids: number[];
  is_disable: number;
  createdAt: Date;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
