<template>
  <div class="sidebar">
    <div class="profile">
      <img
        src="https://i.pinimg.com/736x/8f/6c/56/8f6c56d97403d930c437c8e5339efc4c.jpg"
        alt="User Avatar"
        class="avatar"
      />
      <p class="name">LARISSA</p>
      <p class="role">Quản Trị Viên</p>
    </div>
    <ul class="nav">
      <li
        class="nav-item"
        :class="{ active: isActive('/') }"
        @click="navigate('/')"
      >
        <i class="fas fa-tachometer-alt"></i>
        <span>Tổng Quan</span>
      </li>
      <li
        class="nav-item"
        :class="{ active: isActive('/customers') }"
        @click="navigate('/customers')"
      >
        <i class="fas fa-users"></i>
        <span>Khách Hàng</span>
      </li>
      <li
        class="nav-item"
        :class="{ active: isActive('/products') }"
        @click="navigate('/products')"
      >
        <i class="fas fa-box"></i>
        <span>Sản Phẩm</span>
      </li>
      <li
        class="nav-item"
        :class="{ active: isActive('/orders') }"
        @click="navigate('/orders')"
      >
        <i class="fas fa-shopping-cart"></i>
        <span>Đơn Hàng</span>
      </li>
      <li
        class="nav-item"
        :class="{ active: isActive('/statistics') }"
        @click="navigate('/statistics')"
      >
        <i class="fas fa-chart-bar"></i>
        <span>Thống Kê</span>
      </li>
    </ul>
    <div class="logout" @click="handleAuthAction">
      <i
        class="fas"
        :class="isLoggedIn ? 'fa-sign-out-alt' : 'fa-sign-in-alt'"
      ></i>
      <span>{{ isLoggedIn ? "Đăng Xuất" : "Đăng Nhập" }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  name: "Header",
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("user"), // Kiểm tra trạng thái đăng nhập
    };
  },
  methods: {
    navigate(route) {
      this.$router.push(route);
    },
    isActive(route) {
      return this.$route.path === route;
    },
    handleAuthAction() {
      if (this.isLoggedIn) {
        // Xử lý đăng xuất
        localStorage.removeItem("user");
        this.isLoggedIn = false;
        this.$router.push("/login"); // Chuyển hướng đến trang đăng nhập
      } else {
        // Xử lý chuyển đến trang đăng nhập
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 200px;
  background: linear-gradient(120deg, #f78fb3, #ffda79);
  min-height: 100vh;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: "Poppins", sans-serif;
  color: #ffffff;
}

/* Profile Section */
.profile {
  text-align: center;
  margin-bottom: 15px;
}

.avatar {
  border-radius: 50%;
  width: 60px;
  height: 60px;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 6px;
  background: linear-gradient(90deg, #ffd700, #ff639c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.role {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 3px;
}

/* Navigation Menu */
.nav {
  list-style: none;
  padding: 0;
  margin-top: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(2px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.25);
  color: #ffd700;
}

.nav-item i {
  margin-right: 8px;
  font-size: 16px;
  color: #ffffff;
}

.nav-item span {
  font-size: 0.85rem;
  font-weight: 500;
  color: #ffffff;
}

.logout {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 500;
}

.logout i {
  margin-right: 8px;
  font-size: 16px;
  color: #ffffff;
}

.logout:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(2px);
}
</style>
