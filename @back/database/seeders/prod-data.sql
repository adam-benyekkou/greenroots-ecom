INSERT INTO localization (country, continent) VALUES
                                                  ('France', 'Europe'),
                                                  ('Madagascar', 'Afrique'),
                                                  ('Brésil', 'Amérique du Sud'),

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


INSERT INTO tree (name, description, price, image) VALUES
                                                       ('Chêne', 'Le chêne est un arbre majestueux, reconnu pour sa longévité et ses feuilles lobées. Il pousse dans les régions tempérées et peut atteindre plusieurs dizaines de mètres. Ses glands nourrissent les animaux et son bois solide sert à la construction, au mobilier et aux tonneaux. Il favorise biodiversité et ombre.', 15.50, '/assets/images/trees/chene.webp'),
                                                       ('Baobab', 'Le baobab est un arbre majestueux surnommé "arbre de vie". Son tronc massif stocke l''eau pour survivre aux sécheresses. Ses feuilles, fruits et écorce sont utilisés en alimentation et médecine traditionnelle. Il fournit de l''ombre, nourrit de nombreuses espèces et joue un rôle vital dans l''écosystème.', 25.00, '/assets/images/trees/baobab.webp'),
                                                       ('Eucalyptus', 'L''eucalyptus est un arbre originaire d''Australie, reconnu pour sa croissance rapide et ses feuilles aromatiques. Son bois sert à la construction et au papier, tandis que ses feuilles produisent des huiles essentielles aux vertus médicinales. Il offre un habitat pour la faune et contribue à la biodiversité.', 30.00, '/assets/images/trees/eucalyptus.webp'),
                                                       ('Palissandre', 'Le palissandre est un arbre tropical réputé pour son bois dense, dur et coloré. Utilisé pour les meubles, l''ébénisterie et les instruments de musique, il se distingue par sa durabilité et son esthétique. Il contribue aussi à la biodiversité en offrant habitat et nourriture à de nombreuses espèces.', 45.00, '/assets/images/trees/palissandre.webp'),

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

INSERT INTO project (localization_id, name, description) VALUES
                                                             (1, 'Reforestation Bretagne', 'Replantation après tempête'),
                                                             (2, 'Sauvegarde Baobabs', 'Protection des baobabs centenaires'),
                                                             (3, 'Forêt Amazonienne', 'Lutte contre déforestation'),

-- Asie - zones critiques (localization_id 4, 5, 6)
                                                             (4, 'Bornéo Emergency', 'Restauration urgente après huile de palme'),
                                                             (5, 'Myanmar Forest Rescue', 'Reboisement zones d''exploitation illégale'),
                                                             (6, 'Philippines Coral Triangle', 'Mangroves protection récifs coralliens'),

-- Amazonie - poumons de la Terre (localization_id 7, 8, 9)
                                                             (7, 'Amazonie Colombienne', 'Corridor biologique post-déforestation'),
                                                             (8, 'Andes-Amazonie Pérou', 'Transition montagne-forêt tropicale'),
                                                             (9, 'Bolivie Biodiversité', 'Hotspot mondial de biodiversité'),

-- Amérique du Nord - réchauffement (localization_id 10, 11)
                                                             (10, 'Forêt Boréale Canada', 'Adaptation changement climatique'),
                                                             (11, 'Californie Post-Feux', 'Régénération après méga-incendies'),

-- Australie - crise climatique (localization_id 12)
                                                             (12, 'Bushfire Recovery', 'Restauration écosystèmes post-incendies'),

-- Europe - dégradation (localization_id 13, 14)
                                                             (13, 'Carpates Sauvages', 'Dernière forêt primaire d''Europe'),
                                                             (14, 'Montado Portugais', 'Système agroforestier traditionnel'),

-- Afrique - Grande Muraille Verte (localization_id 15, 16)
                                                             (15, 'Sahel Vert Sénégal', 'Barrage anti-désertification'),
                                                             (16, 'Mali Reforestation', 'Corridor vert transsaharien');

INSERT INTO project_tree (project_id, tree_id) VALUES
-- Reforestation Bretagne (France)
(1, 1), -- Chêne
(1, 3), -- Eucalyptus

-- Sauvegarde Baobabs (Madagascar)
(2, 2), -- Baobab
(2, 4), -- Palissandre

-- Forêt Amazonienne (Brésil)
(3, 3), -- Eucalyptus
(3, 4), -- Palissandre

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