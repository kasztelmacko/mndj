import uuid
from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    __tablename__ = "users"
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    teams: list["Team"] = Relationship(back_populates="owner")
    labs: list["Lab"] = Relationship(back_populates="owner")
    user_teams: list["UserTeam"] = Relationship(back_populates="user")
    user_items: list["UserItem"] = Relationship(back_populates="user")


# Properties to return via API, id is always required
class UserPublic(UserBase):
    user_id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


class TeamBase(SQLModel):
    team_name: str


class TeamCreate(TeamBase):
    pass


class TeamUpdate(TeamBase):
    team_name: str | None = None


class Team(TeamBase, table=True):
    __tablename__ = "teams"
    team_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="users.user_id", nullable=False, ondelete="CASCADE")
    owner: User = Relationship(back_populates="teams")
    user_teams: list["UserTeam"] = Relationship(back_populates="team")
    items: list["Item"] = Relationship(back_populates="team")
    labs: list["Lab"] = Relationship(back_populates="team")


class TeamPublic(TeamBase):
    team_id: uuid.UUID
    owner_id: uuid.UUID


class TeamsPublic(SQLModel):
    data: list[TeamPublic]
    count: int


class UserTeam(SQLModel, table=True):
    __tablename__ = "user_team"
    user_team_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.user_id", nullable=False, ondelete="CASCADE")
    team_id: uuid.UUID = Field(foreign_key="teams.team_id", nullable=False, ondelete="CASCADE")
    can_edit_labs: bool = Field(default=False)
    can_edit_items: bool = Field(default=False)
    can_edit_users: bool = Field(default=False)
    user: User = Relationship(back_populates="user_teams")
    team: Team = Relationship(back_populates="user_teams")


class UserTeamCreate(SQLModel):
    email: EmailStr
    can_edit_labs: bool = False
    can_edit_items: bool = False
    can_edit_users: bool = False


class UserTeamUpdate(SQLModel):
    can_edit_labs: bool = False
    can_edit_items: bool = False
    can_edit_users: bool = False


class UserTeamDelete(SQLModel):
    user_id: uuid.UUID

class UserWithPermissions(SQLModel):
    email: EmailStr
    is_active: bool
    is_superuser: bool
    full_name: str | None = Field(default=None, max_length=255)
    user_id: uuid.UUID
    can_edit_labs: bool
    can_edit_items: bool
    can_edit_users: bool


# Shared properties
class ItemBase(SQLModel):
    item_name: str = Field(min_length=1, max_length=255)
    quantity: int = Field(default=1)
    item_img_url: str | None = Field(default=None, max_length=255)
    item_vendor: str | None = Field(default=None, max_length=255)
    item_params: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    item_name: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    __tablename__ = "items"
    item_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    team_id: uuid.UUID = Field(foreign_key="teams.team_id", nullable=False, ondelete="CASCADE")
    team: Team = Relationship(back_populates="items")
    user_items: list["UserItem"] = Relationship(back_populates="item", sa_relationship_kwargs={"cascade": "delete"})


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    item_id: uuid.UUID
    team_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Shared properties
class LabBase(SQLModel):
    lab_place: str | None = Field(default=None, max_length=255)
    lab_university: str | None = Field(default=None, max_length=255)
    lab_num: str | None = Field(default=None, max_length=255)


# Properties to receive on lab creation
class LabCreate(LabBase):
    pass


# Properties to receive on lab update
class LabUpdate(LabBase):
    lab_place: str | None = Field(default=None, max_length=255)  # type: ignore
    lab_university: str | None = Field(default=None, max_length=255)  # type: ignore
    lab_num: str | None = Field(default=None, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Lab(LabBase, table=True):
    __tablename__ = "labs"
    lab_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="users.user_id", nullable=False, ondelete="CASCADE")
    team_id: uuid.UUID = Field(foreign_key="teams.team_id", nullable=False, ondelete="CASCADE")
    owner: User = Relationship(back_populates="labs")
    team: Team = Relationship(back_populates="labs")
    user_items: list["UserItem"] = Relationship(back_populates="lab", sa_relationship_kwargs={"cascade": "delete"})


# Properties to return via API, id is always required
class LabPublic(LabBase):
    lab_id: uuid.UUID
    owner_id: uuid.UUID
    team_id: uuid.UUID


class LabsPublic(SQLModel):
    data: list[LabPublic]
    count: int


# Shared properties
class UserItemBase(SQLModel):
    borrowed_at: str
    returned_at: str | None = None
    table_name: str | None = None
    system_name: str | None = None
    item_status: str | None = None


# Properties to receive on user item creation
class UserItemCreate(UserItemBase):
    pass


# Properties to receive on user item update
class UserItemUpdate(UserItemBase):
    borrowed_at: str | None = None
    returned_at: str | None = None
    table_name: str | None = None
    system_name: str | None = None
    item_status: str | None = None


# Database model, database table inferred from class name
class UserItem(UserItemBase, table=True):
    __tablename__ = "user_items"
    user_item_id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.user_id", nullable=False, ondelete="CASCADE")
    item_id: uuid.UUID = Field(foreign_key="items.item_id", nullable=False, ondelete="CASCADE")
    lab_id: uuid.UUID = Field(foreign_key="labs.lab_id", nullable=False, ondelete="CASCADE")
    user: User = Relationship(back_populates="user_items")
    item: Item = Relationship(back_populates="user_items")
    lab: Lab = Relationship(back_populates="user_items")


# Properties to return via API, id is always required
class UserItemPublic(UserItemBase):
    user_item_id: uuid.UUID
    user_id: uuid.UUID
    item_id: uuid.UUID
    lab_id: uuid.UUID


class UserItemsPublic(SQLModel):
    data: list[UserItemPublic]
    count: int


# JWT token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)

class Message(SQLModel):
    message: str
