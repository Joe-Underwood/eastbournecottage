"""empty message

Revision ID: 6c0b3162e29a
Revises: 5e5c764f59e5
Create Date: 2021-05-22 10:19:48.163985

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6c0b3162e29a'
down_revision = '5e5c764f59e5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('billing', sa.Column('note', sa.String(length=30), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('billing', 'note')
    # ### end Alembic commands ###
