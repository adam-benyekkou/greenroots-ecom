-- Données initiales de base
INSERT INTO localization (country, continent) VALUES
                                                  ('France', 'Europe'),
                                                  ('Madagascar', 'Afrique'),
                                                  ('Brésil', 'Amérique du Sud');

INSERT INTO tree (name, description, price, image) VALUES
                                                       ('Chêne', 'Le chêne est un arbre majestueux, reconnu pour sa longévité et ses feuilles lobées. Il pousse dans les régions tempérées et peut atteindre plusieurs dizaines de mètres. Ses glands nourrissent les animaux et son bois solide sert à la construction, au mobilier et aux tonneaux. Il favorise biodiversité et ombre.', 15.50, '/assets/images/trees/chene.webp'),
                                                       ('Baobab', 'Le baobab est un arbre majestueux surnommé "arbre de vie". Son tronc massif stocke l''eau pour survivre aux sécheresses. Ses feuilles, fruits et écorce sont utilisés en alimentation et médecine traditionnelle. Il fournit de l''ombre, nourrit de nombreuses espèces et joue un rôle vital dans l''écosystème.', 25.00, '/assets/images/trees/baobab.webp'),
                                                       ('Eucalyptus', 'L''eucalyptus est un arbre originaire d''Australie, reconnu pour sa croissance rapide et ses feuilles aromatiques. Son bois sert à la construction et au papier, tandis que ses feuilles produisent des huiles essentielles aux vertus médicinales. Il offre un habitat pour la faune et contribue à la biodiversité.', 30.00, '/assets/images/trees/eucalyptus.webp'),

                                                       ('Palissandre', 'Le palissandre est un arbre tropical réputé pour son bois dense, dur et coloré. Utilisé pour les meubles, l''ébénisterie et les instruments de musique, il se distingue par sa durabilité et son esthétique. Il contribue aussi à la biodiversité en offrant habitat et nourriture à de nombreuses espèces.', 45.00, '/assets/images/trees/palissandre.webp');

INSERT INTO project (localization_id, name, description, image) VALUES
                                                                    (1, 'Reforestation Bretagne', 'Le projet Reforestation Bretagne ambitionne de restaurer les forêts endémiques et bocages, victimes de l''intensification agricole et des tempêtes. Par la plantation d''essences locales et la régénération naturelle, il agit pour la préservation de la biodiversité bretonne, la lutte contre l''érosion et le retour de corridors écologiques. L''implication des citoyens et agriculteurs fait de ce projet une démarche collective et durable, essentielle pour la résilience du territoire face aux nouveaux défis climatiques.', '/assets/images/projects/reforestation-bretagne.webp'),
                                                                    (2, 'Sauvegarde Baobabs', 'La sauvegarde des baobabs vise à protéger ces arbres emblématiques, essentiels à la survie de nombreuses espèces et communautés d''Afrique. Menacés par le changement climatique, la déforestation et l''urbanisation, les baobabs sont replantés et leur environnement restauré grâce à des actions de sensibilisation locale et à l''appui scientifique. Ce projet favorise la transmission des savoirs, soutient l''agroécologie et garantit la pérennité de ces "arbres de vie" pour les générations futures.', '/assets/images/projects/sauvegarde-baobabs.webp'),
                                                                    (3, 'Forêt Amazonienne', 'Le projet Forêt amazonienne s''attache à préserver le "poumon vert" de la planète face à la déforestation et à l''exploitation non durable. À travers la plantation d''essences natives, la protection des terres indigènes et le suivi de la faune, il soutient la régénération d''écosystèmes uniques et la lutte contre le réchauffement climatique. L''engagement des communautés locales assure la transmission des savoirs et la continuité des forêts, vitales pour l''équilibre mondial.', '/assets/images/projects/foret-amazonienne.webp');

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

-- Ajout de localisations en zones menacées
INSERT INTO localization (country, continent) VALUES
-- Zones critiques de déforestation
('Indonésie', 'Asie'),
('Myanmar', 'Asie'),
('Philippines', 'Asie'),

