<template>
  <div class="product-manager">
    <div class="header">
      <h1>Quản lý sản phẩm</h1>
      <button class="add-button" @click="showAddForm">+ Thêm sản phẩm</button>
    </div>

    <div class="table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Giá</th>
            <th>Lượt mua</th>
            <th>Danh mục</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td><img :src="product.image" alt="product image" width="50" /></td>
            <td>{{ product.price }}</td>
            <td>{{ product.purchaseCount }}</td>
            <td>{{ product.categories }}</td>
            <td>
              <span
                :class="{
                  'status-in-stock': product.inStock,
                  'status-out-of-stock': !product.inStock,
                }"
              >
                <i
                  :class="{
                    'fas fa-check-circle': product.inStock,
                    'fas fa-times-circle': !product.inStock,
                  }"
                ></i>
                {{ product.inStock ? "Còn hàng" : "Hết hàng" }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button class="edit-button" @click="editProduct(product)">
                  Cập Nhật
                </button>
                <button
                  class="delete-button"
                  @click="deleteProduct(product.id)"
                >
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Thêm Sản Phẩm -->
    <div class="edit-modal" v-if="isAdding">
      <div class="modal-content">
        <h2>Thêm Sản Phẩm Mới</h2>
        <form @submit.prevent="saveNewProduct">
          <div class="input-group">
            <label for="name">Tên Sản Phẩm:</label>
            <input type="text" id="name" v-model="newProduct.name" required />
          </div>
          <div class="input-group">
            <label for="image">Hình Ảnh:</label>
            <input type="text" id="image" v-model="newProduct.image" />
          </div>
          <div class="input-group">
            <label for="price">Giá:</label>
            <input type="number" id="price" v-model="newProduct.price" />
          </div>
          <div class="input-group">
            <label for="stock">Lượt Mua:</label>
            <input
              type="number"
              id="purchaseCount"
              v-model="newProduct.purchaseCount"
            />
          </div>
          <div class="input-group">
            <label for="category">Danh Mục:</label>
            <input type="text" id="category" v-model="newProduct.categories" />
          </div>
          <div class="input-group">
            <label for="inStock">Trạng thái:</label>
            <select id="inStock" v-model="newProduct.inStock" required>
              <option :value="true">Còn hàng</option>
              <option :value="false">Hết hàng</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-button">Lưu</button>
            <button type="button" class="cancel-button" @click="cancelAdd">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Sửa Sản Phẩm -->
    <div class="edit-modal" v-if="isEditing">
      <div class="modal-content">
        <h2>Sửa Thông Tin Sản Phẩm</h2>
        <form @submit.prevent="saveChanges">
          <div class="input-group">
            <label for="edit-name">Tên Sản Phẩm:</label>
            <input
              type="text"
              id="edit-name"
              v-model="currentProduct.name"
              required
            />
          </div>
          <div class="input-group">
            <label for="edit-image">Hình Ảnh:</label>
            <input
              type="text"
              id="edit-image"
              v-model="currentProduct.image"
              required
            />
          </div>
          <div class="input-group">
            <label for="edit-price">Giá:</label>
            <input
              type="number"
              id="edit-price"
              v-model="currentProduct.price"
              required
            />
          </div>
          <div class="input-group">
            <label for="edit-stock">Lượt Mua:</label>
            <input
              type="number"
              id="edit-stock"
              v-model="currentProduct.purchaseCount"
              required
            />
          </div>
          <div class="input-group">
            <label for="edit-category">Danh Mục:</label>
            <input
              type="text"
              id="edit-category"
              v-model="currentProduct.categories"
              required
            />
          </div>
          <div class="input-group">
            <label for="edit-inStock">Trạng thái:</label>
            <select id="edit-inStock" v-model="currentProduct.inStock" required>
              <option :value="true">Còn hàng</option>
              <option :value="false">Hết hàng</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit" class="save-button">Lưu</button>
            <button type="button" class="cancel-button" @click="cancelEdit">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        Trang Trước
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Trang Sau
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],
      currentPage: 1,
      itemsPerPage: 5,
      isAdding: false,
      isEditing: false,
      currentProduct: null,
      newProduct: {
        name: "",
        image: "",
        price: "",
        purchaseCount: 0,
        inStock: true, // Thêm trạng thái còn hàng
        categories: "",
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.products.slice(start, end);
    },
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3000/products");
        this.products = response.data;
        this.currentPage = 1; // Reset the page to 1 when products are fetched
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    async deleteProduct(id) {
      try {
        await axios.delete(`http://localhost:3000/products/${id}`);
        this.products = this.products.filter((product) => product.id !== id);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    },

    editProduct(product) {
      this.currentProduct = { ...product };
      this.isEditing = true;
    },

    async saveNewProduct() {
      try {
        await axios.post("http://localhost:3000/products", this.newProduct);
        this.fetchProducts();
        this.cancelAdd();
      } catch (error) {
        console.error("Error adding product:", error);
      }
    },

    async saveChanges() {
      try {
        await axios.put(
          `http://localhost:3000/products/${this.currentProduct.id}`,
          this.currentProduct
        );
        this.fetchProducts();
        this.cancelEdit();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },

    cancelAdd() {
      this.isAdding = false;
      this.newProduct = {
        name: "",
        image: "",
        price: "",
        purchaseCount: 0,
        inStock: true,
        categories: "",
      };
    },

    cancelEdit() {
      this.isEditing = false;
      this.currentProduct = null;
    },

    showAddForm() {
      this.isAdding = true;
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    changePage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

/* Buttons */
.add-button {
  background: linear-gradient(90deg, #ff7eb3, #ff758c);
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.add-button:hover {
  transform: scale(1.05);
}

/* Table */
.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

thead th {
  background: #f9fafb;
  color: #333;
}

tbody tr:hover {
  background: #f1f5f9;
}

/* Actions */
.actions {
  display: flex;
  gap: 1rem;
}

.edit-button,
.delete-button {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-button {
  background: linear-gradient(90deg, #57ca85, #45b568);
  color: white;
}

.edit-button:hover {
  background: linear-gradient(90deg, #45b568, #57ca85);
  transform: scale(1.05);
}

.delete-button {
  background: linear-gradient(90deg, #ff758c, #ff4d4d);
  color: white;
}

.delete-button:hover {
  background: linear-gradient(90deg, #ff4d4d, #ff758c);
  transform: scale(1.05);
}

.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.save-button,
.cancel-button {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.save-button {
  background: #4caf50;
  color: white;
}

.cancel-button {
  background: #f44336;
  color: white;
}

.save-button:hover {
  background: #45a049;
}

.cancel-button:hover {
  background: #e53935;
}

/* Stock Status */
.status-in-stock {
  color: #57ca85; /* Màu cho còn hàng */
  font-weight: bold;
}

.status-out-of-stock {
  color: #ff4d4d; /* Màu cho hết hàng */
  font-weight: bold;
}

.status-in-stock i {
  margin-right: 0.5rem;
}

.status-out-of-stock i {
  margin-right: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
}

.pagination button {
  background: #0072ff;
  color: white;
  border: none;
  margin: 0 5px;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease, transform 0.2s ease;
}

.pagination button.active {
  background: #00c6ff;
  font-weight: bold;
}

.pagination button:disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #005bb5;
  transform: scale(1.05);
}

.pagination button:first-child,
.pagination button:last-child {
  padding: 0.6rem 1.6rem;
}

.pagination button:hover:not(:disabled):first-child,
.pagination button:hover:not(:disabled):last-child {
  background: #004c8c;
}
/* Font Awesome */
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");
</style>
