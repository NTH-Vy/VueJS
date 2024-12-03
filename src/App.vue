<template>
  <div class="app">
    <Sidebar v-if="isAuthenticated" />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "./components/Sidebar.vue";

export default {
  components: {
    Sidebar,
  },
  computed: {
    isAuthenticated() {
      return this.getAuthenticatedUser() !== null;
    },
  },
  methods: {
    getAuthenticatedUser() {
      try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
      } catch (e) {
        console.error("Failed to parse user data:", e);
        return null;
      }
    },
  },
};
</script>

<style scoped>
.app {
  display: flex;
}

.main-content {
  flex: 1;
  background: #f9f9f9;
  min-height: 100vh;
  padding: 20px;
}
</style>
