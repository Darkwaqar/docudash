import { combineReducers } from 'redux';
import UserSlice from '../slices/UserSlice';
import { IUserSlice } from 'src/types/userSlice';

// Define the RootState type, which combines all the individual reducer states
export interface RootState {
  user: IUserSlice;
}

const rootReducer = combineReducers<RootState>({
  user: UserSlice,
});
export default rootReducer;
