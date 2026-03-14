import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiFetcher } from "@/API/api-fetcher";

interface Property {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  type_id: number;
  amenities_ids: number[];
  [key: string]: any;
}

interface Amenity {
  id: number;
  name: string;
}

interface PropertyType {
  id: number;
  name: string;
}

// ✅ FILTER STATE INTERFACE
interface FilterState {
  city?: string;
  priceMin?: number;
  priceMax?: number;
  guests?: number;
  rooms?: number;
  amenities?: number[];
  propertyType?: string;
  checkIn?: string;
  checkOut?: string;
}

interface PropertyState {
  properties: Property[];
  filteredProperties: Property[];
  amenities: Amenity[];
  propertyTypes: PropertyType[];
  filters: FilterState;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  filteredProperties: [],
  amenities: [],
  propertyTypes: [],
  filters: {},
  pagination: {
    currentPage: 1,
    pageSize: 3,
    totalItems: 0,
  },
  loading: false,
  error: null,
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  "property/fetchProperties",
  async () => {
    const res = await apiFetcher("/get/product", {
      lang: "en_001",
      company_id: 10,
    });
    return res?.data || [];
  },
);

export const fetchAmenities = createAsyncThunk(
  "property/fetchAmenities",
  async () => {
    const res = await apiFetcher("/get/amenities", {
      lang: "en_001",
      company_id: 10,
    });
    return res?.data || [];
  },
);

export const fetchPropertyTypes = createAsyncThunk(
  "property/fetchPropertyTypes",
  async () => {
    const res = await apiFetcher("/get/property_type", {
      lang: "en_001",
      company_id: 10,
    });
    return res?.data || [];
  },
);

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    // ✅ SET FILTERS
    setFilters: (state, action: PayloadAction<FilterState>) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when filters change
      console.log("✅ Filters updated:", state.filters);
    },

    // ✅ UPDATE SINGLE FILTER
    updateFilter: (
      state,
      action: PayloadAction<{ key: keyof FilterState; value: any }>,
    ) => {
      state.filters[action.payload.key] = action.payload.value;
      state.pagination.currentPage = 1;
      console.log(
        `✅ Filter ${action.payload.key} updated:`,
        action.payload.value,
      );
    },

    // ✅ CLEAR FILTERS
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.currentPage = 1;
      state.filteredProperties = state.properties;
      console.log("✅ Filters cleared");
    },

    // ✅ SET FILTERED PROPERTIES
    setFilteredProperties: (state, action: PayloadAction<Property[]>) => {
      state.filteredProperties = action.payload;
      state.pagination.totalItems = action.payload.length;
      state.pagination.currentPage = 1;
      console.log("✅ Filtered properties updated:", action.payload.length);
    },

    // ✅ SET PAGINATION
    setPagination: (
      state,
      action: PayloadAction<{
        currentPage?: number;
        pageSize?: number;
        totalItems?: number;
      }>,
    ) => {
      if (action.payload.currentPage !== undefined) {
        state.pagination.currentPage = action.payload.currentPage;
      }
      if (action.payload.pageSize !== undefined) {
        state.pagination.pageSize = action.payload.pageSize;
      }
      if (action.payload.totalItems !== undefined) {
        state.pagination.totalItems = action.payload.totalItems;
      }
      console.log("✅ Pagination updated:", state.pagination);
    },

    // ✅ NEXT PAGE
    nextPage: (state) => {
      const maxPage = Math.ceil(
        state.pagination.totalItems / state.pagination.pageSize,
      );
      if (state.pagination.currentPage < maxPage) {
        state.pagination.currentPage++;
      }
    },

    // ✅ PREVIOUS PAGE
    previousPage: (state) => {
      if (state.pagination.currentPage > 1) {
        state.pagination.currentPage--;
      }
    },

    // ✅ SET LOADING
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // ✅ SET ERROR
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProperties.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.properties = action.payload;
          state.filteredProperties = action.payload;
          state.pagination.totalItems = action.payload.length;
          state.loading = false;
          console.log("✅ Properties fetched:", action.payload.length);
        },
      )
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch properties";
        console.log("❌ Properties fetch failed");
      })
      .addCase(
        fetchAmenities.fulfilled,
        (state, action: PayloadAction<Amenity[]>) => {
          state.amenities = action.payload;
        },
      )
      .addCase(
        fetchPropertyTypes.fulfilled,
        (state, action: PayloadAction<PropertyType[]>) => {
          state.propertyTypes = action.payload;
        },
      );
  },
});

export const {
  setFilters,
  updateFilter,
  clearFilters,
  setFilteredProperties,
  setPagination,
  nextPage,
  previousPage,
  setLoading,
  setError,
} = propertySlice.actions;
export default propertySlice.reducer;
