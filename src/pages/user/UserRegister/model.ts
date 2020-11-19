import { Effect, Reducer } from 'umi';

import { fakeRegister,fakeRegisterCode } from './service';

export interface StateType {
  status?: true | false;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
    getCode: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userAndUserRegister',

  state: {
    status: false,
  },

  effects: {
    *submit({ payload }, { call, put }) {
     
      try{
        const response = yield call(fakeRegister, payload);
        yield put({
          type: 'registerHandle',
          payload: response,
        });
        return response;
      }catch(e) {
        return ""
      }
     
    },
    *getCode({ payload }, { call }) {
       yield call(fakeRegisterCode, payload);
    
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.success,
      };
    },
  },
};

export default Model;
