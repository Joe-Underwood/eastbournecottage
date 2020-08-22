"""initial migration

Revision ID: c00652fae690
Revises: 49731d5eabb7
Create Date: 2020-08-22 16:20:15.027581

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'c00652fae690'
down_revision = '49731d5eabb7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('price__list',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=True),
    sa.Column('end_date', sa.Date(), nullable=True),
    sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('end_date'),
    sa.UniqueConstraint('start_date')
    )
    op.add_column('booking', sa.Column('adults', sa.Integer(), nullable=True))
    op.add_column('booking', sa.Column('children', sa.Integer(), nullable=True))
    op.add_column('booking', sa.Column('dogs', sa.Integer(), nullable=True))
    op.add_column('booking', sa.Column('infants', sa.Integer(), nullable=True))
    op.add_column('booking', sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=True))
    op.drop_column('booking', 'confirmed')
    op.drop_column('booking', 'paid')
    op.drop_column('booking', 'cancelled')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('booking', sa.Column('cancelled', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.add_column('booking', sa.Column('paid', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.add_column('booking', sa.Column('confirmed', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.drop_column('booking', 'price')
    op.drop_column('booking', 'infants')
    op.drop_column('booking', 'dogs')
    op.drop_column('booking', 'children')
    op.drop_column('booking', 'adults')
    op.drop_table('price__list')
    # ### end Alembic commands ###
