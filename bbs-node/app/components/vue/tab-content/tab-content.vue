<template>
<div class="tabs" :class="classes">
  <slot></slot>
</div>
</template>

<script>
import Bus from '../bus';
import cx from 'classnames'

export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
    className: {
      type: String,
      default: ''
    }
  },
  watch: {
    index (val) {
      Bus.$emit('setIndex', val);
    }
  },
  computed: {
    classes () {
      return cx({
        [this.className]: !!this.className
      })
    }
  }
}
</script>