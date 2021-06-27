from app import app, db, mail
from app.models import Price_List, Price_List_Settings, Delete_Price_List, Billing_Settings, Payment_Breakpoint, Billing, Customer, Booking
from datetime import datetime, date, timedelta, time
from dateutil.relativedelta import relativedelta
import pdfkit
from flask_mail import Message
from threading import Thread
from flask import render_template

def update_price_list():
    db_price_list = db.session.query(Price_List)
    db_price_list_settings = db.session.query(Price_List_Settings).first()

    active_end_datetime = datetime.today() + timedelta(weeks = db_price_list_settings.active_prices_range)
    future_end_datetime = active_end_datetime + timedelta(weeks = db_price_list_settings.future_prices_range)

    first_changeover_date = db_price_list.order_by(Price_List.start_date.asc()).first().start_date
    last_changeover_date = db_price_list.order_by(Price_List.start_date.desc()).first().start_date
    last_changeover_datetime = datetime(last_changeover_date.year, last_changeover_date.month, last_changeover_date.day)

    new_changeover_datetime = last_changeover_datetime + timedelta(days = (db_price_list_settings.default_changeover_day + 7 - last_changeover_date.weekday()) % 7)

    def previous_year_changeover(changeover_datetime):
        previous_year_date = (changeover_datetime - relativedelta(years=1)).date()

        if (previous_year_date >= first_changeover_date):
            closest_segment = min(db_price_list.all(), key=lambda x: abs(x.start_date - previous_year_date))
            return closest_segment

        return None

    if new_changeover_datetime.date() > last_changeover_date:
        if (previous_year_changeover(new_changeover_datetime)):
            previous_year_segment = previous_year_changeover(new_changeover_datetime)
            new_changeover = Price_List(
                start_date = new_changeover_datetime.date(),
                price = previous_year_segment.price,
                range_type = 'FUTURE'
            )
        else:
            new_changeover = Price_List(
                start_date = new_changeover_datetime.date(),
                range_type = 'FUTURE'
            )
        db.session.add(new_changeover)

    next_changeover_datetime = new_changeover_datetime + timedelta(weeks=1)
    while next_changeover_datetime <= future_end_datetime:
        if previous_year_changeover(next_changeover_datetime):
            previous_year_segment = previous_year_changeover(next_changeover_datetime)
            next_changeover = Price_List(
                start_date = next_changeover_datetime.date(),
                price = previous_year_segment.price,
                range_type = 'FUTURE'
            )
        else:
            next_changeover = Price_List(
                start_date = next_changeover_datetime.date(),
                range_type = 'FUTURE'
        )
        db.session.add(next_changeover)
        next_changeover_datetime += timedelta(weeks=1)
    
    for index, segment in enumerate(db_price_list):
        if segment.start_date <= date.today():
            segment.range_type = 'PAST'
        elif segment.start_date < active_end_datetime.date():
            segment.range_type = 'ACTIVE'
        elif segment.start_date < future_end_datetime.date():
            segment.range_type = 'FUTURE'
        
        #recalculate multiweek prices
        
        db_price_list_len = len(db_price_list.all())

        if not segment.price:
            segment.price = 0
            segment.price_2_weeks = 0
            segment.discount_amount_2_weeks = 0
            segment.price_3_weeks = 0
            segment.discount_amount_3_weeks = 0
            segment.price_4_weeks = 0
            segment.discount_amount_4_weeks = 0   
            
        elif index < db_price_list_len - 1:
            if db_price_list[index + 1].price:
                segment.price_2_weeks = segment.price + db_price_list[index + 1].price
                segment.discount_amount_2_weeks = segment.price_2_weeks * (db_price_list_settings.discount_2_weeks / 100)
            
                if index < db_price_list_len - 2:
                    if db_price_list[index + 2].price:
                        segment.price_3_weeks = segment.price_2_weeks + db_price_list[index + 2].price
                        segment.discount_amount_3_weeks = segment.price_3_weeks * (db_price_list_settings.discount_3_weeks / 100)

                        if index < db_price_list_len - 3:
                            if db_price_list[index + 3].price:
                                segment.price_4_weeks = segment.price_3_weeks + db_price_list[index + 3].price
                                segment.discount_amount_4_weeks = segment.price_4_weeks * (db_price_list_settings.discount_4_weeks / 100)
                            else:
                                segment.price_4_weeks = 0
                                segment.discount_amount_4_weeks = 0
                    else:
                        segment.price_3_weeks = 0
                        segment.discount_amount_3_weeks = 0
                        segment.price_4_weeks = 0
                        segment.discount_amount_4_weeks = 0
            else:
                segment.price_2_weeks = 0
                segment.discount_amount_2_weeks = 0
                segment.price_3_weeks = 0
                segment.discount_amount_3_weeks = 0
                segment.price_4_weeks = 0
                segment.discount_amount_4_weeks = 0

    db.session.commit()

def update_bookings():
    return

def update_customers():
    return
    
def update_billings():
    db_billings = db.session.query(Billing)
    
    db_billing_settings = db.session.query(Billing_Settings).first()

    ## clear out fully paid bookings ##
    
    for bill in db_billings:
        if bill.transaction_type == 'INVOICE' and bill.invoice_status == 'ACCEPTED' and not bill.first_invoice and not bill.last_reminder and date.today() >= bill.invoice_due_date - timedelta(days=db_billing_settings.progressive_bill_notice):
            
            db_booking = db.session.query(Booking).get(bill.booking_id)
            db_customer = db.session.query(Customer).get(db_booking.customer_id)

            def send_async_email_with_invoice(app, msg, render, invoice_reference):
                pdf = pdfkit.from_string(render, False)
                msg.attach('invoice_' + str(invoice_reference) + '.pdf', 'application/pdf', pdf, 'attachment')
                with app.app_context():
                    mail.send(msg)

            invoice_render = render_template(
                'invoice.html',
                customer = db_customer,
                invoice = bill,
                invoice_date_string = bill.date.strftime("%d %B %Y"),
                invoice_due_date_string = bill.invoice_due_date.strftime("%d %B %Y"),
                booking = db_booking, 
                price_per_dog = db.session.query(Price_List_Settings).first().price_per_dog,
                stay_length = (db_booking.departure_date - db_booking.arrival_date).days
            )

            customer_msg = Message('Invoice ' + str(bill.invoice_reference) + ' now due', sender=app.config['MAIL_USERNAME'], recipients=[db_customer.email_address])

            customer_msg.body = (
                'Hello, \n \n' +
                'The next payment for your booking with us is now due. Please find attached invoice which is due by ' + bill.invoice_due_date.isoformat() + '.' +
                'Kind regards, \n \n' + 
                'The Cottage - Eastbourne' 
            )

            customer_thr = Thread(target=send_async_email_with_invoice, args=[app, customer_msg, invoice_render, str(bill.invoice_reference)])
            customer_thr.start() 

    return