"""empty message

Revision ID: 2e357ecc219a
Revises: 8a8b0872077a
Create Date: 2020-12-26 16:00:40.827349

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2e357ecc219a'
down_revision = '8a8b0872077a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('future__price__list', sa.Column('booked', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('future__price__list', 'booked')
    # ### end Alembic commands ###
