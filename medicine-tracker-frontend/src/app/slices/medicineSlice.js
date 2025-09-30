import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getInventory = createAsyncThunk('medicines/getInventory', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth: { adminInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        const { data } = await axios.get(`${API_URL}/api/medicines/inventory`, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});

export const addMedicine = createAsyncThunk('medicines/add', async (medicineData, { getState, rejectWithValue }) => {
    try {
        const { auth: { adminInfo } } = getState();
        const config = { headers: { Authorization: `Bearer ${adminInfo.token}` } };
        const { data } = await axios.post(`${API_URL}/api/medicines`, medicineData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});

export const listShops = createAsyncThunk('medicines/listShops', async (keyword = '', { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/users/shops/search?keyword=${keyword}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});

export const getExpiringMedicines = createAsyncThunk('medicines/getExpiring', async (shopId, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/medicines/expiring/${shopId}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
});

const medicineSlice = createSlice({
    name: 'medicines',
    initialState: { inventory: [], shops: [], expiring: [], loading: false, error: null, success: false },
    reducers: {
        resetMedicineSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Inventory Actions
            .addCase(getInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getInventory.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.inventory = payload;
            })
            .addCase(getInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Medicine Actions
            .addCase(addMedicine.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMedicine.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.inventory.push(payload);
            })
            .addCase(addMedicine.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // List Shops Actions
            .addCase(listShops.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listShops.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.shops = payload;
            })
            .addCase(listShops.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Expiring Medicines Actions
            .addCase(getExpiringMedicines.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExpiringMedicines.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.expiring = payload;
            })
            .addCase(getExpiringMedicines.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetMedicineSuccess } = medicineSlice.actions;
export default medicineSlice.reducer;