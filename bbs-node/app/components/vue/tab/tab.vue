<template>
  <div class="wux-tab" :class="{'wux-tab-no-animate': !animate}">
    <slot></slot>
    <div v-if="animate" class="wux-tab-ink-bar" :class="barClass" :style="barStyle"></div>
  </div>
</template>

<script>
import util from '../util/'
import { parentMixin } from '../mixins/multi-items'

export default {
  mixins: [parentMixin],
  mounted () {
    var that = this;
    // stop bar anmination on first loading
    setTimeout(() => {
      this.hasReady = true
      // that.activeColor = util.getStyle(that.$el.querySelector('.wux-tab-selected'),"color");
    }, 0)

    
  },
  props: {
    lineWidth: {
      type: Number,
      default: 3
    },
    activeColor: {
      type: String
    },
    defaultColor: {
      type: String,
      default: '#666'
    },
    animate: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    barLeft () {
      return `${this.index * (100 / this.number)}%`
    },
    barRight () {
      return `${(this.number - this.index - 1) * (100 / this.number)}%`
    },
    barStyle () {
      return {
        left: this.barLeft,
        right: this.barRight,
        display: 'block',
        backgroundColor: this.activeColor,
        height: this.lineWidth + 'px',
        transition: !this.hasReady ? 'none' : ''
      }
    },
    barClass () {
      return {
        'wux-tab-ink-bar-transition-forward': this.direction === 'forward',
        'wux-tab-ink-bar-transition-backward': this.direction === 'backward'
      }
    }
  },
  watch: {
    index (newIndex, oldIndex) {
      this.direction = newIndex > oldIndex ? 'forward' : 'backward'
      this.$emit('on-index-change', newIndex)
    }
  },
  data () {
    return {
      direction: 'forward',
      right: '100%',
      hasReady: false
    }
  }
}
</script>
<style lang="less">
@import '../styles/variable.less';

@easing-in-out: cubic-bezier(0.35, 0, 0.25, 1);
@effect-duration: .3s;

.wux-tab{
  color:@tab-item-color;
  &-ink-bar {
    position: absolute;
    height: 2px;
    bottom: 0;
    left: 0;

    &-transition-forward {
      transition: right @effect-duration @easing-in-out,
      left @effect-duration @easing-in-out;
    }
    &-transition-backward {
      transition: right @effect-duration @easing-in-out,
      left @effect-duration @easing-in-out;
    }
  }

}

.wux-tab {
  display: flex;
  background-color: #fff;
  height: 44px;
  position: relative;
}
.wux-tab button {
  padding: 0;
  border: 0;
  outline: 0;
  background: 0 0;
  appearance: none;
}
.wux-tab .wux-tab-item {
  display: block;
  flex: 1;
  width: 100%;
  height: 100%;
  font-size: 14px;
  text-align: center;
  line-height: 44px;
  color: @tab-item-color;
}
.wux-tab .wux-tab-item.wux-tab-selected {
  color: @tab-selected-bd-color;
  border-bottom: 3px solid @tab-selected-bd-color;
}

.wux-tab.wux-tab-no-animate .wux-tab-item.wux-tab-selected {
  background: 0 0;
}


</style>
