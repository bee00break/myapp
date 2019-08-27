<template>
  <main class="p-mypage">
    <h2 class="userName">{{userName}}さんのページ</h2>
    <div class="myBtns">
      <button type="button" class="myBtns__item" @click="logout()">ログアウト</button>
      <button type="button" class="myBtns__item" @click="modal=!modal">会員削除</button>
    </div>
    <div class="modal" :class="{active:modal}">
      <div class="modal__cont">
        <p class="contMsg">アカウントとデータが完全に削除されますが、<br>よろしいですか？</p>
        <div class="myBtns">
          <button type="button" class="myBtns__item" @click="deleted()">削除する</button>
          <button type="button" class="myBtns__item" @click="modal=!modal">やめる</button>
        </div>
      </div>
      <div class="modal__overlay" @click="modal=!modal"></div>
    </div>
    <div class="addStore">
      <p class="addStore__ttl">店舗追加</p>
      <div class="addStore__wrap">
        <label class="addStore__item">
          店舗名
          <input type="text" class="input" v-model="newStoreName">
        </label>
        <label class="addStore__item">
          Url
          <input type="text" class="input" v-model="newStoreLink">
        </label>
        <button type="submit" class="addStore__btn" @click="addStore()">店舗追加</button>
      </div>
    </div>
    <nav class="listNav">
      <button type="button" class="listNav__item" @click="showType = 'all'" :class="{active:showType == 'all'}">すべて</button>
      <button type="button" class="listNav__item" @click="showType = 'favorite'" :class="{active:showType == 'favorite'}">よく行く</button>
      <button type="button" class="listNav__item" @click="showType = 'sort'" :class="{active:showType == 'sort'}">評価順</button>
    </nav>
    <div class="storeList">
      <ul class="storeList__inner">
        <li v-for="(data, key) in filterdStore" :key="`no${key}`" class="listItem">
          <div class="listItem__name">
            <input type="checkbox" :id="`no${key+0}`" v-model="data.favorite" @change="updateDate(data,key)">
            <label :for="`no${key+0}`" class="storeName"> 
            {{ data.name }}
            </label>
            <a :href="data.link" class="storeLink" target="_blank" v-show="data.link!=='no'">
              <img src="@/assets/link.png" alt="">
            </a>
          </div>
          <div class="listItem__rate">
            <input :id="`no${key+1}`" type="radio" :name="`no${key}`" value="5" v-model="data.rate" @change="updateDate(data,key)">
            <label :for="`no${key+1}`">★</label>
            <input :id="`no${key+2}`" type="radio" :name="`no${key}`" value="4" v-model="data.rate" @change="updateDate(data,key)">
            <label :for="`no${key+2}`">★</label>
            <input :id="`no${key+3}`" type="radio" :name="`no${key}`" value="3" v-model="data.rate" @change="updateDate(data,key)">
            <label :for="`no${key+3}`">★</label>
            <input :id="`no${key+4}`" type="radio" :name="`no${key}`" value="2" v-model="data.rate" @change="updateDate(data,key)">
            <label :for="`no${key+4}`">★</label>
            <input :id="`no${key+5}`" type="radio" :name="`no${key}`" value="1" v-model="data.rate" @change="updateDate(data,key)">
            <label :for="`no${key+5}`">★</label>
          </div>
        </li>
      </ul>
    </div>
    <button type="button" class="mapBtn">
      <router-link to="/map" class="mapBtn__txt">銭湯<br>マップ</router-link>
    </button>
  </main>
</template>

<script>
import firebase from "firebase";