-- Amérique du Sud (déforestation Amazonie)
('Colombie', 'Amérique du Sud'),
('Pérou', 'Amérique du Sud'),
('Bolivie', 'Amérique du Sud'),

-- Amérique du Nord (zones post-incendies)
('Canada', 'Amérique du Nord'),
('États-Unis', 'Amérique du Nord'),

-- Australie (zones post-incendies)
('Australie', 'Océanie'),

-- Europe (zones dégradées)
('Roumanie', 'Europe'),
('Portugal', 'Europe'),

-- Afrique (désertification)
('Sénégal', 'Afrique'),
('Mali', 'Afrique');

-- Arbres pour reforestation (espèces locales menacées)
INSERT INTO tree (name, description, price, image) VALUES
-- Asie (déforestation tropicale)
('Dipterocarpus', 'Le Dipterocarpus est un grand arbre tropical d''Asie du Sud-Est, souvent dominant dans les forêts primaires. Son bois dense est utilisé pour la construction et le mobilier, et sa résine possède des vertus médicinales. Il joue un rôle écologique crucial en offrant nourriture et abri à de nombreuses espèces.', 45.00, '/assets/images/trees/dipterocarpus.webp'),
('Teck birman', 'Le Dipterocarpus est un grand arbre tropical d''Asie du Sud-Est, souvent dominant dans les forêts primaires. Son bois dense est utilisé pour la construction et le mobilier, et sa résine possède des vertus médicinales. Il joue un rôle écologique crucial en offrant nourriture et abri à de nombreuses espèces.', 38.00, '/assets/images/trees/teck-birman.webp'),
('Narra philippin', 'Le Narra philippin est un arbre tropical des Philippines, apprécié pour son bois dur et rougeâtre utilisé en mobilier et construction. Ses fleurs parfumées attirent les pollinisateurs, et il contribue à l''ombre, à la biodiversité et à la beauté des paysages tropicaux.', 42.00, '/assets/images/trees/narratree.webp'),

-- Amérique du Sud (Amazonie)
('Acajou du Brésil', 'L''acajou du Brésil est un arbre tropical d''Amérique du Sud, réputé pour son bois rouge profond et durable. Utilisé en meubles et instruments, il fournit nourriture et abri à la faune et joue un rôle important dans la biodiversité des forêts tropicales.', 55.00, '/assets/images/trees/acajou-bresil.webp'),
('Cecropia', 'Le Cecropia est un arbre tropical d''Amérique centrale et du Sud, à croissance rapide et grandes feuilles caractéristiques. Il sert de refuge et de nourriture pour de nombreux animaux et contribue à la régénération des forêts et à la biodiversité.', 25.00, '/assets/images/trees/cecropia.webp'),
('Pau-brasil', 'Le Pau-brasil est un arbre tropical du Brésil, célèbre pour son bois rouge utilisé historiquement en teinture et ébénisterie. Il favorise la biodiversité, offre de l''ombre et un habitat à la faune, et est aujourd''hui protégé en raison de sa raréfaction.', 48.00, '/assets/images/trees/pau-brasil.webp'),

-- Amérique du Nord (forêt boréale)
('Épinette noire', 'L''épinette noire est un conifère robuste, typique des régions froides et humides du nord. Avec ses aiguilles courtes, vert foncé, et ses cônes brunâtres, elle est facilement reconnaissable. Elle pousse lentement mais vit très longtemps, ce qui en fait un arbre essentiel dans les forêts boréales. Son bois léger mais solide est très utilisé pour la construction, le papier et même les instruments de musique.', 28.00, '/assets/images/trees/conifer.webp'),
('Peuplier faux-tremble', 'Le peuplier faux-tremble est un arbre à croissance rapide des régions tempérées. Ses feuilles légères créent un doux bruissement au vent. Il fournit du bois pour la construction, des habitats pour la faune et aide à la stabilisation des sols.', 22.00, '/assets/images/trees/peuplier-faux-tremble.webp'),

