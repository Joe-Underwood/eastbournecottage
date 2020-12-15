from app import app, db
from app.forms import BookingForm
from app.models import User, Customer, Booking, Date, Price_List, Future_Price_List, Past_Price_List, Price_List_Settings
from flask import render_template, request, jsonify
from datetime import datetime, date, timedelta
from calendar import Calendar
from decimal import Decimal

@app.route('/', methods=['GET', 'POST'])
def landing_page():
    booking_form = BookingForm()
    return render_template('main.html', booking_form=booking_form)

@app.route('/dates', methods=['POST'])
def dates():

    booked_dates_query = db.session.query(Date.date).all()
    booked_dates = []
    for date in booked_dates_query:
        booked_dates.append(date[0])

    return { 'dates' : booked_dates }

@app.route('/get_prices', methods=['POST'])
def get_prices():

    price_list_query = db.session.query(Price_List)
    price_list = []
    for row in price_list_query:
        segment = { 'startDate': row.start_date.isoformat(), 'price': str(row.price), 'price2Weeks': str(row.price_2_weeks), 'price3Weeks': str(row.price_3_weeks), 'price4Weeks': str(row.price_4_weeks), 'booked': row.booked }
        price_list.append(segment)

    return { 'priceList': price_list }

@app.route('/booking', methods=['POST'])
def booking():
    booking_form_data = request.get_json()

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

    booking = Booking(
        adults = int(booking_form_data['adults']),
        children = int(booking_form_data['children']),
        infants = int(booking_form_data['infants']),
        dogs = int(booking_form_data['dogs']),
        price = Decimal(booking_form_data['price'])
    )

    arrival_date = datetime.strptime(booking_form_data['arrivalDate'][0:10], '%Y-%m-%d').date()
    departure_date = datetime.strptime(booking_form_data['departureDate'][0:10], '%Y-%m-%d').date()
    date_delta = (departure_date - arrival_date).days
    for i in range(0, date_delta+1):
        if (i == 0):
            arrival_is = True
            departure_is = False

            for start_date in db.session.query(Price_List.start_date).all():
                if (start_date == arrival_date):
                    changeover_is = True
                    break

            changeover_is = False
                
        elif (i == date_delta+1):
            arrival_is = False
            departure_is = True

            for end_date in db.session.query(Price_List.end_date).all():
                if (end_date == departure_date):
                    changeover_is = True
                    break

            changeover_is = False

        else:
            arrival_is = False
            departure_is = False
            changeover_is = False

        date = Date(is_arrival = arrival_is, is_departure = departure_is, is_changeover = changeover_is, date = (arrival_date + timedelta(days=i)))
        booking.dates.append(date)
        db.session.add(date)

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
            booked = segment['booked']
        )
        db.session.add(price_list_segment)

    request_future_price_list = request.get_json()['futurePriceList']

    for segment in request_future_price_list:
        future_price_list_segment = Future_Price_List(
            start_date = datetime.strptime(segment['startDate'], '%Y-%m-%d').date(),
            price = segment['price'],
            price_2_weeks = segment['price2Weeks'],
            price_3_weeks = segment['price3Weeks'],
            price_4_weeks = segment['price4Weeks']
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
        active = True
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
        'defaultChangeoverDay': str(settings_query[0].default_changeover_day)
        }

    return { 'priceListSettings': settings }

@app.route('/get_future_prices', methods=['POST'])
def get_future_prices():
    future_price_list_query = db.session.query(Future_Price_List)
    future_price_list = []
    for row in future_price_list_query:
        segment = { 'startDate': row.start_date.isoformat(), 'price': str(row.price), 'price2Weeks': str(row.price_2_weeks), 'price3Weeks': str(row.price_3_weeks), 'price4Weeks': str(row.price_4_weeks) }
        future_price_list.append(segment)

    return { 'futurePriceList': future_price_list }