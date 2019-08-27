<template>
  <main class="p-entry">
    <section class="login">
      <h2 class="login__ttl">新規会員登録</h2>
      <div class="login__input">
        <label for="loginMail" class="inputTxt">メールアドレス</label>
        <input type="text" class="input" id="loginMail" v-model="mailAddress">
        <label for="loginPass" class="inputTxt">パスワード</label>
        <input type="password" class="input" id="loginPass" v-model="password">
      </div>
      <button class="login__btn" @click="entry">会員登録</button>
    </section>
    <div class="entry">
      <p class="entry__ttl">既にアカウントをお持ちの方は</p>
      <router-link to="/" class="entry__btn">こちら</router-link>
    </div>
    <button type="button" class="mapBtn">
      <router-link to="/map" class="mapBtn__txt">銭湯<br>マップ</router-link>
    </button>
  </main>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Entry",
  data(){
    return {
      mailAddress: "",
			password: "",
    };
  },
  methods: {
    entry() {
      firebase.auth().createUserWithEmailAndPassword(this.mailAddress, this.password)
      .then(() => {//成功
        this.success();
      })
      .catch((error) => {//失敗
        alert(error.message);
      });
    },
    success() {
      let user = firebase.auth().currentUser;
      if (user != null) {
				alert(`ようこそ${user.email}さん!`);
			  user = user ? user : {};
        const { uid, email } = user;
        this.$store.commit('setUser', user);
        this.$store.commit('setSignIn', user.uid ? true : false);
				this.$router.push('mypage') 
      }
    }
  }
};
</script>