-- Australie (bushland)
('Eucalyptus à gomme rouge', 'L''eucalyptus à gomme rouge est un arbre australien remarquable pour son écorce rouge et ses feuilles aromatiques. Il produit une résine riche utilisée en médecine et industrie. Son bois sert à la construction et au mobilier, et il offre habitat et nourriture à la faune tout en contribuant à la biodiversité.', 35.00, '/assets/images/trees/eucalyptus-rouge.webp'),
('Banksia géant', 'Le Banksia géant est un arbre australien aux fleurs spectaculaires et nectar riche. Il attire abeilles et oiseaux, offre un habitat à la faune locale et son bois sert parfois pour la construction ou l''artisanat. Il joue un rôle écologique dans la régénération des sols.', 32.00, '/assets/images/trees/banksia-geant.webp'),

-- Europe (forêts dégradées)
('Chêne de Roumanie', 'Les chênes de Roumanie sont de grands arbres robustes et longeviques, avec des feuilles lobées caractéristiques. Leurs glands nourrissent de nombreux animaux et leur bois solide sert à la construction et au mobilier. Ils offrent ombre, favorisent la biodiversité et symbolisent force et longévité.', 30.00, '/assets/images/trees/chene-roumanie.webp'),
('Chêne-liège', 'Le chêne-liège est un arbre méditerranéen connu pour son écorce épaisse utilisée pour fabriquer le liège. Il vit longtemps, fournit ombre et habitat, contribue à la biodiversité forestière et offre un bois solide pour certains usages.', 40.00, '/assets/images/trees/chene-liege.webp'),

-- Afrique (Grande Muraille Verte)
('Balanites', 'Le Balanites est un arbre africain adapté aux régions arides. Ses fruits nutritifs servent à l''alimentation humaine et animale, son bois est utilisé localement, et il fournit ombre et abri, tout en aidant à stabiliser les sols secs.', 20.00, '/assets/images/trees/balanites.webp'),
('Prosopis', 'Le Prosopis est un arbre robuste des régions arides, souvent appelé mesquite. Il fixe l''azote dans le sol, produit bois et fourrage, offre ombre et habitat à la faune, et aide à lutter contre l''érosion dans les zones désertiques ou semi-arides.', 18.00, '/assets/images/trees/prosopis.webp');

-- Projets de reforestation urgents
INSERT INTO project (localization_id, name, description, image) VALUES
-- Asie - zones critiques (localization_id 4, 5, 6)
(4, 'Bornéo Emergency', 'Le projet Bornéo Emergency vise à restaurer rapidement les forêts tropicales détruites par les feux et l''exploitation illégale à Bornéo. Grâce à la replantation d''essences locales et à l''implication des populations, le projet soutient la survie des orangs-outans et d''innombrables espèces menacées. En restaurant les sols et en recréant des habitats, cette initiative contribue à préserver la biodiversité unique de Bornéo tout en donnant un nouveau souffle aux communautés riveraines.', '/assets/images/projects/borneo-emergency.webp'),
(5, 'Myanmar Forest Rescue', 'Myanmar Forest Rescue agit pour la préservation des forêts primaires du Myanmar, menacées par la déforestation et l''agriculture intensive. Le projet mise sur la plantation d''espèces indigènes, la restauration des sols et l''éducation des populations locales aux pratiques durables. Cette action favorise la résilience des écosystèmes face aux changements climatiques et préserve la biodiversité, essentielle pour l''avenir des communautés locales et de la faune.', '/assets/images/projects/myanmar-forest-rescue.webp'),
(6, 'Philippines Coral Triangle', 'Le projet Philippines Coral Triangle s''attache à restaurer la végétation littorale et la mangrove pour protéger la zone, vitale pour la biodiversité marine. La plantation d''arbres adaptés renforce les côtes, améliore la qualité de l''eau et assure un refuge aux poissons et coraux. Cette démarche soutient les communautés de pêcheurs et joue un rôle clé dans la lutte contre l''érosion, offrant un avenir plus sûr aux habitants et à l''écosystème marin.', '/assets/images/projects/philippines-coral-triangle.webp'),

