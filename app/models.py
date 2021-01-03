from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    def __repr__(self):
        return '<User {}>'.format(self.username)  

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

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

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    date_segments = db.relationship('Price_List', backref='booking')
    arrival_date = db.Column(db.Date)
    departure_date = db.Column(db.Date)
    adults = db.Column(db.Integer)
    children = db.Column(db.Integer)
    infants = db.Column(db.Integer)
    dogs = db.Column(db.Integer)
    stay_price = db.Column(db.Numeric(10, 2))
    dog_price = db.Column(db.Numeric(10, 2))
    price = db.Column(db.Numeric(10,2))
    
class Price_List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, unique=True)
    price = db.Column(db.Numeric(10,2))
    price_2_weeks = db.Column(db.Numeric(10, 2))
    price_3_weeks = db.Column(db.Numeric(10, 2))
    price_4_weeks = db.Column(db.Numeric(10, 2))
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id', ondelete='SET NULL'), default=None)
    is_past = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=False)
    is_future = db.Column(db.Boolean, default=False)

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
