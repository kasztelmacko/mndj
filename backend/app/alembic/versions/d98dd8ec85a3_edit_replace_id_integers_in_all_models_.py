"""Edit replace id integers in all models to use UUID instead

Revision ID: d98dd8ec85a3
Revises: 9c0a54914c78
Create Date: 2024-07-19 04:08:04.000976

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = 'd98dd8ec85a3'
down_revision = '9c0a54914c78'
branch_labels = None
depends_on = None


def upgrade():
    # Add unique constraints for referenced columns
    op.create_unique_constraint('uq_user_user_id', 'users', ['user_id'])
    op.create_unique_constraint('uq_team_team_id', 'teams', ['team_id'])
    op.create_unique_constraint('uq_labs_lab_id', 'labs', ['lab_id'])
    op.create_unique_constraint('uq_items_item_id', 'items', ['item_id'])

    # Recreate foreign key constraints with cascade delete
    op.drop_constraint('team_owner_id_fkey', 'teams', type_='foreignkey')
    op.create_foreign_key('team_owner_id_fkey', 'teams', 'users', ['owner_id'], ['user_id'], ondelete='CASCADE')

    op.drop_constraint('user_team_user_id_fkey', 'user_team', type_='foreignkey')
    op.create_foreign_key('user_team_user_id_fkey', 'user_team', 'users', ['user_id'], ['user_id'], ondelete='CASCADE')

    op.drop_constraint('user_team_team_id_fkey', 'user_team', type_='foreignkey')
    op.create_foreign_key('user_team_team_id_fkey', 'user_team', 'teams', ['team_id'], ['team_id'], ondelete='CASCADE')

    op.drop_constraint('labs_owner_id_fkey', 'labs', type_='foreignkey')
    op.create_foreign_key('labs_owner_id_fkey', 'labs', 'users', ['owner_id'], ['user_id'], ondelete='CASCADE')

    op.drop_constraint('labs_team_id_fkey', 'labs', type_='foreignkey')
    op.create_foreign_key('labs_team_id_fkey', 'labs', 'teams', ['team_id'], ['team_id'], ondelete='CASCADE')

    op.drop_constraint('items_team_id_fkey', 'items', type_='foreignkey')
    op.create_foreign_key('items_team_id_fkey', 'items', 'teams', ['team_id'], ['team_id'], ondelete='CASCADE')

    op.drop_constraint('user_items_user_id_fkey', 'user_items', type_='foreignkey')
    op.create_foreign_key('user_items_user_id_fkey', 'user_items', 'users', ['user_id'], ['user_id'], ondelete='CASCADE')

    op.drop_constraint('user_items_item_id_fkey', 'user_items', type_='foreignkey')
    op.create_foreign_key('user_items_item_id_fkey', 'user_items', 'items', ['item_id'], ['item_id'], ondelete='CASCADE')

    op.drop_constraint('user_items_lab_id_fkey', 'user_items', type_='foreignkey')
    op.create_foreign_key('user_items_lab_id_fkey', 'user_items', 'labs', ['lab_id'], ['lab_id'], ondelete='CASCADE')

def downgrade():

    # Remove unique constraints for referenced columns
    op.drop_constraint('uq_user_user_id', 'users', type_='unique')
    op.drop_constraint('uq_team_team_id', 'teams', type_='unique')
    op.drop_constraint('uq_labs_lab_id', 'labs', type_='unique')
    op.drop_constraint('uq_items_item_id', 'items', type_='unique')

    # Revert foreign key constraints to remove cascade delete
    op.drop_constraint('team_owner_id_fkey', 'teams', type_='foreignkey')
    op.create_foreign_key('team_owner_id_fkey', 'teams', 'users', ['owner_id'], ['user_id'])

    op.drop_constraint('user_team_user_id_fkey', 'user_team', type_='foreignkey')
    op.create_foreign_key('user_team_user_id_fkey', 'user_team', 'users', ['user_id'], ['user_id'])

    op.drop_constraint('user_team_team_id_fkey', 'user_team', type_='foreignkey')
    op.create_foreign_key('user_team_team_id_fkey', 'user_team', 'teams', ['team_id'], ['team_id'])

    op.drop_constraint('labs_owner_id_fkey', 'labs', type_='foreignkey')
    op.create_foreign_key('labs_owner_id_fkey', 'labs', 'users', ['owner_id'], ['user_id'])

    op.drop_constraint('labs_team_id_fkey', 'labs', type_='foreignkey')
    op.create_foreign_key('labs_team_id_fkey', 'labs', 'teams', ['team_id'], ['team_id'])

    op.drop_constraint('items_team_id_fkey', 'items', type_='foreignkey')
    op.create_foreign_key('items_team_id_fkey', 'items', 'teams', ['team_id'], ['team_id'])

    op.drop_constraint('user_items_user_id_fkey', 'user_items', type_='foreignkey')
    op.create_foreign_key('user_items_user_id_fkey', 'user_items', 'users', ['user_id'], ['user_id'])

    op.drop_constraint('user_items_item_id_fkey', 'user_items', type_='foreignkey')
    op.create_foreign_key('user_items_item_id_fkey', 'user_items', 'items', ['item_id'], ['item_id'])

    op.drop_constraint('user_items_lab_id_fkey', 'user_items', type_='foreignkey')
    op.create_foreign_key('user_items_lab_id_fkey', 'user_items', 'labs', ['lab_id'], ['lab_id'])