-- Amazonie - poumons de la Terre (localization_id 7, 8, 9)
(7, 'Amazonie Colombienne', 'Amazonie colombienne a pour objectif de restaurer des milliers d''hectares de forêt amazonienne dégradée. Par l''implantation d''essences natives en collaboration avec les communautés indigènes, le projet protège les réserves d''eau, la faune locale et contribue à la lutte contre le réchauffement climatique. L''implication des habitants assure la pérennité des plantations et permet de transmettre des connaissances essentielles aux générations futures.', '/assets/images/projects/amazonie-colombienne.webp'),
(8, 'Andes-Amazonie Pérou', 'Le projet Andes-Amazonie Pérou restaure les forêts entre les Andes et l''Amazonie. Grâce à la plantation d''espèces adaptées et à la régénération naturelle, il lutte contre l''érosion, préserve la biodiversité et soutient la sécurité alimentaire locale. Les communautés rurales participent activement à la gestion des plantations et à la transmission des savoirs pour améliorer la résilience de ces écosystèmes stratégiques face aux défis climatiques.', '/assets/images/projects/andes-amazonie-perou.webp'),
(9, 'Bolivie Biodiversité', 'Le projet Bolivie biodiversité protège les écosystèmes uniques de Bolivie à travers la reforestation et la restauration des habitats fragiles. En implantant différentes essences, il favorise le retour des espèces animales et végétales menacées. Cette démarche crée des emplois durables, sensibilise les communautés et contribue à la conservation des ressources naturelles, indispensables à l''équilibre de la région et à la qualité de vie des populations.', '/assets/images/projects/bolivie-biodiversite.webp'),

-- Amérique du Nord - réchauffement (localization_id 10, 11)
(10, 'Forêt Boréale Canada', 'La Forêt boréale Canada est au coeur d''un projet de restauration ambitieux pour contrer les effets des exploitations minières et forestières intensives. Replanter des essences locales et restaurer la mosaïque naturelle du territoire permet de protéger le climat mondial, la faune (caribous, ours, oiseaux migrateurs) et de garantir un patrimoine durable aux futures générations de Canadiens.', '/assets/images/projects/foret-boreale-canada.webp'),
(11, 'Californie Post-Feux', 'Le projet Californie Post-Feux accompagne le repeuplement forestier après les mégafeux destructeurs. En mettant l''accent sur des plantations d''espèces résilientes, l''initiative contribue à limiter l''érosion, restaurer le cycle de l''eau et redonner abri à la faune locale. Elle s''appuie aussi sur la sensibilisation des populations et le suivi scientifique pour garantir la survie et l''équilibre des zones sinistrées par les incendies.', '/assets/images/projects/californie-post-feux.webp'),

-- Australie - crise climatique (localization_id 12)
(12, 'Bushfire Recovery', 'Bushfire Recovery restaure les paysages sinistrés par les incendies en Océanie. En favorisant la replantation d''espèces autochtones, souvent adaptées au feu, le projet contribue à la résilience des forêts et à la survie de la faune endémique. L''action collective des communautés, alliée à la veille écologique, permet une récupération progressive des sols, offrant ainsi un nouvel espoir aux territoires brûlés.', '/assets/images/projects/bushfire-recovery.webp'),

