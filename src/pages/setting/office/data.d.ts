export interface TableListItem {
  id: number;
  office_name: string;
  office_username?: string;
  office_user_mobile?: string;
  office_province_name: string;
  office_province_code: string;
  office_city_name: string;
  office_city_code: string;
  office_area_name?: string;
  office_area_code?: string;
  office_address?: string;

  office_sign_province_name: string;
  office_sign_province_code: string;
  office_sign_city_name: string;
  office_sign_city_code: string;
  office_sign_area_name?: string;
  office_sign_area_code?: string;
  office_sign_address?: string;
  office_remark?: number;
  created_at?: Date;

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
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
