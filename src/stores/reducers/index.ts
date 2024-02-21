import { combineReducers } from 'redux';
import UserSlice from '../slices/UserSlice';
import { IUserSlice } from 'src/types/userSlice';
import navSlice from '@stores/NavSlice';
import { api } from '@services/api';

// Define the RootState type, which combines all the individual reducer states
export interface RootState {
  user: IUserSlice;
  nav: any;
  api: any;
}

const rootReducer = combineReducers<RootState>({
  user: UserSlice,
  nav: navSlice,
  [api.reducerPath]: api.reducer,
});
export default rootReducer;
