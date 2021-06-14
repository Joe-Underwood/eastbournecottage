from app import app, db, mail
from app.forms import BookingForm, LoginForm
from app.models import User, Customer, Booking, Billing, Billing_Settings, Payment_Breakpoint, Cancellation_Breakpoint, Price_List, Price_List_Settings, Delete_Price_List, Delete_Booking, Delete_Customer, Delete_Billing
from app.methods import update_price_list
from flask import render_template, request, jsonify, redirect, url_for
from datetime import datetime, date, timedelta, time
from calendar import Calendar
from decimal import Decimal, ROUND_HALF_UP
from flask_login import current_user, login_user, logout_user, login_required
from functools import reduce
from flask_mail import Message
from threading import Thread
import pdfkit

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
        return redirect(url_for('admin'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            #flask('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('admin'))
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/get_past_price_list', methods=['POST'])
@login_required
def get_past_price_list():
    query = db.session.query(Price_List).filter(Price_List.range_type == 'PAST')
    past_price_list = []
    for row in query:
        segment = {
            'id': row.id,
            'startDate': row.start_date.isoformat(), 
            'price': str(row.price), 
            'price2Weeks': str(row.price_2_weeks), 
            'price3Weeks': str(row.price_3_weeks), 
            'price4Weeks': str(row.price_4_weeks), 
            'discountAmount2Weeks': str(row.discount_amount_2_weeks),
            'discountAmount3Weeks': str(row.discount_amount_3_weeks),
            'discountAmount4Weeks': str(row.discount_amount_4_weeks),
            'bookingId': row.booking_id,
            'updateFlag': False,
            'removeFlag': False
            }
        past_price_list.append(segment)

    return { 'pastPriceList': past_price_list }
        
@app.route('/get_active_price_list', methods=['POST'])
@login_required
def get_active_price_list():
    query = db.session.query(Price_List).filter(Price_List.range_type == 'ACTIVE').order_by(Price_List.start_date.asc())
    active_price_list = []
    for row in query:
        segment = {
            'id': row.id,
            'startDate': row.start_date.isoformat(), 
            'price': str(row.price), 
            'price2Weeks': str(row.price_2_weeks), 
            'price3Weeks': str(row.price_3_weeks), 
            'price4Weeks': str(row.price_4_weeks), 
            'discountAmount2Weeks': str(row.discount_amount_2_weeks),
            'discountAmount3Weeks': str(row.discount_amount_3_weeks),
            'discountAmount4Weeks': str(row.discount_amount_4_weeks),
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
    query = db.session.query(Price_List).filter(Price_List.range_type != 'PAST').order_by(Price_List.start_date.asc())
    price_list = []
    for row in query:
        segment = {
            'id': row.id,
            'startDate': row.start_date.isoformat(), 
            'price': str(row.price), 
            'price2Weeks': str(row.price_2_weeks), 
            'price3Weeks': str(row.price_3_weeks), 
            'price4Weeks': str(row.price_4_weeks),
            'discountAmount2Weeks': str(row.discount_amount_2_weeks),
            'discountAmount3Weeks': str(row.discount_amount_3_weeks),
            'discountAmount4Weeks': str(row.discount_amount_4_weeks),
            'bookingId': row.booking_id,
            'rangeType': row.range_type,
            'lockFlag': row.lock_flag,
            'updateFlag': False,
            'deleteFlag': False,
            'selectFlag': False
            }
        price_list.append(segment)

    return { 'priceList': price_list }

@app.route('/get_public_price_list', methods=['POST'])
def get_public_price_list():
    query = db.session.query(Price_List).filter(Price_List.range_type == 'ACTIVE').order_by(Price_List.start_date.asc())
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
            'discountAmount2Weeks': str(row.discount_amount_2_weeks),
            'discountAmount3Weeks': str(row.discount_amount_3_weeks),
            'discountAmount4Weeks': str(row.discount_amount_4_weeks),
            'booked': booked
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
                discount_amount_2_weeks = db_segment.discount_amount_2_weeks,
                discount_amount_3_weeks = db_segment.discount_amount_3_weeks,
                discount_amount_4_weeks = db_segment.discount_amount_4_weeks,
                booking_id = db_segment.booking_id,
                range_type = None
            )
            db.session.add(delete_segment)
            db.session.delete(db_segment)
            print('segment deleted')
            #works

        elif (segment['updateFlag']):
            start_date = datetime.strptime(segment['startDate'], '%Y-%m-%d').date()
            activeEndDatetime = datetime.today() + timedelta(weeks = price_list_settings.active_prices_range)
            futureEndDatetime = activeEndDatetime + timedelta(weeks = price_list_settings.future_prices_range)
            db_segment = base_query.filter(Price_List.id == segment['id']).first()
            if (db_segment):
                booking_id = db_segment.booking_id
            else:
                booking_id = None
            
            #check proper flag isActive, isFuture etc.
            if (start_date < date.today()):
                range_type = 'PAST'
                print('is_past')
            elif (start_date < activeEndDatetime.date()):
                range_type = 'ACTIVE'
                print('is_active')
            elif (start_date < futureEndDatetime.date()):
                range_type = 'FUTURE'
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
                    Price_List.discount_amount_2_weeks: Decimal(segment['discountAmount2Weeks']),
                    Price_List.discount_amount_3_weeks: Decimal(segment['discountAmount3Weeks']),
                    Price_List.discount_amount_4_weeks: Decimal(segment['discountAmount4Weeks']),
                    Price_List.booking_id: booking_id,
                    Price_List.range_type: range_type,
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
                    discount_amount_2_weeks = Decimal(segment['discountAmount2Weeks']),
                    discount_amount_3_weeks = Decimal(segment['discountAmount3Weeks']),
                    discount_amount_4_weeks = Decimal(segment['discountAmount4Weeks']),
                    booking_id = booking_id,
                    range_type = range_type,
                    lock_flag = segment['lockFlag']
                )
                db.session.add(new_segment)
    db.session.commit()
    update_price_list()
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
        query.min_age = json_request['minAge']
        query.check_in_time = time.fromisoformat(json_request['checkInTime'])
        query.check_out_time = time.fromisoformat(json_request['checkOutTime'])

    db.session.commit()
    update_price_list()
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
            'multiWeekDiscount': str(row.multi_week_discount),
            'dogPrice': str(row.dog_price),
            'total': str(row.total),
            'status': row.status,
            'updateFlag': False,
            'updateStatusFlag': False,
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
        if (booking['updateStatusFlag']):
            print(booking['status'])
            query.filter(Booking.id == booking['id']).update({
                Booking.status: booking['status']
            })

            db_customer = db.session.query(Customer).get(customer_id)
            db_booking = db.session.query(Booking).get(booking['id'])
            db_billing_settings = db.session.query(Billing_Settings).first()

            for bill in db_booking.billings:
                if bill.first_invoice:
                    first_invoice = bill
                    bill.date = date.today()
                    bill.invoice_due_date = bill.date + timedelta(days=db_billing_settings.first_payment_due_after)
                    bill.invoice_status = 'ACTIVE'
                
                else:
                    bill.invoice_status = 'ACCEPTED'

            def send_async_email(app, msg):
                with app.app_context():
                    mail.send(msg)

            def send_async_email_with_invoice(app, msg, render, invoice_reference):
                pdf = pdfkit.from_string(render, False)
                msg.attach('invoice_' + str(invoice_reference) + '.pdf', 'application/pdf', pdf, 'attachment')
                with app.app_context():
                    mail.send(msg)

            if booking['status'] == 'ACCEPTED':
                admin_msg = Message('Booking Request Accepted: ' + db_customer.first_name + ' ' + db_customer.last_name, sender=app.config['MAIL_USERNAME'], recipients=[app.config['MAIL_USERNAME']])
                admin_msg.body = (
                    'Hello, \n \n' +
                    'The following booking request has now been ACCEPTED and the customer has been notified. \n' + 
                    'Name: ' + db_customer.first_name + ' ' + db_customer.last_name + '\n' +
                    'Email: ' + db_customer.email_address + '\n' +
                    'Phone: ' + db_customer.phone_number + '\n' +
                    'Arrival Date: ' + booking['arrivalDate'] + '\n' + 
                    'Departure Date: ' + booking['departureDate'] + '\n' +
                    'Party: ' + str(booking['adults']) + ' adults, ' + str(booking['children']) + ' children, ' + str(booking['infants']) + ' infants, ' + str(booking['dogs']) + ' dogs \n' +
                    'Total: ' + str(booking['total']) + '\n \n'
                )

                admin_thr = Thread(target=send_async_email, args=[app, admin_msg])
                admin_thr.start()

                invoice_render = render_template(
                    'invoice.html',
                    customer = db_customer,
                    invoice = first_invoice,
                    invoice_date_string = first_invoice.date.strftime("%d %B %Y"),
                    invoice_due_date_string = first_invoice.invoice_due_date.strftime("%d %B %Y"),
                    booking = db_booking, 
                    price_per_dog = db.session.query(Price_List_Settings).first().price_per_dog,
                    stay_length = (db_booking.departure_date - db_booking.arrival_date).days
                )

                customer_msg = Message('Booking Request Accepted', sender=app.config['MAIL_USERNAME'], recipients=[db_customer.email_address])

                if len(db_booking.billings) == 1:
                    customer_msg.body = (
                        'Hello, \n \n' +
                        'Your booking request has been accepted! Payment is now due within ' + str(db_billing_settings.first_payment_due_after) + ' days of this email, and should be made via bank transfer. Our account details are as follows: \n ' +
                        '>>Insert bank details<< \n \n' +
                        'Kind regards, \n \n' + 
                        'The Cottage - Eastbourne' 
                    )

                elif len(db_booking.billings) > 1:
                    customer_msg.body = (
                        'Hello, \n \n' +
                        'Your booking request has been accepted! The first payment of £' + str(first_invoice.amount) + ' (' + str(first_invoice.percentage_due) + '%) is now due within ' + str(db_billing_settings.first_payment_due_after) + ' days of this email, and should be made via bank transfer. Our account details are as follows: \n' +
                        '>>Insert banks details<< \n \n' +
                        'The other installments are' + 
                        'Kind regards, \n \n' + 
                        'The Cottage - Eastbourne' 
                        )

                customer_thr = Thread(target=send_async_email_with_invoice, args=[app, customer_msg, invoice_render, str(first_invoice.invoice_reference)])
                customer_thr.start() 

            elif booking['status'] == 'REJECTED':

                for bill in db_booking.billings:
                    db.session.delete(bill)

                admin_msg = Message('Booking Request Rejected: ' + db_customer.first_name + ' ' + db_customer.last_name, sender=app.config['MAIL_USERNAME'], recipients=[app.config['MAIL_USERNAME']])
                admin_msg.body = (
                    'Hello, \n \n' +
                    'The following booking request has now been REJECTED and the customer has been notified. \n' + 
                    'Name: ' + db_customer.first_name + ' ' + db_customer.last_name + '\n' +
                    'Email: ' + db_customer.email_address + '\n' +
                    'Phone: ' + db_customer.phone_number + '\n' +
                    'Arrival Date: ' + booking['arrivalDate'] + '\n' + 
                    'Departure Date: ' + booking['departureDate'] + '\n' +
                    'Party: ' + str(booking['adults']) + ' adults, ' + str(booking['children']) + ' children, ' + str(booking['infants']) + ' infants, ' + str(booking['dogs']) + ' dogs \n' +
                    'Total: ' + str(booking['total']) + '\n \n'
                )

                admin_thr = Thread(target=send_async_email, args=[app, admin_msg])
                admin_thr.start()

                customer_msg = Message('Booking Request Rejected', sender=app.config['MAIL_USERNAME'], recipients=[db_customer.email_address])
                customer_msg.body = (
                    'Hello, \n \n' +
                    'Unfortunately, your booking request with us has been rejected. \n \n' +
                    'Kind regards, \n \n' + 
                    'The Cottage - Eastbourne' 
                    )

                customer_thr = Thread(target=send_async_email, args=[app, customer_msg])
                customer_thr.start()


        
        elif (booking['deleteFlag']):
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
                    multi_week_discount = Decimal(booking['multiWeekDiscount']),
                    dog_price = Decimal(booking['dogPrice']),
                    total = Decimal(booking['total']),
                    status = booking['status']
                )
                db.session.add(delete_booking)
                for segment in db_booking.date_segments:
                    segment.booking_id = None
                    
                for bill in db_booking.billings:
                    delete_billing = Delete_Billing(
                        booking_id = delete_booking.id,
                        amount = bill.amount,
                        date = bill.date,
                        note = bill.note,
                        invoice_due_date = bill.invoice_due_date,
                        transaction_type = bill.transaction_type,
                        invoice_reference = bill.invoice_reference,
                        payment_reference = bill.payment_reference,
                        credit_note_reference = bill.credit_note_reference,
                        debit_note_reference = bill.debit_note_reference,
                        invoice_status = 'INACTIVE',
                        linked_invoice_id = bill.linked_invoice_id,
                        first_invoice = bill.first_invoice,
                        last_reminder = bill.last_reminder,
                        percentage_due = bill.percentage_due
                    )

                    db.session.add(delete_billing)
                    db.session.delete(bill)
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
                    Booking.multi_week_discount: Decimal(booking['multi_week_discount']),
                    Booking.dog_price: Decimal(booking['dogPrice']),
                    Booking.total: Decimal(booking['total']),
                    Booking.status: booking['status']
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
                    multi_week_discount = Decimal(booking['multiWeekDiscount']),
                    dog_price = Decimal(booking['dogPrice']),
                    total = Decimal(booking['total']),
                    status = booking['status']
                )
                for segment in date_segments:
                    new_booking.date_segments.append(segment)
                db.session.add(new_booking)
    db.session.commit()
    print('Booking updated')
    return { 'success': True }

