"""Initialize models

Revision ID: e2412789c190
Revises:
Create Date: 2023-11-24 22:55:43.195942

"""
import sqlalchemy as sa
from sqlmodel.sql.sqltypes import AutoString
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "e2412789c190"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "users",
        sa.Column("email", AutoString(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="True"),
        sa.Column("is_superuser", sa.Boolean(), nullable=False, server_default="False"),
        sa.Column("full_name", AutoString(), nullable=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('uuid_generate_v4()')),
        sa.Column("hashed_password", AutoString(), nullable=False),
        sa.PrimaryKeyConstraint("user_id"),
    )
    op.create_index(op.f("ix_user_email"), "users", ["email"], unique=True)

    op.create_table(
        "teams",
        sa.Column("team_name", AutoString(), nullable=False),
        sa.Column("team_id", postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('uuid_generate_v4()')),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["owner_id"],
            ["users.user_id"],
        ),
        sa.PrimaryKeyConstraint("team_id")
    )

    op.create_table(
        "user_team",
        sa.Column("user_team_id", postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('uuid_generate_v4()')),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("team_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("can_edit_labs", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("can_edit_items", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("can_edit_users", sa.Boolean(), nullable=False, server_default="false"),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.user_id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["team_id"],
            ["teams.team_id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("user_team_id"),
    )

    op.create_table(
        "labs",
        sa.Column("lab_id", postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('uuid_generate_v4()')),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("team_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("lab_place", AutoString(length=255), nullable=True),
        sa.Column("lab_university", AutoString(length=255), nullable=True),
        sa.Column("lab_num", AutoString(length=255), nullable=True),
        sa.ForeignKeyConstraint(
            ["owner_id"],
            ["users.user_id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["team_id"],
            ["teams.team_id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("lab_id"),
    )

    op.create_table(
        "items",
        sa.Column("item_id", postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('uuid_generate_v4()')),
        sa.Column("team_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("item_name", AutoString(length=255), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("item_img_url", AutoString(length=255), nullable=True),
        sa.Column("item_vendor", AutoString(length=255), nullable=True),
        sa.Column("item_params", AutoString(length=255), nullable=True),
        sa.ForeignKeyConstraint(
            ["team_id"],
            ["teams.team_id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("item_id"),
    )

    op.create_table(
        "user_items",
        sa.Column("user_item_id", postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('uuid_generate_v4()')),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("item_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("lab_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("borrowed_at", AutoString(), nullable=False),
        sa.Column("returned_at", AutoString(), nullable=True),
        sa.Column("table_name", AutoString(), nullable=True),
        sa.Column("system_name", AutoString(), nullable=True),
        sa.Column("item_status", AutoString(), nullable=True),
        sa.ForeignKeyConstraint(
            ["item_id"],
            ["items.item_id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["lab_id"],
            ["labs.lab_id"],
            ondelete="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.user_id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("user_item_id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("user_items")
    op.drop_table("items")
    op.drop_table("labs")
    op.drop_table("user_team")
    op.drop_table("teams")
    op.drop_index(op.f("ix_user_email"), table_name="users")
    op.drop_table("users")
    # ### end Alembic commands ###