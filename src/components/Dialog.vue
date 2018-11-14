<template>
  <div class="todo-dialog">
    <div class="todo-dialog__scrim" @click="$emit('close')"></div>
    <div class="todo-dialog-window">
      <form class="todo-form" @submit="$emit('submit')">
        <div class="todo-dialog__head">
          <slot name="head"></slot>
        </div>
        <div class="todo-dialog-body">
          <slot></slot>
        </div>
        <div class="todo-dialog-footer">
          <slot name="footer"></slot>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dialog',
  data () {
    return {
    }
  },
  props: ['options', 'type']
}
</script>

<style>
  .todo-dialog {
    display: flex;
    position: absolute;
    top: 0;
    width: 100vw;
    max-width:100%;
    height: 100vh;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    left: 0;
  }

  .todo-dialog__scrim {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 100%;
    transition: background .4s ease;
    background: rgba(0, 0, 0, .6);
    z-index: 8;
  }

  .todo-dialog-window {
    border-radius: 2px;
    min-width: 700px;
    max-width: 95%;
    background: rgb(60, 66, 66);
    padding: 1em;
    box-sizing: border-box;
    box-shadow: 0 20px 30px rgba(0, 0, 0, .5);
    z-index: 9;
    transform: scale(1);
    opacity: 1;
    transition: all .2s ease .2s;
  }

  .todo-dialog__head {
    font-weight: 700;
    font-size: 2em;
    margin-bottom: 1rem;
  }

  .todo-dialog-footer > * {
    margin-top: 2rem;
    justify-content: flex-end;
    display: flex;
  }

  .todo-dialog-footer__left {
    flex: 5 1;
  }

  .dialog_show-enter-active, .dialog_show-leave-active {
    transition: all .4s ease;
  }

  .dialog_show-enter .todo-dialog__scrim, .dialog_show-leave-to .todo-dialog__scrim {
    background: rgba(0, 0, 0, 0);
    transition: all .2s ease .2s;
  }

  .dialog_show-enter .todo-dialog-window, .dialog_show-leave-to .todo-dialog-window {
    transform: scale(.5);
    opacity: 0;
    transition: all .2s ease;
  }

  @media screen and (max-width: 800px) {
    .todo-dialog-window {
      min-width: 95%;
    }
  }
</style>
