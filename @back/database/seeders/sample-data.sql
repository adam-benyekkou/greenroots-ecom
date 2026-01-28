INSERT INTO "user" (first_name, last_name, email, password, role) VALUES
('Jean', 'Dupont', 'jean@email.com', '$argon2id$v=19$m=65536,t=3,p=1$48vM+BWMFWxYYzEq5ou6DQ$G+bv1ZAR4jD1atT3htKPVsG+O7qDzmHQ+mLZ8nxg5TE', 'client'),
('Marie', 'Martin', 'marie@email.com', '$argon2id$v=19$m=65536,t=3,p=1$CLey8gljg72Dsc/HJISuPA$TQIR6DvYVyVS5UXhwvF8dHTd4J/uzGGHTkL4GzsMnSM', 'client'),
('Admin', 'Site', 'admin@greenroots.website', '$argon2id$v=19$m=65536,t=3,p=1$3DMAh7YpWf1ukFCctNiZ2g$rdZHJ65A5j/YGfn7jOxNTYmODNxYfRv8pPOz/qmdrNQ', 'admin');

INSERT INTO localization (country, continent) VALUES
('France', 'Europe'),
('Madagascar', 'Africa'),
('Brazil', 'South America'),

-- Critical deforestation zones
('Indonesia', 'Asia'),
('Myanmar', 'Asia'),
('Philippines', 'Asia'),

-- South America (Amazon deforestation)
('Colombia', 'South America'),
('Peru', 'South America'),
('Bolivia', 'South America'),

-- North America (post-fire zones)
('Canada', 'North America'),
('USA', 'North America'),

-- Australia (post-fire zones)
('Australia', 'Oceania'),

-- Europe (degraded zones)
('Romania', 'Europe'),
('Portugal', 'Europe'),

-- Africa (desertification)
('Senegal', 'Africa'),
('Mali', 'Africa');


INSERT INTO tree (name, description, price, image, price_id) VALUES
('Oak', 'The oak is a majestic tree, known for its longevity and lobed leaves. It grows in temperate regions and can reach several tens of meters. Its acorns feed animals and its strong wood is used for construction, furniture, and barrels. It promotes biodiversity and provides shade.', 15.50, '/assets/images/trees/chene.webp', 'price_1SugPMFE6fL5cookFpV4m79S'),
('Baobab', 'The baobab is a majestic tree nicknamed "tree of life". Its massive trunk stores water to survive droughts. Its leaves, fruits, and bark are used in food and traditional medicine. It provides shade, feeds many species, and plays a vital role in the ecosystem.', 25.00, '/assets/images/trees/baobab.webp', 'price_1SugPNFE6fL5cookhucECwmO'),
('Eucalyptus', 'The eucalyptus is a tree native to Australia, known for its rapid growth and aromatic leaves. Its wood is used for construction and paper, while its leaves produce essential oils with medicinal properties. It offers a habitat for wildlife and contributes to biodiversity.', 30.00, '/assets/images/trees/eucalyptus.webp', 'price_1SugPNFE6fL5cookMZSpWoSP'),
('Rosewood', 'Rosewood is a tropical tree renowned for its dense, hard, and colorful wood. Used for furniture, cabinet making, and musical instruments, it stands out for its durability and aesthetics. It also contributes to biodiversity by offering habitat and food to many species.', 45.00, '/assets/images/trees/palissandre.webp', 'price_1SugPOFE6fL5cookiONPRWrN'),

-- Asia (tropical deforestation)
('Dipterocarpus', 'Dipterocarpus is a large tropical tree from Southeast Asia, often dominant in primary forests. Its dense wood is used for construction and furniture, and its resin has medicinal properties. It plays a crucial ecological role by offering food and shelter to many species.', 45.00, '/assets/images/trees/dipterocarpus.webp', 'price_1SugPOFE6fL5cooky4Qpatyf'),
('Burmese Teak', 'Burmese teak is a tropical tree from Southeast Asia, renowned for its dense, resistant, and high-quality wood. Used in shipbuilding, furniture, and decoration, it resists insects and moisture. Its slow growth makes it a precious wood, and it contributes to biodiversity by providing habitat and food for local wildlife.', 38.00, '/assets/images/trees/teck-birman.webp', 'price_1SugPPFE6fL5cookjyL3YFOa'),
('Philippine Narra', 'Philippine Narra is a tropical tree from the Philippines, appreciated for its hard and reddish wood used in furniture and construction. Its fragrant flowers attract pollinators, and it contributes to shade, biodiversity, and the beauty of tropical landscapes.', 42.00, '/assets/images/trees/narratree.webp', 'price_1SugPPFE6fL5cooknn6odHzW'),

