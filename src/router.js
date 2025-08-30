import Vue from "vue";
import VueRouter from "vue-router";
import MainLayout from "./views/MainLayout.vue";
import Reminders from "./views/Reminders.vue";
import Profile from "./views/Profile.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "reminders", component: Reminders },
      { path: "profile", component: Profile },
    ],
  },
  { path: "*", redirect: "/login" },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/reminders");
  } else {
    next();
  }
});

export default router;
