const parentMixin = {
  mounted () {
    this.updateIndex()
  },
  methods: {
    updateIndex () {
      if (!this.$children) return
      this.number = this.$children.length
      let children = this.$children
      for (let i = 0; i < children.length; i++) {
        if (children[i].checked) {
          this.value = children[i].value
        }
      }
    }
  },
  props: {
    value: {
      type: [String,Number],
      default: ""
    }
  },
  watch: {
    index (val, oldVal) {
      this.$children[oldVal].checked = false
      this.$children[val].checked = true
    }
  },
  data () {
    return {
      number: this.$children.length
    }
  }
}


export {
  parentMixin
}