@app.route('/get_billings', methods=['POST'])
@login_required
def get_billings():
    query = db.session.query(Billing).order_by(Billing.booking_id.asc())
    billings = []
    for row in query:
        if row.transaction_type == 'INVOICE':
            reference = row.invoice_reference
        elif row.transaction_type == 'PAYMENT':
            reference = row.payment_reference
        elif row.transaction_type == 'DEBIT_NOTE':
            reference = row.debit_note_reference
        elif row.transaction_type == 'CREDIT_NOTE':
            reference = row.credit_note_reference

        if row.date:
            billing_date = row.date.isoformat()
        else:
            billing_date = row.date

        if row.invoice_due_date:
            invoice_due_date = row.invoice_due_date.isoformat()
        else:
            invoice_due_date = None

        billing = {
            'id': row.id,
            'bookingId': row.booking_id,
            'amount': str(row.amount),
            'date': billing_date,
            'invoiceDueDate': invoice_due_date,
            'transactionType': row.transaction_type,
            'reference': reference,
            'note': row.note,
            'invoiceStatus': row.invoice_status,
            'linkedInvoice': row.linked_invoice,
            'linkedPayments': row.linked_payments,
            'updateFlag': False,
            'deleteFlag': False
        }
        billings.append(billing)
    
    return { 'billings': billings }

