import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";
require('@/assets/reset.css')

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyCPhhNt2KwmN9BGaVIqEJSY-fzUCWUI7P0",
  authDomain: "myapp-d9f7e.firebaseapp.com",
  databaseURL: "https://myapp-d9f7e.firebaseio.com",
  projectId: "myapp-d9f7e",
  storageBucket: "",
  messagingSenderId: "1017056571775",
  appId: "1:1017056571775:web:78a2020c1162e143"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
