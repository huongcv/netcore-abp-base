export const USER_POLICIES = {
    BASE: 'AuthPlugin.User',
    CREATE: 'AuthPlugin.User.Create',
    UPDATE: 'AuthPlugin.User.Update',
    REMOVE: 'AuthPlugin.User.Remove',
    RESET_PASSWORD: 'AuthPlugin.User.ResetPassword',
    ASSIGN_ROLE: 'AuthPlugin.User.AssignRole',
    LOGIN_WITH_ACCOUNT: 'AuthPlugin.User.LoginPasswordless'
} as const;