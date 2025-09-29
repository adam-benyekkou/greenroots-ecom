INSERT INTO localization (country, continent) VALUES
('France', 'Europe'),
('Madagascar', 'Afrique'),
('Brésil', 'Amérique du Sud');

INSERT INTO tree (name, description, price) VALUES
('Chêne', 'Arbre robuste pour climats tempérés', 15.50),
('Baobab', 'Arbre emblématique de Madagascar', 25.00),
('Eucalyptus', 'Croissance rapide, bon pour reforestation', 12.00),
('Palissandre', 'Bois précieux, espèce protégée', 45.00);

INSERT INTO project (localization_id, name, description) VALUES
(1, 'Reforestation Bretagne', 'Replantation après tempête'),
(2, 'Sauvegarde Baobabs', 'Protection des baobabs centenaires'),
(3, 'Forêt Amazonienne', 'Lutte contre déforestation');

INSERT INTO project_tree (project_id, tree_id) VALUES
-- Projet Reforestation Bretagne (France)
(1, 1), -- Chêne
(1, 3), -- Eucalyptus

-- Projet Sauvegarde Baobabs (Madagascar)
(2, 2), -- Baobab
(2, 4), -- Palissandre

-- Projet Forêt Amazonienne (Brésil)
(3, 3), -- Eucalyptus
(3, 4); -- Palissandre

INSERT INTO "user" (first_name, last_name, email, password, role) VALUES
('Jean', 'Dupont', 'jean@email.com', 'hash123', 'client'),
('Marie', 'Martin', 'marie@email.com', 'hash456', 'client'),
('Admin', 'Site', 'admin@greenroots.com', 'adminHash', 'admin');

INSERT INTO "order" (user_id, status) VALUES
(1, 'completed'), -- Jean commande
(2, 'processing'); -- Marie commande

INSERT INTO order_line (tree_id, order_id, quantity, price) VALUES
-- Jean commande 5 Chênes et 3 Eucalyptus
(1, 1, 5, 15.50), -- 5 Chênes
(3, 1, 3, 12.00), -- 3 Eucalyptus

-- Marie commande 2 Baobabs
(2, 2, 2, 25.00); -- 2 Baobabs

INSERT INTO planted_tree (project_id, order_line_id) VALUES
-- Les 5 Chênes de Jean plantés en Bretagne
(1, 1),

-- Les 3 Eucalyptus de Jean plantés en Amazonie  
(3, 2),

-- Les 2 Baobabs de Marie plantés à Madagascar
(2, 3);

INSERT INTO payment_transaction (order_id, amount, status, stripe_payment_id) VALUES
(1, 113.50, 'completed', 'pi_1234567890'),
(2, 50.00, 'completed', 'pi_0987654321');
