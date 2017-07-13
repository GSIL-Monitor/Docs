<template>
<div class="tab" :class="classes">
  <slot></slot>
</div>
</template>

<style scoped>
.tab-item.active {
  color:  #ed8e07 !important;
}
.tab-item.inactive {
}
</style>

<script>
import Bus from '../bus';
import cx from 'classnames'

export default {
  props: {
   tabIndex: {
      type: Number,
      default: 0
    },
    defaultCls : {
    	type : String,
    	default: 'active'
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    Bus.$on('setIndex', index => {
      this.activeItemIndex = index;
    });
  },
  data(){
    return {
      activeItemIndex: this.activeIndex
    }
  },
  computed : {
    classes () {
      return cx({
        [this.defaultCls]: this.tabIndex == this.activeItemIndex
      })
    }
  }
}
</script>
