from app import app, db
from app.forms import BookingForm
from app.models import User, Customer, Booking, Price_List, Future_Price_List, Price_List_Settings
from flask import render_template, request, jsonify
from datetime import datetime, date, timedelta
from calendar import Calendar
from decimal import Decimal

@app.route('/', methods=['GET', 'POST'])
def landing_page():
    booking_form = BookingForm()
    return render_template('main.html', booking_form=booking_form)

@app.route('/get_prices', methods=['POST'])
def get_prices():
    price_list_query = db.session.query(Price_List)
    price_list = []
    for row in price_list_query:
        segment = { 
            'startDate': row.start_date.isoformat(), 
            'price': str(row.price), 
            'price2Weeks': str(row.price_2_weeks), 
            'price3Weeks': str(row.price_3_weeks), 
            'price4Weeks': str(row.price_4_weeks), 
            'bookingId': str(row.booking_id) 
            }
        price_list.append(segment)

    return { 'priceList': price_list }

@app.route('/get_bookings', methods=['POST'])
def get_bookings():
    bookings_query = db.session.query(Booking)
    print(bookings_query)
    for row in bookings_query:
        print(row.price)
        print(row.arrival_date)
    bookings = []
    for row in bookings_query:
        booking = {
            'customerId': str(row.customer_id),
            'arrivalDate': row.arrival_date.isoformat(),
            'departureDate': row.departure_date.isoformat(),
            'adults': str(row.adults),
            'children': str(row.children),
            'infants': str(row.infants),
            'dogs': str(row.dogs),
            'stayPrice': str(row.stay_price),
            'dogPrice': str(row.dog_price),
            'price': str(row.price)
        }
        bookings.append(booking)
    
    return { 'bookings': bookings }

@app.route('/booking', methods=['POST'])
def booking():
    booking_form_data = request.get_json()

    #----VALIDATION-------#
    price_list_settings = db.session.query(Price_List_Settings)
    price_list = db.session.query(Price_List)
    arrival_date = datetime.strptime(booking_form_data['arrivalDate'][0:10], '%Y-%m-%d').date()
    departure_date = datetime.strptime(booking_form_data['departureDate'][0:10], '%Y-%m-%d').date()
    date_segments = []

    for index, segment in enumerate(price_list):
        if (not date_segments and segment.start_date > arrival_date):
            if (price_list[index - 1].booking_id):
                print('date segment is already booked')
                return { 'sucess': False }
            date_segments.append(price_list[index - 1])
        
        if (date_segments):
            if (segment.booking_id):
                print('date segment is already booked')
                return { 'sucess': False }
            if (departure_date <= segment.start_date):
                break
            date_segments.append(price_list[index])
            
    if (not (date_segments)):
        return { 'success': False }
    else:
        print(date_segments)
        if (len(date_segments) == 1):
            correct_price = date_segments[0].price
        elif (len(date_segments) == 2):
            correct_price = date_segments[0].price_2_weeks
        elif (len(date_segments) == 3):
            correct_price = date_segments[0].price_3_weeks
        elif (len(date_segments) == 4):
            correct_price = date_segments[0].price_4_weeks
        else:
            print('Stay length exceeds maximum allowed')
            return { 'success': False }
        
        if (Decimal(booking_form_data['stayPrice']) != Decimal(correct_price)):
            print('submitted stay price:' + str(booking_form_data['stayPrice']))
            print('database stay_price:' + str(correct_price))
            print('Submitted price does not match with databse, resubmit correct_price to user for confirmation')
            return { 'success': False }

    if (0 < (int(booking_form_data['adults']) + int(booking_form_data['children'])) <= price_list_settings[0].max_guests):
        print('Number of guests exceeds maximum allowed')
        return { 'success': False }
    if (int(booking_form_data['infants']) > price_list_settings[0].max_infants):
        print('Number of infants exceeds maximum allowed')
        return { 'success': False }
    if (int(booking_form_data['dogs']) > price_list_settings[0].max_dogs):
        print('Number of dogs exceeds maximum allowed')
        return { 'success': False }
    if (Decimal(booking_form_data['dogPrice']) != int(booking_form_data['dogs']) * price_list_settings[0].price_per_dog):
        print('Incorrect dog price')
        return { 'success': False }
    if (Decimal(booking_form_data['price']) != Decimal(booking_form_data['stayPrice']) + Decimal(booking_form_data['dogPrice'])):
        print('Prices do not add up to total, resubmit correct prices to user for confirmation')
        return { 'success': False }
    
    #-------VALIDATION END-------------------#

    booking = Booking(
        arrival_date = arrival_date,
        departure_date = departure_date,
        adults = int(booking_form_data['adults']),
        children = int(booking_form_data['children']),
        infants = int(booking_form_data['infants']),
        dogs = int(booking_form_data['dogs']),
        stay_price = Decimal(booking_form_data['stayPrice']),
        dog_price = Decimal(booking_form_data['dogPrice']),
        price = Decimal(booking_form_data['price'])
    )

    customer = Customer(
        first_name = booking_form_data['firstName'],
        last_name = booking_form_data['lastName'],
        email_address = booking_form_data['emailAddress'],
        phone_number = booking_form_data['phoneNumber'],
        address_line_1 = booking_form_data['addressLine1'],
        address_line_2 = booking_form_data['addressLine2'],
        town_or_city = booking_form_data['townOrCity'],
        county_or_region = booking_form_data['countyOrRegion'],
        postcode = booking_form_data['postcode']
    )

    for segment in date_segments:
        segment.booked = True
        booking.date_segments.append(segment)

    print(booking.arrival_date)
    customer.bookings.append(booking)
    db.session.add(customer)
    db.session.add(booking)
    db.session.commit()

    return { 'success': True }

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template('admin.html')

