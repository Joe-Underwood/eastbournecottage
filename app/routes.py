from app import app, db
from app.forms import BookingForm, LoginForm
from app.models import User, Customer, Booking, Price_List, Price_List_Settings, Delete_Price_List, Delete_Booking, Delete_Customer
from flask import render_template, request, jsonify, redirect, url_for
from datetime import datetime, date, timedelta
from datetime import timedelta
from calendar import Calendar
from decimal import Decimal
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User

@app.route('/', methods=['GET', 'POST'])
def landing_page():
    booking_form = BookingForm()
    return render_template('main.html', booking_form=booking_form)

@app.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    return render_template('admin.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect('/admin')
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            #flask('Invalid username or password')
            return redirect('/login')
        login_user(user, remember=form.remember_me.data)
        return redirect('/admin')
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    logout_user()
    return redirect('/login')

@app.route('/get_past_price_list', methods=['POST'])
@login_required
def get_past_price_list():
    query = db.session.query(Price_List).filter(Price_List.is_past == True)
    past_price_list = []
    for row in query:
        segment = {
            'id': row.id,
            'startDate': row.start_date.isoformat(), 
            'price': str(row.price), 
            'price2Weeks': str(row.price_2_weeks), 
            'price3Weeks': str(row.price_3_weeks), 
            'price4Weeks': str(row.price_4_weeks), 
            'bookingId': row.booking_id,
            'updateFlag': False,
            'removeFlag': False
            }
        past_price_list.append(segment)

    return { 'pastPriceList': past_price_list }
        
@app.route('/get_active_price_list', methods=['POST'])
@login_required
def get_active_price_list():
    query = db.session.query(Price_List).filter(Price_List.is_active == True).order_by(Price_List.start_date.asc())
    active_price_list = []
    for row in query:
        segment = {
            'id': row.id,
            'startDate': row.start_date.isoformat(), 
            'price': str(row.price), 
            'price2Weeks': str(row.price_2_weeks), 
            'price3Weeks': str(row.price_3_weeks), 
            'price4Weeks': str(row.price_4_weeks), 
            'bookingId': row.booking_id,
            'updateFlag': False,
            'removeFlag': False
            }
        active_price_list.append(segment)

    return { 'activePriceList': active_price_list }

@app.route('/get_price_list', methods=['POST'])
@login_required
def get_price_list():
    print('price_list_requested')
    query = db.session.query(Price_List).filter(Price_List.is_past == False).order_by(Price_List.start_date.asc())
    price_list = []
    for row in query:
        segment = {
            'id': row.id,
            'startDate': row.start_date.isoformat(), 
            'price': str(row.price), 
            'price2Weeks': str(row.price_2_weeks), 
            'price3Weeks': str(row.price_3_weeks), 
            'price4Weeks': str(row.price_4_weeks), 
            'bookingId': row.booking_id,
            'isPast': row.is_past,
            'isActive': row.is_active,
            'isFuture': row.is_future,
            'lockFlag': row.lock_flag,
            'updateFlag': False,
            'deleteFlag': False,
            'selectFlag': False
            }
        price_list.append(segment)

    return { 'priceList': price_list }

@app.route('/get_public_price_list', methods=['POST'])
def get_public_price_list():
    query = db.session.query(Price_List).filter(Price_List.is_active == True).order_by(Price_List.start_date.asc())
    public_price_list = []
    for row in query:
        if row.booking_id:
            booked = True
        else:
            booked = False
        segment = {
            'id': row.id,
            'startDate': row.start_date.isoformat(), 
            'price': str(row.price), 
            'price2Weeks': str(row.price_2_weeks), 
            'price3Weeks': str(row.price_3_weeks), 
            'price4Weeks': str(row.price_4_weeks), 
            'booked': booked,
            'updateFlag': False,
            'removeFlag': False
            }
        public_price_list.append(segment)
    return { 'publicPriceList': public_price_list }

@app.route('/set_price_list', methods=['POST'])
@login_required
def set_price_list():
    json_request = request.get_json()
    base_query = db.session.query(Price_List)
    price_list_settings = db.session.query(Price_List_Settings).first()

    for segment in json_request:
        if (segment['deleteFlag']):
            db_segment = base_query.filter(Price_List.id == segment['id']).first()
            if (db_segment):
                if (db_segment.booking_id):
                    db_prev_segment = base_query.filter(Price_List.start_date < db_segment.start_date).order_by(Price_List.start_date.desc()).first()
                    if (db_prev_segment):
                        if (not db_prev_segment.booking_id):
                            db_prev_segment.booking_id = db_segment.booking_id
                            print('prev_segment will absorb booking')
                            #delete db_segment
                        elif (db_prev_segment.booking_id != db_segment.booking_id):
                            print('cannot delete segment, as it would cause a clash of bookings in previous segment')
                            continue
                    else:
                        print('no prev_segment to absorb booking')
                        continue
            
            else:
                print('segment flagged for deletion does not exist')
                continue
            
            delete_segment = Delete_Price_List(
                start_date = db_segment.start_date,
                price = db_segment.price,
                price_2_weeks = db_segment.price_2_weeks,
                price_3_weeks = db_segment.price_3_weeks,
                price_4_weeks = db_segment.price_4_weeks,
                booking_id = db_segment.booking_id,
                is_past = False,
                is_active = False,
                is_future = False
            )
            db.session.add(delete_segment)
            db.session.delete(db_segment)
            print('segment deleted')
            #works

        elif (segment['updateFlag']):
            start_date = datetime.strptime(segment['startDate'], '%Y-%m-%d').date()
            activeEndDatetime = datetime.today() + timedelta(weeks = price_list_settings.active_prices_range)
            futureEndDatetime = activeEndDatetime + timedelta(weeks = price_list_settings.future_prices_range)
            is_past = False
            is_active = False
            is_future = False
            db_segment = base_query.filter(Price_List.id == segment['id']).first()
            if (db_segment):
                booking_id = db_segment.booking_id
            else:
                booking_id = None
            
            #check proper flag isActive, isFuture etc.
            if (start_date < date.today()):
                is_past = True
                print('is_past')
            elif (start_date < activeEndDatetime.date()):
                is_active = True
                print('is_active')
            elif (start_date < futureEndDatetime.date()):
                is_future = True
                print('is_future')
            else:
                print('date too far into future, change price_list_settings.future_prices_range')
                continue
            
            #check if booking_id needs to be set, or if there is an overlap with previously booked segment
            
            if (base_query.filter(Price_List.start_date == start_date).first()):
                #works
                if (not db_segment == base_query.filter(Price_List.start_date == start_date).first()):
                    print('date already taken')
                    continue
                
            else:
                prev_segment = base_query.filter(Price_List.start_date < start_date).order_by(Price_List.start_date.desc()).first()
                if prev_segment: #may need to add some validation for updating existing segment
                    if prev_segment.booking_id:
                        prev_segment_booking = db.session.query(Booking).get(prev_segment.booking_id)
                        if (start_date == prev_segment_booking.arrival_date):
                            #works
                            booking_id = prev_segment.booking_id
                            prev_segment.booking_id = None
                            print('booking assignment changed')
                        elif (prev_segment_booking.arrival_date < start_date < prev_segment_booking.departure_date):
                            #works
                            print('invalid, new segment date overlaps with preexisting booking')
                            continue

            if (db_segment):
                base_query.filter(Price_List.id == segment['id']).update({
                    Price_List.start_date: start_date,
                    Price_List.price: Decimal(segment['price']),
                    Price_List.price_2_weeks: Decimal(segment['price2Weeks']),
                    Price_List.price_3_weeks: Decimal(segment['price3Weeks']),
                    Price_List.price_4_weeks: Decimal(segment['price4Weeks']),
                    Price_List.booking_id: booking_id,
                    Price_List.is_past: is_past,
                    Price_List.is_active: is_active,
                    Price_List.is_future: is_future,
                    Price_List.lock_flag: segment['lockFlag']
                },
                synchronize_session = False
                )
            else:
                new_segment = Price_List(
                    start_date = start_date,
                    price = Decimal(segment['price']),
                    price_2_weeks = Decimal(segment['price2Weeks']),
                    price_3_weeks = Decimal(segment['price3Weeks']),
                    price_4_weeks = Decimal(segment['price4Weeks']),
                    booking_id = booking_id,
                    is_past = is_past,
                    is_active = is_active,
                    is_future = is_future,
                    lock_flag = segment['lockFlag']
                )
                db.session.add(new_segment)
    db.session.commit()
    print('Price_List updated')
    return { 'success': True }

@app.route('/set_price_list_settings', methods=['POST'])
@login_required
def set_price_list_settings():
    json_request = request.get_json()
    query = db.session.query(Price_List_Settings).first()
    if (json_request['updateFlag']):
        #insert validation here
        query.discount_2_weeks = Decimal(json_request['discount2Weeks'])
        query.discount_3_weeks = Decimal(json_request['discount3Weeks'])
        query.discount_4_weeks = Decimal(json_request['discount4Weeks'])
        query.active_prices_range = int(json_request['activePricesRange'])
        query.future_prices_range = int(json_request['futurePricesRange'])
        query.default_changeover_day = json_request['defaultChangeoverDay']
        query.max_segment_length = json_request['maxSegmentLength']
        query.price_per_dog = Decimal(json_request['pricePerDog'])
        query.max_dogs = json_request['maxDogs']
        query.max_infants = json_request['maxInfants']
        query.max_guests = json_request['maxGuests']
 
        price_list_query = db.session.query(Price_List)
        #apply discounts:
        for index, segment in enumerate(price_list_query):
            if (not segment.lock_flag and not segment.is_past):
                if (index + 2 < price_list_query.count()):
                    segment.price_2_weeks = (segment.price + price_list_query[index + 1].price) * ((100 - Decimal(json_request['discount2Weeks'])) / 100)
                if (index + 3 < price_list_query.count()):
                    segment.price_3_weeks = (segment.price + price_list_query[index + 1].price + price_list_query[index + 2].price) * ((100 - Decimal(json_request['discount3Weeks'])) / 100)
                if (index + 4 < price_list_query.count()):
                    segment.price_4_weeks = (segment.price + price_list_query[index + 1].price + price_list_query[index + 2].price + price_list_query[index + 3].price) * ((100 - Decimal(json_request['discount4Weeks'])) / 100)
                    
        #adjust ranges:
        #currently performed when updating price list segments, this performs for all
        activeEndDatetime = datetime.today() + timedelta(weeks = query.active_prices_range)
        futureEndDatetime = activeEndDatetime + timedelta(weeks = query.future_prices_range)
        for segment in price_list_query:
            start_date = segment.start_date
            segment.is_past = False
            segment.is_active = False
            segment.is_future = False
            #check proper flag isActive, isFuture etc.
            if (start_date < date.today()):
                segment.is_past = True
            elif (start_date < activeEndDatetime.date()):
                segment.is_active = True
            elif (start_date < futureEndDatetime.date()):
                segment.is_future = True
            else:
                delete_segment = Delete_Price_List(
                    start_date = segment.start_date,
                    price = segment.price,
                    price_2_weeks = segment.price_2_weeks,
                    price_3_weeks = segment.price_3_weeks,
                    price_4_weeks = segment.price_4_weeks,
                    booking_id = segment.booking_id,
                    is_past = False,
                    is_active = False,
                    is_future = False
                )
                db.session.add(delete_segment)
                db.session.delete(segment)

        #alter default changeover day:

    db.session.commit()
    print('Price_List_Settings updated')
    return { 'success': True }

@app.route('/get_bookings', methods=['POST'])
@login_required
def get_bookings():
    query = db.session.query(Booking).order_by(Booking.arrival_date.asc())
    bookings = []
    for row in query:
        booking = {
            'id': row.id,
            'customerId': row.customer_id,
            'arrivalDate': row.arrival_date.isoformat(),
            'departureDate': row.departure_date.isoformat(),
            'adults': row.adults,
            'children': row.children,
            'infants': row.infants,
            'dogs': row.dogs,
            'stayPrice': str(row.stay_price),
            'dogPrice': str(row.dog_price),
            'price': str(row.price),
            'updateFlag': False,
            'deleteFlag': False,
            'selectFlag': False
        }
        bookings.append(booking)
    
    return { 'bookings': bookings }

@app.route('/set_bookings', methods=['POST'])
@login_required
def set_bookings():
    json_request = request.get_json()
    query = db.session.query(Booking)
    price_list = db.session.query(Price_List)

    for booking in json_request:
        if (booking['arrivalDate'] and booking['departureDate']):
            arrival_date = datetime.strptime(booking['arrivalDate'], '%Y-%m-%d').date()
            departure_date = datetime.strptime(booking['departureDate'], '%Y-%m-%d').date()
        else:
            print('booking must have arrival date and departure date')
            continue
        
        if (booking['customerId']):
            customer_id = int(booking['customerId'])
        else:
            print('warning: booking not assigned to customer')
            customer_id = None
        
        date_segments = []
        if (booking['deleteFlag']):
            db_booking = query.filter(Booking.id == booking['id']).first()
            if (db_booking):
                delete_booking = Delete_Booking(
                    customer_id = customer_id,
                    arrival_date = datetime.strptime(booking['arrivalDate'], '%Y-%m-%d').date(),
                    departure_date = datetime.strptime(booking['departureDate'], '%Y-%m-%d').date(),
                    adults = int(booking['adults']),
                    children = int(booking['children']),
                    infants = int(booking['infants']),
                    dogs = int(booking['dogs']),
                    stay_price = Decimal(booking['stayPrice']),
                    dog_price = Decimal(booking['dogPrice']),
                    price = Decimal(booking['price'])
                )
                db.session.add(delete_booking)
                for segment in db_booking.date_segments:
                    segment.booking_id = None
                #remove references to booking from related customer
                db.session.delete(db_booking)
                print('booking deleted')   
            else:
                print('booking marked for deletion does not exist')
                continue
        elif (booking['updateFlag']):
            #match with price_list segment if possible
            #find arrival date segment first, then departure date segment
            if (not departure_date > arrival_date):
                print('departure date must be after arrival date')
                continue
            if (not int(booking['adults']) >= 1):
                print('no. of adults must be at least 1')
                continue
            def checkDateSegments():
                arrivalSegmentFound = False
                for index, segment in enumerate(price_list):
                    if (arrival_date < segment.start_date and not arrivalSegmentFound):
                        arrivalSegmentFound = True
                        if (index > 0):
                            if (price_list[index - 1].booking_id):
                                if (price_list[index - 1].booking_id != booking['id']):
                                    return False                    
                            date_segments.append(price_list[index - 1])
                    if (arrivalSegmentFound):
                        if (departure_date > segment.start_date):
                            if (segment.booking_id):
                                if (segment.booking_id != booking['id']):
                                    return False
                            date_segments.append(segment)
                        else:
                            return True
            
            if not checkDateSegments():
                print('dates overlap with preexisiting booking, new_booking is invalid')
                print(booking['arrivalDate'])
                continue

            #checking date segments do not overlap with pre existing bookings
            if (booking['id']):
                booking_to_update = query.get(booking['id'])
                query.filter(Booking.id == booking['id']).update({
                    Booking.customer_id: customer_id,
                    Booking.arrival_date: datetime.strptime(booking['arrivalDate'], '%Y-%m-%d').date(),
                    Booking.departure_date: datetime.strptime(booking['departureDate'], '%Y-%m-%d').date(),
                    Booking.adults: int(booking['adults']),
                    Booking.children: int(booking['children']),
                    Booking.infants: int(booking['infants']),
                    Booking.dogs: int(booking['dogs']),
                    Booking.stay_price: Decimal(booking['stayPrice']),
                    Booking.dog_price: Decimal(booking['dogPrice']),
                    Booking.price: Decimal(booking['price'])
                },
                synchronize_session = False
                )
                for existing_segment in booking_to_update.date_segments:
                    existing_segment.booking_id = None
                for segment in date_segments:
                    segment.booking_id = booking['id']
            else:
                new_booking = Booking(
                    customer_id = customer_id,
                    arrival_date = datetime.strptime(booking['arrivalDate'], '%Y-%m-%d').date(),
                    departure_date = datetime.strptime(booking['departureDate'], '%Y-%m-%d').date(),
                    adults = int(booking['adults']),
                    children = int(booking['children']),
                    infants = int(booking['infants']),
                    dogs = int(booking['dogs']),
                    stay_price = Decimal(booking['stayPrice']),
                    dog_price = Decimal(booking['dogPrice']),
                    price = Decimal(booking['price'])
                )
                for segment in date_segments:
                    new_booking.date_segments.append(segment)
                db.session.add(new_booking)
    db.session.commit()
    print('Booking updated')
    return { 'success': True }

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

    if (int(booking_form_data['adults']) <= 0):
        print('Number of adults must be at least 1')
        return { 'success': False }
    if ((int(booking_form_data['adults']) + int(booking_form_data['children'])) > price_list_settings[0].max_guests):
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

    customer.bookings.append(booking)
    db.session.add(customer)
    db.session.add(booking)
    db.session.commit()

    return { 'success': True }

@app.route('/get_customers', methods=['POST'])
@login_required
def get_customers():
    customers_query = db.session.query(Customer)
    customers = []
    for row in customers_query:
        customer = {
            'id': row.id,
            'firstName': str(row.first_name),
            'lastName': str(row.last_name),
            'emailAddress': str(row.email_address),
            'phoneNumber': str(row.phone_number),
            'addressLine1': str(row.address_line_1),
            'addressLine2': str(row.address_line_2),
            'townOrCity': str(row.town_or_city),
            'countyOrRegion': str(row.county_or_region),
            'postcode': str(row.postcode),
            'updateFlag': False,
            'deleteFlag': False,
            'selectFlag': False
        }
        customers.append(customer)
    return { 'customers': customers }

@app.route('/set_customers', methods=['POST'])
@login_required
def set_customers():
    json_request = request.get_json()
    query = db.session.query(Customer)
    for customer in json_request:
        if (customer['deleteFlag']):
            db_customer = query.filter(Customer.id == customer['id']).first()
            if (db_customer):
                delete_customer = Delete_Customer(
                    first_name = str(customer['firstName']),
                    last_name = str(customer['lastName']),
                    email_address = str(customer['emailAddress']),
                    phone_number = str(customer['phoneNumber']),
                    address_line_1 = str(customer['addressLine1']),
                    address_line_2 = str(customer['addressLine2']),
                    town_or_city = str(customer['townOrCity']),
                    county_or_region = str(customer['countyOrRegion']),
                    postcode = str(customer['postcode'])
                )
                db.session.add(delete_customer)
                for booking in db_customer.bookings:
                    booking.customer_id = None
                db.session.delete(db_customer)
                print('customer deleted')
            else:
                print('customer marked for deletion does not exist')
                continue
        elif (customer['updateFlag']):
            if (customer['id']): #maybe check if there are any mismatches
                query.filter(Customer.id == customer['id']).update({
                    Customer.first_name: str(customer['firstName']),
                    Customer.last_name: str(customer['lastName']),
                    Customer.email_address: str(customer['emailAddress']),
                    Customer.phone_number: str(customer['phoneNumber']),
                    Customer.address_line_1: str(customer['addressLine1']),
                    Customer.address_line_2: str(customer['addressLine2']),
                    Customer.town_or_city: str(customer['townOrCity']),
                    Customer.county_or_region: str(customer['countyOrRegion']),
                    Customer.postcode: str(customer['postcode']),
                },
                synchronize_session = False
                )
                print('customer updated')
            else: 
                new_customer = Customer(
                    first_name = str(customer['firstName']),
                    last_name = str(customer['lastName']),
                    email_address = str(customer['emailAddress']),
                    phone_number = str(customer['phoneNumber']),
                    address_line_1 = str(customer['addressLine1']),
                    address_line_2 = str(customer['addressLine2']),
                    town_or_city = str(customer['townOrCity']),
                    county_or_region = str(customer['countyOrRegion']),
                    postcode = str(customer['postcode'])
                )
                db.session.add(new_customer)
                print('customer added')
    db.session.commit()
    print('Customer updated')
    return { 'success': True }
    
@app.route('/get_price_list_settings', methods=['POST'])
@login_required
def get_price_list_settings():
    settings_query = db.session.query(Price_List_Settings)
    settings = { 
        'id': settings_query[0].id,
        'discount2Weeks': str(settings_query[0].discount_2_weeks),
        'discount3Weeks': str(settings_query[0].discount_3_weeks),
        'discount4Weeks': str(settings_query[0].discount_4_weeks),
        'activePricesRange': settings_query[0].active_prices_range,
        'futurePricesRange': settings_query[0].future_prices_range,
        'defaultChangeoverDay': settings_query[0].default_changeover_day,
        'maxSegmentLength': settings_query[0].max_segment_length,
        'pricePerDog': str(settings_query[0].price_per_dog),
        'maxDogs': settings_query[0].max_dogs,
        'maxInfants': settings_query[0].max_infants,
        'maxGuests': settings_query[0].max_guests,
        'updateFlag': False
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

@app.route('/get_server_date', methods=['POST'])
def get_server_date():
    return { 'serverDate': date.today().isoformat() }

