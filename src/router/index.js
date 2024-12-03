import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../components/Dashboard.vue";
import CustomerManager from "../components/CustomerManager.vue";
import ProductManager from "../components/ProductManager.vue";
import OrderManager from "../components/OrderManager.vue";
import Statistics from "../components/Statistics.vue";
import Login from "../views/Login.vue";

const routes = [
  { path: "/", component: Dashboard, meta: { requiresAuth: true } },
  {
    path: "/customers",
    component: CustomerManager,
    meta: { requiresAuth: true },
  },
  {
    path: "/products",
    component: ProductManager,
    meta: { requiresAuth: true },
  },
  { path: "/orders", component: OrderManager, meta: { requiresAuth: true } },
  { path: "/statistics", component: Statistics, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  { path: "/:pathMatch(.*)*", redirect: "/" }, // Chuyển hướng 404 về Dashboard
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem("user");

  // Nếu route yêu cầu xác thực nhưng chưa đăng nhập, chuyển hướng về /login
  if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
    next("/login");
  }
  // Nếu đã đăng nhập mà truy cập /login, chuyển hướng về Dashboard
  else if (to.path === "/login" && user) {
    next("/");
  }
  // Tiếp tục nếu không có yêu cầu đặc biệt
  else {
    next();
  }
});

export default router;
