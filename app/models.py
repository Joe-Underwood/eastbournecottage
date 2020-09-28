from app import db

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
    dates = db.relationship('Date', backref='booking')
    adults = db.Column(db.Integer)
    children = db.Column(db.Integer)
    infants = db.Column(db.Integer)
    dogs = db.Column(db.Integer)
    price = db.Column(db.Numeric(10,2))

class Date(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'))
    date = db.Column(db.Date, unique=True)

class Price_List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, unique=True)
    end_date = db.Column(db.Date, unique=True)
    price = db.Column(db.Numeric(10,2))