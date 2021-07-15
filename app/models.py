from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import login
import pyotp

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    otp_secret = db.Column(db.String(32))

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.otp_secret is None:
            # generate a random secret
            self.otp_secret = pyotp.random_base32()

    def __repr__(self):
        return '<User {}>'.format(self.username)  

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_totp_uri(self):
        return 'otpauth://totp/eastbourne:{0}?secret={1}&issuer=eastbourne' \
            .format(self.username, self.otp_secret)

    def verify_totp(self, token):
        return pyotp.TOTP(self.otp_secret).verify(token)

class Price_List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, unique=True)
    price = db.Column(db.Numeric(10,2))
    price_2_weeks = db.Column(db.Numeric(10, 2), nullable=True)
    price_3_weeks = db.Column(db.Numeric(10, 2), nullable=True)
    price_4_weeks = db.Column(db.Numeric(10, 2), nullable=True)
    discount_amount_2_weeks = db.Column(db.Numeric(10, 2), nullable=True)
    discount_amount_3_weeks = db.Column(db.Numeric(10, 2), nullable=True)
    discount_amount_4_weeks = db.Column(db.Numeric(10, 2), nullable=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id', ondelete='SET NULL'), default=None)
    block_flag = db.Column(db.Boolean, default=False)
    range_type = db.Column(db.Enum('PAST', 'ACTIVE', 'FUTURE', name='range_type'))
    lock_flag = db.Column(db.Boolean, default=False, nullable=False)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    date_segments = db.relationship('Price_List', backref='booking')
    billings = db.relationship('Billing', backref='booking')
    arrival_date = db.Column(db.Date)
    departure_date = db.Column(db.Date)
    adults = db.Column(db.Integer)
    children = db.Column(db.Integer)
    infants = db.Column(db.Integer)
    dogs = db.Column(db.Integer)
    stay_price = db.Column(db.Numeric(10, 2))
    multi_week_discount = db.Column(db.Numeric(10, 2))
    dog_price = db.Column(db.Numeric(10, 2))
    total = db.Column(db.Numeric(10,2))
    status = db.Column(db.Enum('AWAITING_CONFIRMATION', 'ACCEPTED', 'REJECTED', 'ACTIVE', 'INACTIVE', name='status'), nullable=True)
    booking_type = db.Column(db.Enum('STANDARD', 'OWNER', 'EXTERNAL', name='booking_type'), nullable=False, default='STANDARD')
    external_note = db.Column(db.String(30))
    
#consider splitting this up into invoices, payments etc.
class Billing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'))
    amount = db.Column(db.Numeric(10, 2))
    date = db.Column(db.Date)                                                                                                                                                  
    invoice_due_date = db.Column(db.Date, default=None)
    #insert invoice due_dates relationship to take into account multistage payment terms
    transaction_type = db.Column(db.Enum('INVOICE', 'PAYMENT', 'DEBIT_NOTE', 'CREDIT_NOTE', name='transaction_type'), nullable=False)
    note = db.Column(db.String(30))
    invoice_reference = db.Column(db.Integer, unique=True, default=None)
    payment_reference = db.Column(db.Integer, unique=True, default=None)
    credit_note_reference = db.Column(db.Integer, unique=True, default=None)
    debit_note_reference = db.Column(db.Integer, unique=True, default=None)
    linked_invoice_id = db.Column(db.Integer, db.ForeignKey('billing.id'))
    linked_payments = db.relationship('Billing', backref=db.backref('linked_invoice', remote_side=[id]))
    first_invoice = db.Column(db.Boolean, default=False)
    last_reminder = db.Column(db.Date, default=None)
    percentage_due = db.Column(db.Integer)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bookings = db.relationship('Booking', backref='customer')
    first_name = db.Column(db.String(30))
    last_name = db.Column(db.String(30))
    email_address = db.Column(db.String(30))
    phone_number = db.Column(db.String(20))
    address_line_1 = db.Column(db.String(30))
    address_line_2 = db.Column(db.String(30))
    town_or_city = db.Column(db.String(30))
    county_or_region = db.Column(db.String(30))
    postcode = db.Column(db.String(30))

class Price_List_Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    discount_2_weeks = db.Column(db.Numeric(10, 2))
    discount_3_weeks = db.Column(db.Numeric(10, 2))
    discount_4_weeks = db.Column(db.Numeric(10, 2))
    active_prices_range = db.Column(db.Integer)
    future_prices_range = db.Column(db.Integer)
    default_changeover_day = db.Column(db.Integer)
    max_segment_length = db.Column(db.Integer, default=7)
    price_per_dog = db.Column(db.Numeric(10, 2))
    max_dogs = db.Column(db.Integer)
    max_infants = db.Column(db.Integer)
    max_guests = db.Column(db.Integer)
    min_age = db.Column(db.Integer)
    check_in_time = db.Column(db.Time)
    check_out_time = db.Column(db.Time)

class Billing_Settings(db.Model):
    __tablename__ = 'billing_settings'
    id = db.Column(db.Integer, primary_key=True)
    first_payment_due_after = db.Column(db.Integer, default=None)
    progressive_bill_notice = db.Column(db.Integer, default=None)
    payment_breakpoints = db.relationship('Payment_Breakpoint', backref='billing_settings', lazy='dynamic')
    cancellation_breakpoints = db.relationship('Cancellation_Breakpoint', backref='billing_settings', lazy='dynamic')

class Payment_Breakpoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    billing_settings_id = db.Column(db.Integer, db.ForeignKey('billing_settings.id'))
    amount_due = db.Column(db.Integer)
    due_by = db.Column(db.Integer, unique=True) #days before Booking.start_date
    first_payment = db.Column(db.Boolean, default=False)

class Cancellation_Breakpoint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    billing_settings_id = db.Column(db.Integer, db.ForeignKey('billing_settings.id'))
    amount_refundable = db.Column(db.Integer)
    cancel_by = db.Column(db.Integer, unique=True) #days before Booking.start_date
    check_in = db.Column(db.Boolean, default=False)

class Delete_Price_List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date)
    price = db.Column(db.Numeric(10,2))
    price_2_weeks = db.Column(db.Numeric(10, 2))
    price_3_weeks = db.Column(db.Numeric(10, 2))
    price_4_weeks = db.Column(db.Numeric(10, 2))
    discount_amount_2_weeks = db.Column(db.Numeric(10, 2))
    discount_amount_3_weeks = db.Column(db.Numeric(10, 2))
    discount_amount_4_weeks = db.Column(db.Numeric(10, 2))
    booking_id = db.Column(db.Integer, default=None)
    is_past = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=False)
    is_future = db.Column(db.Boolean, default=False)

