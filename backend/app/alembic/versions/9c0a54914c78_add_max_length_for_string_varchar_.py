"""Add max length for string(varchar) fields in User and Items models

Revision ID: 9c0a54914c78
Revises: e2412789c190
Create Date: 2024-06-17 14:42:44.639457

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '9c0a54914c78'
down_revision = 'e2412789c190'
branch_labels = None
depends_on = None


def upgrade():
    # Adjust the length of the email field in the User table
    op.alter_column('users', 'email',
               existing_type=sa.String(),
               type_=sa.String(length=255),
               existing_nullable=False)

    # Adjust the length of the full_name field in the User table
    op.alter_column('users', 'full_name',
               existing_type=sa.String(),
               type_=sa.String(length=255),
               existing_nullable=True)

    # Adjust the length of the hashed_password field in the User table
    op.alter_column('users', 'hashed_password',
               existing_type=sa.String(),
               type_=sa.String(length=255),
               existing_nullable=False)

    # Adjust the length of the item_name field in the Items table
    op.alter_column('items', 'item_name',
               existing_type=sa.String(),
               type_=sa.String(length=255),
               existing_nullable=False)

    # Adjust the length of the item_img_url field in the Items table
    op.alter_column('items', 'item_img_url',
               existing_type=sa.String(),
               type_=sa.String(length=255),
               existing_nullable=True)

    # Adjust the length of the item_vendor field in the Items table
    op.alter_column('items', 'item_vendor',
               existing_type=sa.String(),
               type_=sa.String(length=255),
               existing_nullable=True)

    # Adjust the length of the item_params field in the Items table
    op.alter_column('items', 'item_params',
               existing_type=sa.String(),
               type_=sa.String(length=255),
               existing_nullable=True)


def downgrade():
    # Revert the length of the email field in the User table
    op.alter_column('users', 'email',
               existing_type=sa.String(length=255),
               type_=sa.String(),
               existing_nullable=False)

    # Revert the length of the full_name field in the User table
    op.alter_column('users', 'full_name',
               existing_type=sa.String(length=255),
               type_=sa.String(),
               existing_nullable=True)

    # Revert the length of the hashed_password field in the User table
    op.alter_column('users', 'hashed_password',
               existing_type=sa.String(length=255),
               type_=sa.String(),
               existing_nullable=False)

    # Revert the length of the item_name field in the Items table
    op.alter_column('items', 'item_name',
               existing_type=sa.String(length=255),
               type_=sa.String(),
               existing_nullable=False)

    # Revert the length of the item_img_url field in the Items table
    op.alter_column('items', 'item_img_url',
               existing_type=sa.String(length=255),
               type_=sa.String(),
               existing_nullable=True)

    # Revert the length of the item_vendor field in the Items table
    op.alter_column('items', 'item_vendor',
               existing_type=sa.String(length=255),
               type_=sa.String(),
               existing_nullable=True)

    # Revert the length of the item_params field in the Items table
    op.alter_column('items', 'item_params',
               existing_type=sa.String(length=255),
               type_=sa.String(),
               existing_nullable=True)