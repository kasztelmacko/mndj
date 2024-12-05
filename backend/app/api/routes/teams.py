import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import col, delete, func, select

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Message,
    User,
    Team,
    TeamCreate,
    TeamUpdate,
    TeamBase,
    TeamPublic,
    TeamsPublic,
    UserTeam,
    UserTeamCreate,
    UserWithPermissions,
)
from app.utils import generate_new_account_email, send_email

router = APIRouter()

@router.get("/", response_model=TeamsPublic)
def read_teams(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve teams.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )

    count_statement = select(func.count()).select_from(Team)
    count = session.exec(count_statement).one()

    statement = select(Team).offset(skip).limit(limit)
    teams = session.exec(statement).all()

    return TeamsPublic(data=teams, count=count)

@router.get("/{team_id}", response_model=TeamPublic)
def read_team(*, session: SessionDep, team_id: int, current_user: CurrentUser) -> Any:
    """
    Retrieve team by ID.
    """
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The team with this ID does not exist in the system.",
        )
    if not current_user.is_superuser and team.owner_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )

    return team

@router.post("/", response_model=TeamPublic)
def create_team(*, session: SessionDep, team_in: TeamCreate, current_user: CurrentUser) -> Any:
    """
    Create new team.
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )
    
    team = Team.model_validate(team_in, update={"owner_id": current_user.user_id})
    session.add(team)
    session.commit()
    session.refresh(team)

    user_team = UserTeam(
        user_id=current_user.user_id,
        team_id=team.team_id,
        can_edit_labs = True,
        can_edit_users = True,
        can_edit_items = True,
    )

    session.add(user_team)
    session.commit()
    session.refresh(user_team)

    return team

@router.put("/{team_id}", response_model=TeamPublic)
def update_team(*, session: SessionDep, team_id: int, team_in: TeamUpdate, current_user: CurrentUser) -> Any:
    """
    Update team by ID.
    """
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The team with this ID does not exist in the system.",
        )
    if not current_user.is_superuser and team.owner_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )

    team = Team.model_validate(team_in, update={"team_id": team_id})
    session.add(team)
    session.commit()
    session.refresh(team)

    return team

@router.delete("/{team_id}", response_model=Message)
def delete_team(*, session: SessionDep, team_id: int, current_user: CurrentUser) -> Any:
    """
    Delete team by ID.
    """
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The team with this ID does not exist in the system.",
        )
    if not current_user.is_superuser and team.owner_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )

    session.delete(team)
    session.commit()

    return Message(message="Team deleted successfully.")

@router.get("/{team_id}/add-users", response_model=Message)
def add_user_to_team(
    *, session: SessionDep, team_id: int, add_user_in: UserTeamCreate, current_user: CurrentUser
) -> Any:
    """
    Add a user to a team by providing an email and their permissions.
    """
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The team with this ID does not exist in the system.",
        )
    
    if not current_user.is_superuser:
        user_team = session.exec(
            select(UserTeam).where(
                UserTeam.user_id == current_user.user_id,
                UserTeam.team_id == team_id
            )
        ).first()

        if not user_team or not user_team.can_edit_users:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )
        
    email = add_user_in.email
    user = session.exec(select(User).where(User.email == email)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user with this email does not exist in the system.",
        )
    
    user_team = UserTeam(
        user_id=user.user_id,
        team_id=team_id,
        can_edit_labs=add_user_in.can_edit_labs,
        can_edit_users=add_user_in.can_edit_users,
        can_edit_items=add_user_in.can_edit_items,
    )
    session.add(user_team)
    session.commit()

    return Message(message="User added to team successfully.")

@router.get("/{team_id}/users/{user_id}", response_model=UserWithPermissions)
def view_user_in_team(
    *, session: SessionDep, current_user: CurrentUser, team_id: uuid.UUID, user_id: uuid.UUID
) -> Any:
    """
    View a specific user in a team.
    """
    # Check if the current user is part of the team
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Check if the current user is part of the lab
    current_user_team = session.exec(
        select(UserTeam).where(
            UserTeam.team_id == team_id,
            UserTeam.user_id == current_user.user_id
        )
    ).first()

    if not current_user_team:
        raise HTTPException(status_code=403, detail="You are not part of this team")

    # Find the user by their user ID
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

    # Check if the user is part of the team
    user_team = session.exec(
        select(UserTeam).where(
            UserTeam.team_id == team_id,
            UserTeam.user_id == user.user_id
        )
    ).first()

    if not user_team:
        raise HTTPException(status_code=404, detail=f"User with ID {user.user_id} is not associated with this team")

    # Construct the UserWithPermissions object
    user_with_permissions = UserWithPermissions(
        email=user.email,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        full_name=user.full_name,
        user_id=user.user_id,
        can_edit_labs=user_team.can_edit_labs,
        can_edit_items=user_team.can_edit_items,
        can_edit_users=user_team.can_edit_users
    )

    return user_with_permissions

@router.delete("/{team_id}/users/{user_id}/remove-user", response_model=Message)
def remove_user_from_team(
    *, session: SessionDep, team_id: int, user_id: int, current_user: CurrentUser
) -> Any:
    """
    Remove a user from a team.
    """
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The team with this ID does not exist in the system.",
        )

    if not current_user.is_superuser:
        user_team = session.exec(
            select(UserTeam).where(
                UserTeam.user_id == current_user.user_id,
                UserTeam.team_id == team_id
            )
        ).first()

        if not user_team or not user_team.can_edit_users:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )
    
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user with this ID does not exist in the system.",
        )
    
    user_team_to_delete = session.exec(
        select(UserTeam).where(
            UserTeam.team_id == team_id,
            UserTeam.user_id == user.user_id
            )
        ).first()

    if not user_team_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user is not part of this team.",
        )

    session.delete(user_team_to_delete)
    session.commit()

    return Message(message="User removed from team successfully.")

@router.get("/{team_id}/users", response_model=list[UserWithPermissions])
def view_team_users(
    *, session: SessionDep, team_id: int, current_user: CurrentUser
) -> Any:
    """
    View users in a team.
    """
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The team with this ID does not exist in the system.",
        )
    
    user_team = session.exec(
        select(UserTeam).where(
            UserTeam.user_id == current_user.user_id,
            UserTeam.team_id == team_id
        )
    ).first()

    if not user_team:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    
    users_team = session.exec(
        select(UserTeam).where(
            UserTeam.team_id == team_id)
    ).all()

    user_ids = [user_team.user_id for user_team in users_team]
    users = session.exec(
        select(User).where(
            User.user_id.in_(user_ids)
            )
        ).all()

    users_with_permissions = []
    for user in users:
        user_team = next((ut for ut in users_team if ut.user_id == user.user_id), None)
        if user_team:
            user_with_permissions = UserWithPermissions(
                email=user.email,
                is_active=user.is_active,
                is_superuser=user.is_superuser,
                full_name=user.full_name,
                user_id=user.user_id,
                can_edit_labs=user_team.can_edit_labs,
                can_edit_items=user_team.can_edit_items,
                can_edit_users=user_team.can_edit_users,
            )
            users_with_permissions.append(user_with_permissions)

    return users_with_permissions

@router.put("/{team_id}/users/{user_id}/update-permissions", response_model=Message)
def update_user_permissions(
    *, session: SessionDep, team_id: int, user_id: int, user_team_in: UserTeamCreate, current_user: CurrentUser
) -> Any:
    """
    Update user permissions in a team.
    """
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The team with this ID does not exist in the system.",
        )

    if not current_user.is_superuser:
        user_team = session.exec(
            select(UserTeam).where(
                UserTeam.user_id == current_user.user_id,
                UserTeam.team_id == team_id
            )
        ).first()

        if not user_team or not user_team.can_edit_users:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user with this ID does not exist in the system.",
        )

    user_team = session.exec(
        select(UserTeam).where(
            UserTeam.team_id == team_id,
            UserTeam.user_id == user.user_id
        )
    ).first()

    if not user_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user is not part of this team.",
        )

    user_team.can_edit_labs = user_team_in.can_edit_labs
    user_team.can_edit_items = user_team_in.can_edit_items
    user_team.can_edit_users = user_team_in.can_edit_users

    session.add(user_team)
    session.commit()

    return Message(message="User permissions updated")
