

Vue.component('table-date', {
    props: ['dateYear', 'dateMonth', 'dateDate'],
    computed: {
        isoDate: function () {
            const thisDate = new Date(this.dateYear, this.dateMonth, this.dateDate, 12);
            const isoDate = thisDate.toISOString().slice(0, 10);
            return isoDate;
        },
        isoDateString: function () {
            const yearString = this.isoDate.slice(0, 4);
            const monthString = this.isoDate.slice(5, 7);
            const dateString = this.isoDate.slice(8, 10);
            return `${dateString}-${monthString}-${yearString}`;
        }
    },
    asyncComputed: {
        availability: async function () {
            if (this.dateDate === '') {
                return 'whitespace';
            }

            let dates = await bookedDates;
            for (date in dates) {
                if (this.isoDate === dates[date]) {
                    return 'booked';
                } 
            }
            return 'available';
        }
    },
    methods: {
        returnDate() {
            const inputDate = ``
            const input = document.getElementById(field);
            input.setAttribute('value', this.isoDateString);
        }
    },
    template: '<td :class="availability" v-on:click="returnDate()">{{ dateDate }}</td>'
})

const Component = Vue.extend({
    props: ['instYear', 'instMonth', 'calMonth'],
    template: `<table>
                   <tr v-for="week in calMonth">
                       <table-date v-for="date in week" :dateYear="instYear" :dateMonth="instMonth" :dateDate="date"></table-date>
                   </tr>
               </table>`
})

const bookingForm = new Vue({
    el: '#booking-form',
    data: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        slideCount: 0,
        calendarWidth: 150
    },
    computed: {
        monthString: function () {
            return (this.selectedDate.toLocaleString('default', { month: 'long' }));
        },
        selectedDate: function () {
            return new Date(this.year, this.month + this.slideCount);
        }
    },
    methods: {
        selectArrivalDate() {
            field = 'arrival-date';
            const calendar = document.querySelector('#calendar');
            calendar.style.display = 'block';
            calendar.focus();
        },
        selectDepartureDate() {
            field = 'departure-date';
            const calendar = document.querySelector('#calendar');
            calendar.style.display = 'block';
            calendar.focus();
        },
        decreaseMonth() {
            this.slideCount--;
            const calendarCarousel = document.querySelector('.calendar-carousel');
            const allMonths = calendarCarousel.children;

            allMonths[4].remove();

            const mountPoint = document.createElement('table');
            calendarCarousel.insertBefore(mountPoint, allMonths[0]);

            for (let i = 0; i < allMonths.length; i++) {
                allMonths[i].style.transform = `translateX(${((i + 1 - 3) * this.calendarWidth)}px`;
            }

            let instance = new Component({
                propsData: {
                    instYear: this.year,
                    instMonth: this.month + this.slideCount - 2,
                    calMonth: daysOfMonth(this.year, this.month + this.slideCount - 2),
                    inputField: this.inputField
                }
            });

            instance.$mount(mountPoint);

            allMonths[0].style.transform = `translateX(${((1 - 3) * this.calendarWidth)}px`;

        },
        increaseMonth() {
            this.slideCount++;
            const calendarCarousel = document.querySelector('.calendar-carousel');
            const allMonths = calendarCarousel.children;

            allMonths[0].remove();

            const mountPoint = document.createElement('table');
            calendarCarousel.insertBefore(mountPoint, allMonths[4]);

            for (let i = 0; i < allMonths.length; i++) {
                allMonths[i].style.transform = `translateX(${((i + 1 - 3) * this.calendarWidth)}px`;
            }

            let instance = new Component({
                propsData: {
                    instYear: this.year,
                    instMonth: this.month + this.slideCount + 2,
                    calMonth: daysOfMonth(this.year, this.month + this.slideCount + 2),
                    instField: this.inputField
                }
            });       

            instance.$mount(mountPoint);

            allMonths[4].style.transform = `translateX(${((5 - 3) * this.calendarWidth)}px`;

        },
    },
    delimiters: ['<%', '%>']
})

function daysOfMonth(year, month) { //populates calendar

    //---add days to calendar from first of month--//
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let week = [];
    let calendar = [];
    let n = 1;
    for (let n = 1; n <= daysInMonth; n++) {
        let date = new Date(year, month, n);
        week.push(date.getDate());
        if (date.getDay() === 0) {
            calendar.push(week);
            week = [];
        }
    }
    calendar.push(week);

    //--fills first week with dates of previous month--//
    datesAdded = 0;
    while (calendar[0].length < 7) {
        calendar[0].unshift('');
        datesAdded++;
        /*dateToAdd = (new Date(year, month, 0 - datesAdded)).getDate();
        calendar[0].unshift(dateToAdd);
        datesAdded++;*/
    }
    return (calendar);   
}

const bookedDates = 
    fetch('/dates', { method: 'post' })
        .then(response => {
            return (response.json());
        })
        .then(json => {
            return (json['dates']);
        })


function initialCalendarLoad(year, month, inputField) {
    const calendarCarousel = document.querySelector('.calendar-carousel');
    const allMonths = calendarCarousel.children;
    const inputObj = {
        data: inputField
    }
    for (let i = 0; i < 5; i++) {
        const mountPoint = document.createElement('table');
        calendarCarousel.insertBefore(mountPoint, allMonths[i]);

        allMonths[i + 1].remove();

        const instance = new Component({
            data: {
                field: inputField
            },
            propsData: {
                instYear: year,
                instMonth: month + i - 2,
                calMonth: daysOfMonth(year, month + i - 2),
            }
        });

        instance.$mount(mountPoint);

        allMonths[i].style.transform = `translateX(${((i - 2) * 150)}px`;
    }
}

let field = '';

initialCalendarLoad(2020, 7, field);

function hideCalendar() {
    const calendar = document.querySelector('#calendar');
    calendar.style.display = 'none';
}


