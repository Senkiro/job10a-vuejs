import CompanyChange from "@/views/CompanyChange.vue";
import HomeView from "@/views/HomeView.vue";
import Job10a from "@/views/job10a/Job10a.vue";
import Job30 from "@/views/job30/Job30.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/company-change",
      name: "CompanyChange",
      component: CompanyChange,
    },
    {
      path: "/job10a",
      name: "job10a",
      component: Job10a,
    },
    {
      path: "/job30",
      name: "job30",
      component: Job30,
    },
  ],
});

export default router;
