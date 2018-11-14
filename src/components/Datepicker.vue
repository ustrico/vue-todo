<template>
  <div class="datepicker">
    <div class="datepicker-section">
      <div class="datepicker-section__title">
        Year
      </div>
      <div class="datepicker-list">
        <div class="datepicker__item"
             v-for="year in years" :key="year"
             :class="{'datepicker_active': year === outDate.year}"
             @click="pickHandle(year, 'year')">
          {{ year }}
        </div>
      </div>
    </div>
    <div class="datepicker-section datepicker-section_month">
      <div class="datepicker-section__title">
        Month
      </div>
      <div class="datepicker-list">
        <div class="datepicker__item"
             v-for="(month, monthId) in months" :key="month"
             :class="{'datepicker_active': monthId === outDate.month}"
              @click="pickHandle(monthId, 'month')">
          {{ month }}
        </div>
      </div>
    </div>
    <div class="datepicker-section">
      <div class="datepicker-section__title">
        Day
      </div>
      <div class="datepicker-list datepicker-week">
        <div class="datepicker__item datepicker__item_day datepicker__item_weekday"
             v-for="weekday in week" :key="weekday">
          {{ weekday }}
        </div>
      </div>
      <div class="datepicker-list datepicker-week">
        <div class="datepicker__item datepicker__item_day"
             v-for="(day, dayId) in days" :key="dayId"
             :class="{'datepicker_active': day === outDate.day, 'datepicker__item_empty': !day}"
             @click="pickHandle(day, 'day')">
          {{ day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Datepicker',
  data () {
    return {
      inDate: null,
      outDate: {},
      years: [],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      days: []
    }
  },
  props: ['date'],
  methods: {
    pickHandle (val = 0, field = null) {
      this.outDate[field] = val
    }
  },
  created () {
    this.inDate = this.date ? new Date(this.date) : new Date()
    this.outDate = {
      year: this.inDate.getFullYear(),
      month: this.inDate.getMonth(),
      day: this.inDate.getDate(),
      dayStart: this.inDate.getDay()
    }
    this.outDate.monthDays = new Date(this.outDate.year, this.outDate.month + 1, 0).getDate()
    for (let i = this.outDate.year - 3; i <= this.outDate.year + 3; i++) this.years.push(i)
    this.days = []
    for (let i = 0; i < this.outDate.dayStart; i++) this.days.push(0)
    for (let i = 1; i <= this.outDate.monthDays; i++) this.days.push(i)
  }
}
</script>

<style>

  .datepicker {
    max-width: 800px;
    margin: 2em auto;
  }

  .datepicker-section {
    margin: 1em 0;
  }

  .datepicker-section_month {
    border-top: 1px solid rgba(255, 255, 255, .2);
    border-bottom: 1px solid rgba(255, 255, 255, .2);
    padding: 1em 0;
  }

  .datepicker-section__title {
    margin: 0 0 .5em;
    text-transform: uppercase;
  }

  .datepicker-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -.5em;
  }

  .datepicker__item {
    padding: .5em;
    border-radius: 2px;
    cursor: pointer;
    color: rgba(255, 255, 255, .5);
    transition: all .4s ease;
  }

  .datepicker__item:hover, .datepicker__item:active {
    background-color: rgba(255, 255, 255, .1);
  }

  .datepicker_active {
    color: rgba(0, 200, 170, 1);
  }

  .datepicker-week {
    max-width: 280px;
    justify-content: flex-start;
  }

  .datepicker__item_day {
    padding: .5em 1em;
    width: 40px;
    box-sizing: border-box;
    text-align: right;
  }

  .datepicker__item_empty {
    color: rgba(255, 255, 255, 0);
  }

  .datepicker__item_weekday {
    color: rgba(255, 255, 255, .2);
  }

  @media screen and (max-width: 800px) {
  }
</style>
