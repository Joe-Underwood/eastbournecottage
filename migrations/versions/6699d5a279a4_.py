"""empty message

Revision ID: 6699d5a279a4
Revises: 75aec4647c30
Create Date: 2020-12-29 16:37:08.529415

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6699d5a279a4'
down_revision = '75aec4647c30'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('future__price__list', sa.Column('booking_id', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('future__price__list', 'booking_id')
    # ### end Alembic commands ###
