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



const vm = new Vue({
    el: '#root',
    data: {
        galleryImages: [
            '../static/01-front.jpg',
            '../static/02-lounge.jpg',
            '../static/03-lounge.jpg',
            '../static/04-dining.jpg',
            '../static/05-dining.jpg',
            '../static/06-kitchen.jpg',
            '../static/07-stairs.jpg',
            '../static/08-master.jpg',
            '../static/09-twin.jpg',
            '../static/10-single.jpg',
            '../static/11-bathroom.jpg',
            '../static/12-garden.jpg',
            '../static/13-gardens.jpg',
            '../static/14-gardens.jpg'
        ],
        bookingFormData: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            address: {
                addressLine1: '',
                addressLine2: '',
                townCity: '',
                countyRegion: '',
                postZipCode: ''
            },
            party: {
                adults: 0,
                children: 0,
                infants: 0,
                dogs: 0
            },
            arrivalDate: '',
            departureDate: ''
        },
        contactFormData: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            message: ''
        }
    },
    computed: {
        bookingFormComputed: function () {
            return {
                price: function () {
                    return 0;
                }
            }
        }
    },
    methods: {
        calendarArray(year, month) {
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

            //--fills first week--//
            datesAdded = 0;
            while (calendar[0].length < 7) {
                calendar[0].unshift('');
                datesAdded++;
            }
            return (calendar);
        },
        initialCalendarLoad(year, month, inputField) {
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
        },
        hideCalendar() {
            const calendar = document.querySelector('#calendar');
            calendar.style.display = 'none';
        }
    },
    delimiters: ['<%', '%>']
})


const bookedDates =
    fetch('/dates', { method: 'post' })
        .then(response => {
            return (response.json());
        })
        .then(json => {
            return (json['dates']);
        })



let field = '';

vm.initialCalendarLoad(2020, 7, field);

