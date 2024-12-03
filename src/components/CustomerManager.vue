<template>
  <div class="customer-manager">
    <div class="header">
      <h1>Quản Lý Người Dùng</h1>
      <button class="add-button" @click="showAddCustomerModal">
        + Thêm Người Dùng
      </button>
    </div>

    <table class="customer-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ Tên</th>
          <th>Tên Người Dùng</th>
          <th>Email</th>
          <th>Mật Khẩu</th>
          <th>Số Điện Thoại</th>
          <th>Trạng Thái</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(customer, index) in paginatedCustomers" :key="customer.id">
          <td>{{ customer.id }}</td>
          <td>{{ customer.name }}</td>
          <td>{{ customer.user }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.password }}</td>
          <td>{{ customer.phone }}</td>
          <td>{{ customer.status }}</td>
          <td>
            <div class="actions">
              <button class="edit-button" @click="editCustomer(index)">
                Sửa
              </button>
              <button
                class="delete-button"
                @click="deleteCustomer(customer.id)"
              >
                Xóa
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Thêm Người Dùng -->
    <div class="edit-modal" v-if="isAdding">
      <div class="modal-content">
        <h2>Thêm Người Dùng Mới</h2>
        <form @submit.prevent="saveNewCustomer">
          <div class="input-group">
            <label for="name">Họ Tên:</label>
            <input type="text" id="name" v-model="newCustomer.name" required />
          </div>
          <div class="input-group">
            <label for="user">Tên Người Dùng:</label>
            <input type="text" id="user" v-model="newCustomer.user" required />
          </div>
          <div class="input-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              v-model="newCustomer.email"
              required
            />
          </div>
          <div class="input-group">
            <label for="password">Mật Khẩu:</label>
            <input
              type="password"
              id="password"
              v-model="newCustomer.password"
              required
            />
          </div>
          <div class="input-group">
            <label for="phone">Số Điện Thoại:</label>
            <input type="tel" id="phone" v-model="newCustomer.phone" required />
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

    <!-- Modal Sửa Người Dùng -->
    <div class="edit-modal" v-if="isEditing">
      <div class="modal-content">
        <h2>Sửa Thông Tin Người Dùng</h2>
        <form @submit.prevent="saveChanges">
          <div class="input-group">
            <label for="edit-name">Họ Tên:</label>
            <input
              type="text"
              id="edit-name"
              v-model="currentCustomer.name"
              required
            />
          </div>
          <div class="input-group">
            <label for="edit-user">Tên Người Dùng:</label>
            <input
              type="text"
              id="edit-user"
              v-model="currentCustomer.user"
              required
            />
          </div>
          <div class="input-group">
            <label for="edit-email">Email:</label>
            <input
              type="email"
              id="edit-email"
              v-model="currentCustomer.email"
              required
            />
          </div>
          <div class="input-group">
            <label for="edit-password">Mật Khẩu:</label>
            <input
              type="password"
              id="edit-password"
              v-model="currentCustomer.password"
              required
            />
          </div>
          <div class="input-group">
            <label for="edit-phone">Số Điện Thoại:</label>
            <input
              type="tel"
              id="edit-phone"
              v-model="currentCustomer.phone"
              required
            />
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
      customers: [],
      currentPage: 1,
      itemsPerPage: 5,
      isAdding: false,
      isEditing: false,
      currentCustomer: null,
      newCustomer: {
        name: "",
        user: "",
        email: "",
        password: "",
        phone: "",
      },
    };
  },
  computed: {
    paginatedCustomers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.customers.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.customers.length / this.itemsPerPage);
    },
  },
  methods: {
    fetchCustomers() {
      axios.get("http://localhost:3000/customers").then((response) => {
        this.customers = response.data;
      });
    },
    showAddCustomerModal() {
      this.isAdding = true;
    },
    cancelAdd() {
      this.isAdding = false;
      this.newCustomer = {
        name: "",
        user: "",
        email: "",
        password: "",
        phone: "",
      };
    },
    saveNewCustomer() {
      axios
        .post("http://localhost:3000/customers", this.newCustomer)
        .then(() => {
          this.fetchCustomers();
          this.cancelAdd();
        });
    },
    editCustomer(index) {
      this.isEditing = true;
      this.currentCustomer = { ...this.customers[index] };
    },
    cancelEdit() {
      this.isEditing = false;
      this.currentCustomer = null;
    },
    saveChanges() {
      axios
        .put(
          `http://localhost:3000/customers/${this.currentCustomer.id}`,
          this.currentCustomer
        )
        .then(() => {
          this.fetchCustomers();
          this.cancelEdit();
        });
    },
    deleteCustomer(id) {
      axios.delete(`http://localhost:3000/customers/${id}`).then(() => {
        this.fetchCustomers();
      });
    },
    changePage(page) {
      this.currentPage = page;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
  mounted() {
    this.fetchCustomers();
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

.add-button {
  background: linear-gradient(90deg, #00c6ff, #0072ff);
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
  background: linear-gradient(90deg, #0072ff, #00c6ff);
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.customer-table th,
.customer-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.customer-table th {
  background: #f9fafb;
  color: #333;
}

.customer-table tr:hover {
  background: #e5f1ff;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.8rem;
  justify-content: flex-start;
}

.edit-button,
.delete-button {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button {
  background: linear-gradient(90deg, #6dd5ed, #2193b0);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-button:hover {
  background: linear-gradient(90deg, #2193b0, #6dd5ed);
  transform: translateY(-2px);
}

.delete-button {
  background: linear-gradient(90deg, #ff758c, #ff4d4d);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.delete-button:hover {
  background: linear-gradient(90deg, #ff4d4d, #ff758c);
  transform: translateY(-2px);
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
</style>
