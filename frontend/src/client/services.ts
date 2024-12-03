import type { CancelablePromise } from "./core/CancelablePromise"
import { OpenAPI } from "./core/OpenAPI"
import { request as __request } from "./core/request"

import type {
  Body_login_login_access_token,
  Message,
  NewPassword,
  Token,
  UserPublic,
  UpdatePassword,
  UserCreate,
  UserRegister,
  UsersPublic,
  UserUpdate,
  UserUpdateMe,
  ItemCreate,
  ItemPublic,
  ItemsPublic,
  ItemUpdate,
  TeamCreate,
  TeamPublic,
  TeamsPublic,
  TeamUpdate,
  UserTeamCreate,
  UserWithPermissions,
  UpdateUserTeam,
  LabCreate,
  LabPublic,
  LabsPublic,
  LabUpdate,
  UserItemCreate,
  UserItemPublic,
  UserItemsPublic,
  UserItemUpdate,
} from "./models"

export type TDataLoginAccessToken = {
  formData: Body_login_login_access_token
}
export type TDataRecoverPassword = {
  email: string
}
export type TDataResetPassword = {
  requestBody: NewPassword
}
export type TDataRecoverPasswordHtmlContent = {
  email: string
}

export class LoginService {
  /**
   * Login Access Token
   * OAuth2 compatible token login, get an access token for future requests
   * @returns Token Successful Response
   * @throws ApiError
   */
  public static loginAccessToken(
    data: TDataLoginAccessToken,
  ): CancelablePromise<Token> {
    const { formData } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/access-token",
      formData: formData,
      mediaType: "application/x-www-form-urlencoded",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Test Token
   * Test access token
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static testToken(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/login/test-token",
    })
  }

  /**
   * Recover Password
   * Password Recovery
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static recoverPassword(
    data: TDataRecoverPassword,
  ): CancelablePromise<Message> {
    const { email } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/password-recovery/{email}",
      path: {
        email,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Reset Password
   * Reset password
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static resetPassword(
    data: TDataResetPassword,
  ): CancelablePromise<Message> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/reset-password/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Recover Password Html Content
   * HTML Content for Password Recovery
   * @returns string Successful Response
   * @throws ApiError
   */
  public static recoverPasswordHtmlContent(
    data: TDataRecoverPasswordHtmlContent,
  ): CancelablePromise<string> {
    const { email } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/password-recovery-html-content/{email}",
      path: {
        email,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataReadUsers = {
  limit?: number
  skip?: number
}
export type TDataCreateUser = {
  requestBody: UserCreate
}
export type TDataUpdateUserMe = {
  requestBody: UserUpdateMe
}
export type TDataUpdatePasswordMe = {
  requestBody: UpdatePassword
}
export type TDataRegisterUser = {
  requestBody: UserRegister
}
export type TDataReadUserById = {
  user_id: string
}
export type TDataUpdateUser = {
  requestBody: UserUpdate
  user_id: string
}
export type TDataDeleteUser = {
  user_id: string
}

export class UsersService {
  /**
   * Read Users
   * Retrieve users.
   * @returns UsersPublic Successful Response
   * @throws ApiError
   */
  public static readUsers(
    data: TDataReadUsers = {},
  ): CancelablePromise<UsersPublic> {
    const { limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Create User
   * Create new user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static createUser(
    data: TDataCreateUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read User Me
   * Get current user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserMe(): CancelablePromise<UserPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/me",
    })
  }

  /**
   * Delete User Me
   * Delete own user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUserMe(): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/me",
    })
  }

  /**
   * Update User Me
   * Update own user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUserMe(
    data: TDataUpdateUserMe,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update Password Me
   * Update own password.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static updatePasswordMe(
    data: TDataUpdatePasswordMe,
  ): CancelablePromise<Message> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/me/password",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Register User
   * Create new user without the need to be logged in.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static registerUser(
    data: TDataRegisterUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/users/signup",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read User By Id
   * Get a specific user by id.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static readUserById(
    data: TDataReadUserById,
  ): CancelablePromise<UserPublic> {
    const { user_id } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update User
   * Update a user.
   * @returns UserPublic Successful Response
   * @throws ApiError
   */
  public static updateUser(
    data: TDataUpdateUser,
  ): CancelablePromise<UserPublic> {
    const { requestBody, user_id } = data
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Delete User
   * Delete a user.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUser(data: TDataDeleteUser): CancelablePromise<Message> {
    const { user_id } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/users/{user_id}",
      path: {
        user_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataTestEmail = {
  emailTo: string
}

export class UtilsService {
  /**
   * Test Email
   * Test emails.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static testEmail(data: TDataTestEmail): CancelablePromise<Message> {
    const { emailTo } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/utils/test-email/",
      query: {
        email_to: emailTo,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Health Check
   * @returns boolean Successful Response
   * @throws ApiError
   */
  public static healthCheck(): CancelablePromise<boolean> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/utils/health-check/",
    })
  }
}

export type TDataReadItems = {
  limit?: number
  skip?: number
}
export type TDataCreateItem = {
  requestBody: ItemCreate
}
export type TDataReadItem = {
  item_id: string
}
export type TDataUpdateItem = {
  item_id: string
  requestBody: ItemUpdate
}
export type TDataDeleteItem = {
  item_id: string
  team_id: string
}

export class ItemsService {
  /**
   * Read Items
   * Retrieve items.
   * @returns ItemsPublic Successful Response
   * @throws ApiError
   */
  public static readItems(
    data: TDataReadItems = {},
  ): CancelablePromise<ItemsPublic> {
    const { limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Create Item
   * Create new item.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static createItem(
    data: TDataCreateItem,
  ): CancelablePromise<ItemPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/items/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read Item
   * Get item by ID.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static readItem(data: TDataReadItem): CancelablePromise<ItemPublic> {
    const { item_id } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/items/{item_id}",
      path: {
        item_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update Item
   * Update an item.
   * @returns ItemPublic Successful Response
   * @throws ApiError
   */
  public static updateItem(
    data: TDataUpdateItem,
  ): CancelablePromise<ItemPublic> {
    const { item_id, requestBody } = data
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/items/{item_id}",
      path: {
        item_id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Delete Item
   * Delete an item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteItem(data: TDataDeleteItem): CancelablePromise<Message> {
    const { item_id, team_id } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/items/{item_id}",
      path: {
        item_id,
        team_id
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataReadTeams = {
  limit?: number
  skip?: number
}
export type TDataCreateTeam = {
  requestBody: TeamCreate
}
export type TDataReadTeam = {
  team_id: string
}
export type TDataUpdateTeam = {
  team_id: string
  requestBody: TeamUpdate
}
export type TDataDeleteTeam = {
  team_id: string
}

export class TeamsService {
  /**
   * Read Teams
   * Retrieve teams.
   * @returns TeamsPublic Successful Response
   * @throws ApiError
   */
  public static readTeams(
    data: TDataReadTeams = {},
  ): CancelablePromise<TeamsPublic> {
    const { limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/teams/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Create Team
   * Create new team.
   * @returns TeamPublic Successful Response
   * @throws ApiError
   */
  public static createTeam(
    data: TDataCreateTeam,
  ): CancelablePromise<TeamPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/teams/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read Team
   * Get team by ID.
   * @returns TeamPublic Successful Response
   * @throws ApiError
   */
  public static readTeam(data: TDataReadTeam): CancelablePromise<TeamPublic> {
    const { team_id } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/teams/{team_id}",
      path: {
        team_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update Team
   * Update a team.
   * @returns TeamPublic Successful Response
   * @throws ApiError
   */
  public static updateTeam(
    data: TDataUpdateTeam,
  ): CancelablePromise<TeamPublic> {
    const { team_id, requestBody } = data
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/teams/{team_id}",
      path: {
        team_id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Delete Team
   * Delete a team.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteTeam(data: TDataDeleteTeam): CancelablePromise<Message> {
    const { team_id } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/teams/{team_id}",
      path: {
        team_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataCreateUserTeam = {
  team_id: string;
  requestBody: UserTeamCreate;
};

export type TDataUpdateUserTeam = {
  team_id: string;
  user_id: string;
  requestBody: UpdateUserTeam;
};

export type TDataDeleteUserTeam = {
  team_id: string;
  user_id: string;
};

export class UserTeamsService {
  /**
   * Create User Team
   * Create new user team.
   * @returns UserWithPermissions Successful Response
   * @throws ApiError
   */
  public static createUserTeam(
    data: TDataCreateUserTeam,
  ): CancelablePromise<UserWithPermissions> {
    const { team_id, requestBody } = data;
    return __request(OpenAPI, {
      method: "POST",
      url: `/api/v1/teams/{team_id}/add-users`,
      path: {
        team_id
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update User Team
   * Update a user team.
   * @returns UserWithPermissions Successful Response
   * @throws ApiError
   */
  public static updateUserTeam(
    data: TDataUpdateUserTeam,
  ): CancelablePromise<UserWithPermissions> {
    const { team_id, user_id, requestBody } = data;
    return __request(OpenAPI, {
      method: "PUT",
      url: `/api/v1/teams/{team_id}/users/{user_id}/update-permissions`,
      path: {
        team_id,
        user_id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete User Team
   * Delete a user team.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUserTeam(
    data: TDataDeleteUserTeam,
  ): CancelablePromise<Message> {
    const { team_id, user_id } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/teams/{team_id}/users/{user_id}/remove-user",
      path: {
        team_id,
        user_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataReadLabs = {
  limit?: number
  skip?: number
}
export type TDataCreateLab = {
  requestBody: LabCreate
}
export type TDataReadLab = {
  lab_id: string
}
export type TDataUpdateLab = {
  lab_id: string
  requestBody: LabUpdate
}
export type TDataDeleteLab = {
  lab_id: string
}

export class LabsService {
  /**
   * Read Labs
   * Retrieve labs.
   * @returns LabsPublic Successful Response
   * @throws ApiError
   */
  public static readLabs(
    data: TDataReadLabs = {},
  ): CancelablePromise<LabsPublic> {
    const { limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/labs/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Create Lab
   * Create new lab.
   * @returns LabPublic Successful Response
   * @throws ApiError
   */
  public static createLab(
    data: TDataCreateLab,
  ): CancelablePromise<LabPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/labs/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read Lab
   * Get lab by ID.
   * @returns LabPublic Successful Response
   * @throws ApiError
   */
  public static readLab(data: TDataReadLab): CancelablePromise<LabPublic> {
    const { lab_id } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/labs/{lab_id}",
      path: {
        lab_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update Lab
   * Update a lab.
   * @returns LabPublic Successful Response
   * @throws ApiError
   */
  public static updateLab(
    data: TDataUpdateLab,
  ): CancelablePromise<LabPublic> {
    const { lab_id, requestBody } = data
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/labs/{lab_id}",
      path: {
        lab_id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Delete Lab
   * Delete a lab.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteLab(data: TDataDeleteLab): CancelablePromise<Message> {
    const { lab_id } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/labs/{lab_id}",
      path: {
        lab_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}

export type TDataReadUserItems = {
  limit?: number
  skip?: number
}
export type TDataCreateUserItem = {
  requestBody: UserItemCreate
}
export type TDataReadUserItem = {
  user_item_id: string
}
export type TDataUpdateUserItem = {
  user_item_id: string
  requestBody: UserItemUpdate
}
export type TDataDeleteUserItem = {
  user_item_id: string
}

export class UserItemsService {
  /**
   * Read User Items
   * Retrieve user items.
   * @returns UserItemsPublic Successful Response
   * @throws ApiError
   */
  public static readUserItems(
    data: TDataReadUserItems = {},
  ): CancelablePromise<UserItemsPublic> {
    const { limit = 100, skip = 0 } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/user-items/",
      query: {
        skip,
        limit,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Create User Item
   * Create new user item.
   * @returns UserItemPublic Successful Response
   * @throws ApiError
   */
  public static createUserItem(
    data: TDataCreateUserItem,
  ): CancelablePromise<UserItemPublic> {
    const { requestBody } = data
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/user-items/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Read User Item
   * Get user item by ID.
   * @returns UserItemPublic Successful Response
   * @throws ApiError
   */
  public static readUserItem(
    data: TDataReadUserItem,
  ): CancelablePromise<UserItemPublic> {
    const { user_item_id } = data
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/user-items/{user_item_id}",
      path: {
        user_item_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Update User Item
   * Update a user item.
   * @returns UserItemPublic Successful Response
   * @throws ApiError
   */
  public static updateUserItem(
    data: TDataUpdateUserItem,
  ): CancelablePromise<UserItemPublic> {
    const { user_item_id, requestBody } = data
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/user-items/{user_item_id}",
      path: {
        user_item_id,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    })
  }

  /**
   * Delete User Item
   * Delete a user item.
   * @returns Message Successful Response
   * @throws ApiError
   */
  public static deleteUserItem(
    data: TDataDeleteUserItem,
  ): CancelablePromise<Message> {
    const { user_item_id } = data
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/user-items/{user_item_id}",
      path: {
        user_item_id,
      },
      errors: {
        422: `Validation Error`,
      },
    })
  }
}