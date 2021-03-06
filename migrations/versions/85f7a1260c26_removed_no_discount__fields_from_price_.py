"""removed no_discount_* fields from Price_List model

Revision ID: 85f7a1260c26
Revises: 13fba8f4c705
Create Date: 2021-05-01 20:04:22.472535

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '85f7a1260c26'
down_revision = '13fba8f4c705'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('price__list', 'is_past')
    op.drop_column('price__list', 'no_discount_price_2_weeks')
    op.drop_column('price__list', 'is_future')
    op.drop_column('price__list', 'no_discount_price_4_weeks')
    op.drop_column('price__list', 'no_discount_price_3_weeks')
    op.drop_column('price__list', 'is_active')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('price__list', sa.Column('is_active', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.add_column('price__list', sa.Column('no_discount_price_3_weeks', mysql.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('price__list', sa.Column('no_discount_price_4_weeks', mysql.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('price__list', sa.Column('is_future', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.add_column('price__list', sa.Column('no_discount_price_2_weeks', mysql.DECIMAL(precision=10, scale=2), nullable=True))
    op.add_column('price__list', sa.Column('is_past', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
