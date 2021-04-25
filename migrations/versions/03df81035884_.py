"""empty message

Revision ID: 03df81035884
Revises: 382e254e3efd
Create Date: 2021-03-17 21:06:43.097212

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '03df81035884'
down_revision = '382e254e3efd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('billing_settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('cancellation__breakpoint',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('billing_settings_id', sa.Integer(), nullable=True),
    sa.Column('amount_refundable', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('is_percentage', sa.Boolean(), nullable=True),
    sa.Column('is_absolute', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['billing_settings_id'], ['billing_settings.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('payment__breakpoint',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('billing_settings_id', sa.Integer(), nullable=True),
    sa.Column('amount_due', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('due_by', sa.Integer(), nullable=True),
    sa.Column('is_percentage', sa.Boolean(), nullable=True),
    sa.Column('is_absolute', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['billing_settings_id'], ['billing_settings.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('billing__settings')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('billing__settings',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8_bin',
    mysql_default_charset='utf8',
    mysql_engine='InnoDB'
    )
    op.drop_table('payment__breakpoint')
    op.drop_table('cancellation__breakpoint')
    op.drop_table('billing_settings')
    # ### end Alembic commands ###