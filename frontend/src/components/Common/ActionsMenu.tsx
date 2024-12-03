import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FiEdit, FiTrash } from "react-icons/fi"

import type { ItemPublic, TeamPublic, UserPublic, UserTeam } from "../../client"
import EditUser from "../Admin/EditUser"
import EditItem from "../Items/EditItem"
import EditTeam from "../Teams/EditTeam"
import EditUserTeam from "../UserTeam/EditUserTeam"
import Delete from "./DeleteAlert"

interface ActionsMenuProps {
  type: string
  value: ItemPublic | UserPublic | TeamPublic | UserTeam
  disabled?: boolean
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const editUserModal = useDisclosure()
  const deleteModal = useDisclosure()

  const getId = (value: UserPublic | ItemPublic | TeamPublic | UserTeam ) => {
    if (type === "User") {
      return { user_id: (value as UserPublic).user_id };
    } else if (type === "Item") {
      return {
        team_id: (value as ItemPublic).team_id,
        item_id: (value as ItemPublic).item_id,
      };
    } else if (type === "Team") {
      return { team_id: (value as TeamPublic).team_id };
    } else if (type === "UserTeam") {
      return {
        team_id: (value as UserTeam).team_id,
        user_id: (value as UserTeam).user_id,
      };
    }
    return {};
  };

  const getPermissions = (value: UserTeam) => {
    return {
      can_edit_items: value.can_edit_items,
      can_edit_lab: value.can_edit_labs,
      can_edit_users: value.can_edit_users,
    };
  };

  const ids = getId(value);
  const permissions = type === "UserTeam" ? getPermissions(value as UserTeam) : {};

  return (
    <>
      <Menu>
        <MenuButton
          isDisabled={disabled}
          as={Button}
          rightIcon={<BsThreeDotsVertical />}
          variant="unstyled"
        />
        <MenuList>
          <MenuItem
            onClick={editUserModal.onOpen}
            icon={<FiEdit fontSize="16px" />}
          >
            Edit {type}
          </MenuItem>
          <MenuItem
            onClick={deleteModal.onOpen}
            icon={<FiTrash fontSize="16px" />}
            color="ui.danger"
          >
            Delete {type}
          </MenuItem>
        </MenuList>
        {type === "User" ? (
          <EditUser
            user={value as UserPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        ) : type === "Item" ? (
          <EditItem
            item={value as ItemPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        ) : type === "Team" ? (
          <EditTeam
            team={value as TeamPublic}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        ) : type === "UserTeam" ? (
          <EditUserTeam
            userteam={value as UserTeam}
            initialPermissions={permissions}
            isOpen={editUserModal.isOpen}
            onClose={editUserModal.onClose}
          />
        ) : null}
        <Delete
          type={type}
          user_id={ids.user_id}
          team_id={ids.team_id}
          item_id={ids.item_id}
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.onClose}
        />
      </Menu>
    </>
  )
}

export default ActionsMenu
