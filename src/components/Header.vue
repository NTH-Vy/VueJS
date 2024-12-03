<template>
  <header class="header">
    <input type="text" class="search-bar" placeholder="Tìm kiếm..." />
    <div class="actions">
      <!-- Icon thông báo -->
      <i class="icon-notification fas fa-bell"></i>

      <!-- Icon cài đặt -->
      <i class="icon-settings fas fa-cog"></i>

      <!-- Menu người dùng -->
      <div class="user-menu">
        <img
          src="https://i.pinimg.com/736x/8f/6c/56/8f6c56d97403d930c437c8e5339efc4c.jpg"
          alt="User"
          class="user-avatar"
        />
        <span class="username">Larissa</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
};
</script>

<style scoped>
/* Header tổng thể */
.header {
  height: 60px;
  background: linear-gradient(120deg, #ffda79, #f78fb3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

/* Thanh tìm kiếm */
.search-bar {
  width: 250px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 15px;
  font-size: 12px;
  color: #555;
  background-color: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-bar:focus {
  border-color: #ffda79;
  box-shadow: 0 0 3px #ffda79;
  outline: none;
}

/* Hành động (icon và user menu) */
.actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Icon thông báo */
.icon-notification {
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.icon-notification:hover {
  color: #ffe066;
}

/* Icon cài đặt */
.icon-settings {
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s ease;
}

.icon-settings:hover {
  color: #ffe066;
}

/* Menu người dùng */
.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Avatar người dùng */
.user-avatar {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border: 1.5px solid #fff;
}

/* Tên người dùng */
.username {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}
</style>
