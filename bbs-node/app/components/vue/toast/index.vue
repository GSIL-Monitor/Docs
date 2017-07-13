<template>
<div>
	<div class="mask_transparent" v-if="show"></div>

  <transition name="toast">
  	<div class="toast" :class="classes" v-if="show">
  		<i class="wux-icon-toast" v-if="type !== 'text'"></i>
      <p class="weui_toast_content" v-if="text" v-html="text"></p>
      <p class="weui_toast_content" v-else><slot></slot></p>
  	</div>
  </transition>
</div>
</template>
<script>

import cx from 'classnames'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    time: {
      type: Number,
      default: 300000
    },
    type: {
      type: String,
      default: 'text'
    },
    prefixCls: {
      type: String,
      default: 'wux-toast'
    },
    text : String
  },
  watch: {
    show: function (val) {
      const _this = this
      if (val) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(function () {
          _this.show = false

        }, _this.time)
      }
    }
  },
  computed : {
    classes () {
      return cx({
        [this.className]: !!this.className,
        [`${this.prefixCls}-${this.type}`]: !!this.type
      })
    }
  }
}
</script>
<style lang="less">

.checkmark(@color: #454545;@bg: #bcbcbc){
  position: relative;
  border-radius: 50%;
  background-color: @bg;
  border:1px solid @bg;
  &:after{
    content: '';
    position: absolute;
    width: 30%;
    height: 60%;
    left:50%;
    top:50%;
    margin-top: -2px;
    border: solid @color;
    border-width: 0 2px 2px 0;
    transform: translate3d(-50%,-50%,0) rotate(45deg);
  }
}

.cross(@color:#454545;@bg:transparent){
  position: relative;
  border-radius: 50%;
  border:1px solid @bg;
  background-color: @bg;
  &:before,&:after{
    content: '';
    position: absolute;
    width: 60%;
    height: 1px;
    background: @color;
    left: 50%;
    top: 50%;
  }
  &:before{
    transform: translateX(-50%) rotate(-45deg);
  }
  &:after{
    transform:  translateX(-50%) rotate(45deg);
  }
}

.mask_transparent {
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.toast{
  position: absolute;
  z-index: 2;
  line-height: 1;
  top:50%;
  left:50%;
  font-size: 16px;
  min-width: 130px;
  width:auto;
  background: rgba(0, 0, 0, 0.7);
  transform:translateX(-50%) translateY(-50%);
  color:#fff;
    text-align: center;
    border-radius: 8px;
    padding: 20px;
    opacity:1;
    transition:opacity .3s linear;
}

.wux-icon-toast{
  padding-right: 0;
  line-height: 1;
  display: inline-block;
  margin-bottom: 16px;
}

.toast .weui_toast_content {
  margin: 0;
  white-space: nowrap;
}

.toast-leave-active,.toast-enter{
  opacity:0;
}

.wux-toast-success{
  .wux-icon-toast{
    width:32px;
    height: 32px;
    .checkmark();
  }
}

.wux-toast-fail{
  .wux-icon-toast{
    width:32px;
    height: 32px;
    .cross(#fff,#bcbcbc);
  }
}

.wux-toast-loading{
  .wux-icon-toast{
    transform-origin:50% 50%; 
  }
  .wux-icon-toast {
      display: inline-block;
      border: 2px solid;
      border-color: transparent #FFF #FFF #FFF;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: rotate 0.75s 0s linear infinite;

      &:before{
        content : ""
      }
  }
}



</style>