"""empty message

Revision ID: 6aa9141a1c00
Revises: d4c334a5f179
Create Date: 2021-05-03 17:46:21.823616

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '6aa9141a1c00'
down_revision = 'd4c334a5f179'
branch_labels = None
depends_on = None


def upgrade():
	op.add_column('price__list', sa.Column('discount_amount_2_weeks', mysql.DECIMAL(precision=10, scale=2), nullable=True))
	op.add_column('price__list', sa.Column('discount_amount_3_weeks', mysql.DECIMAL(precision=10, scale=2), nullable=True))
	op.add_column('price__list', sa.Column('discount_amount_4_weeks', mysql.DECIMAL(precision=10, scale=2), nullable=True))


def downgrade():
	op.drop_column('price__list', 'discount_amount_2_weeks')
	op.drop_column('price__list', 'discount_amount_3_weeks')
	op.drop_column('price__list', 'discount_amount_4_weeks')
    