class Delete_Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, default=None)
    arrival_date = db.Column(db.Date)
    departure_date = db.Column(db.Date)
    adults = db.Column(db.Integer)
    children = db.Column(db.Integer)
    infants = db.Column(db.Integer)
    dogs = db.Column(db.Integer)
    stay_price = db.Column(db.Numeric(10, 2))
    multi_week_discount = db.Column(db.Numeric(10, 2))
    dog_price = db.Column(db.Numeric(10, 2))
    total = db.Column(db.Numeric(10,2))
    status = db.Column(db.Enum('AWAITING_CONFIRMATION', 'ACCEPTED', 'REJECTED', 'ACTIVE', 'INACTIVE', name='status'), default='INACTIVE', nullable=True)
    booking_type = db.Column(db.Enum('STANDARD', 'OWNER', 'EXTERNAL', name='booking_type'), nullable=True, default='STANDARD')
    external_note = db.Column(db.String(30))

class Delete_Billing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, default=None)
    amount = db.Column(db.Numeric(10, 2))
    date = db.Column(db.Date)
    note = db.Column(db.String(30))
    invoice_due_date = db.Column(db.Date, default=None)
    #insert invoice due_dates relationship to take into account multistage payment terms
    transaction_type = db.Column(db.Enum('INVOICE', 'PAYMENT', 'DEBIT_NOTE', 'CREDIT_NOTE', name='transaction_type'), nullable=False)
    invoice_reference = db.Column(db.Integer, default=None)
    payment_reference = db.Column(db.Integer, default=None)
    credit_note_reference = db.Column(db.Integer, default=None)
    debit_note_reference = db.Column(db.Integer, default=None)
    invoice_status = db.Column(db.Enum('NOT_SENT', 'ACTIVE', 'OVERDUE', 'PAID', 'INACTIVE', name='invoice_status'), nullable=True)
    linked_invoice_id = db.Column(db.Integer)
    first_invoice = db.Column(db.Boolean, default=False)
    last_reminder = db.Column(db.Date)
    percentage_due = db.Column(db.Integer)

class Delete_Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30))
    last_name = db.Column(db.String(30))
    email_address = db.Column(db.String(30))
    phone_number = db.Column(db.String(20))
    address_line_1 = db.Column(db.String(30))
    address_line_2 = db.Column(db.String(30))
    town_or_city = db.Column(db.String(30))
    county_or_region = db.Column(db.String(30))
    postcode = db.Column(db.String(30))