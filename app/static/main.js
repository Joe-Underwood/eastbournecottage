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
    if (window.screen.height > window.screen.width) {
        if (document.documentElement.offsetHeight > document.documentElement.offsetWidth) {
            heroHeight = window.screen.height;
            newOrientation = 'portait';
        }
        else {
            heroHeight = window.screen.width;
            newOrientation = 'landscape';
        }
    } 
    else {
        if (document.documentElement.offsetWidth > document.documentElement.offsetHeight) {
            heroHeight = window.screen.height;
            newOrientation = 'landscape';
        }
        else {
            heroHeight = window.screen.width;
            newOrientation = 'portait';
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
zenscroll.setup(500, 56);

//---------------CALENDAR COMPONENTS---------------------------------------//

Vue.component('calendar-date', {
    props: ['dateYear', 'dateMonth', 'dateDate', 'isChangeoverData'],
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
        },
        isChangeover: function () {
            if (this.isChangeoverData) {
                return 'changeover-date';
            }
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
                if (calendarSwiper.params.slidesPerView === 1) {
                    if (element.classList.contains('prev-days')) {
                        calendarSwiper.slidePrev();
                    } 
                    else if (element.classList.contains('next-days')) {
                        calendarSwiper.slideNext();
                    }
                }
                else if (calendarSwiper.params.slidesPerView === 2) {
                    if ((element.classList.contains('prev-days')) && calendarSwiper.slides[calendarSwiper.activeIndex].contains(element)) {
                        calendarSwiper.slidePrev();
                    } 
                    else if ((element.classList.contains('next-days')) && calendarSwiper.slides[calendarSwiper.activeIndex + 1].contains(element)) {
                        calendarSwiper.slideNext();
                    }
                }
            }
        }
    },
    template: `<div :class="['calendar-date', availability, isChangeover]" v-on:click="selectDate(_vnode.elm, selfDate); slide(_vnode.elm);">
                   <div>{{ dateDate }}</div>
               </div>`
})

