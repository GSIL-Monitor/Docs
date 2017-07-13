<template>
  <div class="wux-tab-item" :class="[currentSelected ? activeClass : '', {'wux-tab-selected': currentSelected}]" :style="style" @click="onItemClick">
    <slot></slot>
  </div>
</template>

<script>
import { childMixin } from '../mixins/multi-items'

export default {
  mixins: [childMixin],
  props: {
    activeClass: String
  },
  mounted(){
  },
  computed: {
    style () {
      return {
        borderWidth: this.$parent.lineWidth + 'px',
        borderColor: this.$parent.activeColor,
        color: this.currentSelected ? this.$parent.activeColor : this.$parent.defaultColor,
        border: this.$parent.animate ? 'none' : 'auto'
      }
    }
  }
}
</script>
