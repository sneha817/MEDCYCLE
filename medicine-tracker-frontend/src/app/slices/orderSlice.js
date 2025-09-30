import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createOrderRequest = createAsyncThunk('orders/create', async (orderData, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post(`${API_URL}/api/orders/request`, orderData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});

export const getUserOrderHistory = createAsyncThunk('orders/history', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { userInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${API_URL}/api/orders/history/my`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});

export const getShopOrderRequests = createAsyncThunk('orders/requests', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { adminInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        const { data } = await axios.get(`${API_URL}/api/orders/requests`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});

export const handleOrderRequest = createAsyncThunk('orders/handle', async ({ id, status }, { getState, rejectWithValue }) => {
    try {
        const { auth: { adminInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        const { data } = await axios.put(`${API_URL}/api/orders/${id}/action`, { status }, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});

export const getDonationHistory = createAsyncThunk('orders/donationHistory', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { adminInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        const { data } = await axios.get(`${API_URL}/api/orders/history/donated`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});

const orderSlice = createSlice({
    name: 'orders',
    // Added pendingCount to the initial state
    initialState: { history: [], requests: [], donationHistory: [], pendingCount: 0, loading: false, error: null, success: false },
    reducers: {
        resetOrderSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrderRequest.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createOrderRequest.fulfilled, (state) => { state.loading = false; state.success = true; })
            .addCase(createOrderRequest.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            .addCase(getUserOrderHistory.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getUserOrderHistory.fulfilled, (state, { payload }) => { state.loading = false; state.history = payload; })
            .addCase(getUserOrderHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            .addCase(getShopOrderRequests.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getShopOrderRequests.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.requests = payload;
                // Calculate and store the count of pending requests
                state.pendingCount = payload.filter(req => req.status === 'Pending').length;
            })
            .addCase(getShopOrderRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            .addCase(handleOrderRequest.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(handleOrderRequest.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.requests = state.requests.map(req => req._id === payload._id ? payload : req);
                // Also update the count when an action is taken
                state.pendingCount = state.requests.filter(req => req.status === 'Pending').length;
            })
            .addCase(handleOrderRequest.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            .addCase(getDonationHistory.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(getDonationHistory.fulfilled, (state, { payload }) => { state.loading = false; state.donationHistory = payload; })
            .addCase(getDonationHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export const { resetOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;