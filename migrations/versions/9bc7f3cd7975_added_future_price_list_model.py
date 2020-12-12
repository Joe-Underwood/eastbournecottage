"""added Future_Price_List model

Revision ID: 9bc7f3cd7975
Revises: 65ad66588403
Create Date: 2020-12-09 19:12:03.359089

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '9bc7f3cd7975'
down_revision = '65ad66588403'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('future__price__list',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=True),
    sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('start_date')
    )
    op.drop_column('price__list', 'is_active')
    op.drop_column('price__list', 'is_future')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('price__list', sa.Column('is_future', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.add_column('price__list', sa.Column('is_active', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True))
    op.drop_table('future__price__list')
    # ### end Alembic commands ###