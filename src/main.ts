import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "primeicons/primeicons.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import ToastService from "primevue/toastservice";
import FocusTrap from "primevue/focustrap";
import { createPinia } from "pinia";
import { setupInterceptors } from "@/api/setupInterceptors";

const app = createApp(App);

app.use(createPinia());
setupInterceptors();
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
});
app.use(ToastService);
app.directive("focustrap", FocusTrap);

app.mount("#app");
