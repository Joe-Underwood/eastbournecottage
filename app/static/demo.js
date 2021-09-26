const vm = new Vue({
    el: '#root',
    data: {
        priceList: [
            { 'id': 1, 'startDate': '2022-01-01', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 2, 'startDate': '2022-01-08', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 3, 'startDate': '2022-01-15', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 4, 'startDate': '2022-01-22', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 5, 'startDate': '2022-01-29', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 6, 'startDate': '2022-02-05', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 7, 'startDate': '2022-02-12', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 8, 'startDate': '2022-02-19', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 9, 'startDate': '2022-02-26', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 10, 'startDate': '2022-03-05', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 11, 'startDate': '2022-03-12', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 12, 'startDate': '2022-03-19', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 13, 'startDate': '2022-03-26', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 14, 'startDate': '2022-04-02', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 15, 'startDate': '2022-04-09', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 16, 'startDate': '2022-04-16', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 17, 'startDate': '2022-04-23', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 18, 'startDate': '2022-04-30', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 19, 'startDate': '2022-05-07', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 20, 'startDate': '2022-05-14', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 21, 'startDate': '2022-05-21', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 22, 'startDate': '2022-05-28', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 23, 'startDate': '2022-06-04', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 24, 'startDate': '2022-06-11', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 25, 'startDate': '2022-06-18', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 26, 'startDate': '2022-06-25', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 27, 'startDate': '2022-07-02', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 28, 'startDate': '2022-07-09', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 29, 'startDate': '2022-07-16', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 30, 'startDate': '2022-07-23', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 31, 'startDate': '2022-07-30', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 32, 'startDate': '2022-08-06', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 33, 'startDate': '2022-08-13', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 34, 'startDate': '2022-08-20', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 35, 'startDate': '2022-08-27', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 36, 'startDate': '2022-09-03', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 37, 'startDate': '2022-09-10', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 38, 'startDate': '2022-09-17', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 39, 'startDate': '2022-09-24', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 40, 'startDate': '2022-10-01', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 41, 'startDate': '2022-10-08', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 42, 'startDate': '2022-10-15', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 43, 'startDate': '2022-10-22', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 44, 'startDate': '2022-10-29', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 45, 'startDate': '2022-11-05', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 46, 'startDate': '2022-11-12', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 47, 'startDate': '2022-11-19', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 48, 'startDate': '2022-11-26', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 49, 'startDate': '2022-12-03', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 50, 'startDate': '2022-12-10', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 51, 'startDate': '2022-12-17', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 52, 'startDate': '2022-12-24', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false },
            { 'id': 53, 'startDate': '2022-12-31', 'price': '100.00', 'price2Weeks': '200.00', 'price3Weeks': '300.00', 'price4Weeks': '400.00', 'discountAmount2Weeks': '0.00', 'discountAmount3Weeks': '0.00', 'discountAmount4Weeks': '0.00', 'bookingId': null, 'blockFlag': false, 'rangeType': 'ACTIVE', 'lockFlag': false, 'deleteFlag': false, 'selectFlag': false }
        ],
        priceListSettings: { 'id': 1, 'discount2Weeks': '0.00', 'discount3Weeks': '0.00', 'discount4Weeks': '0.00', 'activePricesRange': 12, 'futurePricesRange': 0, 'defaultChangeoverDay': 5, 'maxSegmentLength': 7, 'pricePerDog': '20.00', 'maxDogs': 1, 'maxInfants': 5, 'maxGuests': 5, 'minAge': 18, 'checkInTime': '15:00', 'checkOutTime': '11:00' },
        bookings: [],
        customers: [],
        billings: [],
        billingSettings: { 'id': 1, 'firstPaymentDueAfter': 7, 'progressiveBillNotice': 7, 'paymentBreakpoints': [], 'cancellationBreakpoints': []},

        serverDate: new Date(2022, 0, 1),
        priceListMonthView: true,
        rangeMonths: [new Date(2022, 0, 1), new Date(2022, 1, 1), new Date(2022, 2, 1), new Date(2022, 3, 1), new Date(2022, 4, 1), new Date(2022, 5, 1), new Date(2022, 6, 1), new Date(2022, 7, 1), new Date(2022, 8, 1), new Date(2022, 9, 1), new Date(2022, 10, 1), new Date(2022, 11, 1) ],
        cardSelect: false,
        cardSelection: [],

        dialogBoxMessage: '',

        paymentBreakpointSelect: false,
        paymentBreakpointSelection: [],

        cancellationBreakpointSelect: false,
        cancellationBreakpointSelection: [],

        monthSwiper: null,
        monthTabGlider: null,
        monthTabsRefresh: false,
        priceTableSwiperList: [],


        billingTableSwiper: null,

        newBillingScrimClose: false,
        initialY: undefined,
        offsetY: undefined,

        disableBodyScroll: undefined,
        enableBodyScroll: undefined,

        newBillingFormData: {
            'id': null,
            'bookingId': null,
            'amount': null,
            'date': null,
            'invoiceDueDate': null,
            'transactionType': null,
            'reference': null,
            'note': null
        }


    },
    computed: {
        activePriceList: function() {
            if (this.priceList) {
                return (this.priceList.filter(segment => segment['isActive']));
            }
            else {
                return null;
            }
        },
        futurePriceList: function() {
            if (this.priceList) {
                return (this.priceList.filter(segment => segment['isFuture']));
            }
            else {
                return null;
            }
        },/*
        pastPriceList: function () {
            if (this.priceList) {
                return (this.priceList.filter(segment => segment['isPast']));
            }
            else {
                return null;
            }
        },
        newPriceList: function() {
            if (this.priceList) {
                return (this.priceList.filter(segment => !segment['id']));
            }
            else {
                return null;
            }
        },*/
    },
    created: function() {
        this.disableBodyScroll = bodyScrollLock.disableBodyScroll;
        this.enableBodyScroll = bodyScrollLock.enableBodyScroll;

        this.initMonthSwiper();
        this.$nextTick(function() {
            document.querySelector('.tab').classList.add('current-month-tab');
            this.initMonthTabGlider();
            this.initPriceTableSwipers();
            this.$nextTick(function() {
                this.initMonthSwiper();
            })
        })  
    },
    methods: {
        setBillings() {
            this.showMessage('Billings successfully updated!');
            return true;
        },
        setBillingSettings() {
            this.refreshPaymentBreakpoints();
            this.refreshCancellationBreakpoints();
            return true;
        },
        refreshPaymentBreakpoints() {
            this.billingSettings['paymentBreakpoints'].sort(function(a, b) {
                if (a['firstPayment']) {
                    return -1;
                }
                else if (b['firstPayment']) {
                    return 1;
                }
                else {
                    return b['dueBy'] - a['dueBy'];
                }
            })

            for (let i = 0; i < this.billingSettings['paymentBreakpoints'].length; i++) {
                if (this.billingSettings['paymentBreakpoints'][i]['deleteFlag']) {
                    this.billingSettings['paymentBreakpoints'][i]['amountDue'] = 0;
                }
                if (i === 0) {
                    this.billingSettings['paymentBreakpoints'][i]['cumulativeTotal'] = parseInt(this.billingSettings['paymentBreakpoints'][i]['amountDue']);
                }
                else {
                    this.billingSettings['paymentBreakpoints'][i]['cumulativeTotal'] = parseInt(this.billingSettings['paymentBreakpoints'][i-1]['cumulativeTotal']) + parseInt(this.billingSettings['paymentBreakpoints'][i]['amountDue']);
                }
            }
        },
        refreshCancellationBreakpoints() {
            this.billingSettings['cancellationBreakpoints'].sort((a, b) => b['cancelBy'] - a['cancelBy']);
        },
        refreshPriceList() {
            this.priceList.sort((a, b) => new Date(a['startDate']) - new Date(b['startDate']));
        },
        setPriceList() {
            this.refreshPriceList();

            return true;
        },
        addRangeMonths(startDate) {
            //expects startDate is a date object, returns array of date objects, one for each month including and between current date and end of future price list range
            let rangeEndDate = new Date(+startDate);
            rangeEndDate.setDate(startDate.getDate() + 7 * (this.priceListSettings['activePricesRange'] + this.priceListSettings['futurePricesRange']));

            const rangeMonths = [];
            const monthAmount = ((rangeEndDate.getMonth() + 1) - (startDate.getMonth() + 1)) + 1 + (12 * (rangeEndDate.getFullYear() - startDate.getFullYear()));
            
            for (let i = 0; i < monthAmount; i++) {
                let month = new Date(startDate.getFullYear(), startDate.getMonth() + i);
                rangeMonths.push(month);
            }

            this.rangeMonths = rangeMonths;
        },
        addPriceListSegment() {
            this.priceList.push({
                'id': null,
                'startDate': null,
                'price': 0,
                'price2Weeks': 0,
                'price3Weeks': 0,
                'price4Weeks': 0,
                'discountAmount2Weeks': 0,
                'discountAmount3Weeks': 0,
                'discountAmount4Weeks': 0,
                'bookingId': null,
                'rangeType': null,
                'lockFlag': false,
                'updateFlag': true,
                'deleteFlag': false
            })
            const lastSegment = this.priceList[this.priceList.length - 1];
            /*this.$watch(function() {
                return lastSegment;
            },
            function() {
                //place in correct range (isPast. isActive, isFuture)
                const year = lastSegment['startDate'].substr(0, 4);
                const month = lastSegment['startDate'].substr(5, 2);
                const date = lastSegment['startDate'].substr(8, 2);
                const startDate = new Date(year, month - 1, date);
            },
            { deep: true })*/
        },
        setPriceListSettings() {
            return true;
        },
        setBookings() {
            return true;
        },
        addBooking() {
            const newBooking = {
                'id': null,
                'customerId': null,
                'arrivalDate': null,
                'departureDate': null,
                'adults': 0,
                'children': 0,
                'infants': 0,
                'dogs': 0,
                'stayPrice': 0,
                'multiWeekDiscount': 0,
                'dogPrice': 0,
                'total': 0,
                'status': 'ACCEPTED',
                'bookingType': null,
                'externalNote': '',
                'payInFull': true,
                'payInParts': false,
                'payCustom': false,
                'updateFlag': true,
                'updateStatusFlag': true,
                'deleteFlag': false
            }
            this.bookings.push(newBooking);
            /*
            this.$watch(function() {
                return newBooking;
            },
            function() {
                //find price list segments associated with date, do validation etc and take price
                //const bookingsFilter = this.bookings.filter(booking => booking['id'] === segment['bookingId']);
                const dateSegments = [];

                for (let i = 0; i < this.activePriceList.length; i++) {
                    if 
                    if (newBooking['arrivalDate'] >= this.activePriceList[i]['startDate'] && newBooking['arrivalDate'] <= this.activePriceList[i+1]['startDate']) {
                        dateSegments.push(this.priceList[i]);
                    }
                }
                newBooking['dogPrice'] = str((newBooking['dogs'] * parseFloat(this.priceListSettings['pricePerDog'])).toFixed(2));
                newBooking['multiWeekDiscount'] = str((parseFloat(newBooking['stayPrice']) * this.priceListSettings['']).toFixed(2));
                newBooking['total'] = str((parseFloat(newBooking['stayPrice']) + parseFloat(newBooking['dogPrice']) - parseFloat(newBooking['multiWeekDiscount'])).toFixed(2));

            },
            { deep: true })*/
            this.$nextTick(() => {
                const pageElement = document.querySelectorAll('.booking .page')[document.querySelectorAll('.booking .page').length - 1];
                const cardElement = document.querySelectorAll('.booking .card')[document.querySelectorAll('.booking .card').length - 1];
                const parentElement = cardElement.parentElement;
    
                document.querySelector('#root').classList.add('fullscreen');
                cardElement.classList.add('invisible');
                pageElement.classList.remove('hidden');
                document.querySelector('.bookings .main-view-buttons').classList.add('invisible');

                for (let i = 0; i < document.querySelectorAll('.booking').length; i++) {
                    if (document.querySelectorAll('.booking')[i] !== parentElement) {
                        document.querySelectorAll('.booking')[i].classList.add('hidden');
                    }
                }
            })
            
        },
        setCustomers() {
            return true;
        },
        addCustomer() {
            this.customers.push({
                'id': null,
                'firstName': null,
                'lastName': null,
                'emailAddress': null,
                'phoneNumber': null,
                'addressLine1': null,
                'addressLine2': null,
                'townOrCity': null,
                'countyOrRegion': null,
                'postcode': null,
                'updateFlag': true,
                'deleteFlag': false
            })
            this.$nextTick(() => {
                const pageElement = document.querySelectorAll('.customer .page')[document.querySelectorAll('.customer .page').length - 1];
                const cardElement = document.querySelectorAll('.customer .card')[document.querySelectorAll('.customer .card').length - 1];
                const parentElement = cardElement.parentElement;
    
                document.querySelector('#root').classList.add('fullscreen');
                cardElement.classList.add('invisible');
                pageElement.classList.remove('hidden');
                document.querySelector('.customers .main-view-buttons').classList.add('invisible');

                for (let i = 0; i < document.querySelectorAll('.customer').length; i++) {
                    if (document.querySelectorAll('.customer')[i] !== parentElement) {
                        document.querySelectorAll('.customer')[i].classList.add('hidden');
                    }
                }
            })
            
        },
        initMonthSwiper() {
            const monthSwiper = new Swiper('.month-swiper', {
                spaceBetween: 16,
                slidesPerView: 1,
                allowTouchMove: false,
                on: {
                    slideChange: function() {
                        document.querySelectorAll('.tab').forEach(tab => {
                            tab.classList.remove('current-month-tab');
                        })
                        document.querySelectorAll('.tab')[this.activeIndex].classList.add('current-month-tab');
                        vm.monthTabGlider.scrollItem(this.activeIndex);
                    }
                }
            });  

            this.monthSwiper = monthSwiper;
        },
        initMonthTabGlider() {
            const monthTabGlider = new Glider(document.querySelector('.month-tabs'), {
                slidesToShow: 4,
                duration: 2,
                scrollLock: true
            })

            this.monthTabGlider = monthTabGlider;
        },
        initPriceTableSwipers() {
            const swiperNodeList = document.querySelectorAll('.price-table-swiper');
            const priceTableSwiperList = [];
            for (node in swiperNodeList) {
                priceTableSwiperList.push(new Swiper(swiperNodeList[node], {
                    spaceBetween: 0,
                    slidesPerView: 1,
                    allowTouchMove: true,
                    pagination: {
                        el: document.querySelectorAll('.swiper-pagination')[node],
                        type: 'bullets'
                    },
                    breakpoints: {
                        478: {
                            slidesPerView: 2,
                            allowTouchMove: true
                        },
                        638: {
                            slidesPerView: 3,
                            allowTouchMove: true
                        },
                        798: {
                            slidesPerView: 4,
                            allowTouchMove: true
                        }
                    }
                }))
            }
            this.priceTableSwiperList = priceTableSwiperList;
        },
        initBillingTableSwiper() {
            const billingTableSwiper = new Swiper('.billing-table-swiper', {
                spaceBetween: 0,
                slidesPerView: 1,
                allowTouchMove: true,
                pagination: {
                    el: document.querySelector('.billing-table-swiper .swiper-pagination'),
                    type: 'bullets'
                },
                breakpoints: {
                    422: {
                        slidesPerView: 2,
                        allowTouchMove: true
                    },
                    582: {
                        slidesPerView: 3,
                        allowTouchMove: true
                    },
                    712: {
                        slidesPerView: 4,
                        allowTouchMove: true
                    },
                    872: {
                        slidesPerView: 5,
                        allowTouchMove: true
                    },
                    932: {
                        slidesPerView: 6,
                        allowTouchMove: true
                    },
                    1092: {
                        slidesPerView: 7,
                        allowTouchMove: false
                    }
                }
            })

            this.billingTableSwiper = billingTableSwiper;
            
        },
        segmentMonthFilter(segment, month, index) {
            if (index === this.rangeMonths.length - 1) {
                return (month <= new Date(segment['startDate']));
            } 
            else {
                return (month <= new Date(segment['startDate']) && new Date(segment['startDate']) <= this.rangeMonths[index + 1]);
            }
        },
        segmentBookedType(segment) {
            if (segment['bookingId']) {
                const bookingsFilter = this.bookings.filter(booking => booking['id'] === segment['bookingId']);
                return bookingsFilter[0]['bookingType'];
            }
            else {
                return null;
            }
        },
        goToPriceList() {
            document.querySelector('.price-list').classList.remove('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.tabs').classList.remove('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
            document.querySelector('.bookings .main-view-buttons').classList.remove('invisible');
            document.querySelector('.customers .main-view-buttons').classList.remove('invisible');
            document.querySelector('#root').classList.remove('fullscreen');
            this.priceListSelectOff();
            if (!this.monthTabGlider) {
                this.monthTabsRefresh = false;
                this.$forceUpdate();
                this.initMonthSwiper();
                this.$nextTick(function() {
                    this.initMonthTabGlider();
                    this.$forceUpdate();
                });
            }
        },
        openPriceListSettings() {
            if (this.monthTabGlider) {
                this.monthTabGlider.destroy();
                this.monthTabGlider = null;
                this.monthTabsRefresh = true;
            }
            document.querySelector('.tabs').classList.add('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.remove('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
        },
        segmentToggleExpand(e) {
            function segmentNode(node) {
                if (node.classList.contains('price-list-segment')) {
                    return node;
                }
                else {
                    return segmentNode(node.parentElement);
                }
            }

            const segmentEl = segmentNode(e.target);
            const segmentIndex = Array.from(document.querySelectorAll('.price-list-segment')).indexOf(segmentEl);

            segmentEl.classList.toggle('expand');
            document.querySelectorAll('.segment-card')[segmentIndex].classList.toggle('hidden');
            document.querySelectorAll('.segment-expand')[segmentIndex].classList.toggle('hidden');
        },
        goToBookings() {
            document.querySelector('.tabs').classList.remove('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.remove('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
            document.querySelector('.bookings .main-view-buttons').classList.remove('invisible');
            document.querySelector('.customers .main-view-buttons').classList.remove('invisible');
            document.querySelector('#root').classList.remove('fullscreen');
            this.bookingCardSelectOff();
        },
        goToCustomers() {
            document.querySelector('.tabs').classList.remove('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.remove('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
            document.querySelector('.bookings .main-view-buttons').classList.remove('invisible');
            document.querySelector('.customers .main-view-buttons').classList.remove('invisible');
            document.querySelector('#root').classList.remove('fullscreen');
            this.customerCardSelectOff();
        },
        goToBilling() {
            document.querySelector('.tabs').classList.remove('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.remove('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
            document.querySelector('.bookings .main-view-buttons').classList.remove('invisible');
            document.querySelector('.customers .main-view-buttons').classList.remove('invisible');
            document.querySelector('#root').classList.remove('fullscreen');
            this.customerCardSelectOff();
            if (!this.billingTableSwiper) {
                this.initBillingTableSwiper();
            }
        },
        goToBillingSettings() {
            document.querySelector('.tabs').classList.add('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.billing-settings').classList.remove('hidden');
            this.customerCardSelectOff();
        },
        priceListSettingsUpdate() {
            this.setPriceListSettings()
                .then(() => {
                    this.getPriceList();
                })
        },
        bookingRequestReject(booking, e) {
            booking['updateStatusFlag'] = true;
            booking['status'] = 'REJECTED';
            this.setBookings().then(success => {
                if (success) {
                    this.showMessage('Booking request rejected!');
                    this.exitFullscreen(e);
                }
                else {
                    this.showMessage('Booking request rejection failed. No changes were made.');
                }
                return success;
            })
            .then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                    this.getBillings();
                }
            })
        },
        bookingRequestAccept(booking, e) {
            booking['updateStatusFlag'] = true;
            booking['status'] = 'ACCEPTED';
            this.setBookings().then(success => {
                if (success) {
                    this.showMessage('Booking request accepted!');
                    this.exitFullscreen(e);
                }
                else {
                    this.showMessage('Booking request acceptance failed. No changes were made.', true);
                }
                return success;
            })
            .then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                    this.getBillings();
                }
            })
        },
        bookingUpdate(booking, e) {
            booking['updateFlag'] = true;
            this.setBookings().then(success => {
                if (success) {
                    this.showMessage('Booking successfully updated!');
                    this.exitFullscreen(e);
                }
                else {
                    this.showMessage('Booking update failed - no changes were made.', true);
                }
                return success;
            })
            .then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                    this.getBillings();
                }
            });
            //prompt result, with(out) closing page
        },
        bookingDelete(booking, e) {
            booking['deleteFlag'] = true;
            this.setBookings().then(success => {
                if (success) {
                    this.showMessage('Booking succesfully deleted!');
                    this.exitFullscreen(e);
                }
                else {
                    this.showMessage('Booking deletion failed - no changes were made.', true);
                }
                return success;
            })
            .then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                    this.getBillings();
                }
            })
            //if successful, delete from view/ refresh to show change
        },
        customerUpdate(customer, e) {
            customer['updateFlag'] = true;
            this.setCustomers().then(success => {
                if (success) {
                    this.showMessage('Customer successfully updated!');
                    this.exitFullscreen(e);
                }
                else {
                    this.showMessage('Customer update failed - no changes were made.', true);
                }
                return success;
            })
            .then(success => {
                if (success) {
                    this.getBookings();
                    this.getCustomers();
                    this.getBillings();
                }
            })
            //prompt result, with(out) closing page
        },
        customerDelete(customer, e) {
            customer['deleteFlag'] = true;
            this.setCustomers().then(success => {
                if (success) {
                    this.showMessage('Customer successfully deleted!');
                    this.exitFullscreen(e);
                } else {
                    this.showMessage('Customer deletion failed - no changes were made.', true);
                }
                return success;
            })
            .then(success => {
                if (success) {
                    this.getBookings();
                    this.getCustomers();
                    this.getBillings();
                }
            })
            //if successful, delete from view/ refresh to show change
        },
        isDeepEqual(obj1, obj2) {
            //assumes same object type
            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                return false;
            }
            for (key in obj1) {
                if (obj1[key] !== obj2[key]) {
                    return false;
                }
            }
            return true;
        },
        clone(obj) {
            if(obj == null || typeof(obj) != 'object')
                return obj;
        
            var temp = new obj.constructor(); 
            for(var key in obj)
                temp[key] = this.clone(obj[key]);
        
            return temp;
        },
        customerName(id) {
            if (id) {
                const customer = this.customers.find(customer => {
                    return(customer.id === id);
                });
                return `${customer['firstName']} ${customer['lastName']}`;
            }
            else {
                return 'No customer';
            }
        },
        priceListSelectOn() {
            this.cardSelect = true;

            document.querySelector('.price-list .cards-add').classList.add('hidden');
            document.querySelector('.price-list .cards-select').classList.add('hidden');
            document.querySelector('.price-list .cards-cancel').classList.remove('hidden');
            document.querySelector('.price-list .cards-delete').classList.remove('hidden');
            document.querySelector('.price-list .cards-block').classList.remove('hidden');
        },
        priceListSelectOff() {
            this.cardSelect = false;
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['selectFlag'] = false;
            }
            this.cardSelection = [];

            document.querySelector('.price-list .cards-add').classList.remove('hidden');
            document.querySelector('.price-list .cards-select').classList.remove('hidden');
            document.querySelector('.price-list .cards-cancel').classList.add('hidden');
            document.querySelector('.price-list .cards-delete').classList.add('hidden');
            document.querySelector('.price-list .cards-block').classList.add('hidden');
        },
        bookingCardSelectOn() {
            this.cardSelect = true;

            document.querySelector('.bookings .cards-add').classList.add('hidden');
            document.querySelector('.bookings .cards-select').classList.add('hidden');
            document.querySelector('.bookings .cards-cancel').classList.remove('hidden');
            document.querySelector('.bookings .cards-delete').classList.remove('hidden');
        },
        bookingCardSelectOff() {
            this.cardSelect = false;
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['selectFlag'] = false;
            }
            this.cardSelection = [];

            document.querySelector('.bookings .cards-add').classList.remove('hidden');
            document.querySelector('.bookings .cards-select').classList.remove('hidden');
            document.querySelector('.bookings .cards-cancel').classList.add('hidden');
            document.querySelector('.bookings .cards-delete').classList.add('hidden');
        },
        customerCardSelectOn() {
            this.cardSelect = true;

            document.querySelector('.customers .cards-add').classList.add('hidden');
            document.querySelector('.customers .cards-select').classList.add('hidden');
            document.querySelector('.customers .cards-cancel').classList.remove('hidden');
            document.querySelector('.customers .cards-delete').classList.remove('hidden');
        },
        customerCardSelectOff() {
            this.cardSelect = false;
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['selectFlag'] = false;
            }
            this.cardSelection = [];

            document.querySelector('.customers .cards-add').classList.remove('hidden');
            document.querySelector('.customers .cards-select').classList.remove('hidden');
            document.querySelector('.customers .cards-cancel').classList.add('hidden');
            document.querySelector('.customers .cards-delete').classList.add('hidden');
        },
        cardClick(obj, e) {
            if (this.cardSelect) {
                if (obj['selectFlag']) {
                    this.cardSelection.splice(this.cardSelection.indexOf(obj), 1);
                    obj['selectFlag'] = false;
                } 
                else {
                    this.cardSelection.push(obj);
                    obj['selectFlag'] = true;
                }
            }
            else {
                this.goFullscreen(e);
            }
        },
        segmentSelect(segment, e) {
            if (this.cardSelect) {
                if (segment['selectFlag']) {
                    segment['selectFlag'] = false;
                    this.cardSelection.splice(this.cardSelection.indexOf(segment), 1);
                } else {
                    segment['selectFlag'] = true;
                    this.cardSelection.push(segment)
                }
            }
        },
        priceListSelectionDelete() {
            //prompt for user confirmation before deletion
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['deleteFlag'] = true;
            }
            this.setPriceList().then(success => {
                if (success) {
                    this.showMessage('Price list selection successfully deleted!')
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                    this.getBillings();
                }
                else {
                    this.showMessage('Price list selection deletion failed - no changes were made', true);
                }
            })
            this.priceListSelectOff();
        },
        priceListSelectionBlock() {
            //prompt for user confirmation before deletion
            for (let i = 0; i < this.cardSelection.length; i++) {
                if (this.cardSelection[i]['blockFlag']) {
                    this.cardSelection[i]['blockFlag'] = false;
                }
                else {
                    this.cardSelection[i]['blockFlag'] = true;
                }
            }
            this.setPriceList().then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                }
                else {
                    console.log('failed to block segments');
                }
            })
            this.priceListSelectOff();
        },
        bookingSelectionDelete() {
            //prompt for user confirmation before deletion
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['deleteFlag'] = true;
            }
            this.setBookings().then(success => {
                if (success) {
                    this.showMessage('Booking selection successfully deleted!');
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                    this.getBillings();
                }
                else {
                    this.showMessage('Booking selection deletion failed - no changes were made', true);
                }
            })
            this.bookingCardSelectOff();
        },
        customerSelectionDelete() {
            //prompt for user confirmation before deletion
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['deleteFlag'] = true;
            }
            this.setCustomers().then(success => {
                if (success) {
                    this.showMessage('Customer selection successfully deleted!');
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                    this.getBillings();
                }
                else {
                    this.showMessage('Customer selection deletion failed - no changes were made', true);
                }
            })
            this.customerCardSelectOff();
        },
        goFullscreen(e) {
            function cardLevelElement(el) {
                if (el.classList.contains('card')) {
                    return el;
                } else {
                    return cardLevelElement(el.parentElement);
                }
            }

            const cardElement = cardLevelElement(e.target);
            const pageElement = cardElement.previousElementSibling;
            const transitionElement = cardElement.nextElementSibling;
            const parentElement = cardElement.parentElement;
            const cardRect = cardElement.getBoundingClientRect();
            const pageRect = pageElement.getBoundingClientRect();

            document.querySelector('#root').classList.add('fullscreen');

            cardElement.classList.add('invisible');
            /*transitionElement.classList.remove('hidden');
            transitionElement.style.top = `${cardRect.top}px`;
            transitionElement.style.right = `${cardRect.right}px`;
            transitionElement.style.bottom = `${cardRect.bottom}px`;
            transitionElement.style.left = `${cardRect.left}px`;*/

            pageElement.classList.remove('hidden');

            document.querySelector('.bookings .main-view-buttons').classList.add('invisible');
            document.querySelector('.customers .main-view-buttons').classList.add('invisible');

            if (parentElement.classList.contains('booking')) {
                for (let i = 0; i < document.querySelectorAll('.booking').length; i++) {
                    if (document.querySelectorAll('.booking')[i] !== parentElement) {
                        document.querySelectorAll('.booking')[i].classList.add('hidden');
                    }
                }
            }
            else if (parentElement.classList.contains('customer')) {
                for (let i = 0; i < document.querySelectorAll('.customer').length; i++) {
                    if (document.querySelectorAll('.customer')[i] !== parentElement) {
                        document.querySelectorAll('.customer')[i].classList.add('hidden');
                    }
                }
            }
        },
        exitFullscreen(e) {
            function pageLevelElement(el) {
                if (el.classList.contains('page')) {
                    return el;
                } else {
                    return pageLevelElement(el.parentElement);
                }
            }
            
            const pageElement = pageLevelElement(e.target);
            const cardElement = pageElement.nextElementSibling;
            const parentElement = cardElement.parentElement;

            document.querySelector('#root').classList.remove('fullscreen');

            pageElement.classList.add('hidden');
            cardElement.classList.remove('invisible');

            document.querySelector('.bookings .main-view-buttons').classList.remove('invisible');
            document.querySelector('.customers .main-view-buttons').classList.remove('invisible');

            if (parentElement.classList.contains('booking')) {
                for (let i = 0; i < document.querySelectorAll('.booking').length; i++) {
                    document.querySelectorAll('.booking')[i].classList.remove('hidden');
                }
            }
            else if (parentElement.classList.contains('customer')) {
                for (let i = 0; i < document.querySelectorAll('.customer').length; i++) {
                    document.querySelectorAll('.customer')[i].classList.remove('hidden');
                }
            }
        },
        adultsDecrease(booking, e) {
            e.preventDefault();
            if(booking['adults'] > 0) {
                booking['adults']--;
            }
        },
        adultsIncrease(booking, e) {
            e.preventDefault();
            if (booking['adults'] + booking['children'] < this.priceListSettings['maxGuests']) {
                booking['adults']++;
            }
        },
        childrenDecrease(booking, e) {
            e.preventDefault();
            if (booking['children'] > 0) {
                booking['children']--;
            }
        },
        childrenIncrease(booking, e) {
            e.preventDefault();
            if (booking['adults'] + booking['children'] < this.priceListSettings['maxGuests']) {
                booking['children']++;
            }
        },
        infantsDecrease(booking, e) {
            e.preventDefault();
            if (booking['infants'] > 0) {
                booking['infants']--;
            }
        },
        infantsIncrease(booking, e) {
            e.preventDefault();
            if (booking['infants'] < this.priceListSettings['maxInfants']) {
                booking['infants']++;
            }
        },
        dogsDecrease(booking, e) {
            e.preventDefault();
            if (booking['dogs'] > 0) {
                booking['dogs']--;
            }
        },
        dogsIncrease(booking, e) {
            e.preventDefault();
            if (booking['dogs'] < this.priceListSettings['maxDogs']) {
                booking['dogs']++;
            }
        },
        maxGuestsDecrease(e) {
            e.preventDefault();
            if (this.priceListSettings['maxGuests'] > 0) {
                this.priceListSettings['maxGuests']--;
            }
        },
        maxGuestsIncrease(e) {
            e.preventDefault();
            this.priceListSettings['maxGuests']++;
        },
        maxInfantsDecrease(e) {
            e.preventDefault();
            if (this.priceListSettings['maxInfants'] > 0) {
                this.priceListSettings['maxInfants']--;
            }
        },
        maxInfantsIncrease(e) {
            e.preventDefault();
            this.priceListSettings['maxInfants']++;
        },
        maxDogsDecrease(e) {
            e.preventDefault();
            if (this.priceListSettings['maxDogs'] > 0) {
                this.priceListSettings['maxDogs']--;
            }
        },
        maxDogsIncrease(e) {
            e.preventDefault();
            this.priceListSettings['maxDogs']++;
        },
        addPaymentBreakpoint() {
            this.billingSettings['paymentBreakpoints'].push({
                'id': null,
                'amountDue': null,
                'dueBy': null,
                'firstPayment': false,
                'cumulativeTotal': null,
                'selectFlag': false,
                'deleteFlag': false
            })
            this.billingSettings['updateFlag'] = true
        },
        addCancellationBreakpoint() {
            this.billingSettings['cancellationBreakpoints'].push({
                'id': null,
                'amountRefundable': null,
                'cancelBy': null,
                'checkIn': false,
                'cumulativeTotal': null,
                'selectFlag': false,
                'deleteFlag': false
            })
            this.billingSettings['updateFlag'] = true
        },
        selectPaymentBreakpoint(row, e) {
            if (this.paymentBreakpointSelect) {
                if (row['selectFlag']) {
                    row['selectFlag'] = false;
                    this.paymentBreakpointSelection.splice(this.paymentBreakpointSelection.indexOf(row), 1);
                } else if (!row['firstPayment']) {
                    row['selectFlag'] = true;
                    this.paymentBreakpointSelection.push(row);
                }
            }
        },
        deletePaymentBreakpointSelection() {
            //prompt for user confirmation before deletion

            for (let i = 0; i < this.paymentBreakpointSelection.length; i++) {
                this.paymentBreakpointSelection[i]['deleteFlag'] = true;
                this.paymentBreakpointSelection[i]['amountDue'] = 0;
            }

            this.paymentBreakpointSelectOff();
            this.refreshPaymentBreakpoints();
        },
        paymentBreakpointSelectOn() {
            this.paymentBreakpointSelect = true;

            document.querySelector('.payment-terms-settings .controls-add').classList.add('hidden');
            document.querySelector('.payment-terms-settings .controls-select').classList.add('hidden');
            document.querySelector('.payment-terms-settings .controls-cancel').classList.remove('hidden');
            document.querySelector('.payment-terms-settings .controls-delete').classList.remove('hidden');
        },
        paymentBreakpointSelectOff() {
            this.paymentBreakpointSelect = false;
            for (let i = 0; i < this.paymentBreakpointSelection.length; i++) {
                this.paymentBreakpointSelection[i]['selectFlag'] = false;
            }
            this.paymentBreakpointSelection = [];

            document.querySelector('.payment-terms-settings .controls-add').classList.remove('hidden');
            document.querySelector('.payment-terms-settings .controls-select').classList.remove('hidden');
            document.querySelector('.payment-terms-settings .controls-cancel').classList.add('hidden');
            document.querySelector('.payment-terms-settings .controls-delete').classList.add('hidden');
        },
        selectCancellationBreakpoint(row, e) {
            if (this.cancellationBreakpointSelect) {
                if (row['selectFlag']) {
                    row['selectFlag'] = false;
                    this.cancellationBreakpointSelection.splice(this.cancellationBreakpointSelection.indexOf(row), 1);
                } else if (!row['checkIn']) {
                    row['selectFlag'] = true;
                    this.cancellationBreakpointSelection.push(row);
                }
            }
        },
        deleteCancellationBreakpointSelection() {
            //prompt for user confirmation before deletion
            for (let i = 0; i < this.cancellationBreakpointSelection.length; i++) {
                this.cancellationBreakpointSelection[i]['deleteFlag'] = true;
                this.cancellationBreakpointSelection[i]['amountRefundable'] = 0;
            }
            
            this.cancellationBreakpointSelectOff();
        },
        cancellationBreakpointSelectOn() {
            this.cancellationBreakpointSelect = true;

            document.querySelector('.cancellation-terms-settings .controls-add').classList.add('hidden');
            document.querySelector('.cancellation-terms-settings .controls-select').classList.add('hidden');
            document.querySelector('.cancellation-terms-settings .controls-cancel').classList.remove('hidden');
            document.querySelector('.cancellation-terms-settings .controls-delete').classList.remove('hidden');
        },
        cancellationBreakpointSelectOff() {
            this.cancellationBreakpointSelect = false;
            for (let i = 0; i < this.cancellationBreakpointSelection.length; i++) {
                this.cancellationBreakpointSelection[i]['selectFlag'] = false;
            }
            this.cancellationBreakpointSelection = [];

            document.querySelector('.cancellation-terms-settings .controls-add').classList.remove('hidden');
            document.querySelector('.cancellation-terms-settings .controls-select').classList.remove('hidden');
            document.querySelector('.cancellation-terms-settings .controls-cancel').classList.add('hidden');
            document.querySelector('.cancellation-terms-settings .controls-delete').classList.add('hidden');
        },
        newBillingTouchstart(event) {
            //on touchstart
            if (document.querySelector('.new-billing-container').contains(event.target)) {
                this.initialY = event.touches[0].clientY;
                document.querySelector('.new-billing-container').style.transition = "none"; 
            } else if (document.querySelector('.new-billing-container').classList.contains('open') && event.target === document.querySelector('.new-billing-wrapper')) {
                this.newBillingScrimClose = true;
                this.initialY = document.querySelector('.new-billing-container').offsetTop;
                document.querySelector('.new-billing-container').style.transition = "none"; 
            }
        },
        newBillingTouchmove(event) {
            //on touchmove, slides menu horizontally based on touch position
            if (document.querySelector('.new-billing-wrapper').contains(event.target) && document.querySelector('.new-billing-container').classList.contains('open')) {
                this.newBillingScrimClose = false;
                /*if (!document.querySelector('.navbar').contains(event.target)) {*/
                    this.offsetY = event.touches[0].clientY - this.initialY;
                    if (this.offsetY >= 0) {
                        document.querySelector('.new-billing-container').style.transform = `translate3d(0, ${this.offsetY}px, 0)`;
                    }   
                /*}*/
            }
        },
        newBillingTouchend(event) {
            //on touchend, calls side menu if conditions are met, else keeps side menu open and resets parameters ready for next touch event
            if (this.newBillingScrimClose && document.querySelector('.new-billing-container').classList.contains('open')) {
                document.querySelector('.new-billing-container').style.transition = 'all 0.2s';
                let endX = event.changedTouches[0].clientX;
                let endY = event.changedTouches[0].clientY;
                if (document.elementFromPoint(endX, endY) === document.querySelector('.new-billing-wrapper')) {
                    vm.hideNewBillingOverlay();
                }
                this.newBillingScrimClose = false;
            }
            /*else if (document.querySelector('.party-wrapper').contains(event.target) && document.querySelector('.party-container').classList.contains('open')) {
                document.querySelector('.party-container').style.transition = 'all 0.4s';
                if (this.offsetY > (document.querySelector('.party-container').clientHeight) / 4) {  
                    this.hidePartyOverlay();
                } else {
                    document.querySelector('.party-container').style.transform = `translate3d(0, 0, 0)`;
                }
            }*/
            else if (document.querySelector('.new-billing-wrapper').contains(event.target) && document.querySelector('.new-billing-container').classList.contains('open')) {
                document.querySelector('.new-billing-container').style.transition = 'all 0.2s';
                if (this.offsetY > document.querySelector('.new-billing-container').clientHeight / 4) {
                    this.hideNewBillingOverlay();
                } else {
                    document.querySelector('.new-billing-container').style.transform = 'translate3d(0, 0, 0)';
                }
                
            }
            this.newBillingScrimClose = false;
            this.initialY = undefined;
            this.offsetY = undefined;
        },
        displayNewBillingOverlay() {
            const x = window.matchMedia("(max-width: 3000px)");

            if (x.matches) {
                document.querySelector('.new-billing-wrapper').classList.remove('closed');
                document.querySelector('.new-billing-wrapper').classList.add('open');
                document.querySelector('.new-billing-container').classList.add('open');
                document.querySelector('.new-billing-container').style.transform = 'translate3d(0, 0, 0)';
    
                this.disableBodyScroll(document.querySelector('.new-billing-container'));
            } 
            /*
            else {
                document.querySelector('.guests-dropdown').classList.add('open');
                window.addEventListener('click', this.hideGuestsDropdown);
            }*/
            
        },
        hideNewBillingOverlay() {
            closeNewBillingOverlay = true;
            document.querySelector('.new-billing-wrapper').classList.remove('open');
            document.querySelector('.new-billing-container').classList.remove('open');
            document.querySelector('.new-billing-container').style.transform = 'translate3d(0, 100%, 0)';

            document.querySelector('.new-billing-container').ontransitionend = function() {
                if (!document.querySelector('.new-billing-wrapper').classList.contains('open') && closeNewBillingOverlay) {
                    document.querySelector('.new-billing-wrapper').classList.add('closed');
                    closeNewBillingOverlay = false;
                }
            }
            this.enableBodyScroll(document.querySelector('.new-billing-container'));
        },
        createNewBilling() {
            if (this.newBillingFormData['transactionType'] && this.newBillingFormData['date'] && this.newBillingFormData['amount'] && this.newBillingFormData['bookingId']) {
                if (this.newBillingFormData['transactionType'] == 'PAYMENT') {
                    if (this.newBillingFormData['amount'] > 0) {
                        this.newBillingFormData['amount'] *= -1;
                    }
                }
                this.billings.push({
                    'id': null,
                    'bookingId': this.newBillingFormData['bookingId'],
                    'amount': this.newBillingFormData['amount'],
                    'date': this.newBillingFormData['date'],
                    'invoiceDueDate': null,
                    'transactionType': this.newBillingFormData['transactionType'],
                    'invoiceStatus': null,
                    'linkedInvoice': null,
                    'linkedPayments': [],
                    'reference': null,
                    'note': this.newBillingFormData['note'],
                    'updateFlag': true,
                    'deleteFlag': false
                });
                this.newBillingFormData = {
                    'id': null,
                    'bookingId': null,
                    'amount': null,
                    'date': null,
                    'invoiceDueDate': null,
                    'transactionType': null,
                    'reference': null,
                    'note': null
                }
                this.hideNewBillingOverlay();
                this.showMessage('New billing created, to confirm changes click update.');
            }
        },
        showMessage(msg, negative=false) {
            this.dialogBoxMessage = msg;
            document.querySelector('.dialog-box-message').classList.remove('negative');

            if (negative) {
                document.querySelector('.dialog-box-message').classList.add('negative');
            }

            document.querySelector('.dialog-box').classList.remove('closed');
            setTimeout(() => {
                document.querySelector('.dialog-box').classList.add('closed');
            }, 3000);
        },
        closeMessage() {
            document.querySelector('.dialog-box').classList.add('closed');
        },
        payInFull(booking) {
            booking['payInFull'] = true;
            booking['payInParts'] = false;
        },
        payInParts(booking) {
            booking['payInFull'] = false;
            booking['payInParts'] = true;
        }
    },
    delimiters: ['<%', '%>']
})