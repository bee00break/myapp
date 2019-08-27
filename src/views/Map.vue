<template>
  <main class="p-map">
    <h2 class="userName" v-show="flag">{{userName}}さんのページ</h2>
    <div class="maplogin" v-show="!flag">
      <input type="text" class="maplogin__input" placeholder="メールアドレス" v-model="mailAddress" />
      <input type="password" class="maplogin__input" placeholder="パスワード" v-model="password" />
      <button type="button" class="maplogin__btn" @click="logIn">ログイン</button>
    </div>
    <div class="mapWrap">
      <iframe src="https://www.google.com/maps/d/embed?mid=1L0f_89dRcZGh7fjbnysyJKh8Cis&hl=ja?mid=1L0f_89dRcZGh7fjbnysyJKh8Cis&ll=35.50452294845212%2C139.4810012503466&z=10" width="640" height="480"></iframe>
    </div>
    <button type="button" class="back">
      <router-link to="/mypage" class="back__txt">戻る</router-link>
    </button>
  </main>
</template>
<script>
import firebase from "firebase";

export default {
  name: "Map",
  data() {
    return {
      mailAddress: "",
      password: ""
    };
  },
  computed: {
    flag(){
      return this.$store.state.isSignIn
    },
    userName(){//ユーザー名取得
      if(this.$store.state.isSignIn){
        return this.$store.state.user.email;
      }else{
        return '';
      }
    },
  },
  methods:{
    logIn(){
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
      })
      .catch((error) => {//ログイン失敗
        alert(error.message);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
  .userName{
    font-size: 20px;
    margin-top: 30px;
  }
  .maplogin{
    margin-top: 30px;
    display: flex;
    justify-content: center;
    @include sp{
      display: block;
    }
    &__input{
      display: block;
      font-size: 12px;
      padding: .3em;
      background: #fff;
      margin-right: .3em;
      width: 160px;
      @include sp{
        margin: 0 auto;
        width: 260px;
        line-height: 1.6;
      }
      &:nth-of-type(2){
        @include sp{
          margin-top: 10px;
        }
      }
    }
    &__btn{
      width: 100px;
      padding: .25em .3em;
      font-size: 11px;
      background: #fff;
      border: solid 1px #eee;
      @include sp{
        margin-top: 10px;
      }
    }
  }
  .mapWrap{
    margin-top: 30px;
    padding: 0 10px;
    iframe{
      max-width: 640px;
      width: 96%;
    }
  }
  .back{
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
    &__txt{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>