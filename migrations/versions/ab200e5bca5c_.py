"""empty message

Revision ID: ab200e5bca5c
Revises: 712384ed1e42
Create Date: 2021-01-30 14:56:51.579117

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'ab200e5bca5c'
down_revision = '712384ed1e42'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('price__list', 'is_active',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=True)
    op.alter_column('price__list', 'is_future',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=True)
    op.alter_column('price__list', 'is_past',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('price__list', 'is_past',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=False)
    op.alter_column('price__list', 'is_future',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=False)
    op.alter_column('price__list', 'is_active',
               existing_type=mysql.TINYINT(display_width=1),
               nullable=False)
    # ### end Alembic commands ###