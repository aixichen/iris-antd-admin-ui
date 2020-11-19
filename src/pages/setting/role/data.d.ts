export interface RolePermission {
  value:number;
  name:string;
  label:string;
  description:string;
}

export interface TableListItem {
  id: number;
  name: string;
  company_id: number;
  display_name: string;
  description: string;
  createdAt: Date;
  role_permission: number[]
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
