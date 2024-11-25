import { configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';



export type StateProb = {
  photo: string;
  subscriptionStatus: string;
};


export interface ReduxState {
  userData: StateProb;
}


 const initialState: ReduxState = {
  userData: {
    photo: '',
    subscriptionStatus: ''
  },
};
export type ReduxUserDataDispatchType={
  type: 'SET_DATA' | 'CLEAR_DATA'; payload?: StateProb
}

const appReducer = (
  state: ReduxState = initialState,
  action: ReduxUserDataDispatchType
): ReduxState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, userData: { ...action.payload! } };
    case 'CLEAR_DATA':
      return initialState;
    default:
      return state;
  }
};


const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


export const persistor = persistStore(store);

export default store;