export default {
  name: "mypage",
  data() {
    return {
      database: null,
      newStoreName: null,
      newStoreLink: null,
      storeLink: null,
      showType: "all",
      stores: [],
      modal: false,
    };
  },
  created(){
    this.database = firebase.database();
    this.uid = firebase.auth().currentUser.uid;
    this.storeRef = this.database.ref(this.uid+'/store/');//storeへのアクセス
    this.storeRef.on("value", (snapshot) => {//データ取得 初回・更新
      if(snapshot.val()==null){
        const storeJson = require(`./store.json`)
        this.storeRef.set(storeJson) //DBにjsonデータをセット
      }else{
        this.stores = snapshot.val(); //stores更新
      }
    });
  },
  computed: {
		userName(){//ユーザー名取得
      const user = firebase.auth().currentUser;
      return user.email;
    },
    filterdStore() {
      if(this.showType == "all"){
        return this.stores;
      }else if(this.showType == "favorite"){
        const filterStore = {};
        for (let key in this.stores){
          if(this.stores[key].favorite == true){
            filterStore[key] = this.stores[key]
          }
        }
        return filterStore;
      }else{
        const filterStore = [];
        for (let key in this.stores){
          filterStore[key]=this.stores[key]
        };
        return Object.values(filterStore).sort((a,b)=>{
          return (a.rate < b.rate) ? 1 : (a.rate > b.rate) ? -1 : 0;
        })
      }
    } 
  },
  methods:{
    logout(){//ログアウト
      firebase.auth().signOut().then(()=>{
        console.log("ログアウトしました");
        this.$store.commit('setUser', {});
        this.$store.commit('setSignIn', false);
      })
      .catch((error)=>{
        alert(`ログアウト時にエラーが発生しました (${error})`);
      });
    },
    deleted(){//ユーザー・DB削除
      const user = firebase.auth().currentUser;
      user.delete().then(()=>{//ユーザー削除
        console.log("ユーザーを削除しました");
      }).catch((error)=>{
        console.log(`ユーザーを削除時にエラーが発生しました (${error})`);
      });
      this.storeRef.remove()//DB削除
    },
    addStore(){//店舗追加
      if (this.newStoreName == "") {
        return;
      }else if(this.newStoreLink == null){
        this.storeRef.push({
          name: this.newStoreName,
          favorite: false,
          rate: 0,
          link: 'no'
        });
      }else{
        this.storeRef.push({
          name: this.newStoreName,
          favorite: false,
          rate: 0,
          link: this.newStoreLink
        });
      }
      this.newStoreName = "";
      this.newStoreLink = "";
    },
    updateDate(data, key){//お気に入りの更新
      const updates = {};
      updates[key] = data;
      console.log(key);
      this.storeRef.update(updates);
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
  @mixin vw($size) {
    font-size: ($size/2)*1px;
    font-size: ($size/767*100)*1vw;
  }
  .userName{
    font-size: 20px;
    margin-top: 30px;
  }
  .myBtns{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    &__item{
      width: 100px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 11px;
      background: #fff;
      border: solid 1px #eee;
      &:nth-of-type(2){
        margin-left: 10px;
      }
    }
  }
  .modal{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 10;
    &.active{
      display: flex;
    }
    &__cont{
      width: 400px;
      height: 100px;
      background: #fff;
      border-radius: 15px;
      padding: 40px 20px;
      .contMsg{
        font-size: 16px;
        line-height: 1.6;
      }
      .myBtns{
        margin-top: 26px;
      }
    }
    &__overlay{
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      opacity: .6;
      z-index: -1;
    }
  }
  .addStore{
    margin-top: 45px;
    &__ttl{
      font-size: 16px;
    }
    &__wrap{
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      @include sp{
        display: block;
      }
    }
    &__item{
      font-size: 11px;
      text-align: left;
      display: block;
      width: 160px;
      margin-right: .3em;
      @include sp{
        margin: 0 auto;
        width: 260px;
      }
      .input{
        display: block;
        background: #fff;
        font-size: 13px;
        padding: .3em;
        margin-top: .2em;
        width: 100%;
        @include sp{
          margin: .2em auto 0
        }
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
  .listNav{
    display: flex;
    justify-content: center;
    border-bottom: solid 1px #000;
    width: 600px;
    margin: 60px auto 0;
    @include sp{
      width: 96%;
    }
    &__item{
      width: 200px;
      font-size: 14px;
      border-bottom: solid 2px transparent;
      @include sp{
        width: 32%;
      }
      &.active{
        border-bottom: solid 2px #191970;
      }
    }
  }
  .storeList{
    width: 600px;
    height: 360px;
    overflow: auto;
    background: #fff;
    margin: 0 auto;
    padding: 20px 30px 30px;
    box-sizing: border-box;
    @include sp{
      width: 96%;
    }
    .listItem{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 4em;
      margin-top: 2em;
      &__name{
        display: flex;
        align-items: center;
        .storeName{
          font-size: 15px;
          position: relative;
          text-align: left;
          @include sp{
            font-size: 12px;
          }
          &:before{
            content: '';
            position: absolute;
            top: 0;
            left: -2.4em;
            display: block;
            width: 1em;
            height: 1em;
            border: 1px dashed #bbb;
            border-radius: 50%;
          }
          &:after {
            content: '';
            position: absolute;
            top: 0;
            left: -2em;
            display: block;
            width: 1em;
            height: 1em;
            background: url('~@/assets/flag.png') no-repeat;
            background-size: 100% auto;
            opacity: 0;
            transform: rotateZ(20deg)
          }
        }
        input[type=checkbox]{
          display: none;
        }
        input[type=checkbox]:checked + .storeName:after {
          opacity: 1;
        }
        .storeLink{
          display: inline-block;
          width: 1.5em;
          transition: opacity .3s;
          margin-left: .8em;
          img{
            width: 100%;
          }
          @include pc{
            &:hover{
              opacity: .6s
            }
          }
        }
      }
      &__rate{
        display: flex;
        flex-direction: row-reverse;
        justify-content: center;
        input[type=radio]{
          display: none;
          &:checked ~ label{
            color: #ffcc00;
          }
        }
        label{
          position: relative;
          padding-left: .3em;
          color: gray;
          cursor: pointer;
          font-size: 14px;
          &:hover,&:hover ~ label{
            color: #ffcc00;
          }
        }
      }
    }
  }
</style>