-- Europe - dégradation (localization_id 13, 14)
(13, 'Carpates Sauvages', 'Le projet Carpates sauvages se consacre à la préservation et à la restauration des forêts anciennes d''Europe centrale. Il protège la richesse écologique unique de ce massif, refuge d''espèces rares comme l''ours et le lynx. La plantation d''essences variées et d''arbres centenaires permet de recréer des corridors forestiers, tout en impliquant les populations locales dans une gestion durable et responsable de leur héritage naturel.', '/assets/images/projects/carpates-sauvages.webp'),
(14, 'Montado Portugais', 'Le projet Montado portugais vise à restaurer les forêts de chênes-lièges et les prairies méditerranéennes typiques du sud du Portugal. En favorisant la régénération de cet écosystème, essentiel à la biodiversité et à l''économie rurale, il lutte contre la désertification. La replantation et l''entretien d''espèces locales soutiennent la faune, les producteurs de liège et les traditions agricoles ancestrales.', '/assets/images/projects/montado-portugais.webp'),

-- Afrique - Grande Muraille Verte (localization_id 15, 16)
(15, 'Sahel Vert Sénégal', 'Sahel vert Sénégal se mobilise pour reverdir les terres arides à travers la reforestation de zones fragiles du Sahel. Le projet améliore la fertilité des sols, favorise la rétention d''eau et redonne vie aux cultures vivrières. En sensibilisant et impliquant les communautés locales, il crée un climat propice à la résilience face à la sécheresse et offre aux générations futures un environnement plus prospère et sain.', '/assets/images/projects/sahel-vert-senegal.webp'),
(16, 'Mali Reforestation', 'Mali reforestation redonne espoir aux régions désertifiées en restaurant des forêts vitales à la vie locale. Par la plantation d''arbres adaptés au climat, le projet protège les sols de l''érosion, améliore la qualité de l''eau et soutient la biodiversité. L''implication des populations garantit l''entretien des arbres et la transmission des bonnes pratiques, pour une résilience durable face aux défis du changement climatique.', '/assets/images/projects/mali-reforestation.webp');

-- Associations arbres/projets (espèces natives)
INSERT INTO project_tree (project_id, tree_id) VALUES
-- Bornéo Emergency (project_id 4)
(4, 5), -- Dipterocarpus (tree_id 5)
(4, 6), -- Teck birman (tree_id 6)

-- Myanmar Forest Rescue (project_id 5)
(5, 6), -- Teck birman (tree_id 6)
(5, 5), -- Dipterocarpus (tree_id 5)

-- Philippines Coral Triangle (project_id 6)
(6, 7), -- Narra philippin (tree_id 7)

-- Amazonie (project_id 7, 8, 9)
(7, 8), -- Acajou du Brésil (tree_id 8)
(7, 9), -- Cecropia (tree_id 9)
(8, 10), -- Pau-brasil (tree_id 10)
(8, 9),  -- Cecropia (tree_id 9)
(9, 8),  -- Acajou du Brésil (tree_id 8)
(9, 10), -- Pau-brasil (tree_id 10)

-- Amérique du Nord (project_id 10, 11)
(10, 11), -- Épinette noire (tree_id 11)
(10, 12), -- Peuplier faux-tremble (tree_id 12)
(11, 12), -- Peuplier faux-tremble (tree_id 12)
(11, 11), -- Épinette noire (tree_id 11)

-- Australie (project_id 12)
(12, 13), -- Eucalyptus à gomme rouge (tree_id 13)
(12, 14), -- Banksia géant (tree_id 14)

-- Europe (project_id 13, 14)
(13, 15), -- Chêne de Roumanie (tree_id 15)
(14, 16), -- Chêne-liège (tree_id 16)

-- Afrique - Grande Muraille Verte (project_id 15, 16)
(15, 17), -- Balanites (tree_id 17)
(16, 18); -- Prosopis (tree_id 18)

