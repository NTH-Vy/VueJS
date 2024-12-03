// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')
// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";

// const app = createApp(App);

// app.use(router);
// app.mount("#app");
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (to.path !== "/login" && (!user || user.role !== "admin")) {
    alert("Bạn không có quyền truy cập.");
    next("/login");
  } else {
    next();
  }
});

createApp(App).use(router).mount("#app");
