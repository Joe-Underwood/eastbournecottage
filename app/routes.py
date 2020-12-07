from app import app, db
from app.forms import BookingForm
from app.models import Customer, Booking, Date, Price_List
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

    return {'dates' : booked_dates }

@app.route('/prices', methods=['POST'])
def price_list():

    price_list_query = db.session.query(Price_List).all()
    
    return { 'response' : 0 }

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