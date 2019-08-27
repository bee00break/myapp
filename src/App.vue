<template>
  <div id="app" class="app">
    <div class="app__inner">
      <header>
        <h1 class="mainTtl">横浜周辺スーパー銭湯APP</h1>
      </header>
      <router-view />
    </div>
  </div>
</template>

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
@mixin vw($size) {
  font-size: ($size/2)*1px;
  font-size: ($size/767*100)*1vw;
}
.app{
  font-family: 'M PLUS Rounded 1c', sans-serif;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(to top, #b2fefa 10%, #fff); 
  width: 100%;
  min-height: 100vh;
  height: 100%;
  &__inner{
    max-width: 1000px;
    position: relative;
    padding-bottom: 30px;
  }
}
.mainTtl{
  padding-top: 60px;
  font-size: 32px;
  @include sp{
    font-size: 28px;
  }
  &::before{
    content: '';
    display: inline-block;
    background: url('~@/assets/icon.png') no-repeat;
    background-size: 100% auto;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    margin-right: .3em;
 }
}
.mapBtn{
  display: inline-block;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  background: #fff;
  margin: 30px 20px 0 auto;
  border: solid 2px #191970;
  translate: opacity .3s;
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
