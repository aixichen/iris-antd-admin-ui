declare namespace API {
  export interface Api {
    success?:boolean,
    data?:any,
    errorCode?: string;
    ErrorCode?: string;
    errorMessage?: string;
    showType?: number;
    traceId?: string;
  }

  export interface UserProfile {
    id?:number,
    username?:string,
    company_id?:number,
    company_name?: string,
    user_office_name?:string,
    user_office_id?: number,
    avatar?: string;
    is_disable?: number;
    title?: string;
    group?: string;
    signature?: string;
    role_permission?: {
      name: string;
      act: string;
    }[];
  }

  export interface LoginStateType {
    data: any;
    success?: boolean;
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
}
