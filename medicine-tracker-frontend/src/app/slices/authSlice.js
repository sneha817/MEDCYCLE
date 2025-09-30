import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
const adminInfo = localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')) : null;

export const login = createAsyncThunk('auth/login', async ({ endpoint, credentials }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/${endpoint}/login`, credentials);
    if (endpoint === 'users') localStorage.setItem('userInfo', JSON.stringify(data));
    else localStorage.setItem('adminInfo', JSON.stringify(data));
    return { userType: endpoint === 'users' ? 'user' : 'admin', data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'An error occurred');
  }
});

export const register = createAsyncThunk('auth/register', async ({ endpoint, details }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/${endpoint}/register`, details);
    if (endpoint === 'users') localStorage.setItem('userInfo', JSON.stringify(data));
    else localStorage.setItem('adminInfo', JSON.stringify(data));
    return { userType: endpoint === 'users' ? 'user' : 'admin', data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'An error occurred');
  }
});

export const updateAdminProfile = createAsyncThunk('auth/updateAdmin', async (profileData, { getState, rejectWithValue }) => {
    try {
        const { auth: { adminInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        const { data } = await axios.put(`${API_URL}/api/admin/profile`, profileData, config);
        const newAdminInfo = { ...adminInfo, ...data };
        localStorage.setItem('adminInfo', JSON.stringify(newAdminInfo));
        return newAdminInfo;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});


const authSlice = createSlice({
  name: 'auth',
  initialState: { userInfo, adminInfo, loading: false, error: null },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('adminInfo');
      state.userInfo = null;
      state.adminInfo = null;
    },
    clearError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Actions
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.userType === 'user') state.userInfo = payload.data;
        else state.adminInfo = payload.data;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register Actions
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.userType === 'user') state.userInfo = payload.data;
        else state.adminInfo = payload.data;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Admin Profile Actions
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.adminInfo = payload;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;