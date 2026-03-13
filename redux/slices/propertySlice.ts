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
}

interface Amenity {
  id: number;
  name: string;
}

interface PropertyType {
  id: number;
  name: string;
}

interface PropertyState {
  properties: Property[];
  amenities: Amenity[];
  propertyTypes: PropertyType[];
  loading: boolean;
}

const initialState: PropertyState = {
  properties: [],
  amenities: [],
  propertyTypes: [],
  loading: false,
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProperties.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          state.properties = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchProperties.rejected, (state) => {
        state.loading = false;
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

export default propertySlice.reducer;
