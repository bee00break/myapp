<template>
  <main class="p-top">
    <section class="login">
      <h2 class="login__ttl">ログイン</h2>
      <div class="login__input">
        <label for="loginMail" class="inputTxt">メールアドレス</label>
        <input type="text" class="input" id="loginMail" v-model="mailAddress">
        <label for="loginPass" class="inputTxt">パスワード</label>
        <input type="password" class="input" id="loginPass" v-model="password">
      </div>
      <button class="login__btn" @click="logIn">ログイン</button>
    </section>
    <div class="entry">
      <p class="entry__ttl">アカウントを持ってない方は</p>
      <router-link to="/entry" class="entry__btn">こちら</router-link>
    </div>
    <button type="button" class="mapBtn">
      <router-link to="/map" class="mapBtn__txt">銭湯<br>マップ</router-link>
    </button>
  </main>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Top",
  data(){
    return {
      mailAddress: "",
			password: "",
    };
  },
  creadted(){
    const user = firebase.auth().currentUser;
    if (user != null) {//loginしてたらmypageへ
      this.$router.push("mypage");
    }
  },
  methods: {
    logIn() {
      firebase.auth().signInWithEmailAndPassword(this.mailAddress, this.password)
      .then(() => {//ログイン成功
        console.log('ログインしました');
        let user = firebase.auth().currentUser;
        if (user != null) {
          user = user ? user : {};
          const { uid, email } = user;
          this.$store.commit('setUser', user);
          this.$store.commit('setSignIn', user.uid ? true : false);
        }
        this.$router.push("mypage");
      })
      .catch((error) => {//ログイン失敗
        alert(error.message);
      });
    }
	},
};
</script>

<style lang="scss">
  @mixin sp {
    @media print, screen and (max-width: 767px) {
      @content;
    }
  }
  @mixin pc {
    @media print, screen and (min-width: 767px) {
      @content;
    }
  }
  .login{
    &__ttl{
      font-size: 20px;
      margin-top: 45px;
    }
    &__input{
      display: block;
      margin: 30px auto 0;
      width: 240px;
      .inputTxt{
        display: block;
        font-size: 14px;
        margin-top: 20px;
      }
      .input{
        display: block;
        background: #fff;
        font-size: 14px;
        padding: .3em;
        width: 100%;
        margin-top: .5em;
      }
    }
    &__btn{
      display: block;
      width: 200px;
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      line-height: 1.8;
      margin: 30px auto 0;
      background: #fff;
      border-top: solid 4px #191970;
      border-bottom: solid 4px #191970;
      transition: opacity .3s;
      &:hover{
        @include pc{
          opacity: .6;
        }
      }
    }
  }
  .entry{
    font-size: 14px;
    margin-top: 45px;
    display: flex;
    justify-content: center;
    &__btn{
      text-decoration: underline;
      &:hover{
        @include pc{
          text-decoration: none;
        }
      }
    }
  }
</style>
