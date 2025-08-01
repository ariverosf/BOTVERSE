import { createRouter, createWebHistory } from "vue-router";
import Home from "../App.vue";
import ProjectDetail from "../views/ProjectDetail.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/project/:id", component: ProjectDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
