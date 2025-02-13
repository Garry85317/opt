const extraI18nKeyMap: Record<string, string> = {
  // messages in API response
  'Advanced trial': 'Advanced_trial',
  'email not found or password incorrect': 'Email_not_found_or_password_incorrect',
  'User already exists': 'Email_is_exists',

  // breadcrumbs
  users: 'Users',
  editUser: 'Edit_user',
  addUser: 'Add_user',
  devices: 'Devices',
  devicesAdd: 'Add_new_device',
};

export default (message?: string) => {
  if (!message) {
    return message;
  }
  return extraI18nKeyMap[message] || message;
};
