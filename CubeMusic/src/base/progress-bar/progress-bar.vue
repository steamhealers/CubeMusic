<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress">
      </div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn" ref="progressBtn"  @touchstart="progressTouchStart" @touchmove.prevent="progressTouchMove" @touchend.prevent="progressTouchEnd"></div>
      </div>
    </div>
  </div>
</template>

<script>
const PROGRESS_BTN_WIDTH = 16
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(Math.max(this.touch.left + deltaX, 0), this.$refs.progressBar.clientWidth)
      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._trigglePrecent()
    },
    _trigglePrecent() {
      const barWidth = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      this._offset(e.pageX - PROGRESS_BTN_WIDTH / 2 - rect.left)
      this._trigglePrecent()
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const width = this.$refs.progressBar.clientWidth - PROGRESS_BTN_WIDTH
        const offsetWidth = newPercent * width
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>