export const AUTH_USERS = [
  {
    email: 'cliente@lingoshelf.com',
    name: 'Cliente Demo',
    password: 'cliente123',
    role: 'customer',
  },
  {
    email: 'vendedor@lingoshelf.com',
    name: 'Vendedor Demo',
    password: 'vendedor123',
    role: 'seller',
  },
  {
    email: 'admin@lingoshelf.com',
    name: 'Administrador Demo',
    password: 'admin123',
    role: 'admin',
  },
];

export function findAuthUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  return AUTH_USERS.find(
    (user) => user.email === normalizedEmail && user.password === password,
  );
}

export function userEmailExists(email) {
  const normalizedEmail = email.trim().toLowerCase();

  return AUTH_USERS.some((user) => user.email === normalizedEmail);
}

export function createSessionUser(user) {
  return {
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
