<template>
  <div class="order-manager">
    <div class="header">
      <h1>Quản Lý Đơn Hàng</h1>
      <button class="add-button" @click="showAddForm">+ Thêm Đơn Hàng</button>
    </div>

    <!-- Modal Thêm Đơn Hàng -->
    <div class="edit-modal" v-if="isAdding">
      <div class="modal-content">
        <h2>Thêm Đơn Hàng Mới</h2>
        <form @submit.prevent="saveNewOrder">
          <div class="input-group">
            <label for="customer">Khách Hàng:</label>
            <input
              type="text"
              id="customer"
              v-model="newOrder.customer"
              required
            />
          </div>
          <div class="input-group">
            <label for="total">Tổng Tiền:</label>
            <input type="number" id="total" v-model="newOrder.total" required />
          </div>
          <div class="input-group">
            <label for="date">Ngày:</label>
            <input type="date" id="date" v-model="newOrder.date" required />
          </div>
          <div class="input-group">
            <label for="status">Trạng Thái:</label>
            <select id="status" v-model="newOrder.status" required>
              <option value="Completed">Hoàn Thành</option>
              <option value="Pending">Đang Chờ</option>
              <option value="Cancelled">Hủy</option>
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

    <div class="table-container">
      <table class="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách Hàng</th>
            <th>Tổng</th>
            <th>Ngày</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in paginatedOrders" :key="index">
            <td>{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>${{ order.total }}</td>
            <td>{{ order.date }}</td>
            <td>
              <span :class="['status', order.status.toLowerCase()]">
                <i :class="getStatusIcon(order.status)"></i>
                {{ getVietnameseStatus(order.status) }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button class="edit-button" @click="editOrder(order)">
                  Sửa
                </button>
                <button class="delete-button" @click="deleteOrder(order.id)">
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
export default {
  data() {
    return {
      orders: [
        {
          id: "001",
          customer: "John Doe",
          date: "2024-11-01",
          status: "Completed",
          total: 250,
        },
        {
          id: "002",
          customer: "Jane Smith",
          date: "2024-11-03",
          status: "Pending",
          total: 125,
        },
        {
          id: "003",
          customer: "Alice Johnson",
          date: "2024-11-05",
          status: "Cancelled",
          total: 0,
        },
      ],
      currentPage: 1,
      itemsPerPage: 5,
      isAdding: false,
      newOrder: {
        id: "",
        customer: "",
        date: "",
        status: "Completed",
        total: 0,
      },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.orders.length / this.itemsPerPage);
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.orders.slice(start, end);
    },
  },
  methods: {
    getVietnameseStatus(status) {
      const translations = {
        Completed: "Đã Hoàn Thành",
        Pending: "Đang Chờ",
        Cancelled: "Đã Hủy",
      };
      return translations[status] || status;
    },
    getStatusIcon(status) {
      const icons = {
        Completed: "fas fa-check-circle",
        Pending: "fas fa-hourglass-half",
        Cancelled: "fas fa-times-circle",
      };
      return icons[status] || "fas fa-circle";
    },
    showAddForm() {
      this.isAdding = true;
    },
    cancelAdd() {
      this.isAdding = false;
      this.newOrder = {
        id: "",
        customer: "",
        date: "",
        status: "Completed",
        total: 0,
      };
    },
    async saveNewOrder() {
      const newId = (this.orders.length + 1).toString().padStart(3, "0"); // Tạo ID tự động
      this.newOrder.id = newId;
      this.orders.push({ ...this.newOrder });
      this.cancelAdd();
    },
    editOrder(order) {
      this.newOrder = { ...order };
      this.isAdding = true;
    },
    async deleteOrder(id) {
      this.orders = this.orders.filter((order) => order.id !== id);
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

.order-table {
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

/* Status */
.status {
  font-weight: bold;
  font-size: 0.9rem; /* Kích thước chữ vừa phải */
  display: inline-flex;
  align-items: center;
  gap: 0.4rem; /* Khoảng cách giữa biểu tượng và chữ */
  color: inherit; /* Giữ nguyên màu mặc định */
}

.status.completed {
  color: #57ca85; /* Màu xanh cho trạng thái Đã Hoàn Thành */
}

.status.pending {
  color: #ffc107; /* Màu vàng cho trạng thái Đang Chờ */
}

.status.cancelled {
  color: #ff4d4d; /* Màu đỏ cho trạng thái Đã Hủy */
}

.status i {
  font-size: 1rem; /* Kích thước biểu tượng vừa phải */
  margin-right: 0.3rem; /* Khoảng cách nhỏ giữa biểu tượng và chữ */
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