-- South America (Amazon)
('Brazilian Mahogany', 'Brazilian mahogany is a tropical tree from South America, renowned for its deep red and durable wood. Used in furniture and instruments, it provides food and shelter for wildlife and plays an important role in the biodiversity of tropical forests.', 55.00, '/assets/images/trees/acajou-bresil.webp', 'price_1SugPQFE6fL5cookSQFgfwmE'),
('Cecropia', 'Cecropia is a tropical tree from Central and South America, with rapid growth and characteristic large leaves. It serves as refuge and food for many animals and contributes to forest regeneration and biodiversity.', 25.00, '/assets/images/trees/cecropia.webp', 'price_1SugPQFE6fL5cookxo0rZnNW'),
('Pau-Brasil', 'Pau-Brasil is a tropical tree from Brazil, famous for its red wood historically used in dyeing and cabinet making. It promotes biodiversity, offers shade and habitat for wildlife, and is now protected due to its scarcity.', 48.00, '/assets/images/trees/pau-brasil.webp', 'price_1SugPRFE6fL5cookYHCjk0pZ'),

-- North America (boreal forest)
('Black Spruce', 'Black spruce is a robust conifer, typical of cold and humid northern regions. With its short, dark green needles and brownish cones, it is easily recognizable. It grows slowly but lives very long, making it an essential tree in boreal forests. Its light but strong wood is widely used for construction, paper, and even musical instruments.', 28.00, '/assets/images/trees/conifer.webp', 'price_1SugPRFE6fL5cookxbQjXLVG'),
('Trembling Aspen', 'Trembling aspen is a fast-growing tree of temperate regions. Its light leaves create a soft rustling in the wind. It provides wood for construction, habitats for wildlife, and helps in soil stabilization.', 22.00, '/assets/images/trees/peuplier-faux-tremble.webp', 'price_1SugPSFE6fL5cookOGWKIAxU'),

-- Australia (bushland)
('Red Gum Eucalyptus', 'Red Gum Eucalyptus is an Australian tree remarkable for its red bark and aromatic leaves. It produces rich resin used in medicine and industry. Its wood is used for construction and furniture, and it offers habitat and food for wildlife while contributing to biodiversity.', 35.00, '/assets/images/trees/eucalyptus-rouge.webp', 'price_1SugPSFE6fL5cookwsf6fP5V'),
('Giant Banksia', 'Giant Banksia is an Australian tree with spectacular flowers and rich nectar. It attracts bees and birds, offers habitat to local wildlife, and its wood is sometimes used for construction or crafts. It plays an ecological role in soil regeneration.', 32.00, '/assets/images/trees/banksia-geant.webp', 'price_1SugPTFE6fL5cookzbjzIh2b'),

-- Europe (degraded forests)
('Romanian Oak', 'Romanian oaks are large, robust, and long-lived trees, with characteristic lobed leaves. Their acorns feed many animals and their strong wood is used for construction and furniture. They offer shade, promote biodiversity, and symbolize strength and longevity.', 30.00, '/assets/images/trees/chene-roumanie.webp', 'price_1SugPTFE6fL5cookoJD8DUZI'),
('Cork Oak', 'Cork oak is a Mediterranean tree known for its thick bark used to make cork. It lives long, provides shade and habitat, contributes to forest biodiversity, and offers strong wood for certain uses.', 40.00, '/assets/images/trees/chene-liege.webp', 'price_1SugPUFE6fL5cookO6QKaA7u'),

