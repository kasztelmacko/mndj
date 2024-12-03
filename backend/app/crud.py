import uuid
from typing import Any

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.models import (User, UserCreate, UserUpdate, 
                        Team, TeamCreate,
                        UserTeam, UserTeamCreate,
                        Lab, LabCreate,
                        Item, ItemCreate,
                        UserItem, UserItemCreate)


def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_team(*, session: Session, team_in: TeamCreate, owner_id: uuid.UUID) -> Team:
    db_team = Team.model_validate(team_in, update={"owner_id": owner_id})
    session.add(db_team)
    session.commit()
    session.refresh(db_team)
    return db_team

def create_user_team(*, session: Session, user_team_in: UserTeamCreate, user_id: uuid.UUID, team_id: uuid.UUID) -> UserTeam:
    db_user_team = UserTeam.model_validate(user_team_in, update={"user_id": user_id, "team_id": team_id})
    session.add(db_user_team)
    session.commit()
    session.refresh(db_user_team)
    return db_user_team

def create_item(*, session: Session, item_in: ItemCreate, team_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"team_id": team_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item

def create_user_item(*, session: Session, user_item_in: UserItemCreate, user_id: uuid.UUID, item_id: uuid.UUID, lab_id: uuid.UUID) -> UserItem:
    db_user_item = UserItem.model_validate(user_item_in, update={"user_id": user_id, "item_id": item_id, "lab_id": lab_id})
    session.add(db_user_item)
    session.commit()
    session.refresh(db_user_item)
    return db_user_item

def create_lab(*, session: Session, lab_in: LabCreate, owner_id: uuid.UUID, team_id: uuid.UUID) -> Lab:
    db_lab = Lab.model_validate(lab_in, update={"owner_id": owner_id, "team_id": team_id})
    session.add(db_lab)
    session.commit()
    session.refresh(db_lab)
    return db_lab
