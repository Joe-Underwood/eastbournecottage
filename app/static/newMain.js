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
            arrivalDate: '',
            departureDate: '',
            phoneNumber: '',
            party: {
                adults: 0,
                children: 0,
                infants: 0,
                dogs: 0
            },
            name: '',
            emailAddress: ''
        },
        contactFormData: {
            name: '',
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
        toggleSideMenu() {
            if (this.$refs.sideMenu.style.display === 'none') {
                this.$refs.sideMenu.style.display = 'block';
            } else {
                this.$refs.sideMenu.style.display = 'none';
            }
        },
        goToProfile() {
            this.$refs.profile.scrollIntoView(true);
        },
        goToBooking() {
            this.$refs.booking.scrollIntoView(true);
        },
        goToContact() {
            this.$refs.contact.scrollIntoView(true);
        },
        showOverview() {
            this.$refs.overview.style.display = 'block';
            this.$refs.facilities.style.display = 'none';
            this.$refs.location.style.display = 'none';
        },
        showFacilities() {
            this.$refs.overview.style.display = 'none';
            this.$refs.facilities.style.display = 'block';
            this.$refs.location.style.display = 'none';
        },
        showLocation() {
            this.$refs.overview.style.display = 'none';
            this.$refs.facilities.style.display = 'none';
            this.$refs.location.style.display = 'block';
        },
        toggleCalendar() {

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

