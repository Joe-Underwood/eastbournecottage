"""empty message

Revision ID: c9e6034cf14d
Revises: 99e8f5466197
Create Date: 2021-07-12 16:42:24.565937

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'c9e6034cf14d'
down_revision = '99e8f5466197'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('delete__booking', 'booking_type')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('delete__booking', sa.Column('booking_type', mysql.ENUM('standard', 'owner', 'external', collation='utf8_bin'), nullable=True))
    # ### end Alembic commands ###
