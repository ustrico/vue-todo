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

    <transition-group name="dialog_show">

      <Dialog
        v-if="dialog.type === 'edit'"
        :options="dialog"
        key="edit"
        type="edit"
        @close="dialogCloseHandle"
        @submit="dialogSaveHandle"
      >
        <div slot="head" v-html="dialog.id ? 'Edit' : 'Add'"></div>
        <div class="todo-form-field">
          <label class="todo-form__label" for="todo-form-date">Date</label>
          <AButton
            title="Date"
            aClass="todo__icon_calendar todo__icon_inputdate"
            @aClick="dialogItemDatepickerHandle"
          />
          <input type="text" id="todo-form-date" class="todo-form__input todo-form__input_date" v-model="dialog.date">
        </div>
        <div class="todo-form-field">
          <label class="todo-form__label" for="todo-form-name">Name</label>
          <input type="text" id="todo-form-name" class="todo-form__input" v-model="dialog.name">
        </div>
        <div slot="footer">
          <div class="todo-dialog-footer__left" v-if="dialog.id">
            <AButton
              title="Delete"
              aClass="todo__icon_trash"
              @aClick="dialogItemDeleteHandle"
            />
          </div>
          <AButton
            aClass="todo__button_mute"
            aValue="Cancel"
            @aClick="dialogCloseHandle"
          />
          <AButton
            aType="submit"
            aValue="Save"
          />
        </div>
      </Dialog>

      <Dialog
        v-if="dialog.type === 'delete'"
        :options="dialog"
        key="delete"
        type="delete"
        @close="dialogCloseHandle"
        @submit="dialogDeleteHandle"
      >
        <div slot="head">Delete</div>
        <p>
          Delete "{{ dialog.name }}"?
        </p>
        <div slot="footer">
          <AButton
            aClass="todo__button_mute"
            aValue="Cancel"
            @aClick="dialogCloseHandle"
          />
          <AButton
            aType="submit"
            aValue="Delete"
          />
        </div>
      </Dialog>

      <Dialog
        v-if="dialog.type === 'datepicker'"
        :options="dialog"
        key="datepicker"
        type="datepicker"
        @close="dialogDatepickerCloseHandle"
        @submit="dialogCloseHandle"
      >
        <div slot="head">Date</div>
        <Datepicker :options="dialog"/>
        <div slot="footer">
          <AButton
            aClass="todo__button_mute"
            aValue="Cancel"
            @aClick="dialogDatepickerCloseHandle"
          />
          <AButton
            aType="submit"
            aValue="Apply"
          />
        </div>
      </Dialog>
    </transition-group>

  </div>
</template>

<script>
import AButton from '@/components/AButton'
import Dialog from '@/components/Dialog'
import Datepicker from '@/components/Datepicker'
export default {
  name: 'Todo',
  data () {
    return {
      items: {},
      dialog: {
        hide: false,
        type: null
      }
    }
  },
  components: {Datepicker, AButton, Dialog},
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
      this.dialog.id = id
      this.dialog.date = this.viewDate(this.items[id].date)
      this.dialog.name = this.items[id].name
    },
    itemDeleteHandle (id = 0) {
      if (!this.items[id]) return
      this.dialog.id = id
      this.dialog.name = this.items[id].name
      this.dialog.type = 'delete'
      setTimeout(() => document.querySelector('[type="button"]').focus(), 500)
    },
    dialogItemDeleteHandle () {
      this.itemDeleteHandle(this.dialog.id)
    },
    dialogItemDatepickerHandle () {
      this.dialog.type = 'datepicker'
    },
    dialogDatepickerCloseHandle () {
      this.dialog.type = 'edit'
    },
    dialogAddHandle () {
      this.dialog.id = 0
      this.dialog.date = this.viewDate()
      this.dialog.name = ''
      this.dialog.status = false
      this.dialog.type = 'edit'
      setTimeout(() => document.getElementById('todo-form-name').focus(), 500)
    },
    dialogCloseHandle (e = null) {
      if (e) e.preventDefault()
      this.dialog.type = ''
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

  /* icons */

  .todo__icon {
    user-select: none;
    outline: none;
    background: transparent;
    border: 0;
    display: inline-block;
    width: 20px;
    height: 20px;
    transition: all .4s ease;
    cursor: pointer;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
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

  .todo__icon_calendar {
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 1L6 3 5 3C3.9 3 3 3.9 3 5L3 19C3 20.1 3.9 21 5 21L19 21C20.1 21 21 20.1 21 19L21 5C21 3.9 20.1 3 19 3L18 3 18 1 16 1 16 3 8 3 8 1 6 1zM5 8L19 8 19 19 5 19 5 8z' fill='%23ffffff'/%3E%3C/svg%3E");
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

  .todo__icon_inputdate {
    position: absolute;
    height: 2em;
    margin-top: .2em;
  }

  .todo-form__input_date {
    padding-left: 30px;
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
  }
</style>
