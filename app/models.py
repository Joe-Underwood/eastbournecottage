from app import db

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bookings = db.relationship('Booking', backref='customer')
    name = db.Column(db.String(30))
    email_address = db.Column(db.String(30))
    phone_number = db.Column(db.String(20))

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dates = db.relationship('Date', backref='booking')
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    confirmed = db.Column(db.Boolean)
    paid = db.Column(db.Boolean)
    cancelled = db.Column(db.Boolean)

class Date(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('booking.id'))
    date = db.Column(db.String(15), unique=True)

