export type Body_login_login_access_token = {
  grant_type?: string | null
  username: string
  password: string
  scope?: string
  client_id?: string | null
  client_secret?: string | null
}

export type HTTPValidationError = {
  detail?: Array<ValidationError>
}

export type ItemCreate = {
  item_name: string
  quantity?: number
  item_img_url?: string | null
  item_vendor?: string | null
  item_params?: string | null
}

export type ItemPublic = {
  item_name: string
  quantity?: number
  item_img_url?: string | null
  item_vendor?: string | null
  item_params?: string | null
  item_id: string
  team_id: string
}

export type ItemUpdate = {
  item_name?: string | null
  quantity?: number
  item_img_url?: string | null
  item_vendor?: string | null
  item_params?: string | null
}

export type ItemsPublic = {
  data: Array<ItemPublic>
  count: number
}

export type Message = {
  message: string
}

export type NewPassword = {
  token: string
  new_password: string
}

export type Token = {
  access_token: string
  token_type?: string
}

export type UpdatePassword = {
  current_password: string
  new_password: string
}

export type UserCreate = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password: string
}

export type UserPublic = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  user_id: string
}

export type UserRegister = {
  email: string
  password: string
  full_name?: string | null
}

export type UserUpdate = {
  email?: string | null
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  password?: string | null
}

export type UserUpdateMe = {
  full_name?: string | null
  email?: string | null
}

export type UsersPublic = {
  data: Array<UserPublic>
  count: number
}

export type ValidationError = {
  loc: Array<string | number>
  msg: string
  type: string
}

export type TeamCreate = {
  team_name?: string | null
}

export type TeamUpdate = {
  team_id: string
  owner_id: string
  team_name?: string | null
}

export type TeamPublic = {
  team_name?: string | null
  team_id: string
  owner_id: string
}

export type TeamsPublic = {
  data: Array<TeamPublic>
  count: number
}

export type UserTeam = {
  user_team_id: string
  user_id: string
  team_id: string
  can_edit_labs?: boolean
  can_edit_items?: boolean
  can_edit_users?: boolean
}

export type UserTeamCreate = {
  email: string
  can_edit_labs?: boolean
  can_edit_items?: boolean
  can_edit_users?: boolean
}

export type UpdateUserTeam = {
  can_edit_labs?: boolean
  can_edit_items?: boolean
  can_edit_users?: boolean
}

export type UserTeamDelete = {
  user_id: string
}

export type UserWithPermissions = {
  email: string
  is_active?: boolean
  is_superuser?: boolean
  full_name?: string | null
  user_id: string
  can_edit_labs?: boolean
  can_edit_items?: boolean
  can_edit_users?: boolean
}

export type LabCreate = {
  lab_place?: string | null
  lab_university?: string | null
  lab_num?: string | null
}

export type LabUpdate = {
  lab_place?: string | null
  lab_university?: string | null
  lab_num?: string | null
}

export type LabPublic = {
  lab_place?: string | null
  lab_university?: string | null
  lab_num?: string | null
  lab_id: string
  owner_id: string
  team_id: string
}

export type LabsPublic = {
  data: Array<LabPublic>
  count: number
}

export type UserItemCreate = {
  borrowed_at: string
  returned_at?: string | null
  table_name?: string | null
  system_name?: string | null
  item_status?: string | null
}

export type UserItemUpdate = {
  borrowed_at?: string | null
  returned_at?: string | null
  table_name?: string | null
  system_name?: string | null
  item_status?: string | null
}

export type UserItemPublic = {
  borrowed_at: string
  returned_at?: string | null
  table_name?: string | null
  system_name?: string | null
  item_status?: string | null
  user_item_id: string
  user_id: string
  item_id: string
  lab_id: string
}

export type UserItemsPublic = {
  data: Array<UserItemPublic>
  count: number
}