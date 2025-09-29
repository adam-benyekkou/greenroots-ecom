BEGIN;

-- Suppression des tables existantes
DROP TABLE IF EXISTS payment_transaction;
DROP TABLE IF EXISTS planted_tree;
DROP TABLE IF EXISTS order_line;
DROP TABLE IF EXISTS "order";
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS project_tree;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS tree;
DROP TABLE IF EXISTS localization;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS email_verification_tokens;

CREATE TABLE localization (
    localization_id SERIAL PRIMARY KEY,
    country TEXT NOT NULL,
    continent TEXT NOT NULL
);

CREATE TABLE tree (
    tree_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    localization_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_localization FOREIGN KEY (localization_id) 
        REFERENCES localization(localization_id) 
        ON DELETE RESTRICT
);

CREATE TABLE project_tree (
    project_id INTEGER NOT NULL,
    tree_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, tree_id),
    CONSTRAINT fk_tree FOREIGN KEY (tree_id) 
        REFERENCES tree(tree_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_project FOREIGN KEY (project_id) 
        REFERENCES project(project_id) 
        ON DELETE CASCADE
);

CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone_number TEXT,
    role TEXT CHECK (role IN ('admin', 'client')) DEFAULT 'client',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at DATE DEFAULT CURRENT_DATE,
    updated_at DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES "user"(user_id)
        ON DELETE RESTRICT
);

CREATE TABLE order_line (
    order_line_id SERIAL PRIMARY KEY,
    tree_id INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_tree_order FOREIGN KEY (tree_id)
        REFERENCES tree(tree_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_order FOREIGN KEY (order_id)
        REFERENCES "order"(order_id)
        ON DELETE CASCADE
);

CREATE TABLE planted_tree (
    project_id INTEGER NOT NULL,
    order_line_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, order_line_id),
    CONSTRAINT fk_project_planted FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_order_line FOREIGN KEY (order_line_id)
        REFERENCES order_line(order_line_id)
        ON DELETE CASCADE
);

CREATE TABLE payment_transaction (
    payment_transaction_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    stripe_payment_id TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_payment FOREIGN KEY (order_id)
        REFERENCES "order"(order_id)
        ON DELETE RESTRICT
);

-- Ajout des tables nécessaires à la gestion des rôles et des token password + email - WIP
CREATE TABLE password_reset_tokens (
                                       email TEXT PRIMARY KEY,
                                       token TEXT NOT NULL,
                                       expires_at TIMESTAMPTZ NOT NULL,
                                       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_verification_tokens (
                                           email TEXT PRIMARY KEY,
                                           token TEXT NOT NULL,
                                           created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Création des index pour améliorer les performances
CREATE INDEX idx_project_localization ON project(localization_id);
CREATE INDEX idx_project_tree_tree ON project_tree(tree_id);
CREATE INDEX idx_order_user ON "order"(user_id);
CREATE INDEX idx_order_line_tree ON order_line(tree_id);
CREATE INDEX idx_order_line_order ON order_line(order_id);
CREATE INDEX idx_planted_tree_order_line ON planted_tree(order_line_id);
CREATE INDEX idx_payment_transaction_order ON payment_transaction(order_id);
CREATE INDEX idx_user_email ON "user"(email);

COMMIT;