@app.route('/set_billings', methods=['POST'])
@login_required
def set_billings():
    json_request = request.get_json()
    query = db.session.query(Billing)
    for billing in json_request:
        invoice_reference = None
        payment_reference = None
        debit_note_reference = None
        credit_note_reference = None
        invoice_status = None
        if billing['transactionType'] == 'INVOICE':
            invoice_reference = billing['reference']
        elif billing['transactionType'] == 'PAYMENT':
            payment_reference = billing['reference']
        elif billing['transactionType'] == 'DEBIT_NOTE':
            debit_note_reference = billing['reference']
        elif billing['transactionType'] == 'CREDIT_NOTE':
            credit_note_reference = billing['reference']

        if (billing['deleteFlag']):
            db_billing = query.filter(Billing.id == billing['id']).first()
            if (db_billing):
                delete_billing = Delete_Billing(
                    booking_id = int(billing['bookingId']),
                    amount = Decimal(billing['amount']),
                    date = datetime.strptime(billing['date'], '%Y-%m-%d').date(),
                    transaction_type = billing['transactionType'],
                    invoice_reference = invoice_reference,
                    payment_reference = payment_reference,
                    debit_note_reference = debit_note_reference,
                    credit_note_reference = credit_note_reference,
                    invoice_status = 'INACTIVE',
                    linked_invoice = billing['linkedInvoice'],
                    linked_payments = billing['linkedPayments'],
                    note = billing['note']
                )

                db.session.add(delete_billing)
                print('billing deleted')
            else:
                print('billing marked for deletion does not exist')
                continue

        elif (billing['updateFlag']):
            if (billing['id']): #maybe check if there are any mismatches
                query.filter(Billing.id == billing['id']).update({
                    Billing.booking_id: int(billing['bookingId']),
                    Billing.amount: Decimal(billing['amount']),
                    Billing.date: datetime.strptime(billing['date'], '%Y-%m-%d').date(),
                    Billing.transaction_type: billing['transactionType'],
                    Billing.invoice_reference: invoice_reference,
                    Billing.payment_reference: payment_reference,
                    Billing.debit_note_reference: debit_note_reference,
                    Billing.credit_note_reference: credit_note_reference,
                    Billing.invoice_status: billing['invoiceStatus'],
                    Billing.linked_invoice: billing['linkedInvoice'],
                    Billing.linked_payments: billing['linkedPayments'],
                    Billing.note: str(billing['note'])
                },
                synchronize_session = False
                )
                print('billing updated')
            else: 
                if billing['transactionType'] == 'INVOICE':
                    db_invoices = db.session.query(Billing).filter(Billing.transaction_type == 'INVOICE')
                    if db_invoices.all():
                        invoice_reference = int(db_invoices.order_by(Billing.invoice_reference.desc()).first().invoice_reference) + 1
                    else:
                        invoice_reference = 1
                elif billing['transactionType'] == 'PAYMENT':
                    db_payments = db.session.query(Billing).filter(Billing.transaction_type == 'PAYMENT')
                    if db_payments.all():
                        payment_reference = int(db_payments.order_by(Billing.payment_reference.desc()).first().payment_reference) + 1
                    else:
                        payment_reference = 1
                elif billing['transactionType'] == 'DEBIT_NOTE':
                    db_debit_notes = db.session.query(Billing).filter(Billing.transaction_type == 'DEBIT_NOTE')
                    if db_debit_notes.all():
                        debit_note_reference = int(db_debit_notes.order_by(Billing.debit_note_reference.desc()).first().debit_note_reference) + 1
                    else:
                        debit_note_reference = 1
                elif billing['transactionType'] == 'CREDIT_NOTE':
                    db_credit_notes = db.session.query(Billing).filter(Billing.transaction_type == 'CREDIT_NOTE')
                    if db_credit_notes.all():
                        credit_note_reference = int(db_credit_notes.order_by(Billing.credit_note_reference.desc()).first().credit_note_reference) + 1
                    else:
                        credit_note_reference = 1

                new_billing = Billing(
                    booking_id = int(billing['bookingId']),
                    amount = Decimal(billing['amount']),
                    date = datetime.strptime(billing['date'], '%Y-%m-%d').date(),
                    transaction_type = billing['transactionType'],
                    invoice_reference = invoice_reference,
                    payment_reference = payment_reference,
                    debit_note_reference = debit_note_reference,
                    credit_note_reference = credit_note_reference,
                    invoice_status = billing['invoiceStatus'],
                    linked_invoice = billing['linkedInvoice'],
                    linked_payments = billing['linkedPayments'],
                    note = billing['note']
                )
                db.session.add(new_billing)
                print('billing added')

    db.session.commit()
    print('Billing updated')
    return { 'success': True }

