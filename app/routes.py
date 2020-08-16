from app import app, db
from app.forms import BookingForm
from app.models import Customer, Booking, Date
from flask import render_template, request, jsonify
from datetime import date, timedelta
from calendar import Calendar

@app.route('/', methods=['GET', 'POST'])
def landing_page():

    booking_form = BookingForm()

    if booking_form.validate_on_submit():
        customer = Customer(name=booking_form.name.data, email_address=booking_form.email_address.data, phone_number=booking_form.phone_number.data)
        booking = Booking(confirmed=False, paid=False, cancelled=False)

        customer.bookings.append(booking)

        date_delta = (booking_form.departure_date.data - booking_form.arrival_date.data).days
        for i in range(0, date_delta+1):
            date = Date(date=(booking_form.arrival_date.data + timedelta(days=i)).isoformat())
            booking.dates.append(date)
            db.session.add(date)

        db.session.add(customer)
        db.session.add(booking)
        db.session.commit()

    return render_template('index.html', booking_form=booking_form)

@app.route('/dates', methods=['POST'])
def dates():

    booked_dates_query = db.session.query(Date.date).all()
    booked_dates = []
    for date in booked_dates_query:
        booked_dates.append(date[0])

    return {'dates' : booked_dates }

@app.route('/booking', methods=['POST'])
def booking():
    print('received')
    booking_form_data = request.get_json()
    print(booking_form_data)

    return { 'success': True }