-- Africa (Great Green Wall)
('Balanites', 'Balanites is an African tree adapted to arid regions. Its nutritious fruits are used for human and animal food, its wood is used locally, and it provides shade and shelter, while helping to stabilize dry soils.', 20.00, '/assets/images/trees/balanites.webp', 'price_1SugPUFE6fL5cookrJMvke2P'),
('Prosopis', 'Prosopis is a robust tree of arid regions, often called mesquite. It fixes nitrogen in the soil, produces wood and fodder, offers shade and habitat to wildlife, and helps fight erosion in desert or semi-arid zones.', 18.00, '/assets/images/trees/prosopis.webp', 'price_1SugPVFE6fL5cookVx6EV0eh');


INSERT INTO project (localization_id, name, description, image) VALUES
(1, 'Brittany Reforestation', ' The Brittany Reforestation project aims to restore endemic forests and bocages, victims of agricultural intensification and storms. By planting local species and promoting natural regeneration, it acts for the preservation of Breton biodiversity, the fight against erosion, and the return of ecological corridors. The involvement of citizens and farmers makes this project a collective and sustainable approach, essential for the resilience of the territory in the face of new climatic challenges.', '/assets/images/projects/reforestation-bretagne.webp'),
(2, 'Baobab Conservation', 'Baobab conservation aims to protect these iconic trees, essential for the survival of many species and communities in Africa. Threatened by climate change, deforestation, and urbanization, baobabs are replanted and their environment restored through local awareness actions and scientific support. This project promotes the transmission of knowledge, supports agroecology, and ensures the sustainability of these "trees of life" for future generations.', '/assets/images/projects/sauvegarde-baobabs.webp'),
(3, 'Amazon Rainforest', 'The Amazon Rainforest project is dedicated to preserving the "green lung" of the planet against deforestation and unsustainable exploitation. Through the planting of native species, the protection of indigenous lands, and wildlife monitoring, it supports the regeneration of unique ecosystems and the fight against global warming. The engagement of local communities ensures the transmission of knowledge and the continuity of forests, vital for global balance.', '/assets/images/projects/foret-amazonienne.webp'),

-- Asia - critical zones (localization_id 4, 5, 6)
(4, 'Borneo Emergency', 'The Borneo Emergency project aims to rapidly restore tropical forests destroyed by fires and illegal logging in Borneo. Thanks to the replanting of local species and the involvement of populations, the project supports the survival of orangutans and countless threatened species. By restoring soils and recreating habitats, this initiative contributes to preserving the unique biodiversity of Borneo while giving a new breath to riparian communities.', '/assets/images/projects/borneo-emergency.webp'),
(5, 'Myanmar Forest Rescue', 'Myanmar Forest Rescue acts for the preservation of Myanmar''s primary forests, threatened by deforestation and intensive agriculture. The project relies on planting native species, restoring soils, and educating local populations on sustainable practices. This action promotes ecosystem resilience to climate change and preserves biodiversity, essential for the future of local communities and wildlife.', '/assets/images/projects/myanmar-forest-rescue.webp'),
(6, 'Philippines Coral Triangle', 'The Philippines Coral Triangle project is dedicated to restoring coastal vegetation and mangroves to protect the area, vital for marine biodiversity. Planting adapted trees strengthens coasts, improves water quality, and provides refuge for fish and coral. This approach supports fishing communities and plays a key role in fighting erosion, offering a safer future for inhabitants and the marine ecosystem.', '/assets/images/projects/philippines-coral-triangle.webp'),

-- Amazon - Earth lungs (localization_id 7, 8, 9)
(7, 'Colombian Amazon', 'Colombian Amazon aims to restore thousands of hectares of degraded Amazon forest. Through the implantation of native species in collaboration with indigenous communities, the project protects water reserves, local wildlife, and contributes to the fight against global warming. The involvement of inhabitants ensures the sustainability of plantations and allows essential knowledge to be transmitted to future generations.', '/assets/images/projects/amazonie-colombienne.webp'),
(8, 'Andes-Amazon Peru', 'The Andes-Amazon Peru project restores forests between the Andes and the Amazon. Thanks to the planting of adapted species and natural regeneration, it fights erosion, preserves biodiversity, and supports local food security. Rural communities actively participate in plantation management and knowledge transmission to improve the resilience of these strategic ecosystems in the face of climatic challenges.', '/assets/images/projects/andes-amazonie-perou.webp'),
(9, 'Bolivia Biodiversity', 'The Bolivia Biodiversity project protects Bolivia''s unique ecosystems through reforestation and restoration of fragile habitats. By implanting different species, it favors the return of threatened animal and plant species. This approach creates sustainable jobs, raises community awareness, and contributes to the conservation of natural resources, indispensable for the region''s balance and the population''s quality of life.', '/assets/images/projects/bolivie-biodiversite.webp'),

