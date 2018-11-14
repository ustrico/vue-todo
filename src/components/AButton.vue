<template>
  <button
    :type="aType || 'button'"
    :class="cClass"
    @click="aType ? null : $emit('aClick')"
  >
    {{ aValue }}
  </button>
</template>

<script>
export default {
  name: 'AButton',
  data () {
    return {}
  },
  props: ['aType', 'aClass', 'aValue'],
  computed: {
    cClass () {
      let ret = 'todo__button'
      let icon = 'todo__icon'
      if (!this.aClass) return ret
      if (~this.aClass.indexOf(icon)) ret = icon
      ret += ' ' + this.aClass
      return ret
    }
  }
}
</script>

<style>
  .todo__button {
    color: rgba(0, 200, 170, 1);
    user-select: none;
    border-radius: 2px;
    font-weight: 700;
    text-transform: uppercase;
    margin: 0;
    padding: .5em 1em;
    display: inline-block;
    overflow: hidden;
    outline: none;
    background: transparent;
    border: 0;
    transition: all .4s ease;
    text-decoration: none;
    white-space: nowrap;
    min-width: 70px;
    box-sizing: border-box;
  }

  .todo__button:not([disabled]) {
    cursor: pointer;
  }

  .todo__button:hover, .todo__button:active {
    background-color: rgba(255, 255, 255, .1);
  }

  .todo__button_mute {
    color: rgba(255, 255, 255, .5);
  }
</style>
