from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, DateField, SubmitField
from wtforms.fields.html5 import EmailField
from wtforms.validators import Required, DataRequired, InputRequired, Email, Length, ValidationError

class BookingForm(FlaskForm):
    name = StringField('Name', validators=[InputRequired()])
    email_address = EmailField('Email', validators=[InputRequired()])
    phone_number = StringField('Phone Number', validators=[InputRequired()])
    arrival_date = DateField('Arrival Date', validators=[InputRequired()])
    departure_date = DateField('Departure Date', validators=[InputRequired()])
    submit_button = SubmitField('Submit')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    token = StringField('Token', validators=[Required(), Length(6, 6)])
    submit = SubmitField('Sign In')