-- North America - warming (localization_id 10, 11)
(10, 'Canadian Boreal Forest', 'The Canadian Boreal Forest is at the heart of an ambitious restoration project to counter the effects of intensive mining and forestry. Replanting local species and restoring the territory''s natural mosaic helps protect the global climate, wildlife (caribou, bears, migratory birds) and guarantee a sustainable heritage for future generations of Canadians.', '/assets/images/projects/foret-boreale-canada.webp'),
(11, 'California Post-Fire', 'The California Post-Fire project supports forest repopulation after destructive megafires. Focusing on planting resilient species, the initiative helps limit erosion, restore the water cycle, and give shelter back to local wildlife. It also relies on population awareness and scientific monitoring to guarantee the survival and balance of zones stricken by fires.', '/assets/images/projects/californie-post-feux.webp'),

-- Australia - climate crisis (localization_id 12)
(12, 'Bushfire Recovery', 'Bushfire Recovery restores landscapes stricken by fires in Oceania. By favoring the replanting of native species, often adapted to fire, the project contributes to forest resilience and the survival of endemic wildlife. The collective action of communities, combined with ecological monitoring, allows progressive soil recovery, thus offering new hope to burned territories.', '/assets/images/projects/bushfire-recovery.webp'),

-- Europe - degradation (localization_id 13, 14)
(13, 'Wild Carpathians', 'The Wild Carpathians project is dedicated to the preservation and restoration of ancient forests in Central Europe. It protects the unique ecological richness of this massif, refuge for rare species like the bear and lynx. Planting varied species and century-old trees helps recreate forest corridors, while involving local populations in sustainable and responsible management of their natural heritage.', '/assets/images/projects/carpates-sauvages.webp'),
(14, 'Portuguese Montado', 'The Portuguese Montado project aims to restore cork oak forests and Mediterranean meadows typical of southern Portugal. By favoring the regeneration of this ecosystem, essential for biodiversity and the rural economy, it fights desertification. Replanting and maintaining local species supports wildlife, cork producers, and ancestral agricultural traditions.', '/assets/images/projects/montado-portugais.webp'),

-- Africa - Great Green Wall (localization_id 15, 16)
(15, 'Green Sahel Senegal', 'Green Sahel Senegal mobilizes to re-green arid lands through reforestation of fragile Sahel zones. The project improves soil fertility, promotes water retention, and revives food crops. By raising awareness and involving local communities, it creates a climate conducive to resilience against drought and offers future generations a more prosperous and healthy environment.', '/assets/images/projects/sahel-vert-senegal.webp'),
(16, 'Mali Reforestation', 'Mali Reforestation gives hope back to desertified regions by restoring forests vital to local life. Through the planting of climate-adapted trees, the project protects soils from erosion, improves water quality, and supports biodiversity. Population involvement guarantees tree maintenance and transmission of good practices, for sustainable resilience against climate change challenges.', '/assets/images/projects/mali-reforestation.webp');


INSERT INTO project_tree (project_id, tree_id) VALUES
-- Reforestation Brittany (France)
(1, 1), -- Oak
(1, 3), -- Eucalyptus

-- Baobab Conservation (Madagascar)
(2, 2), -- Baobab
(2, 4), -- Rosewood

-- Amazon Rainforest (Brazil)
(3, 3), -- Eucalyptus
(3, 4), -- Rosewood

-- Borneo Emergency (project_id 4)
(4, 5), -- Dipterocarpus (tree_id 5)
(4, 6), -- Burmese Teak (tree_id 6)

