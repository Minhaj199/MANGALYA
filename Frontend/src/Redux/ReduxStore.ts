import {configureStore} from '@reduxjs/toolkit'
import { userDataSlice } from './ReduxGlobal'

const store = configureStore({
    reducer: userDataSlice.reducer
  })