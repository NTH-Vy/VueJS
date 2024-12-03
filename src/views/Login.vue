<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleLogin">
      <h2>Đăng Nhập</h2>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Nhập tên đăng nhập"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Nhập mật khẩu"
          required
        />
      </div>
      <button class="login-button" type="submit">Đăng Nhập</button>
      <p class="login-status" v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.get("http://localhost:3000/users", {
          params: {
            username: this.username,
            password: this.password,
          },
        });

        if (response.data.length > 0) {
          const user = response.data[0];

          // Kiểm tra vai trò
          if (user.role !== "admin" && user.role !== "manager") {
            this.errorMessage = "Bạn không có quyền truy cập.";
          } else {
            localStorage.setItem("user", JSON.stringify(user));
            this.$router.push("/components/CustomerManager"),
              this.$router.push("/components/Dashboard"),
              this.$router.push("/components/OrderManager"),
              this.$router.push("/components/ProductManager"),
              this.$router.push("/components/Sidebar"),
              this.$router.push("/components/Statistics");
          }
        } else {
          this.errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng.";
        }
      } catch (error) {
        this.errorMessage = "Đã xảy ra lỗi khi kết nối đến server.";
      }
    },
  },
};
</script>

<style scoped>
/* Tùy chỉnh CSS cho form đăng nhập */
.login-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
}

label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: left;
}

input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box; /* Đảm bảo padding không làm ảnh hưởng đến width */
}

input:focus {
  border-color: #ff758c;
  outline: none;
}

.login-button {
  width: 100%; /* Đảm bảo nút đăng nhập có cùng chiều rộng với input */
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  background: linear-gradient(90deg, #ff7eb3, #ff758c);
  color: white;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  transition: background 0.3s ease;
  margin-top: 1rem; /* Tạo khoảng cách với input */
}

.login-button:hover {
  background: linear-gradient(90deg, #ff758c, #ff7eb3);
}

.login-status {
  color: red;
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1rem;
  font-weight: 600;
}
</style>
