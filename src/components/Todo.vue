<template>
  <div class="todo" @keyup.esc="dialogCloseHandle" tabindex="0">

    <p v-if="itemsReverse.length">
      <label class="todo-switch">
        <input type="checkbox" v-model="dialog.hide" @change="lsTodo">
        <div class="todo-switch__text">Hide done</div>
      </label>
    </p>

    <div class="todo-list">

      <transition-group name="show">

        <div class="todo-row todo-row_th" v-if="true" key="0">
          <div class="todo__item todo__item_id">ID</div>
          <div class="todo__item todo__item_name">Name</div>
          <div class="todo__item todo__item_date">Date</div>
          <div class="todo__item todo__item_status">Status</div>
          <div class="todo__item todo__item_actions">Actions</div>
        </div>

        <div class="todo-row"
             v-for="item in itemsReverse" :key="item.id"
             :class="{'todo-row_done': item.status}"
             v-if="!item.status || !dialog.hide">
          <div class="todo__item todo__item_id" v-html="item.id"></div>
          <div class="todo__item todo__item_name">{{ item.name }}</div>
          <div class="todo__item todo__item_date" v-html="viewDate(item.date)"></div>
          <div class="todo__item todo__item_status">
            <label class="todo-checkbox" title="Done">
              <input type="checkbox" v-model="item.status" @change="lsTodo">
              <div class="todo-checkbox__text"></div>
            </label>
          </div>
          <div class="todo__item todo__item_actions">
            <div class="todo__icon todo__icon_edit sm_hidden" title="Edit" @click="itemEditHandle(item.id)"></div>
            <div class="todo__icon todo__icon_trash sm_hidden" title="Delete" @click="itemDeleteHandle(item.id)"></div>
            <div class="todo__icon todo__icon_more todo__icon_morev sm_visible" title="Edit"
                 @click="itemEditHandle(item.id)"></div>
          </div>
        </div>

      </transition-group>

    </div>

    <div class="todo-add">
      <div class="todo-add__button" @click="dialogAddHandle">
        <div class="todo__icon todo__icon_add" title="Add"></div>
      </div>
    </div>

    <div class="todo-dialog" :class="{'todo-dialog_show': dialog.show}" @click="dialogOverlayHandle">
      <div class="todo-dialog-window">
        <form class="todo-form" @submit.prevent="dialogSaveHandle">
          <div class="todo-dialog__head" v-html="dialog.id ? 'Edit' : 'Add'"></div>
          <div class="todo-dialog-body">
            <div class="todo-form-field">
              <label class="todo-form__label" for="date">Date</label>
              <input type="date" id="date" class="todo-form__input" v-model="dialog.date">
            </div>
            <div class="todo-form-field">
              <label class="todo-form__label" for="name">Name</label>
              <input type="text" id="name" class="todo-form__input" v-model="dialog.name">
            </div>
          </div>
          <div class="todo-dialog-footer">
            <div class="todo-dialog-footer__trash">
              <div v-if="dialog.id" class="todo__icon todo__icon_trash" title="Delete"
                 @click="dialogItemDeleteHandle"></div>
            </div>
            <button type="reset" class="todo-button todo-button_mute" @click="dialogCloseHandle">Cancel</button>
            <button type="submit" class="todo-button">Save</button>
          </div>
        </form>
      </div>
    </div>

    <div class="todo-dialog" :class="{'todo-dialog_show': dialog.delete}" @click="dialogOverlayHandle">
      <div class="todo-dialog-window">
        <form class="todo-form" @submit.prevent="dialogCloseHandle">
          <div class="todo-dialog__head">Delete</div>
          <div class="todo-dialog-body">
            <p>
              Delete "{{ dialog.name }}"?
            </p>
          </div>
          <div class="todo-dialog-footer">
            <button type="submit" class="todo-button todo-button_mute">Cancel</button>
            <button class="todo-button" @click.prevent="dialogDeleteHandle">Delete</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Todo',
  data () {
    return {
      items: {},
      dialog: {
        hide: false,
        show: false,
        delete: false
      }
    }
  },
  computed: {
    itemsReverse () {
      let ret = []
      for (let id in this.items) {
        let item = this.items[id]
        item.id = id
        ret.push(item)
      }
      return ret.reverse()
    }
  },
  methods: {
    lsTodo () {
      this.$ls.set('todo', {
        dialog: this.dialog,
        items: this.items
      })
    },
    viewDate (str = null) {
      let date = str ? new Date(str) : new Date()
      return date.toISOString().slice(0, 10)
    },
    itemEditHandle (id = 0) {
      this.dialogAddHandle()
      if (!this.items[id]) return
      this.$set(this.dialog, 'id', id)
      this.$set(this.dialog, 'date', this.viewDate(this.items[id].date))
      this.$set(this.dialog, 'name', this.items[id].name)
    },
    itemDeleteHandle (id = 0) {
      if (!this.items[id]) return
      this.$set(this.dialog, 'id', id)
      this.$set(this.dialog, 'name', this.items[id].name)
      this.$set(this.dialog, 'show', false)
      this.$set(this.dialog, 'delete', true)
    },
    dialogItemDeleteHandle () {
      this.itemDeleteHandle(this.dialog.id)
    },
    dialogAddHandle () {
      this.$set(this.dialog, 'id', 0)
      this.$set(this.dialog, 'date', this.viewDate())
      this.$set(this.dialog, 'name', '')
      this.$set(this.dialog, 'status', false)
      this.$set(this.dialog, 'show', true)
      document.getElementById('name').focus()
    },
    dialogCloseHandle (e = null) {
      if (e) e.preventDefault()
      this.$set(this.dialog, 'show', false)
      this.$set(this.dialog, 'delete', false)
    },
    dialogSaveHandle () {
      let id = this.dialog.id
      if (!id) {
        let ids = Object.keys(this.items)
        id = (ids.length) ? +ids.pop() + 1 : 1
      }
      let date = Date.parse(this.dialog.date) || null
      date = date ? new Date(date) : new Date()
      this.$set(this.items, id, {
        date: date,
        name: this.dialog.name.trim(),
        status: this.dialog.status
      })
      this.lsTodo()
      this.dialogCloseHandle()
    },
    dialogDeleteHandle () {
      let id = this.dialog.id
      if (!this.items[id]) return
      this.$delete(this.items, id)
      this.lsTodo()
      this.dialogCloseHandle()
    },
    dialogOverlayHandle (e) {
      if (e && ~e.srcElement.classList.value.indexOf('todo-dialog_show')) this.dialogCloseHandle()
    }
  },
  created () {
    let todo = this.$ls.get('todo') || {items: {}, dialog: {hide: false}}
    this.items = todo.items
    this.dialog.hide = todo.dialog.hide
  }
}
</script>