@app.route('/update_prices', methods=['POST'])
def update_prices():

    db.session.query(Price_List).delete()
    db.session.query(Future_Price_List).delete()

    request_price_list = request.get_json()['priceList']

    for segment in request_price_list:
        price_list_segment = Price_List(
            start_date = datetime.strptime(segment['startDate'], '%Y-%m-%d').date(),
            price = segment['price'],
            price_2_weeks = segment['price2Weeks'],
            price_3_weeks = segment['price3Weeks'],
            price_4_weeks = segment['price4Weeks'],
        )
        db.session.add(price_list_segment)

    request_future_price_list = request.get_json()['futurePriceList']

    for segment in request_future_price_list:
        future_price_list_segment = Future_Price_List(
            start_date = datetime.strptime(segment['startDate'], '%Y-%m-%d').date(),
            price = segment['price'],
            price_2_weeks = segment['price2Weeks'],
            price_3_weeks = segment['price3Weeks'],
            price_4_weeks = segment['price4Weeks'],
        )
        db.session.add(future_price_list_segment)

    db.session.commit()
    print('prices updated')
    return { 'success': True }

@app.route('/update_price_list_settings', methods=['POST'])
def update_price_list_settings():

    db.session.query(Price_List_Settings).delete()

    request_settings = request.get_json()

    updated_settings = Price_List_Settings(
        discount_2_weeks = request_settings['discount2Weeks'],
        discount_3_weeks = request_settings['discount3Weeks'],
        discount_4_weeks = request_settings['discount4Weeks'],
        active_prices_range = int(request_settings['activePricesRange']),
        future_prices_range = int(request_settings['futurePricesRange']),
        default_changeover_day = int(request_settings['defaultChangeoverDay']),
        max_segment_length = int(request_settings['maxSegmentLength']),
        price_per_dog = Decimal(request_settings['pricePerDog']),
        max_dogs = int(request_settings['maxDogs']),
        max_infants = int(request_settings['maxInfants']),
        max_guests = int(request_settings['maxGuests'])
    )

    db.session.add(updated_settings)
    db.session.commit()

    print('price_list_settings updated')
    return { 'success': True }

@app.route('/get_price_list_settings', methods=['POST'])
def get_price_list_settings():
    settings_query = db.session.query(Price_List_Settings)
    settings = { 
        'discount2Weeks': str(settings_query[0].discount_2_weeks),
        'discount3Weeks': str(settings_query[0].discount_3_weeks),
        'discount4Weeks': str(settings_query[0].discount_4_weeks),
        'activePricesRange': str(settings_query[0].active_prices_range),
        'futurePricesRange': str(settings_query[0].future_prices_range),
        'defaultChangeoverDay': str(settings_query[0].default_changeover_day),
        'maxSegmentLength': str(settings_query[0].max_segment_length),
        'pricePerDog': str(settings_query[0].price_per_dog),
        'maxDogs': str(settings_query[0].max_dogs),
        'maxInfants': str(settings_query[0].max_infants),
        'maxGuests': str(settings_query[0].max_guests)
        }

    return { 'priceListSettings': settings }

@app.route('/get_public_price_list_settings', methods=['POST'])
def get_public_price_list_settings():
    settings_query = db.session.query(Price_List_Settings)
    settings = { 
        'discount2Weeks': str(settings_query[0].discount_2_weeks),
        'discount3Weeks': str(settings_query[0].discount_3_weeks),
        'discount4Weeks': str(settings_query[0].discount_4_weeks),
        'activePricesRange': str(settings_query[0].active_prices_range),
        'maxSegmentLength': str(settings_query[0].max_segment_length)
        }

    return { 'publicPriceListSettings': settings }

@app.route('/get_future_prices', methods=['POST'])
def get_future_prices():
    future_price_list_query = db.session.query(Future_Price_List)
    future_price_list = []
    for row in future_price_list_query:
        segment = {
            'startDate': row.start_date.isoformat(), 
            'price': str(row.price), 
            'price2Weeks': str(row.price_2_weeks), 
            'price3Weeks': str(row.price_3_weeks), 
            'price4Weeks': str(row.price_4_weeks), 
            }
        future_price_list.append(segment)

    return { 'futurePriceList': future_price_list }