@app.route('/get_billing_settings', methods=['POST'])
@login_required
def get_billing_settings():
    settings_query = db.session.query(Billing_Settings).first()
    db_payment_breakpoints = settings_query.payment_breakpoints
    db_cancellation_breakpoints = settings_query.cancellation_breakpoints

    payment_breakpoints = []
    cancellation_breakpoints = []

    if db_payment_breakpoints:

        db_first_payment = db_payment_breakpoints.filter_by(first_payment = True).first()

        payment_breakpoints.append({
            'id': db_first_payment.id,
            'amountDue': int(db_first_payment.amount_due),
            'dueBy': None,
            'firstPayment': True,
            'cumulativeTotal': 0,
            'selectFlag': False,
            'deleteFlag': False
        })
        
        for row in db_payment_breakpoints.filter_by(first_payment = False).order_by(Payment_Breakpoint.due_by.desc()).all():
            payment_breakpoints.append({
                'id': row.id,
                'amountDue': int(row.amount_due),
                'dueBy': int(row.due_by),
                'firstPayment': row.first_payment,
                'cumulativeTotal': 0,
                'selectFlag': False,
                'deleteFlag': False
            })

    if db_cancellation_breakpoints:

        db_check_in = db_cancellation_breakpoints.filter_by(check_in = True).first()

        cancellation_breakpoints.append({
            'id': db_check_in.id,
            'amountRefundable': int(db_check_in.amount_refundable),
            'cancelBy': None,
            'checkIn': True,
            'cumulativeTotal': 0,
            'selectFlag': False,
            'deleteFlag': False
        })

        for row in db_cancellation_breakpoints.filter_by(check_in = False).order_by(Cancellation_Breakpoint.cancel_by.desc()).all():
            cancellation_breakpoints.append({
                'id': row.id,
                'amountRefundable': int(row.amount_refundable),
                'cancelBy': int(row.cancel_by),
                'checkIn': row.check_in,
                'cumulativeTotal': 0,
                'selectFlag': False,
                'deleteFlag': False
            })

    billing_settings = { 
        'id': settings_query.id,
        'firstPaymentDueAfter': settings_query.first_payment_due_after,
        'progressiveBillNotice': settings_query.progressive_bill_notice,
        'paymentBreakpoints': payment_breakpoints,
        'cancellationBreakpoints': cancellation_breakpoints,
        'updateFlag': False
        }

    return { 'billingSettings': billing_settings }

