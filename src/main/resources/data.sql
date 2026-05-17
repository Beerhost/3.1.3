INSERT INTO roles (id, name)
SELECT 1, 'ROLE_ADMIN'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');

INSERT INTO roles (id, name)
SELECT 2, 'ROLE_USER'
    WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_USER');

INSERT INTO users (username, first_name, last_name, age, password, email)
SELECT  'admin@mail.ru', 'Admin', 'Admin', 35, '$2a$12$t6zkxt2ANFHb.xDMcSYk6O0obaVn79m8L/mhXyPk6qQlfvp4.KsG.', 'admin@mail.ru'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin@mail.ru');

INSERT INTO users (username, first_name, last_name, age, password, email)
SELECT  'user@mail.ru', 'User', 'User', 30, '$2a$12$p/hIMy5l0.FQKuRrUG4.x.Ql8TqLpkgyYUZm7urdknEHonLJ9jJo6', 'user@mail.ru'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user@mail.ru');

INSERT INTO users_roles (user_id, role_id)
SELECT 1, 1 WHERE NOT EXISTS (SELECT 1 FROM users_roles WHERE user_id = 1 AND role_id = 1);

INSERT INTO users_roles(user_id, role_id)
SELECT 1, 2 WHERE NOT EXISTS (SELECT 1 FROM users_roles WHERE user_id = 1 AND role_id = 2);

INSERT INTO users_roles(user_id, role_id)
SELECT 2, 2 WHERE NOT EXISTS (SELECT 1 FROM users_roles WHERE user_id = 2 AND role_id = 2);