-- Myanmar Forest Rescue (project_id 5)
(5, 6), -- Burmese Teak (tree_id 6)
(5, 5), -- Dipterocarpus (tree_id 5)

-- Philippines Coral Triangle (project_id 6)
(6, 7), -- Philippine Narra (tree_id 7)

-- Amazon (project_id 7, 8, 9)
(7, 8), -- Brazilian Mahogany (tree_id 8)
(7, 9), -- Cecropia (tree_id 9)
(8, 10), -- Pau-Brasil (tree_id 10)
(8, 9),  -- Cecropia (tree_id 9)
(9, 8),  -- Brazilian Mahogany (tree_id 8)
(9, 10), -- Pau-Brasil (tree_id 10)

-- North America (project_id 10, 11)
(10, 11), -- Black Spruce (tree_id 11)
(10, 12), -- Trembling Aspen (tree_id 12)
(11, 12), -- Trembling Aspen (tree_id 12)
(11, 11), -- Black Spruce (tree_id 11)

-- Australia (project_id 12)
(12, 13), -- Red Gum Eucalyptus (tree_id 13)
(12, 14), -- Giant Banksia (tree_id 14)

-- Europe (project_id 13, 14)
(13, 15), -- Romanian Oak (tree_id 15)
(14, 16), -- Cork Oak (tree_id 16)

-- Africa - Great Green Wall (project_id 15, 16)
(15, 17), -- Balanites (tree_id 17)
(16, 18); -- Prosopis (tree_id 18)


-- Initial Orders
INSERT INTO "order" (user_id, status) VALUES
(1, 'completed'), -- Jean orders
(2, 'processing'); -- Marie orders

-- Initial Order Lines
INSERT INTO order_line (tree_id, order_id, quantity, price) VALUES
-- Jean orders 5 Oaks and 3 Eucalyptuses
(1, 1, 5, 15.50), -- 5 Oaks
(3, 1, 3, 12.00), -- 3 Eucalyptuses

-- Marie orders 2 Baobabs
(2, 2, 2, 25.00); -- 2 Baobabs

-- New orders for new projects (reduced quantities)
INSERT INTO "order" (user_id, status) VALUES
(1, 'completed'),  -- Jean sponsors Amazon
(2, 'completed'),  -- Marie sponsors Borneo
(3, 'processing'); -- Admin tests Africa

-- New Order Lines (adjusted quantities)
INSERT INTO order_line (tree_id, order_id, quantity, price) VALUES
-- Jean sponsors Amazon rainforest (order_id 3)
(8, 3, 5, 55.00),   -- 5 Brazilian Mahoganies
(9, 3, 10, 25.00),  -- 10 Cecropias

-- Marie sponsors Borneo (order_id 4)
(5, 4, 5, 45.00),   -- 5 Dipterocarpus

-- Admin tests Great Green Wall (order_id 5)
(17, 5, 15, 20.00), -- 15 Balanites
(18, 5, 10, 18.00); -- 10 Prosopis

-- Planted Trees
INSERT INTO planted_tree (project_id, order_line_id) VALUES
-- Jean's 5 Oaks planted in Brittany
(1, 1),
-- Jean's 3 Eucalyptuses planted in Amazon
(3, 2),
-- Marie's 2 Baobabs planted in Madagascar
(2, 3),

-- New planted trees
-- Jean's Mahoganies planted in Colombia
(7, 4),
-- Jean's Cecropias planted in Colombia
(7, 5),
-- Marie's Dipterocarpus planted in Borneo
(4, 6),
-- Admin's Balanites planted in Senegal
(15, 7),
-- Admin's Prosopis planted in Mali
(16, 8);

-- Payment Transactions
INSERT INTO payment_transaction (order_id, amount, status, stripe_payment_id) VALUES
(1, 113.50, 'completed', 'pi_1234567890'),   -- Jean initial
(2, 50.00, 'completed', 'pi_0987654321'),    -- Marie initial
(3, 525.00, 'completed', 'pi_amazon_rescue'), -- Jean Amazon
(4, 225.00, 'completed', 'pi_borneo_emergency'), -- Marie Borneo
(5, 480.00, 'completed', 'pi_sahel_green');   -- Admin Sahel