const calendarMonth = Vue.extend({
    props: ['instYear', 'instMonth', 'instChangeoverDates'],
    computed: {           
        instCalendarValues: function () {
            return (vm.calendarValues(this.instYear, this.instMonth));
        }
    },
    methods: {
        weekRow(week) {
            return `${this.instCalendarValues.indexOf(week) + 3} / span 1`;
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
        },
        changeoverData(year, month, date) {
            const calendarDate = new Date(year, month, date, 12);
            for (segment in this.instChangeoverDates) {
                if (calendarDate.toISOString().slice(0, 10) === this.instChangeoverDates[segment]['startDate']) {
                    return this.instChangeoverDates[segment];
                } 
            }
            return false;
        },
        prevChangeoverData(year, month, date) {
            const calendarDate = new Date(this.prevYear(year, month), this.prevMonth(month - 1), date, 12);
            for (segment in this.instChangeoverDates) {
                if (calendarDate.toISOString().slice(0, 10) === this.instChangeoverDates[segment]['startDate']) {
                    return this.instChangeoverDates[segment];
                } 
            }
            return false;
        },
        nextChangeoverData(year, month, date) {
            const calendarDate = new Date(this.nextYear(year, month), this.nextMonth(month + 1), date, 12);
            for (segment in this.instChangeoverDates) {
                if (calendarDate.toISOString().slice(0, 10) === this.instChangeoverDates[segment]['startDate']) {
                    return this.instChangeoverDates[segment];
                } 
            }
            return false;
        }
    },
    template: `<div class="swiper-slide">
                   <div class="calendar-month" style="{ display: 'grid', 'grid-template-rows': 'repeat(8, 1fr)' }">
                       <div class="current-month" :style="{ 'grid-row': '1', height: '48px', 'padding-top': '8px' }">{{ new Date(instYear, instMonth).toLocaleString('default', { month: 'long' }) }} {{ new Date(instYear, instMonth).getFullYear() }}</div>
                       <div :style="{ 'grid-row': '2', height: '28px' }"></div>
                       <div class="calendar-week" v-for="week in instCalendarValues" :style="{ 'grid-row': weekRow(week), display: 'grid', 'grid-template-columns': 'repeat(7, 1fr)' }">
                           <calendar-date v-for="date in week.prevDays" class="prev-days" :style="{ 'grid-column': prevDateColumn(week.prevDays, date) }" :dateYear="prevYear(instYear, instMonth)" :dateMonth="prevMonth(instMonth - 1)" :dateDate="date" :isChangeoverData="prevChangeoverData(instYear, instMonth, date)"></calendar-date>
                           <calendar-date v-for="date in week.days" class="days" :style="{ 'grid-column': dateColumn(week.days, date, week) }" :dateYear="instYear" :dateMonth="instMonth" :dateDate="date" :isChangeoverData="changeoverData(instYear, instMonth, date)"></calendar-date>
                           <calendar-date v-for="date in week.nextDays" class="next-days" :style="{ 'grid-column': nextDateColumn(week.nextDays, date, week) }" :dateYear="nextYear(instYear, instMonth)" :dateMonth="nextMonth(instMonth + 1)" :dateDate="date" :isChangeoverData="nextChangeoverData(instYear, instMonth, date)"></calendar-date>
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
            stayPrice: 0,
            dogPrice: 0,
            stayDiscount: 0,
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
        departure1Week: [],
        departure2Week: [],
        departure3Week: [],
        departure4Week: [],
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
        offsetY: undefined,
        //guests-dropdown
        guestsDropdownOpen: false,
        getPriceList: [],
        getPublicPriceListSettings: []

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
    asyncComputed: {
    },
    methods: {
        //-------------------- NAVBAR METHODS ------------------------//
        scrollToTop() {
            console.log('top');
            zenscroll.toY(0);
        },
        goToCottage(e) {
            if (e.target.classList.contains('cottage-link')) {
                zenscroll.to(document.querySelector('.cottage'));
                if (document.querySelector('.side-menu').classList.contains('open')) {
                    this.toggleSideMenu();
                }
            }
        },
        goToCottageGallery() {
            zenscroll.to(document.querySelector('.cottage'));
            if (document.querySelector('.side-menu').classList.contains('open')) {
                this.toggleSideMenu();
            }
        },
        goToCottageOverview() {
            zenscroll.to(document.querySelector('.cottage-spacer'));
            this.showOverview();
            if (document.querySelector('.side-menu').classList.contains('open')) {
                this.toggleSideMenu();
            }
        },
        goToCottageFacilities() {
            zenscroll.to(document.querySelector('.cottage-spacer'));
            this.showFacilities();
            if (document.querySelector('.side-menu').classList.contains('open')) {
                this.toggleSideMenu();
            }
        },
        goToCottageLocation() {
            zenscroll.to(document.querySelector('.cottage-spacer'));
            this.showLocation();
            if (document.querySelector('.side-menu').classList.contains('open')) {
                this.toggleSideMenu();
            }
        },
        goToBooking() {
            zenscroll.to(document.querySelector('.booking'));
            if (document.querySelector('.side-menu').classList.contains('open')) {
                this.toggleSideMenu();
            }
        },
        goToContact() {
            zenscroll.to(document.querySelector('.contact'));
            if (document.querySelector('.side-menu').classList.contains('open')) {
                this.toggleSideMenu();
            }
        },
        bookCTAPress() {
            console.log('bookCTAPress');
            //goes to booking section when navbar cta button is pressed
            zenscroll.to(document.querySelector('.calendar-spacer'));
            if (document.querySelector('.side-menu').classList.contains('open')) {
                this.toggleSideMenu();
            }
        },
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
            const endDate = new Date(this.getPriceList[this.getPriceList.length - 1]['startDate']);
            endDate.setDate(endDate.getDate() + +this.getPublicPriceListSettings['maxSegmentLength']);
            const startDate = new Date(year, month);
            let monthRange = (endDate.getMonth() - startDate.getMonth()) + 12 * (endDate.getFullYear() - startDate.getFullYear());

            for (let i = 0; i <= monthRange; i++) {
                const instance = new calendarMonth({
                    data: {
                        field: inputField,
                    },
                    propsData: {
                        instYear: year,
                        instMonth: month + i,
                        instChangeoverDates: this.getPriceList
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
        bookingHelperText() {
            if (!this.bookingFormData.arrivalDate) {
                document.querySelector('.booking-helper-text').innerHTML = 'Select arrival date from calendar';
            }
            else if (!this.bookingFormData.departureDate) {
                document.querySelector('.booking-helper-text').innerHTML = 'Select departure date from calendar';
            }
            else if (!this.bookingFormData.adults) {
                document.querySelector('.booking-helper-text').innerHTML = 'Dates available - select guests to continue';
            }
            else {
                document.querySelector('.booking-helper-text').innerHTML = 'Dates available';
            }
        },
        bookingShowTotal() {
            if (this.bookingFormData.arrivalDate && this.bookingFormData.departureDate) {
                document.querySelector('.total-breakdown').classList.add('show');
                document.querySelector('.stay-length-total').innerHTML = '<div>1 week</div><div>£500.00</div>';
                if (this.bookingFormData.dogs) {
                    document.querySelector('.dog-total').classList.add('show');
                    document.querySelector('.dog-total').innerHTML = '<div>1 dog</div><div>£20.00</div>';
                }
            }
            else {
                document.querySelector('.total-breakdown').classList.remove('show');
                document.querySelector('.dog-total').classList.remove('show');
            }
        },
        selectDate(element, date) {
            if (element.classList.contains('available')) {
                if (element.classList.contains('arrival-date')) {
                    this.removeArrivalDate();
                    this.arrivalDateFocus();
                    this.hideDateRange();
                    this.bookingHelperText();
                    this.bookingShowTotal();
                } 
                else if (element.classList.contains('departure-date')) {
                    this.removeDepartureDate();
                    this.hideDateRange();
                    this.bookingHelperText();
                    this.bookingShowTotal();
                }
                else if (this.calendarSelector === 'arrival') {
                    if (element.classList.contains('changeover-date')) {
                        if (!this.bookingFormData.departureDate) {
                            this.selectArrivalDate(element, date);
                            this.showInvalidDates();
                            this.calendarSelector = 'departure';
                            this.departureDateFocus();
                        } else if (element.classList.contains('valid-arrival-date')) {
                            this.selectArrivalDate(element, date);
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
                    }
                } else if (element.classList.contains('valid-departure-date')) {
                    if (this.bookingFormData.departureDate) {
                        this.hideDateRange();
                    }
                    this.selectDepartureDate(element, date);
                    this.displayDateRange();                
                }
            }

            
            if (this.arrivalDateObject && this.departureDateObject) {
                this.hideValidArrivalDates();
                this.hideValidDepartureDates();
                this.showValidDepartureDates(document.querySelector('.arrival-date'));
                

                if (this.departure1Week.includes(document.querySelector('.departure-date'))) {
                    this.bookingFormData.stayPrice = +document.querySelector('.arrival-date').__vue__._props.isChangeoverData.price;    
                }
                else if (this.departure2Week.includes(document.querySelector('.departure-date'))) {
                    this.bookingFormData.stayPrice = +document.querySelector('.arrival-date').__vue__._props.isChangeoverData.price2Weeks;
                }
                else if (this.departure3Week.includes(document.querySelector('.departure-date'))) {
                    this.bookingFormData.stayPrice = +document.querySelector('.arrival-date').__vue__._props.isChangeoverData.price3Weeks;
                }
                else if (this.departure4Week.includes(document.querySelector('.departure-date'))) {
                    this.bookingFormData.stayPrice = +document.querySelector('.arrival-date').__vue__._props.isChangeoverData.price4Weeks;
                }
                
            } 
            else if (this.arrivalDateObject && !this.departureDateObject) {
                this.hideValidArrivalDates();
                this.hideValidDepartureDates();
                this.showValidDepartureDates(document.querySelector('.arrival-date'));
                this.bookingFormData.stayPrice = 0;
            } 
            else if (!this.arrivalDateObject && this.departureDateObject) {
                this.hideValidArrivalDates();
                this.hideValidDepartureDates();
                let departureDateArray = Array.from(document.querySelectorAll('.departure-date'));
                this.showValidArrivalDates(departureDateArray[departureDateArray.length - 1]);
                this.showValidArrivalDates(document.querySelector('.departure-date.days'));
                this.bookingFormData.stayPrice = 0;
            }
            else {
                this.hideValidArrivalDates();
                this.hideValidDepartureDates();
                this.bookingFormData.stayPrice = 0;
            }
            this.bookingHelperText();
            this.bookingShowTotal();
            if (this.arrivalDateObject) {
                this.refreshDateRange();
            }
            this.bookingFormData.price = (+this.bookingFormData.stayPrice + +this.bookingFormData.dogPrice).toFixed(2);
            
            
        },
        showValidDepartureDates(arrivalElement) {
            const changeoverData = arrivalElement.__vue__._props.isChangeoverData;
            let lastDepartureElement;
            if (+changeoverData.price) {
                lastDepartureElement = this.addNextValidDepartureDate(arrivalElement, 1);
            }
            if (+changeoverData.price2Weeks && lastDepartureElement) {
                lastDepartureElement = this.addNextValidDepartureDate(lastDepartureElement, 2);
            }
            if (+changeoverData.price3Weeks && lastDepartureElement) {
                lastDepartureElement = this.addNextValidDepartureDate(lastDepartureElement, 3);
            }
            if (+changeoverData.price4Weeks && lastDepartureElement) {
                lastDepartureElement = this.addNextValidDepartureDate(lastDepartureElement, 4)
            }
            const validDepartureArray = Array.from(document.querySelectorAll('.valid-departure-date'));
            if (lastDepartureElement) {
                for (date in validDepartureArray) {
                    if (new Date(validDepartureArray[date].__vue__._props.dateYear, validDepartureArray[date].__vue__._props.dateMonth, validDepartureArray[date].__vue__._props.dateDate) > new Date(lastDepartureElement.__vue__._props.dateYear, lastDepartureElement.__vue__._props.dateMonth, lastDepartureElement.__vue__._props.dateDate)) {
                        validDepartureArray[date].classList.remove('valid-departure-date');
                    }
                }
            }
        },
        addNextValidDepartureDate(element, week) {
            const changeoverArray = Array.from(document.querySelectorAll('.changeover-date'));
            let prevElementIndex = changeoverArray.indexOf(element);
            if (changeoverArray[prevElementIndex + 1]) {
                let newElement = changeoverArray[prevElementIndex + 1];
                if (newElement.classList.contains('arrival-date')) {
                    return (this.addNextValidDepartureDate(newElement, week));
                }
                newElement.classList.add('valid-departure-date');
                if (week === 1) {
                    this.departure1Week.push(newElement);
                }
                else if (week === 2) {
                    this.departure2Week.push(newElement);
                }
                else if (week === 3) {
                    this.departure3Week.push(newElement);
                }
                else if (week === 4) {
                    this.departure4Week.push(newElement);
                }
                if (!newElement.classList.contains('days')) {
                    return (this.addNextValidDepartureDate(newElement, week));
                } 
                else {
                    return(newElement);
                }
            }
            else {
                return false;
            }
            
        },
        showValidArrivalDates(departureElement) {
            let prevArrivalDate = departureElement;
            for (let i = 1; i <= 4; i++) {
                if (prevArrivalDate) {
                    prevArrivalDate = this.checkPreviousValidArrivalDate(prevArrivalDate, i);
                }
                else {
                    break;
                }
            }
            let validArrivalArray = Array.from(document.querySelectorAll('.valid-arrival-date'));
            for (date in validArrivalArray) {
                if (new Date(validArrivalArray[date].__vue__._props.dateYear, validArrivalArray[date].__vue__._props.dateMonth, validArrivalArray[date].__vue__._props.dateDate) >= new Date(departureElement.__vue__._props.dateYear, departureElement.__vue__._props.dateMonth, departureElement.__vue__._props.dateDate)) {
                    validArrivalArray[date].classList.remove('valid-arrival-date');
                }
            }
        },
        checkPreviousValidArrivalDate(prevElement, week) {
            const changeoverArray = Array.from(document.querySelectorAll('.changeover-date'));
            if (changeoverArray[changeoverArray.indexOf(prevElement) - 1]) {
                let element = changeoverArray[changeoverArray.indexOf(prevElement) - 1];
                if (element.classList.contains('departure-date')) {
                    return (this.checkPreviousValidArrivalDate(element, week));
                }
                if (week === 1 && element.__vue__._props.isChangeoverData.price) {
                    element.classList.add('valid-arrival-date');
                }
                else if (week === 2 && element.__vue__._props.isChangeoverData.price2Weeks) {
                    element.classList.add('valid-arrival-date');
                }
                else if (week === 3 && element.__vue__._props.isChangeoverData.price3Weeks) {
                    element.classList.add('valid-arrival-date');
                }
                else if (week === 4 && element.__vue__._props.isChangeoverData.price4Weeks) {
                    element.classList.add('valid-arrival-date');
                }
                else {
                    return false;
                }
                if (!element.classList.contains('days')) {
                    return (this.checkPreviousValidArrivalDate(element, week));
                }
                return element;
            }
            else {
                return false;
            }
            
        },
        hideValidDepartureDates() {
            this.departure1Week.length = 0;
            this.departure2Week.length = 0;
            this.departure3Week.length = 0;
            this.departure4Week.length = 0;
            const validDepartureNodeList = document.querySelectorAll('.valid-departure-date');
            const validDepartureArray = Array.from(validDepartureNodeList);
            for (let i = 0; i < validDepartureArray.length; i++) {
                validDepartureNodeList[i].classList.remove('valid-departure-date');
            }
        },
        hideValidArrivalDates() {
            const validArrivalNodeList = document.querySelectorAll('.valid-arrival-date');
            const validArrivalArray = Array.from(validArrivalNodeList);
            for (let i = 0; i < validArrivalArray.length; i++) {
                validArrivalNodeList[i].classList.remove('valid-arrival-date');
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
        },
        removeDepartureDate() {
            let departureDates = document.querySelectorAll('.departure-date');
            for (let i = 0; i < departureDates.length; i++) {
                departureDates[i].classList.remove('departure-date');
            }
            this.bookingFormData.departureDate = '';
            this.departureDateString = '';
            this.departureDateObject = undefined;
        },
        refreshDateRange() {
            let element = document.querySelector('.arrival-date');
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
            document.querySelector('#departure-date').parentElement.children[0].classList.remove('focused');

            document.querySelector('#arrival-date').classList.add('focused');
            document.querySelector('#arrival-date').parentElement.classList.add('focused');
            document.querySelector('#arrival-date').parentElement.children[0].classList.add('focused');

            document.querySelector('#guests').classList.remove('focused');
            document.querySelector('#guests').parentElement.classList.remove('focused');
            document.querySelector('#guests').parentElement.children[0].classList.remove('focused');

            this.calendarSelector = 'arrival';
            this.hideInvalidDates();
        },
        arrivalDateBlur() {
            document.querySelector('#arrival-date').classList.remove('focused');
            document.querySelector('#arrival-date').parentElement.classList.remove('focused');
            document.querySelector('#arrival-date').parentElement.children[0].classList.remove('focused');
        },
        departureDateFocus() {
            if (!this.bookingFormData.arrivalDate && !this.bookingFormData.departureDate) {
                this.arrivalDateFocus();
                return;
            }
            document.querySelector('#arrival-date').classList.remove('focused');
            document.querySelector('#arrival-date').parentElement.classList.remove('focused');
            document.querySelector('#arrival-date').parentElement.children[0].classList.remove('focused');

            document.querySelector('#departure-date').classList.add('focused');
            document.querySelector('#departure-date').parentElement.classList.add('focused');
            document.querySelector('#departure-date').parentElement.children[0].classList.add('focused');

            document.querySelector('#guests').classList.remove('focused');
            document.querySelector('#guests').parentElement.classList.remove('focused');
            document.querySelector('#guests').parentElement.children[0].classList.remove('focused');

            this.calendarSelector = 'departure';
            this.showInvalidDates();
        },
        departureDateBlur() {
            document.querySelector('#departure-date').classList.remove('focused');
            document.querySelector('#departure-date').parentElement.classList.remove('focused');
            document.querySelector('#departure-date').parentElement.children[0].classList.remove('focused');
        },
        guestsFocus() {
            document.querySelector('#guests').classList.add('focused');
            document.querySelector('#guests').parentElement.classList.add('focused');
            document.querySelector('#guests').parentElement.children[0].classList.add('focused');

            document.querySelector('#arrival-date').classList.remove('focused');
            document.querySelector('#arrival-date').parentElement.classList.remove('focused');
            document.querySelector('#arrival-date').parentElement.children[0].classList.remove('focused');

            document.querySelector('#departure-date').classList.remove('focused');
            document.querySelector('#departure-date').parentElement.classList.remove('focused');
            document.querySelector('#departure-date').parentElement.children[0].classList.remove('focused');
        },
        guestsBlur() {
            document.querySelector('#guests').classList.remove('focused');
            document.querySelector('#guests').parentElement.classList.remove('focused');
            document.querySelector('#guests').parentElement.children[0].classList.remove('focused');
        },
        displayPartyOverlay() {
            const x = window.matchMedia("(max-width: 735px)");
            this.guestsFocus();

            if (x.matches) {
                document.querySelector('.party-wrapper').classList.remove('closed');
                document.querySelector('.party-wrapper').classList.add('open');
                document.querySelector('.party-container').classList.add('open');
                document.querySelector('.party-container').style.transform = 'translate3d(0, 0, 0)';
    
                disableBodyScroll(document.querySelector('.party-container'));
            } 
            else {
                document.querySelector('.guests-dropdown').classList.add('open');
                window.addEventListener('click', this.hideGuestsDropdown);
            }
            
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
        hideGuestsDropdown(e) {
            if (!this.guestsDropdownOpen) {
                this.guestsDropdownOpen = true;
            }
            else if (!document.querySelector('.guests-dropdown').contains(e.target)) {
                document.querySelector('.guests-dropdown').classList.remove('open');
                this.guestsBlur();
                window.removeEventListener('click', this.hideGuestsDropdown);
                this.guestsDropdownOpen = false;
            }
            /*if (!document.querySelector('.guests-dropdown').contains(e.target)) {
                document.querySelector('.guests-dropdown').classList.remove('open');
                document.querySelector('.guests-dropdown').blur();
                this.guestsBlur();
                window.removeEventListener('click', this.hideGuestsDropdown);
            }*/
            
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
                document.querySelectorAll('#adults .party-increase')[0].classList.remove('inactive');
                document.querySelectorAll('#children .party-increase')[0].classList.remove('inactive');
                document.querySelectorAll('#adults .party-increase')[1].classList.remove('inactive');
                document.querySelectorAll('#children .party-increase')[1].classList.remove('inactive');
            }
            if (this.bookingFormData.adults === 0) {
                document.querySelectorAll('#adults div')[0].classList.remove('active');
                document.querySelectorAll('#adults .party-decrease')[0].classList.add('inactive');
                document.querySelectorAll('#adults div')[1].classList.remove('active');
                document.querySelectorAll('#adults .party-decrease')[1].classList.add('inactive');
            } 
            this.bookingHelperText();
            this.bookingShowTotal();
        },
        adultsIncrease(e) {
            e.preventDefault();
            if (this.bookingFormData.adults + this.bookingFormData.children < this.partyMax) {
                this.bookingFormData.adults++;  
                document.querySelectorAll('#adults .party-decrease')[0].classList.remove('inactive');
                document.querySelectorAll('#adults .party-decrease')[1].classList.remove('inactive');
            } 
            if (this.bookingFormData.adults + this.bookingFormData.children === this.partyMax) {
                document.querySelectorAll('#adults .party-increase')[0].classList.add('inactive');
                document.querySelectorAll('#children .party-increase')[0].classList.add('inactive'); 
                document.querySelectorAll('#adults .party-increase')[1].classList.add('inactive');
                document.querySelectorAll('#children .party-increase')[1].classList.add('inactive'); 
            } 
            document.querySelector('#adults div').classList.add('active');
            this.bookingHelperText();
            this.bookingShowTotal();
        },
        childrenDecrease(e) {
            e.preventDefault();
            if (this.bookingFormData.children > 0) {
                this.bookingFormData.children--;
                document.querySelectorAll('#children .party-increase')[0].classList.remove('inactive');
                document.querySelectorAll('#adults .party-increase')[0].classList.remove('inactive');
                document.querySelectorAll('#children .party-increase')[1].classList.remove('inactive');
                document.querySelectorAll('#adults .party-increase')[1].classList.remove('inactive');
            }
            if (this.bookingFormData.children === 0) {
                document.querySelectorAll('#children div')[0].classList.remove('active');
                document.querySelectorAll('#children .party-decrease')[0].classList.add('inactive');
                document.querySelectorAll('#children div')[1].classList.remove('active');
                document.querySelectorAll('#children .party-decrease')[1].classList.add('inactive');
            }
            this.bookingShowTotal();
        },
        childrenIncrease(e) {
            e.preventDefault();
            if (this.bookingFormData.children + this.bookingFormData.adults < this.partyMax) {
                this.bookingFormData.children++;  
                document.querySelectorAll('#children .party-decrease')[0].classList.remove('inactive');
                document.querySelectorAll('#children .party-decrease')[1].classList.remove('inactive');
            } 
            if (this.bookingFormData.children + this.bookingFormData.adults === this.partyMax) {
                document.querySelectorAll('#children .party-increase')[0].classList.add('inactive');
                document.querySelectorAll('#adults .party-increase')[0].classList.add('inactive');
                document.querySelectorAll('#children .party-increase')[1].classList.add('inactive');
                document.querySelectorAll('#adults .party-increase')[1].classList.add('inactive');
            }
            document.querySelectorAll('#children div')[0].classList.add('active');
            document.querySelectorAll('#children div')[1].classList.add('active');
            this.bookingShowTotal();
        },
        infantsDecrease(e) {
            e.preventDefault();
            if (this.bookingFormData.infants > 0) {
                this.bookingFormData.infants--;
                document.querySelectorAll('#infants .party-increase')[0].classList.remove('inactive');
                document.querySelectorAll('#infants .party-increase')[1].classList.remove('inactive');
            }
            if (this.bookingFormData.infants === 0) {
                document.querySelectorAll('#infants div')[0].classList.remove('active');
                document.querySelectorAll('#infants .party-decrease')[0].classList.add('inactive');
                document.querySelectorAll('#infants div')[1].classList.remove('active');
                document.querySelectorAll('#infants .party-decrease')[1].classList.add('inactive');
            }
            this.bookingShowTotal();
        },
        infantsIncrease(e) {
            e.preventDefault();
            if (this.bookingFormData.infants < this.infantsMax) {
                this.bookingFormData.infants++;
                document.querySelectorAll('#infants .party-decrease')[0].classList.remove('inactive');
                document.querySelectorAll('#infants .party-decrease')[1].classList.remove('inactive');
            }
            if (this.bookingFormData.infants === this.infantsMax) {
                document.querySelectorAll('#infants .party-increase')[0].classList.add('inactive');
                document.querySelectorAll('#infants .party-increase')[1].classList.add('inactive');
            }
            document.querySelectorAll('#infants div')[0].classList.add('active');
            document.querySelectorAll('#infants div')[1].classList.add('active');
            this.bookingShowTotal();
        },
        dogsDecrease(e) {
            e.preventDefault();
            if (this.bookingFormData.dogs > 0) {
                this.bookingFormData.dogs--;
                document.querySelectorAll('#dogs .party-increase')[0].classList.remove('inactive');
                document.querySelectorAll('#dogs .party-increase')[1].classList.remove('inactive');
            }
            if (this.bookingFormData.dogs === 0) {
                document.querySelectorAll('#dogs div')[0].classList.remove('active');
                document.querySelectorAll('#dogs .party-decrease')[0].classList.add('inactive');
                document.querySelectorAll('#dogs div')[1].classList.remove('active');
                document.querySelectorAll('#dogs .party-decrease')[1].classList.add('inactive');
            }
            this.bookingFormData.dogPrice = +this.bookingFormData.dogs * +this.pricePerDog;
            this.bookingFormData.price = (+this.bookingFormData.stayPrice + +this.bookingFormData.dogPrice).toFixed(2);
            this.bookingShowTotal();
        },
        dogsIncrease(e) {
            e.preventDefault();
            if (this.bookingFormData.dogs < this.dogsMax) {
                this.bookingFormData.dogs++;
                document.querySelectorAll('#dogs .party-decrease')[0].classList.remove('inactive');
                document.querySelectorAll('#dogs .party-decrease')[1].classList.remove('inactive');
            }
            if (this.bookingFormData.dogs === this.dogsMax) {
                document.querySelectorAll('#dogs .party-increase')[0].classList.add('inactive');
                document.querySelectorAll('#dogs .party-increase')[1].classList.add('inactive');
            }
            document.querySelectorAll('#dogs div')[0].classList.add('active');
            document.querySelectorAll('#dogs div')[1].classList.add('active');
            this.bookingFormData.dogPrice = +this.bookingFormData.dogs * +this.pricePerDog;
            this.bookingFormData.price = (+this.bookingFormData.stayPrice + +this.bookingFormData.dogPrice).toFixed(2);
            this.bookingShowTotal();
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

            /*e.target.parentElement.querySelector('.clear-icon').classList.add('visible');*/
        },
        inputBlur(e) {
            e.target.classList.remove('focused');
            e.target.labels[0].classList.remove('focused');
            e.target.parentElement.classList.remove('focused');
            /*e.target.parentElement.querySelector('.clear-icon').classList.remove('visible');*/
            
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

calendarSwiper = new Swiper('.calendar-swiper', {
    navigation: {
        nextEl: '.next-month',
        prevEl: '.prev-month',
      },
      spaceBetween: 16,
});

async function getPriceListData() {
    try {
        const data = await Promise.all([
            fetch('/get_prices', { method: 'post' })
                .then(response => {
                    return (response.json());
                })
                .then(json => {
                    return (json['priceList']);
                })
                .then(priceList => {
                    vm.getPriceList = priceList;
                }),
            fetch('/get_public_price_list_settings', { method: 'post' })
                .then(response => {
                    return (response.json());
                })
                .then(json => {
                    return (json['publicPriceListSettings']);
                })
                .then((settings) => {
                    vm.getPublicPriceListSettings = settings;
                })
        ])
        .then(() => {
            vm.initCalendar(vm.currentYear, vm.currentMonth, field);
        })
    }
    catch (error) {
        console.log(error);
    }
}

getPriceListData();


//------ toggle calendarSwiper slides per view (responsive)-------------//

function toggleCalendarSlides(x) {
    if (x.matches) {
      calendarSwiper.params.slidesPerView = 1;
    } else {
      calendarSwiper.params.slidesPerView = 2;
    }
    calendarSwiper.update();
  }
  
  const x = window.matchMedia("(max-width: 1081px)")
  toggleCalendarSlides(x) // Call listener function at run time
  x.addEventListener("change", toggleCalendarSlides) // Attach listener function on state changes 
