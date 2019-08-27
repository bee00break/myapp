import Vue from "vue";
import Router from "vue-router";
import firebase from 'firebase'

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Top",
      component: () =>
        import(/* login */ "./views/Top.vue")
    },
    {
      path: "/entry",
      name: "Entry",
      component: () =>
        import(/* entry */ "./views/Entry.vue")
    },
    {
      path: "/mypage",
      name: "Mypage",
      meta: { requiresAuth: true },//loginしてないと見れない
      component: () =>
        import(/* mypage */ "./views/Mypage.vue")
    },
    {
      path: "/map",
      name: "Map",
      component: () =>
        import(/* map */ "./views/Map.vue")
    },
  ]
});

//ログイン判定
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        next()
      } else {//ログインしていなければTopへ
        next({
          path: '/'
        })
      }
    })
  } else {
    next() // next() を常に呼び出すみたい
  }
})

export default router