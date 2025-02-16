import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/ApiClient/ApiClient";

// Thunks

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { searchQuery = "", pageNo = "", price = [0, 25000], category, rating = 0 },
    { rejectWithValue }
  ) => {
    const encodedSearchQuery = encodeURIComponent(searchQuery);
    let url = `/product/getAllProducts?keyword=${encodedSearchQuery}&page=${pageNo}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${rating}`;
    if (category) {
      url = `/product/getAllProducts?keyword=${encodedSearchQuery}&category=${category}&page=${pageNo}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${rating}`;
    }

    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const adminAllProducts = createAsyncThunk(
  "adminAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/product/allProducts");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
)
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/product/createProduct",
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/product/${productId}`, {
        withCredentials: true,
      });
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/product/${productId}`, {
        withCredentials: true,
      });
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (productData, { rejectWithValue }) => {
    const { productId, ...updateData } = productData;
    try {
      const response = await apiClient.put(
        `/product/${productId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Slice
const ProductSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    productDetails: null,
    loading: false,
    error: null,
    productsCount: 0,
    totalPages: 0,
    itemsPerPage: 0,
  },
  reducers: {
    resetProductError(state) {
      state.error = null;
    },
    resetProductDetails(state) {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admin Products
      .addCase(adminAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.Products || [];
      })
      .addCase(adminAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.Products || [];
        state.productsCount = action.payload.filteredProductCount || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.itemsPerPage = action.payload.itemNoPerPage || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        state.products = state.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
        if (state.productDetails?.id === updatedProduct.id) {
          state.productDetails = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetProductError,resetProductDetails } = ProductSlice.actions;
export default ProductSlice.reducer;
