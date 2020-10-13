window.addEventListener('load', function() {
    var gallerySwiper = new Swiper('.gallery-swiper', {
        // Optional parameters
        loop: true,
      
        // If we need pagination
        pagination: {
          el: '.gallery-pagination',
          dynamicBullets: true
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
    });
    
    var calendarSwiper;
    let closePartyOverlay = false;

})

// corrects hero image size, as most mobile browsers have inconsistent viewport dimensions
// which causes undesirable resizing of hero area
// also accounts for mobile browsers confusing height and width in landscape orientation

let heroHeight;
let innerHeight;
let offsetHeight;
let currentOrientation;
let newOrientation;


const heroResize = function () {
    if (document.documentElement.offsetHeight > document.documentElement.offsetWidth) {
        if (window.screen.height > window.screen.width) {
            heroHeight = window.screen.height;
            newOrientation = 'portait';
        } else {
            heroHeight = window.screen.width;
            newOrientation = 'landscape';
        }
    } else {
        if (window.screen.height < window.screen.width) {
            heroHeight = window.screen.height;
            newOrientation = 'portait';
        } else {
            heroHeight = window.screen.width;
            newOrientation = 'landscape';
        }
    }
    if (currentOrientation != newOrientation) {
        offsetHeight = heroHeight - document.documentElement.offsetHeight;
        currentOrientation = newOrientation;
    }

    if (newOrientation === 'portait') {
        document.querySelector('.hero-area img').src = '../static/cottage-02.jpg';
    } else {
        document.querySelector('.hero-area img').src = '../static/cottage-01.jpg';
    }

    document.querySelector('.hero-area').style.height = `${heroHeight - offsetHeight}px`;
}

heroResize();

window.addEventListener('resize', heroResize);

//------body scroll lock used when side menu open--------//
const disableBodyScroll = bodyScrollLock.disableBodyScroll;
const enableBodyScroll = bodyScrollLock.enableBodyScroll;

//-------------------- side menu close behavious ---------------//


//---------------CALENDAR COMPONENTS---------------------------------------//

Vue.component('calendar-date', {
    props: ['dateYear', 'dateMonth', 'dateDate'],
    computed: {
        selfDate: function () {
            return new Date(this.dateYear, this.dateMonth, this.dateDate, 12);
        },
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
        selectDate(element, date) {
            if (this.dateDate) {
                vm.selectDate(element, date);
            }  
        },
        slide(element) {
            if (!element.classList.contains('invalid-date') && !element.classList.contains('booked')) {
                if (element.classList.contains('prev-days')) {
                    calendarSwiper.slidePrev();
                } 
                else if (element.classList.contains('next-days')) {
                    calendarSwiper.slideNext();
                }
            }
        }
    },
    template: `<div :class="['calendar-date', availability]" v-on:click="selectDate(_vnode.elm, selfDate); slide(_vnode.elm);">
                   <div>{{ dateDate }}</div>
               </div>`
})

const calendarMonth = Vue.extend({
    props: ['instYear', 'instMonth'],
    computed: {           
        instCalendarValues: function () {
            return (vm.calendarValues(this.instYear, this.instMonth));
        }
    },
    methods: {
        weekRow(week) {
            return `${this.instCalendarValues.indexOf(week) + 1} / span 1`;
        },
        prevDateColumn(arr, date) {
            return `${arr.indexOf(date) + 1} / span 1`;
        },
        dateColumn(arr, date, week) {
            return `${arr.indexOf(date) + 1 + week.prevDays.length} / span 1`;
        },
        nextDateColumn(arr, date, week) {
            return `${arr.indexOf(date) + 1 + week.prevDays.length + week.days.length} / span 1`;
        },
        prevYear(year, month) {
            if (month === 0) {
                return (year - 1);
            } else {
                return year;
            }
        },
        prevMonth(month) {
            if (month === -1) {
                return 11;
            } else {
                return month;
            }
        },
        nextYear(year, month) {
            if (month === 11) {
                return (year + 1);
            } else { 
                return year;
            }
        },
        nextMonth(month) {
            if (month === 12) {
                return 0;
            } else {
                return month;
            }
        }
    },
    template: `<div class="swiper-slide">
                   <div class="calendar-month" style="{ display: 'grid', 'grid-template-rows': 'repeat(6, 1fr)' }">
                       <div class="calendar-week" v-for="week in instCalendarValues" :style="{ 'grid-row': weekRow(week), display: 'grid', 'grid-template-columns': 'repeat(7, 1fr)' }">
                           <calendar-date v-for="date in week.prevDays" class="prev-days" :style="{ 'grid-column': prevDateColumn(week.prevDays, date) }" :dateYear="prevYear(instYear, instMonth)" :dateMonth="prevMonth(instMonth - 1)" :dateDate="date"></calendar-date>
                           <calendar-date v-for="date in week.days" class="days" :style="{ 'grid-column': dateColumn(week.days, date, week) }" :dateYear="instYear" :dateMonth="instMonth" :dateDate="date"></calendar-date>
                           <calendar-date v-for="date in week.nextDays" class="next-days" :style="{ 'grid-column': nextDateColumn(week.nextDays, date, week) }" :dateYear="nextYear(instYear, instMonth)" :dateMonth="nextMonth(instMonth + 1)" :dateDate="date"></calendar-date>
                       </div>
                   </div>
               </div>`
})

//---------------------------ROOT COMPONENT--------------------//

const vm = new Vue({
    el: '#root',
    data: {
        bookingFormData: {
            arrivalDate: '',
            departureDate: '',
            adults: 0,
            children: 0,
            infants: 0,
            dogs: 0,
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            addressLine1: '',
            addressLine2: '',
            townOrCity: '',
            countyOrRegion: '',
            postcode: '',
            price: 0
        },

        contactFormData: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            message: ''
        },
        
        //calendar load settings
        currentDate: new Date(),
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        calendarRange: 18,
        slideCount: 0,
        //calendar select date parameters
        calendarSelector: 'arrival',
        invalidDates: [],
        //additional date formats
        arrivalDateString: '',
        arrivalDateObject: undefined,
        departureDateString: '',
        departureDateObject: undefined,
        //side menu open parameters
        scrollY: 0,
        scrimClose: false,
        initialX: undefined,
        offsetX: undefined,
        //gallery 
        gallerySlideCount: 1,
        //party settings
        partyMax: 5,
        infantsMax: 5,
        dogsMax: 1,
        pricePerDog: 20,
        //page-wrapper
        pageSlide: 0,
        checkoutScrollTop: 0,
        checkoutStep: 0,
        //party-overlay
        partyScrimClose: false,
        initialY: undefined,
        offsetY: undefined

    },
    computed: {
        selectedMonth: function () {
            return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.slideCount);
        },
        partyString: function () {
            let guests = this.bookingFormData.adults + this.bookingFormData.children;
            let partyString = '';

            if (guests === 1) {
                partyString += `${guests} guest`;
            } 
            else if (guests > 1) {
                partyString += `${guests} guests`;
            }

            if (this.bookingFormData.infants) {
                if (guests) {
                    partyString += ', ';
                }
                if (this.bookingFormData.infants === 1) {
                    partyString += `${this.bookingFormData.infants} infant`;
                }
                else if (this.bookingFormData.infants > 1) {
                    partyString += `${this.bookingFormData.infants} infants`;
                }
            } 

            if (this.bookingFormData.dogs) {
                if (guests || this.bookingFormData.infants) {
                    partyString += ', ';
                }
                if (this.bookingFormData.dogs === 1) {
                    partyString += `${this.bookingFormData.dogs} dog`;
                }
                else if (this.bookingFormData.dogs > 1) {
                    partyString += `${this.bookingFormData.dogs} dogs`;
                }
            }

            return partyString;
        }
    },
    methods: {
        //-------------------- NAVBAR METHODS ------------------------//
        hamburgerAction() {
            if (!document.querySelector('.hamburger').classList.contains('back')) {
                this.toggleSideMenu();
            } else {
                this.checkoutPrev();
            }
        },
        toggleSideMenu() {  
            //toggles side menu
            const navLinks = document.querySelector('.nav-links');
            document.querySelector('.side-menu').ontransitionend = function() {
                if (!document.querySelector('.side-menu').classList.contains('open')) {
                    document.querySelector('.side-menu').style.transform = 'translate3d(-100%, 0, 0)';
                }
            }
            
            if (!navLinks.classList.contains('open')) {
                document.querySelector('.side-menu').style.transform = 'translate3d(0, 0, 0)';
                navLinks.style.transform = 'translate3d(0, 0, 0)';

                //body scroll lock
                this.scrollY = window.scrollY;
                let offsetY = this.scrollY;
                disableBodyScroll(navLinks);
                //desktop browsers scroll to the top of page, below code corrects view only if this happens
                setTimeout(function () {
                    if (window.scrollY != offsetY) {
                        document.querySelector('.content-wrapper').style.transform = `translateY(-${offsetY}px)`;
                    }
                })
                
            } else {
                navLinks.style.transform = 'translate3d(-100%, 0, 0)';

                //body scroll unlock
                let offsetY = this.scrollY;
                enableBodyScroll(navLinks);
                //desktop browsers scroll to the top of page, below code corrects view only if this happens
                setTimeout(function () {
                    if (window.scrollY != offsetY) {
                        document.querySelector('.content-wrapper').style.transform = `translateY(0)`;
                    }
                    window.scrollTo(0, offsetY);
                }, 1)
            }
            navLinks.classList.toggle('open');
            document.querySelector('#root').classList.toggle('open');
            this.$refs.hamburger.classList.toggle('open');
            document.querySelector('.hero-area').classList.toggle('open');
            document.querySelector('.side-menu').classList.toggle('open');          
        },
        bookCTAPress() {
            //goes to booking section when navbar cta button is pressed
            document.querySelector('.navbar button').classList.toggle('pressed');
        },

        //----------------------- SIDE MENU METHODS -----------------------------//
        //-----------navigation links--------------//
        //---------- side menu touch methods used to close menu by tapping or sliding //
        menuTouchstart(event) {
            //on touchstart
            if (document.querySelector('.nav-links').contains(event.target)) {
                this.initialX = event.touches[0].clientX;
                document.querySelector('.nav-links').style.transition = "none"; 
            } else if (document.querySelector('.nav-links').classList.contains('open') && event.target === document.querySelector('.side-menu')) {
                this.scrimClose = true;
                this.initialX = document.querySelector('.nav-links').clientWidth;
                document.querySelector('.nav-links').style.transition = "none"; 
            }
        },
        menuTouchmove(event) {
            //on touchmove, slides menu horizontally based on touch position
            if (document.querySelector('.side-menu').contains(event.target) && document.querySelector('.nav-links').classList.contains('open')) {
                this.scrimClose = false;
                if (!document.querySelector('.navbar').contains(event.target)) {
                    this.offsetX = event.touches[0].clientX - this.initialX;
                    if (this.offsetX <= 0) {
                        document.querySelector('.nav-links').style.transform = `translate3d(${this.offsetX}px, 0, 0)`;
                    }   
                }
            }
        },
        menuTouchend(event) {
            //on touchend, calls side menu if conditions are met, else keeps side menu open and resets parameters ready for next touch event
            if (this.scrimClose && document.querySelector('.nav-links').classList.contains('open')) {
                document.querySelector('.nav-links').style.transition = 'all 0.2s';
                let endX = event.changedTouches[0].clientX;
                let endY = event.changedTouches[0].clientY;
                if (document.elementFromPoint(endX, endY) === document.querySelector('.side-menu')) {
                    vm.toggleSideMenu();
                }
                this.scrimClose = false;
            }
            if (document.querySelector('.side-menu').contains(event.target) && document.querySelector('.nav-links').classList.contains('open')) {
                document.querySelector('.nav-links').style.transition = 'all 0.2s';
                if (this.offsetX < -(document.querySelector('.nav-links').clientWidth) / 4) {
                    document.querySelector('.nav-links').style.transform = `translate3d(-100%, 0, 0)`;
                    this.toggleSideMenu();
                } else {
                    document.querySelector('.nav-links').style.transform = `translate3d(0, 0, 0)`;
                }
            }
            this.scrimClose = false;
            this.initialX = undefined;
            this.offsetX = undefined;
        },

        //------------ PARTY OVERLAY METHODS ----------------------//
        partyTouchstart(event) {
            //on touchstart
            if (document.querySelector('.party-container').contains(event.target)) {
                this.initialY = event.touches[0].clientY;
                document.querySelector('.party-container').style.transition = "none"; 
            } else if (document.querySelector('.party-container').classList.contains('open') && event.target === document.querySelector('.party-wrapper')) {
                this.partyScrimClose = true;
                this.initialY = document.querySelector('.party-container').offsetTop;
                document.querySelector('.party-container').style.transition = "none"; 
            }
        },
        partyTouchmove(event) {
            //on touchmove, slides menu horizontally based on touch position
            if (document.querySelector('.party-wrapper').contains(event.target) && document.querySelector('.party-container').classList.contains('open')) {
                this.partyScrimClose = false;
                if (!document.querySelector('.navbar').contains(event.target)) {
                    this.offsetY = event.touches[0].clientY - this.initialY;
                    if (this.offsetY >= 0) {
                        document.querySelector('.party-container').style.transform = `translate3d(0, ${this.offsetY}px, 0)`;
                    }   
                }
            }
        },
        partyTouchend(event) {
            //on touchend, calls side menu if conditions are met, else keeps side menu open and resets parameters ready for next touch event
            if (this.partyScrimClose && document.querySelector('.party-container').classList.contains('open')) {
                document.querySelector('.party-container').style.transition = 'all 0.2s';
                let endX = event.changedTouches[0].clientX;
                let endY = event.changedTouches[0].clientY;
                if (document.elementFromPoint(endX, endY) === document.querySelector('.party-wrapper')) {
                    vm.hidePartyOverlay();
                }
                this.partyScrimClose = false;
            }
            /*else if (document.querySelector('.party-wrapper').contains(event.target) && document.querySelector('.party-container').classList.contains('open')) {
                document.querySelector('.party-container').style.transition = 'all 0.4s';
                if (this.offsetY > (document.querySelector('.party-container').clientHeight) / 4) {  
                    this.hidePartyOverlay();
                } else {
                    document.querySelector('.party-container').style.transform = `translate3d(0, 0, 0)`;
                }
            }*/
            else if (document.querySelector('.party-wrapper').contains(event.target) && document.querySelector('.party-container').classList.contains('open')) {
                document.querySelector('.party-container').style.transition = 'all 0.2s';
                if (this.offsetY > document.querySelector('.party-container').clientHeight / 4) {
                    this.hidePartyOverlay();
                } else {
                    document.querySelector('.party-container').style.transform = 'translate3d(0, 0, 0)';
                }
                
            }
            this.partyScrimClose = false;
            this.initialY = undefined;
            this.offsetY = undefined;
        },

        //------------------- GALLERY METHODS -------------------------------------//
        prevImage() {
            if (this.gallerySlideCount <= 0) {
                return;
            }
            this.gallerySlideCount--;
            document.querySelector('.gallery-slide').style.transition = 'all 0.5s';
            document.querySelector('.gallery-slide').style.transform = `translateX(-${this.gallerySlideCount * 100 / 16}%)`;
        },
        nextImage() {
            if (this.gallerySlideCount >= 15) {
                return;
            }
            this.gallerySlideCount++;
            document.querySelector('.gallery-slide').style.transition = 'all 0.5s';
            document.querySelector('.gallery-slide').style.transform = `translateX(-${this.gallerySlideCount * 100 / 16}%)`;
        },
        galleryWrap() {
            if (this.gallerySlideCount === 15) {
                this.gallerySlideCount = 1;
                document.querySelector('.gallery-slide').style.transition = 'none';
                document.querySelector('.gallery-slide').style.transform = `translateX(-${this.gallerySlideCount * 100 / 16}%)`;

            } else if (this.gallerySlideCount === 0) {
                this.gallerySlideCount = 14;
                document.querySelector('.gallery-slide').style.transition = 'none';
                document.querySelector('.gallery-slide').style.transform = `translateX(-${this.gallerySlideCount * 100 / 16}%)`;
            }
        },
        toggleFullscreenGallery() {
        },

        //-------------------COTTAGE NAV------------------------//
        showOverview() {
            document.querySelector('.overview-cottage-nav').classList.add('active-cottage-link');
            document.querySelector('.facilities-cottage-nav').classList.remove('active-cottage-link');
            document.querySelector('.location-cottage-nav').classList.remove('active-cottage-link');

            document.querySelector('.overview').style.display = 'block';
            document.querySelector('.facilities').style.display = 'none';
            document.querySelector('.location').style.display = 'none';
        },
        showFacilities() {
            document.querySelector('.overview-cottage-nav').classList.remove('active-cottage-link');
            document.querySelector('.facilities-cottage-nav').classList.add('active-cottage-link');
            document.querySelector('.location-cottage-nav').classList.remove('active-cottage-link');

            document.querySelector('.overview').style.display = 'none';
            document.querySelector('.facilities').style.display = 'block';
            document.querySelector('.location').style.display = 'none';
        },
        showLocation() {
            document.querySelector('.overview-cottage-nav').classList.remove('active-cottage-link');
            document.querySelector('.facilities-cottage-nav').classList.remove('active-cottage-link');
            document.querySelector('.location-cottage-nav').classList.add('active-cottage-link');
            
            document.querySelector('.overview').style.display = 'none';
            document.querySelector('.facilities').style.display = 'none';
            document.querySelector('.location').style.display = 'block';
        },

        //--------------- CALENDAR ------------------------------------------//
        //---------calendar initiation-----------------------//

        calendarValues(year, month) { //populates calendar

            //---add days to calendar from first of month--//
            const daysInMonth = new Date(year, month + 1, 0, 12).getDate();
            let week = {};
            let prevDays = [];
            let days = [];
            let nextDays = [];
            let calendar = [];

            let n = 1;

            for (n; n <= daysInMonth; n++) {
                let date = new Date(year, month, n, 12);
                days.push(date.getDate());
                if (date.getDay() === 0) {
                    week.days = days;
                    calendar.push(week);
                    days = [];
                    week = {};
                }
            }
            week.days = days;
            days = [];

            while (calendar.length < 6) {
                let date = new Date(year, month, n, 12);
                nextDays.push(date.getDate());
                if (date.getDay() === 0) {
                    week.nextDays = nextDays;
                    calendar.push(week);
                    nextDays = [];
                    week = {};
                }
                n++;
            }
            
            //--fills first week with dates of previous month--//
            let datesToAdd = 7 - (calendar[0].days.length);
            for (let i = 0; i < datesToAdd; i++) {
                dateToAdd = (new Date(year, month, -i, 12)).getDate();
                prevDays.unshift(dateToAdd);
            }
            calendar[0].prevDays = prevDays;

            for (let i = 0; i < calendar.length; i++) {
                if (!calendar[i].prevDays) {
                    calendar[i].prevDays = [];
                }
                if (!calendar[i].days) {
                    calendar[i].days = [];
                }
                if (!calendar[i].nextDays) {
                    calendar[i].nextDays = [];
                }
            }

            return(calendar);
        },
        

        initCalendar(year, month, inputField) {
            calendarSwiper = new Swiper('.calendar-swiper', {
                navigation: {
                    nextEl: '.next-month',
                    prevEl: '.prev-month',
                  },
                  spaceBetween: 16
            });
            for (let i = 0; i < this.calendarRange; i++) {
                const instance = new calendarMonth({
                    data: {
                        field: inputField,
                    },
                    propsData: {
                        instYear: year,
                        instMonth: month + i,
                    }
                });
                let mountPoint = document.createElement('div');
                calendarSwiper.appendSlide(mountPoint);
                instance.$mount(mountPoint);
            }
            calendarSwiper.update();

            calendarSwiper.on('slideChange', () => {
                this.slideCount = calendarSwiper.activeIndex;
            })
        },
        
        //---------------------------- SELECT DATE FROM CALENDAR ---------------------------------------//
        selectDate(element, date) {
            if (element.classList.contains('available')) {
                if (element.classList.contains('arrival-date')) {
                    if (element.classList.contains('days')) {
                        this.removeArrivalDate();
                        this.arrivalDateFocus();
                        this.hideDateRange();
                    } 
                    return;
                } 
                else if (element.classList.contains('departure-date')) {
                    if (element.classList.contains('days')) {
                        this.removeDepartureDate();
                        this.hideDateRange();
                    }
                    return;
                }
                if (this.calendarSelector === 'arrival') {
                    if (!this.bookingFormData.departureDate) {
                        this.selectArrivalDate(element, date);
                        this.refreshDateRange(element, date);
                        this.showInvalidDates();
                        this.calendarSelector = 'departure';
                        this.departureDateFocus();
                    } else {
                        this.selectArrivalDate(element, date);
                        this.refreshDateRange(element, date);
                        this.showInvalidDates();
                        if (date >= this.departureDateObject || !this.isValidRange()) {
                            this.removeDepartureDate();
                            this.hideDateRange();
                        } else {
                            this.hideDateRange();
                            this.displayDateRange();
                        }
                        this.calendarSelector = 'departure';
                        this.departureDateFocus();
                    }
                } else {
                    if (this.bookingFormData.departureDate) {
                        this.hideDateRange();
                    }
                    this.selectDepartureDate(element, date);
                    this.displayDateRange();                
                }
            }
            if (this.arrivalDateObject && this.departureDateObject) {
                this.bookingFormData.price = this.calculatePrice(this.arrivalDateObject, this.departureDateObject);
                return;
            } else {
                this.bookingFormData.price = this.bookingFormData.dogs * this.pricePerDog;;
            }
        },
        selectArrivalDate(element, date) {
            let arrivalDates = document.querySelectorAll('.arrival-date');
            if (arrivalDates[0]) {
                arrivalDates[0].classList.remove('arrival-date');
            }
            if (arrivalDates[1]) {
                arrivalDates[1].classList.remove('arrival-date');
            }
            element.classList.add('arrival-date');
            this.bookingFormData.arrivalDate = date.toISOString().slice(0, 10);
            this.arrivalDateString = date.toDateString();
            this.arrivalDateObject = date;
        },
        selectDepartureDate(element, date) {
            if (!element.classList.contains('invalid-date')) {
                if (date > this.arrivalDateObject) {
                    let departureDates = document.querySelectorAll('.departure-date');
                    if (departureDates.length > 0) {
                        for (let i = 0; i < departureDates.length; i++) {
                            departureDates[i].classList.remove('departure-date');
                        }
                    }
                    element.classList.add('departure-date');
                    this.bookingFormData.departureDate = date.toISOString().slice(0, 10);
                    this.departureDateString = date.toDateString();
                    this.departureDateObject = date;
                } 
                else if (date <= this.arrivalDateObject) {
                    this.removeDepartureDate();
                }

                if (!element.classList.contains('days')) {
                    let calendarDates = Array.from(document.querySelectorAll('.calendar-date'));
                    let departureDateIndex = calendarDates.indexOf(element);
                    let departureDate = new Date(element.__vue__._props.dateYear, element.__vue__._props.dateMonth, element.__vue__._props.dateDate);
                    
                    if (element.classList.contains('next-days')) {
                        for (let i = departureDateIndex + 1; i < calendarDates.length; i++) {
                            let indexDate = new Date (calendarDates[i].__vue__._props.dateYear, calendarDates[i].__vue__._props.dateMonth, calendarDates[i].__vue__._props.dateDate);
        
                            if (+indexDate === +departureDate) {
                                calendarDates[i].classList.add('departure-date');
                                return;
                            }
                        }
                    }

                    if (element.classList.contains('prev-days')) {
                        for (let i = departureDateIndex - 1; i >= 0; i--) {
                            let indexDate = new Date (calendarDates[i].__vue__._props.dateYear, calendarDates[i].__vue__._props.dateMonth, calendarDates[i].__vue__._props.dateDate);
                            if (+indexDate === +departureDate) {
                                calendarDates[i].classList.add('departure-date');
                                return;
                            }
                        }
                    }
                }
            }
        },
        displayDateRange() {
            let calendarDateDays = Array.from(document.querySelectorAll('.days'));
            let arrivalIndex = calendarDateDays.indexOf(document.querySelector('.arrival-date.days'));
            let departureIndex = calendarDateDays.indexOf(document.querySelector('.departure-date.days'));

            for (let i = arrivalIndex + 1; i < departureIndex; i++) {
                calendarDateDays[i].classList.add('date-range');
            }
        },
        hideDateRange() {
            let dateRange = document.querySelectorAll('.date-range');

            for (let i = 0; i < dateRange.length; i++) {
                dateRange[i].classList.remove('date-range');
            }
        },
        removeArrivalDate() {
            let arrivalDates = document.querySelectorAll('.arrival-date');
            if (arrivalDates[0]) {
                arrivalDates[0].classList.remove('arrival-date');
            }
            if (arrivalDates[1]) {
                arrivalDates[1].classList.remove('arrival-date');
            }
            this.bookingFormData.arrivalDate = '';
            this.arrivalDateString = '';
            this.arrivalDateObject = undefined;
            this.hideInvalidDates();
            this.invalidDates = [];
            this.bookingFormData.price = this.bookingFormData.dogs * this.pricePerDog;;
        },
        removeDepartureDate() {
            let departureDates = document.querySelectorAll('.departure-date');
            for (let i = 0; i < departureDates.length; i++) {
                departureDates[i].classList.remove('departure-date');
            }
            this.bookingFormData.departureDate = '';
            this.departureDateString = '';
            this.departureDateObject = undefined;
            this.bookingFormData.price = this.bookingFormData.dogs * this.pricePerDog;;
        },
        refreshDateRange(element) {
            this.invalidDates = [];
            let calendarDates = Array.from(document.querySelectorAll('.calendar-date'));
            let arrivalIndex = calendarDates.indexOf(element);
            let arrivalDate = new Date(element.__vue__._props.dateYear, element.__vue__._props.dateMonth, element.__vue__._props.dateDate);

            let upperBound;
            let upperBoundDate;
            let validDate = true;
            for (let i = arrivalIndex; i < calendarDates.length; i++) {
                let indexDate = new Date (calendarDates[i].__vue__._props.dateYear, calendarDates[i].__vue__._props.dateMonth, calendarDates[i].__vue__._props.dateDate);
                if (calendarDates[i].classList.contains('booked') && validDate) {
                    upperBound = calendarDates[i];
                    upperBoundDate = new Date (upperBound.__vue__._props.dateYear, upperBound.__vue__._props.dateMonth, upperBound.__vue__._props.dateDate);
                    validDate = false;
                }
                if (+indexDate === +arrivalDate) {
                    calendarDates[i].classList.add('arrival-date');
                }
                else if (!validDate) {
                    if (indexDate >= upperBoundDate) {
                        this.invalidDates.push(calendarDates[i]);
                    } 
                }
                if (indexDate < arrivalDate) {
                    this.invalidDates.push(calendarDates[i]);
                }
            }

            for (let i = arrivalIndex - 1; i >= 0; i--) {
                let indexDate = new Date (calendarDates[i].__vue__._props.dateYear, calendarDates[i].__vue__._props.dateMonth, calendarDates[i].__vue__._props.dateDate);
                if (indexDate < arrivalDate) {
                    this.invalidDates.push(calendarDates[i]);
                } 
                else if (+indexDate === +arrivalDate) {
                    calendarDates[i].classList.add('arrival-date');
                }
            }
        },
        isValidRange() {
            let calendarDateDays = Array.from(document.querySelectorAll('.calendar-date.days'));
            let arrivalIndex = calendarDateDays.indexOf(document.querySelector('.arrival-date.days'));
            let departureIndex = calendarDateDays.indexOf(document.querySelector('.departure-date.days'));

            for (let i = arrivalIndex; i <= departureIndex; i++) {
                if (calendarDateDays[i].classList.contains('invalid-date') || calendarDateDays[i].classList.contains('booked')) {
                    return false;
                }
            } 
            return true;

        },      
        hideInvalidDates() {
            for (let i = 0; i < this.invalidDates.length; i++) {
                this.invalidDates[i].classList.remove('invalid-date');
            }
        },
        showInvalidDates() {
            for (let i = 0; i < this.invalidDates.length; i++) {
                this.invalidDates[i].classList.add('invalid-date');
            }
        },
        arrivalDateFocus() {
            document.querySelector('#departure-date').classList.remove('focused');
            document.querySelector('#departure-date').parentElement.classList.remove('focused');

            document.querySelector('#arrival-date').classList.add('focused');
            document.querySelector('#arrival-date').parentElement.classList.add('focused');

            document.querySelector('#guests').classList.remove('focused');
            document.querySelector('#guests').parentElement.classList.remove('focused');

            this.calendarSelector = 'arrival';
            this.hideInvalidDates();
        },
        arrivalDateBlur() {
            document.querySelector('#arrival-date').classList.remove('focused');
            document.querySelector('#arrival-date').parentElement.classList.remove('focused');
        },
        departureDateFocus() {
            if (!this.bookingFormData.arrivalDate && !this.bookingFormData.departureDate) {
                this.arrivalDateFocus();
                return;
            }
            document.querySelector('#arrival-date').classList.remove('focused');
            document.querySelector('#arrival-date').parentElement.classList.remove('focused');

            document.querySelector('#departure-date').classList.add('focused');
            document.querySelector('#departure-date').parentElement.classList.add('focused');

            document.querySelector('#guests').classList.remove('focused');
            document.querySelector('#guests').parentElement.classList.remove('focused');

            this.calendarSelector = 'departure';
            this.showInvalidDates();
        },
        departureDateBlur() {
            document.querySelector('#departure-date').classList.remove('focused');
            document.querySelector('#departure-date').parentElement.classList.remove('focused');
        },
        guestsFocus() {
            document.querySelector('#guests').classList.add('focused');
            document.querySelector('#guests').parentElement.classList.add('focused');

            document.querySelector('#arrival-date').classList.remove('focused');
            document.querySelector('#arrival-date').parentElement.classList.remove('focused');

            document.querySelector('#departure-date').classList.remove('focused');
            document.querySelector('#departure-date').parentElement.classList.remove('focused');
        },
        guestsBlur() {
            document.querySelector('#guests').classList.remove('focused');
            document.querySelector('#guests').parentElement.classList.remove('focused');
        },
        displayPartyOverlay() {
            this.guestsFocus();

            document.querySelector('.party-wrapper').classList.remove('closed');
            document.querySelector('.party-wrapper').classList.add('open');
            document.querySelector('.party-container').classList.add('open');
            document.querySelector('.party-container').style.transform = 'translate3d(0, 0, 0)';

            disableBodyScroll(document.querySelector('.party-container'));
        },
        hidePartyOverlay() {
            document.querySelector('#guests').focus();
            closePartyOverlay = true;
            document.querySelector('.party-wrapper').classList.remove('open');
            document.querySelector('.party-container').classList.remove('open');
            document.querySelector('.party-container').style.transform = 'translate3d(0, 100%, 0)';

            document.querySelector('.party-container').ontransitionend = function() {
                if (!document.querySelector('.party-wrapper').classList.contains('open') && closePartyOverlay) {
                    document.querySelector('.party-wrapper').classList.add('closed');
                    closePartyOverlay = false;

                    document.querySelector('#guests').blur();
                }
            }
            enableBodyScroll(document.querySelector('.party-container'));
        },
        //-----------------------BOOKING BOX ---------------------//
        calculatePrice(arrDate, depDate) {
            let price = this.bookingFormData.dogs * this.pricePerDog;
            for (let i = 0; i < priceList.length; i++) {
                if (priceList[i]['startDate'] <= arrDate && arrDate < priceList[i]['endDate']) {
                    price += priceList[i]['price'];
                    for (let j = i; j < priceList.length; j++) {
                        if (depDate <= priceList[j]['endDate']) {
                            return price;
                        } else {
                            price += priceList[j + 1]['price'];
                        }
                    }
                }
            }
        },

        //------------------CHECKOUT BUTTONS-------------------------//
        bookingProceed() {
            document.querySelector('.checkout-container').classList.remove('closed');
            this.checkoutScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            //transitionend event
            let pageSlide = this.pageSlide;
            document.querySelector('.checkout-container').ontransitionend = function(e) {
                if (e.target === document.querySelector('.checkout-container')) {
                    if (pageSlide === 0) {
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0;
                        setTimeout( () => {
                            document.querySelector('.checkout-container').classList.add('open');
                            setTimeout( () => {
                                document.querySelector('.content-wrapper').classList.add('closed');
                            }, 5)
                        }, 5);
                        pageSlide = 1;
                    } 
                    else if (pageSlide === 1) {
                        pageSlide = 1;
                    }
                }
            }
            this.pageSlide = pageSlide;

            document.querySelector('.hamburger').classList.add('back');
            document.querySelector('.navbar button').classList.add('hidden');
            this.checkoutStep = 1;
        },  
        bookingBack() {
            document.querySelector('.content-wrapper').classList.remove('closed');
            document.querySelector('.checkout-container').classList.remove('open');
            document.querySelector('.checkout-container').classList.add('closed');

            document.documentElement.scrollTop = this.checkoutScrollTop;
            document.body.scrollTop = this.checkoutScrollTop;

            document.querySelector('.hamburger').classList.remove('back');
            document.querySelector('.navbar button').classList.remove('hidden');
        },
        checkoutPrev() {
            if (this.checkoutStep === 1) {
                this.bookingBack();
            }
            else if (this.checkoutStep === 2) {
                document.querySelector('.checkout-2').style.display = 'none';
                document.querySelector('.checkout-2').classList.add('next');

                document.querySelector('.checkout-1').style.display = 'block';
                setTimeout( () => {
                    document.querySelector('.checkout-1').classList.remove('prev');
                }, 25);
            }
            else if (this.checkoutStep === 3) {
                document.querySelector('.checkout-3').style.display = 'none';
                document.querySelector('.checkout-3').classList.add('next');

                document.querySelector('.checkout-2').style.display = 'block';
                setTimeout( () => {
                    document.querySelector('.checkout-2').classList.remove('prev');
                }, 25);
                
            }
            this.checkoutStep--;
        },      
        checkoutNext() {
            if (this.checkoutStep === 1) {
                document.querySelector('.checkout-1').style.display = 'none';
                document.querySelector('.checkout-1').classList.add('prev');

                document.querySelector('.checkout-2').style.display = 'block';
                setTimeout( () => {
                    document.querySelector('.checkout-2').classList.remove('next');
                }, 25);
                
            } 
            else if (this.checkoutStep === 2) {
                document.querySelector('.checkout-2').style.display = 'none';
                document.querySelector('.checkout-2').classList.add('prev');

                document.querySelector('.checkout-3').style.display = 'block';
                setTimeout( () => {
                    document.querySelector('.checkout-3').classList.remove('next');
                }, 25);
                
            }
            this.checkoutStep++;
        },
        //----------------- BOOKING FORM (main)------------------------------------//
        //---------------PARTY INPUTS-------------------//
        adultsDecrease(e) {
            e.preventDefault();
            if (this.bookingFormData.adults > 0) {
                this.bookingFormData.adults--;
                document.querySelector('#adults .party-increase').classList.remove('inactive');
                document.querySelector('#children .party-increase').classList.remove('inactive');
            }
            if (this.bookingFormData.adults === 0) {
                document.querySelector('#adults div').classList.remove('active');
                document.querySelector('#adults .party-decrease').classList.add('inactive');
            } 
        },
        adultsIncrease(e) {
            e.preventDefault();
            if (this.bookingFormData.adults + this.bookingFormData.children < this.partyMax) {
                this.bookingFormData.adults++;  
                document.querySelector('#adults .party-decrease').classList.remove('inactive');
            } 
            if (this.bookingFormData.adults + this.bookingFormData.children === this.partyMax) {
                document.querySelector('#adults .party-increase').classList.add('inactive');
                document.querySelector('#children .party-increase').classList.add('inactive'); 
            } else {
                
            }
            document.querySelector('#adults div').classList.add('active');
        },
        childrenDecrease(e) {
            e.preventDefault();
            if (this.bookingFormData.children > 0) {
                this.bookingFormData.children--;
                document.querySelector('#children .party-increase').classList.remove('inactive');
                document.querySelector('#adults .party-increase').classList.remove('inactive');
            }
            if (this.bookingFormData.children === 0) {
                document.querySelector('#children div').classList.remove('active');
                document.querySelector('#children .party-decrease').classList.add('inactive');
            }
        },
        childrenIncrease(e) {
            e.preventDefault();
            if (this.bookingFormData.children + this.bookingFormData.adults < this.partyMax) {
                this.bookingFormData.children++;  
                document.querySelector('#children .party-decrease').classList.remove('inactive');
            } 
            if (this.bookingFormData.children + this.bookingFormData.adults === this.partyMax) {
                document.querySelector('#children .party-increase').classList.add('inactive');
                document.querySelector('#adults .party-increase').classList.add('inactive');
            }
            document.querySelector('#children div').classList.add('active');
        },
        infantsDecrease(e) {
            e.preventDefault();
            if (this.bookingFormData.infants > 0) {
                this.bookingFormData.infants--;
                document.querySelector('#infants .party-increase').classList.remove('inactive');
            }
            if (this.bookingFormData.infants === 0) {
                document.querySelector('#infants div').classList.remove('active');
                document.querySelector('#infants .party-decrease').classList.add('inactive');
            }
        },
        infantsIncrease(e) {
            e.preventDefault();
            if (this.bookingFormData.infants < this.infantsMax) {
                this.bookingFormData.infants++;
                document.querySelector('#infants .party-decrease').classList.remove('inactive');
            }
            if (this.bookingFormData.infants === this.infantsMax) {
                document.querySelector('#infants .party-increase').classList.add('inactive');
            }
            document.querySelector('#infants div').classList.add('active');
        },
        dogsDecrease(e) {
            e.preventDefault();
            if (this.bookingFormData.dogs > 0) {
                this.bookingFormData.dogs--;
                document.querySelector('#dogs .party-increase').classList.remove('inactive');
            }
            if (this.bookingFormData.dogs === 0) {
                document.querySelector('#dogs div').classList.remove('active');
                document.querySelector('#dogs .party-decrease').classList.add('inactive');
            }
            this.bookingFormData.price -= this.bookingFormData.dogs * this.pricePerDog;
        },
        dogsIncrease(e) {
            e.preventDefault();
            if (this.bookingFormData.dogs < this.dogsMax) {
                this.bookingFormData.dogs++;
                document.querySelector('#dogs .party-decrease').classList.remove('inactive');
            }
            if (this.bookingFormData.dogs === this.dogsMax) {
                document.querySelector('#dogs .party-increase').classList.add('inactive');
            }
            document.querySelector('#dogs div').classList.add('active');
            this.bookingFormData.price += this.bookingFormData.dogs * this.pricePerDog;
        },

        //-----------personal details//
        inputFocus(e) {
            e.target.classList.add('focused');
            e.target.classList.remove('activated');
            e.target.classList.remove('invalid');
            
            e.target.labels[0].classList.add('focused');
            e.target.labels[0].classList.remove('activated');
            e.target.labels[0].classList.remove('invalid');

            e.target.parentElement.classList.add('focused');

            e.target.parentElement.querySelector('.clear-icon').classList.add('visible');
        },
        inputBlur(e) {
            e.target.classList.remove('focused');
            e.target.labels[0].classList.remove('focused');
            e.target.parentElement.classList.remove('focused');
            e.target.parentElement.querySelector('.clear-icon').classList.remove('visible');
            
            if (e.target.value) {
                e.target.classList.add('activated');
                e.target.labels[0].classList.add('activated');
            }
        },
        inputInvalid(e) {
            console.log('invalid');
            e.preventDefault();
            e.target.classList.add('invalid');
        },
        
        submitBooking() {
            console.log(JSON.stringify(this.bookingFormData));

            fetch('/booking', {
                method: 'post',
                body: JSON.stringify(this.bookingFormData),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
                .then(response => {
                    return (response.json());
                })
                .then(json => {
                    if (json['success']) {
                        console.log('request successful');
                    } else {
                        console.log('request unsuccessful');
                    }
                })
        },
        viewFullScreen() {
            const element = this.$refs.galleryView;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { /* Firefox */
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                element.msRequestFullscreen();
            }
        },
    },
    delimiters: ['<%', '%>']
})

const priceList = [
    { 'startDate': new Date(2020, 7, 15), 'endDate': new Date(2020, 7, 22, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 7, 22), 'endDate': new Date(2020, 7, 29, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 7, 29), 'endDate': new Date(2020, 8, 5, 12), 'price': 1000.00},
    { 'startDate': new Date(2020, 8, 5), 'endDate': new Date(2020, 8, 12, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 8, 12), 'endDate': new Date(2020, 8, 19, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 8, 19), 'endDate': new Date(2020, 8, 26, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 8, 26), 'endDate': new Date(2020, 9, 3, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 9, 3), 'endDate': new Date(2020, 9, 10, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 9, 10), 'endDate': new Date(2020, 9, 17, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 9, 17), 'endDate': new Date(2020, 9, 24, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 9, 24), 'endDate': new Date(2020, 9, 31, 12), 'price': 1000.00 },
    { 'startDate': new Date(2020, 9, 31), 'endDate': new Date(2020, 10, 7, 12), 'price': 1000.00 },
]

const bookedDates =
    fetch('/dates', { method: 'post' })
        .then(response => {
            return (response.json());
        })
        .then(json => {
            return (json['dates']);
        })

let field = '';

vm.initCalendar(vm.currentYear, vm.currentMonth, field);