<style>

  .todo {
    max-width: 800px;
    margin: 2em auto 5em;
    outline: 0;
  }

  .todo-list {
    background-color: rgba(255, 255, 255, .2);
    border-radius: 2px;
  }

  .todo-row {
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, .2);
    transition: all .3s ease;
    transform-origin: 50% 0;
  }

  .todo__item_name {
    flex-grow: 10;
  }

  @supports (display: grid) {
    .todo-row {
      display: grid;
      grid-template-columns: 1fr 5fr 2fr 1fr 1fr;
    }
  }

  .todo-row:last-of-type {
    border-bottom: 0;
  }

  .todo-row_done {
    opacity: .3;
    border-bottom-color: rgba(255, 255, 255, .6);
  }

  .todo-row_th {
    color: rgba(255, 255, 255, .5);
    font-weight: bold;
    font-size: .8em;
    padding: 1em 0;
  }

  .todo__item {
    padding: 1em 1em;
  }

  .todo__item_id {
    text-align: right;
  }

  .todo__item_status, .todo__item_actions {
    text-align: center;
  }

  .todo__item_status .todo-checkbox {
    display: inline-block;
    width: 20px;
    height: 20px;
  }

  /* form */

  .todo-form__label {
    display: block;
    color: rgba(255, 255, 255, .5);
    font-size: .8em;
  }

  .todo-form__input {
    color: #fff;
    padding: 0;
    display: block;
    border: none;
    background: none;
    font-size: 1.2em;
    line-height: 2em;
    height: 2em;
    box-sizing: border-box;
    width: 100%;
    outline: none;
    transition: all .4s ease;
    border-bottom: 1px solid #fff;
  }

  .todo-form__input:focus {
    border-bottom: 1px solid rgb(0, 200, 170);
  }

  .todo-form-field + .todo-form-field {
    margin-top: 2em;
  }

  /* button */

  .todo-button {
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

  .todo-button:not([disabled]) {
    cursor: pointer;
  }

  .todo-button:hover, .todo-button:active {
    background-color: rgba(255, 255, 255, .1);
  }

  .todo-button_mute {
    color: rgba(255, 255, 255, .5);
  }

  /* add */

  .todo-add {
    position: fixed;
    bottom: 1em;
    margin: 1em 0 0 1em;
    width: 4em;
  }

  @supports (position: sticky) {
    .todo-add {
      position: sticky;
    }
    .todo {
      margin-bottom: 0;
    }
  }

  .todo-add__button {
    background-color: rgba(0, 200, 170, 1);
    border-radius: 1em;
    font-size: 2em;
    width: 2em;
    height: 2em;
    text-align: center;
    box-sizing: border-box;
    line-height: 2em;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(0, 0, 0, .5);
    transition: all .4s ease;
  }

  .todo-add__button:hover {
    background-color: rgba(0, 170, 150, 1);
    box-shadow: 0 20px 30px rgba(0, 0, 0, .5);
  }

  /* checkbox */

  .todo-checkbox {
    display: block;
    cursor: pointer;
    position: relative;
  }

  .todo-checkbox input {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }

  .todo-checkbox__text {
    padding-left: 30px;
  }

  .todo-checkbox__text:before {
    content: '';
    position: absolute;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    box-sizing: border-box;
    border: 2px solid rgba(255, 255, 255, .5);
    transition: all .4s ease;
  }

  .todo-checkbox input:checked + .todo-checkbox__text:before {
    background-color: rgba(0, 200, 170, 1);
    border: 2px solid rgba(0, 200, 170, 1);
  }

  .todo-checkbox__text:after {
    content: '';
    position: absolute;
    width: 6px;
    height: 11px;
    top: 1px;
    left: 6px;
    z-index: 1;
    border: 3px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg);
    opacity: 0;
    transition: all .4s ease;
  }

  .todo-checkbox:hover .todo-checkbox__text:after {
    opacity: .5;
  }

  .todo-checkbox input:checked + .todo-checkbox__text:after {
    opacity: 1;
  }

  /* switch */

  .todo-switch {
    display: block;
    cursor: pointer;
    position: relative;
  }

  .todo-switch input {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }

  .todo-switch__text {
    padding-left: 45px;
  }

  .todo-switch__text:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 34px;
    height: 14px;
    border-radius: 14px;
    background-color: rgba(255, 255, 255, .3);
    transition: all .4s ease;
  }

  .todo-switch:hover .todo-switch__text:before {
    background-color: rgba(255, 255, 255, .5);
  }

  .todo-switch__text:after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    top: -3px;
    left: 0px;
    z-index: 1;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, .8);
    transition: all .4s ease;
  }

  .todo-switch input:checked + .todo-switch__text:before {
    background-color: rgba(0, 200, 170, .5);
  }

  .todo-switch input:checked + .todo-switch__text:after {
    left: 14px;
    background-color: rgba(0, 200, 170, 1);
  }

  /* icons */

  .todo__icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    transition: all .4s ease;
    cursor: pointer;
    background-size: contain;
    opacity: .7;
  }

  .todo__icon:hover {
    opacity: 1;
  }

  .todo__icon_edit {
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M76.7 8.3c-1.1 0-2.1 0.4-2.9 1.2l-7.1 7.1 16.7 16.7 7.1-7.1c1.6-1.6 1.6-4.3 0-5.9L79.7 9.6C78.9 8.7 77.8 8.3 76.7 8.3zM60.4 22.9L20.8 62.5c0 0 4.2 0 6.3 2.1s2 6.2 2 6.2 4.2 0.1 6.3 2.1c2.1 2.1 2.1 6.3 2.1 6.3l39.6-39.6L60.4 22.9zM15.3 70.8L12.5 87.5l16.7-2.8L15.3 70.8z' fill='%23FFFFFF'/%3E%3C/svg%3E");
  }

  .todo__icon_trash {
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M41.7 8.3L37.5 12.5H16.7v8.3h66.7V12.5H62.5l-4.2-4.2H41.7zM20.8 29.2v54.2c0 4.6 3.8 8.3 8.3 8.3h41.7c4.6 0 8.3-3.7 8.3-8.3V29.2H20.8zM33.3 37.5h8.3v45.8h-8.3V37.5zM58.3 37.5h8.3v45.8h-8.3V37.5z' fill='%23ffffff'/%3E%3C/svg%3E");
  }

  .todo__icon_more {
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 10A2 2 0 0 0 4 12 2 2 0 0 0 6 14 2 2 0 0 0 8 12 2 2 0 0 0 6 10zM12 10A2 2 0 0 0 10 12 2 2 0 0 0 12 14 2 2 0 0 0 14 12 2 2 0 0 0 12 10zM18 10A2 2 0 0 0 16 12 2 2 0 0 0 18 14 2 2 0 0 0 20 12 2 2 0 0 0 18 10z' fill='%23ffffff'/%3E%3C/svg%3E");
  }

  .todo__icon_morev {
    transform: rotate(90deg);
  }

  .todo__icon_add {
    opacity: 1;
  }

  .todo__icon_add:before {
    content: '+';
    color: #fff;
    font-size: 1.2em;
  }

  /* dialog */

  .todo-dialog {
    background: rgba(0, 0, 0, 0);
    display: flex;
    position: fixed;
    left: -100vw;
    top: 0;
    width: 100vw;
    max-width:100%;
    height: 100vh;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    transition: background .5s ease, left 0s linear .5s;
  }

  .todo-dialog-window {
    border-radius: 2px;
    min-width: 700px;
    max-width: 95%;
    background: rgb(60, 66, 66);
    padding: 1em;
    box-sizing: border-box;
    transform: scale(.5);
    opacity: 0;
    transition: all .2s ease;
    box-shadow: 0 20px 30px rgba(0, 0, 0, .5);
  }

  .todo-dialog__head {
    font-weight: 700;
    font-size: 2em;
    margin-bottom: 1rem;
  }

  .todo-dialog-footer {
    margin-top: 2rem;
    justify-content: flex-end;
    display: flex;
  }

  .todo-dialog-footer__trash {
    flex: 5 1;
  }

  .todo-dialog_show {
    left: 0;
    transition: background .5s ease;
    background: rgba(0, 0, 0, .6);
  }

  .todo-dialog_show .todo-dialog-window {
    transform: scale(1);
    opacity: 1;
    transition: all .2s ease .3s;
  }

  /* media */

  .sm_visible {
    display: none;
  }

  @media screen and (max-width: 800px) {
    .sm_hidden {
      display: none;
    }

    .sm_visible {
      display: inherit;
    }

    .todo-row_th {
      display: none;
    }

    .todo-row {
      padding: .5em .5em;
      flex-wrap: wrap;
      align-items: center;
    }

    .todo__item {
      padding: .5em .5em;
    }

    .todo__item_actions {
      padding-left: 0;
      padding-right: 0;
      width: 20px;
    }

    .todo__item_date {
      order: 1;
      opacity: .6;
      font-size: .8em;
      flex: 10 0 60vw;
    }

    .todo__item_id {
      order: 2;
      text-align: center;
      opacity: .6;
      font-size: .8em;
    }

    .todo__item_name {
      order: 3;
      flex: 10 0 60vw;
    }

    .todo__item_status {
      order: 4;
      align-self: flex-start;
    }

    @supports (display: grid) {
      .todo-row {
        grid-template-columns: auto 10fr 1fr;
        align-items: center;
      }
      .todo__item_name {
        grid-column: span 2;
      }

      .todo__item_status {
        align-self: start;
      }
    }

    .todo-dialog-window {
      min-width: 95%;
    }
  }
</style>
