"""added Billing_Settings.progressive_bill_notice

Revision ID: 9aaec0f42ca3
Revises: e9af5b972803
Create Date: 2021-06-01 10:25:46.309689

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9aaec0f42ca3'
down_revision = 'e9af5b972803'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('billing_settings', sa.Column('progressive_bill_notice', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('billing_settings', 'progressive_bill_notice')
    # ### end Alembic commands ###