-- Utilisateurs
INSERT INTO "user" (first_name, last_name, email, password, role) VALUES
                                                                      ('Jean', 'Dupont', 'jean@email.com', '$argon2id$v=19$m=65536,t=3,p=1$1HIoF7YCPsoHyjzE4agNHg$LLGk5Biamg27yNsOB1hWHI6dEDuQ/1/lDJ4eHfprSkc', 'client'),
                                                                      ('Marie', 'Martin', 'marie@email.com', '$argon2id$v=19$m=65536,t=3,p=1$e8WVMjdaA2uAT5Pa5fFY3g$aVEO/Omm9Ys66tRyHkwWUAbvLGtfoYzb6SihrHBai+U', 'client'),
                                                                      ('Admin', 'Site', 'admin@greenroots.com', '$argon2id$v=19$m=65536,t=3,p=1$tl7lNazgFnTcJ8wNW2czzQ$3OrHdmOj+kV4L+UQw74EqI5Zj+1MoP7Qy3d5fZLw65Y', 'admin');

-- Commandes initiales
INSERT INTO "order" (user_id, status) VALUES
                                          (1, 'completed'), -- Jean commande
                                          (2, 'processing'); -- Marie commande

-- Lignes de commande initiales
INSERT INTO order_line (tree_id, order_id, quantity, price) VALUES
-- Jean commande 5 Chênes et 3 Eucalyptus
(1, 1, 5, 15.50), -- 5 Chênes
(3, 1, 3, 12.00), -- 3 Eucalyptus

-- Marie commande 2 Baobabs
(2, 2, 2, 25.00); -- 2 Baobabs

-- Nouvelles commandes pour les nouveaux projets (quantités réduites)
INSERT INTO "order" (user_id, status) VALUES
                                          (1, 'completed'),  -- Jean parraine Amazonie
                                          (2, 'completed'),  -- Marie parraine Bornéo
                                          (3, 'processing'); -- Admin teste Afrique

-- Nouvelles lignes de commande (quantités ajustées)
INSERT INTO order_line (tree_id, order_id, quantity, price) VALUES
-- Jean parraine forêt amazonienne (order_id 3) - quantités réduites
(8, 3, 5, 55.00),   -- 5 Acajous Amazonie (au lieu de 10)
(9, 3, 10, 25.00),  -- 10 Cecropia régénération (au lieu de 20)

-- Marie parraine Bornéo (order_id 4)
(5, 4, 5, 45.00),   -- 5 Dipterocarpus géants

-- Admin teste Grande Muraille Verte (order_id 5) - quantités réduites
(17, 5, 15, 20.00), -- 15 Balanites Sahel (au lieu de 25)
(18, 5, 10, 18.00); -- 10 Prosopis (au lieu de 15)

-- Arbres plantés
INSERT INTO planted_tree (project_id, order_line_id) VALUES
-- Les 5 Chênes de Jean plantés en Bretagne
(1, 1),
-- Les 3 Eucalyptus de Jean plantés en Amazonie
(3, 2),
-- Les 2 Baobabs de Marie plantés à Madagascar
(2, 3),

-- Nouveaux plantés
-- Acajous de Jean plantés en Colombie
(7, 4),
-- Cecropia de Jean plantés en Colombie
(7, 5),
-- Dipterocarpus de Marie plantés à Bornéo
(4, 6),
-- Balanites d''Admin plantés au Sénégal
(15, 7),
-- Prosopis d''Admin plantés au Mali
(16, 8);

-- Transactions de paiement (montants corrigés pour respecter NUMERIC(5,2))
INSERT INTO payment_transaction (order_id, amount, status, stripe_payment_id) VALUES
                                                                                  (1, 113.50, 'completed', 'pi_1234567890'),   -- Jean initial: (5*15.50) + (3*12.00) = 77.50 + 36.00 = 113.50
                                                                                  (2, 50.00, 'completed', 'pi_0987654321'),    -- Marie initial: 2*25.00 = 50.00
                                                                                  (3, 525.00, 'completed', 'pi_amazon_rescue'), -- Jean Amazonie: (5*55) + (10*25) = 275 + 250 = 525.00
                                                                                  (4, 225.00, 'completed', 'pi_borneo_emergency'), -- Marie Bornéo: 5*45 = 225.00
                                                                                  (5, 480.00, 'completed', 'pi_sahel_green');   -- Admin Sahel: (15*20) + (10*18) = 300 + 180 = 480.00