@app.route('/set_billing_settings', methods=['POST'])
@login_required
def set_billing_settings():
    json_request = request.get_json()
    json_payment_breakpoints = json_request['paymentBreakpoints']
    json_cancellation_breakpoints = json_request['cancellationBreakpoints']

    db_billing_settings = db.session.query(Billing_Settings).first()
    db_payment_breakpoints = db_billing_settings.payment_breakpoints
    db_cancellation_breakpoints = db_billing_settings.cancellation_breakpoints

    if int(json_request['firstPaymentDueAfter']) >= 0:
        db_billing_settings.first_payment_due_after = int(json_request['firstPaymentDueAfter'])

    if int(json_request['progressiveBillNotice']) >= 0:
        db_billing_settings.progressive_bill_notice = int(json_request['progressiveBillNotice'])

    ##-------json_payment_breakpoint validation-----------##


    for row in json_payment_breakpoints:
        if row['deleteFlag']:
            if row['id']:
                db.session.delete(db_payment_breakpoints.filter_by(id = row['id']).first())
            else:
                print('payment breakpoint flagged for deletion does not exist')

        elif row['id']:
            #--payment_breakpoint new/updated validation--#
            if row['firstPayment']:
                due_by = None
                if (int(row['amountDue']) < 0):
                    print('first payment amount due must be more than equal to zero: invalid')
                    return { 'success': False }
            else:
                if (int(row['dueBy']) > 0):
                    due_by = int(row['dueBy'])
                else:
                    print('due by must be more than 0 - invalid')
                    return { 'success': False }

                if (int(row['amountDue']) <= 0):
                    print('amount due must be more than 0: invalid')
                    return { 'success': False }
                
            if int(row['amountDue']) < 0:
                print('amount due and due by must be more than 0, therefore invalid')
                return { 'success': False }

            db_payment_breakpoints.filter(Payment_Breakpoint.id == row['id']).update({
                Payment_Breakpoint.amount_due: int(row['amountDue']),
                Payment_Breakpoint.due_by: due_by,
                Payment_Breakpoint.first_payment: row['firstPayment']
            },
            synchronize_session = False
            )

        else:
            if int(row['amountDue']) <= 0 or int(row['dueBy']) <= 0:
                print('amount due and due by must be more than 0, therefore invalid')
                return { 'success': False }

            new_payment_breakpoint = Payment_Breakpoint(
                amount_due = int(row['amountDue']),
                due_by = int(row['dueBy']),
                first_payment = False
            )
            db.session.add(new_payment_breakpoint)
            db_billing_settings.payment_breakpoints.append(new_payment_breakpoint)   


    #------db_payment_breakpoint validation----------------#
    cumulative_total = 0
    for row in db_payment_breakpoints:
        cumulative_total += row.amount_due

    print(cumulative_total)
    if (cumulative_total != 100):
        print('cumulative total != 100, therefore invalid')
        print(cumulative_total)
        return { 'success': False }

    for row in json_cancellation_breakpoints:
        #json_cancellation_breakpoints validation----##
        if row['deleteFlag']:
            if row['id']:
                db.session.delete(db_cancellation_breakpoints.filter_by(id = row['id']).first())
            else:
                print('cancellation breakpoint marked for deletion does not exist')
        elif row['id']:
            if row['checkIn']:
                cancel_by = None
            else:
                if (int(row['cancelBy']) > 0):
                    cancel_by = int(row['cancelBy'])
                else:
                    print('cancelBy must be more than 0')
                    return { 'success': False }

            if int(row['amountRefundable']) < 0 or int(row['amountRefundable']) > 100:
                print('amount refundable must be between 0 and 100, therefore invalid')
                return { 'success': False }

            db_cancellation_breakpoints.filter(Cancellation_Breakpoint.id == row['id']).update({
                Cancellation_Breakpoint.amount_refundable: int(row['amountRefundable']),
                Cancellation_Breakpoint.cancel_by: cancel_by,
                Cancellation_Breakpoint.check_in: row['checkIn']
            },
            synchronize_session = False
            )
        else:
            if int(row['amountRefundable']) < 0 or int(row['amountRefundable']) > 100 or int(row['cancelBy']) <= 0:
                print('amount refundable must be between 0 and 100, therefore invalid')
                return { 'success': False }

            new_cancellation_breakpoint = Cancellation_Breakpoint(
                amount_refundable = int(row['amountRefundable']),
                cancel_by = int(row['cancelBy']),
                check_in = False
            )
            db.session.add(new_cancellation_breakpoint)
            db_billing_settings.cancellation_breakpoints.append(new_cancellation_breakpoint)


    db.session.commit()
    print('Billing_Settings updated')
    
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
            correct_multi_week_discount = 0
            stay_length_weeks = 1
        elif (len(date_segments) == 2):
            correct_price = date_segments[0].price_2_weeks
            correct_multi_week_discount = date_segments[0].discount_amount_2_weeks
            stay_length_weeks = 2
        elif (len(date_segments) == 3):
            correct_price = date_segments[0].price_3_weeks
            correct_multi_week_discount = date_segments[0].discount_amount_3_weeks
            stay_length_weeks = 3
        elif (len(date_segments) == 4):
            correct_price = date_segments[0].price_4_weeks
            correct_multi_week_discount = date_segments[0].discount_amount_4_weeks
            stay_length_weeks = 4
        else:
            print('Stay length exceeds maximum allowed')
            return { 'success': False }

        correct_dog_price = Decimal(int(booking_form_data['dogs']) * price_list_settings[0].price_per_dog * stay_length_weeks)
        correct_total = correct_price + correct_dog_price - correct_multi_week_discount
        print('total = ' + str(correct_total) + 'price = ' + str(correct_price) + 'dog_price = ' + str(correct_dog_price) + 'discount = ' + str(correct_multi_week_discount))
        
        if (Decimal(booking_form_data['stayPrice']) != Decimal(correct_price)):
            print('submitted stay price:' + str(booking_form_data['stayPrice']))
            print('database stay_price:' + str(correct_price))
            print('Submitted price does not match with databse, resubmit correct_price to user for confirmation')
            return { 'success': False }

        if (Decimal(booking_form_data['multiWeekDiscount']) != Decimal(correct_multi_week_discount)):
            print('multi_week_discount incorrect')
            return { 'success': False }

        if (Decimal(booking_form_data['dogPrice']) != correct_dog_price):
            print('incorrect dog price')
            return { 'success': False }

        if (Decimal(booking_form_data['total']) != correct_total):
            print('incorrect_total')
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
    if (Decimal(booking_form_data['dogPrice']) != int(booking_form_data['dogs']) * price_list_settings[0].price_per_dog * stay_length_weeks):
        print('Incorrect dog price')
        return { 'success': False }
    if (Decimal(booking_form_data['total']) != Decimal(booking_form_data['stayPrice']) + Decimal(booking_form_data['dogPrice']) - Decimal(booking_form_data['multiWeekDiscount'])):
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
        multi_week_discount = Decimal(correct_multi_week_discount),
        dog_price = Decimal(booking_form_data['dogPrice']),
        total = Decimal(correct_total),
        status = 'AWAITING_CONFIRMATION'
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

    #-------- CREATE DRAFT INVOICES -------------#
    billing_settings = db.session.query(Billing_Settings).first()
    payment_terms = billing_settings.payment_breakpoints.all()
    cancellation_terms = billing_settings.cancellation_breakpoints.all()

    first_invoice_amount = 0
    first_invoice_percentage_due = 0
    cumulative_total = 0
    cumulative_percentage = 0

    db_invoices = db.session.query(Billing).filter(Billing.transaction_type == 'INVOICE')
    if db_invoices.all():
        prev_invoice_reference = int(db_invoices.order_by(Billing.invoice_reference.desc()).first().invoice_reference)
    else:
        prev_invoice_reference = 0
    invoices = []

    if (booking_form_data['payInFull']):
        invoice = Billing(
            amount = booking.total,
            transaction_type = 'INVOICE',
            invoice_reference = prev_invoice_reference + 1,
            invoice_status = 'DRAFT',
            first_invoice = True,
            percentage_due = 100
        )
        db.session.add(invoice)
        booking.billings.append(invoice)

    else:
        for index, breakpoint in enumerate(payment_terms):
            if breakpoint.first_payment:
                first_invoice_amount += (Decimal(booking.total) * Decimal(breakpoint.amount_due / 100)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                first_invoice_percentage_due += breakpoint.amount_due
                cumulative_total += (Decimal(booking.total) * Decimal(breakpoint.amount_due / 100)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                cumulative_percentage += breakpoint.amount_due
            elif date.today() >= arrival_date - timedelta(days = breakpoint.due_by):
                first_invoice_amount += (Decimal(booking.total) * Decimal(breakpoint.amount_due / 100)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                first_invoice_percentage_due += breakpoint.amount_due
                cumulative_total += (Decimal(booking.total) * Decimal(breakpoint.amount_due / 100)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
                cumulative_percentage += breakpoint.amount_due
            elif index == len(payment_terms) - 1:
                last_invoice = Billing(
                    amount = (Decimal(booking.total) - Decimal(cumulative_total)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
                    invoice_due_date = arrival_date - timedelta(days = breakpoint.due_by),
                    transaction_type = 'INVOICE',
                    invoice_status = 'DRAFT',
                    percentage_due = 100 - cumulative_percentage
                )
                db.session.add(last_invoice)
                invoices.append(last_invoice)
                booking.billings.append(last_invoice)
            else:
                new_invoice = Billing(
                    amount = (Decimal(booking.total) * Decimal(breakpoint.amount_due / 100)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
                    invoice_due_date = arrival_date - timedelta(days = breakpoint.due_by),
                    transaction_type = 'INVOICE',
                    invoice_status = 'DRAFT',
                    percentage_due = breakpoint.amount_due
                )
                cumulative_total += new_invoice.amount
                cumulative_percentage += new_invoice.percentage_due
                db.session.add(new_invoice)
                booking.billings.append(new_invoice)
                invoices.append(new_invoice)

        first_invoice = Billing(
            amount = first_invoice_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
            transaction_type = 'INVOICE',
            invoice_status = 'DRAFT',
            first_invoice = True,
            percentage_due = first_invoice_percentage_due
        )

        invoices.append(first_invoice)
        db.session.add(first_invoice)
        booking.billings.append(first_invoice)

        invoices.sort(key=lambda x: (x.invoice_due_date is not None, x.invoice_due_date))
        for invoice in invoices:
            invoice.invoice_reference = prev_invoice_reference + 1
            prev_invoice_reference = invoice.invoice_reference
        
        #invoice price validation
        invoices_total_amount = 0
        for invoice in invoices:
            invoices_total_amount += invoice.amount
            print(invoice.amount)

        print(booking.total)
        print(first_invoice_amount)

        if invoices_total_amount != booking.total:
            print('error in prices when creating invoices')
            return { 'success': False }

    db.session.commit()

    #create request for admin

    #send confirmation emails

    def send_async_email(app, msg):
        with app.app_context():
            mail.send(msg)

    admin_msg = Message('Booking Request: ' + customer.first_name + ' ' + customer.last_name, sender=app.config['MAIL_USERNAME'], recipients=[app.config['MAIL_USERNAME']])
    admin_msg.body = (
                'Hello, \n' +
                'A new booking request has been submitted. Details are as follows: \n \n' +
                'Name: ' + customer.first_name + ' ' + customer.last_name + '\n' +
                'Email: ' + customer.email_address + '\n' +
                'Phone: ' + customer.phone_number + '\n' +
                'Arrival Date: ' + booking.arrival_date.isoformat() + '\n' + 
                'Departure Date: ' + booking.departure_date.isoformat() + '\n' +
                'Party: ' + str(booking.adults) + ' adults, ' + str(booking.children) + ' children, ' + str(booking.infants) + ' infants, ' + str(booking.dogs) + ' dogs \n' +
                'Total: ' + str(booking.total) + '\n \n'
                )

    admin_thr = Thread(target=send_async_email, args=[app, admin_msg])
    admin_thr.start()

    customer_msg = Message('Booking Request Received', sender=app.config['MAIL_USERNAME'], recipients=[customer.email_address])
    customer_msg.body = (
        'Hello, \n \n' +
        'We have received your booking request and will update you as soon as possible! \n \n' +
        'Kind regards, \n \n' + 
        'The Cottage - Eastbourne' 
        )

    customer_thr = Thread(target=send_async_email, args=[app, customer_msg])
    customer_thr.start()

    return { 'success': True }

@app.route('/submit_contact', methods=['POST'])
def submit_contact():

    def send_async_email(app, msg):
        with app.app_context():
            mail.send(msg)

    contact_request = request.get_json()
    msg = Message('Contact Form: ' + contact_request['firstName'] + ' ' + contact_request['lastName'], sender=app.config['MAIL_USERNAME'], recipients=[app.config['MAIL_USERNAME']])
    msg.body = ('Hello, \n \n' +
                'A new message has been submitted via the contact form. \n \n' +
                'First name: ' + contact_request['firstName'] + '\n' +
                'Last name: ' + contact_request['lastName'] + '\n' +
                'Email address: ' + contact_request['emailAddress'] + '\n' +
                'Phone number: ' + contact_request['phoneNumber'] + '\n \n' +
                'Message: \n \n' +
                contact_request['message'])

    thr = Thread(target=send_async_email, args=[app, msg])
    thr.start()
    
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
                    Customer.postcode: str(customer['postcode'])
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
        'minAge': settings_query[0].min_age,
        'checkInTime': settings_query[0].check_in_time.isoformat(timespec='minutes'),
        'checkOutTime': settings_query[0].check_out_time.isoformat(timespec='minutes'),
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
        'maxSegmentLength': str(settings_query[0].max_segment_length),
        'pricePerDog': str(settings_query[0].price_per_dog),
        'maxDogs': settings_query[0].max_dogs,
        'maxInfants': settings_query[0].max_infants,
        'maxGuests': settings_query[0].max_guests,
        'minAge': settings_query[0].min_age,
        'checkInTime': settings_query[0].check_in_time.isoformat(timespec='minutes'),
        'checkOutTime': settings_query[0].check_out_time.isoformat(timespec='minutes')
        }

    return { 'publicPriceListSettings': settings }

@app.route('/get_public_billing_settings', methods=['POST'])
def get_public_billing_settings():
    settings_query = db.session.query(Billing_Settings).first()
    db_payment_breakpoints = settings_query.payment_breakpoints
    db_cancellation_breakpoints = settings_query.cancellation_breakpoints

    payment_breakpoints = []
    cancellation_breakpoints = []

    if db_payment_breakpoints:

        db_first_payment = db_payment_breakpoints.filter_by(first_payment = True).first()

        payment_breakpoints.append({
            'id': db_first_payment.id,
            'amountDue': int(db_first_payment.amount_due),
            'dueBy': None,
            'firstPayment': True
        })
        
        for row in db_payment_breakpoints.filter_by(first_payment = False).order_by(Payment_Breakpoint.due_by.desc()).all():
            payment_breakpoints.append({
                'id': row.id,
                'amountDue': int(row.amount_due),
                'dueBy': int(row.due_by),
                'firstPayment': row.first_payment
            })

    if db_cancellation_breakpoints:

        db_check_in = db_cancellation_breakpoints.filter_by(check_in = True).first()

        cancellation_breakpoints.append({
            'id': db_check_in.id,
            'amountRefundable': int(db_check_in.amount_refundable),
            'cancelBy': None,
            'checkIn': True
        })

        for row in db_cancellation_breakpoints.filter_by(check_in = False).order_by(Cancellation_Breakpoint.cancel_by.desc()).all():
            cancellation_breakpoints.append({
                'id': row.id,
                'amountRefundable': int(row.amount_refundable),
                'cancelBy': int(row.cancel_by),
                'checkIn': row.check_in
            })

    public_billing_settings = {
        'firstPaymentDueAfter': settings_query.first_payment_due_after,
        'progressiveBillNotice': settings_query.progressive_bill_notice,
        'paymentBreakpoints': payment_breakpoints,
        'cancellationBreakpoints': cancellation_breakpoints
        }

    return { 'publicBillingSettings': public_billing_settings }


@app.route('/get_server_date', methods=['POST'])
def get_server_date():
    return { 'serverDate': date.today().isoformat() }

@app.route('/get_progressive_payments', methods=['POST'])
def get_progressive_payments():
    json_request = request.get_json()
    db_payment_breakpoints = db.session.query(Billing_Settings).first().payment_breakpoints
    db_add_payment_breakpoints = db_payment_breakpoints.filter_by(first_payment = False).order_by(Payment_Breakpoint.due_by.desc()).all()
    db_first_payment = db_payment_breakpoints.filter_by(first_payment = True).all()
    ordered_breakpoints = db_first_payment + db_add_payment_breakpoints
    progressive_payments = []

    for index, breakpoint in enumerate(ordered_breakpoints):
        if breakpoint.first_payment:
            progressive_payments.append({
                'amountDue': str(Decimal(json_request['total']) * breakpoint.amount_due / 100),
                'dueBy': None,
                'firstPayment': True
            })
        else:
            due_by = datetime.strptime(json_request['arrivalDate'], '%Y-%m-%d').date() - timedelta(days=breakpoint.due_by)
            if due_by <= date.today():
                progressive_payments[-1]['amountDue'] = str(Decimal(progressive_payments[-1]['amountDue']) + Decimal(json_request['total']) * breakpoint.amount_due / 100)
            else:
                progressive_payments.append({
                    'amountDue': str(Decimal(json_request['total']) * breakpoint.amount_due / 100),
                    'dueBy': due_by.isoformat(),
                    'firstPayment': False
                })

    return { 'progressivePayments': progressive_payments }

@app.route('/get_cancellation_terms', methods=['POST'])
def get_cancellation_terms():
    json_request = request.get_json()
    db_cancellation_breakpoints = db.session.query(Billing_Settings).first().cancellation_breakpoints
    db_add_cancellation_breakpoints = db_cancellation_breakpoints.filter_by(check_in = False).order_by(Cancellation_Breakpoint.cancel_by.desc()).all()
    db_check_in = db_cancellation_breakpoints.filter_by(check_in = True).all()
    ordered_breakpoints = db_add_cancellation_breakpoints + db_check_in
    cancellation_terms = []

    for breakpoint in ordered_breakpoints:
        if breakpoint.check_in:
            cancellation_terms.append({
                'amountRefundable': str(breakpoint.amount_refundable),
                'cancelBy': None,
                'checkIn': True
            })
        else:
            cancel_by = datetime.strptime(json_request['arrivalDate'], '%Y-%m-%d').date() - timedelta(days=breakpoint.cancel_by)
            if cancel_by > date.today():
                cancellation_terms.append({
                    'amountRefundable': str(breakpoint.amount_refundable),
                    'cancelBy': cancel_by.isoformat(),
                    'checkIn': False
                })     
    
    return { 'cancellationTerms': cancellation_terms }