## Entité Tree

| Nom de données | Description | Type de données | Format | Taille | Contraintes | Relation | Usage et contexte d'utilisation |
|---|---|---|---|---|---|---|---|
| Tree_ID | Identifiant unique de l'arbre | Numérique | | | Clé primaire | Project_ID (clé étrangère) | Identification de l'arbre dans la BDD |
| Name | Nom de l'arbre | Texte | | 50 caractères | | | Identification et affichage du nom de l'arbre |
| Description | Description | Texte | | 250 caractères | | | Décrire l'arbre |
| Price | Prix total TTC | Numérique | | | | | Calcul du prix total d'une future commande |
| Image | Illustration de l'arbre | Texte | Url | | | | Identification et affichage l'image de l'arbre |

## Entité Project

| Nom de données | Description | Type de données | Format | Taille | Contraintes | Relation | Usage et contexte d'utilisation |
|---|---|---|---|---|---|---|---|
| Project_ID | Identifiant unique du projet | Numérique | | | Clé primaire | Tree_ID et Planted_tree (clés étrangères) | Identification du projet dans la BDD |
| Name | Nom de la zone de plantation du projet | Texte | | 100 caractères | | | Identification et affichage du projet |
| Description | Courte description du projet | Texte | | ? | | | Courte description du projet |
| Image | Illustration du projet | Texte | Url | | | | Affichage de l'image du projet |

## Entité Localisation

| Nom de données | Description | Type de données | Format | Taille | Contraintes | Relation | Usage et contexte d'utilisation |
|---|---|---|---|---|---|---|---|
| Localisation_ID | Identifiant unique de la localisation | Numérique | | | Clé primaire | Project_ID (clé étrangère) | Identification et affichage de la localisation dans la BDD |
| Country | Nom du pays | Texte | | 30 caractères | | | Affichage du nom du pays lié à un ou des projets |
| Continent | Nom du continent | Texte | | 20 caractères | | | Affichage du continent lié à un ou des projets |

## Entité Order Line

| Nom de données | Description | Type de données | Format | Taille | Contraintes | Relation | Usage et contexte d'utilisation |
|---|---|---|---|---|---|---|---|
| Order line_ID | Identifiant unique de la ligne de commande | Numérique | | | Clé primaire | Order_ID, Tree_ID, Planted_ID (clés étrangères) | Identification et affichage de la ligne de commande de la mise en panier à la validation de la commande |
| Quantity | Quantité choisie de l'arbre sélectionné | Numérique | | | | | Indication et affichage du nombre d'arbres dans la ligne de commande |
| Price | Prix unitaire de l'arbre sélectionné | Numérique | | | | | Indication et affichage du prix unitaire de l'arbre de la ligne de commande |

## Entité Order

| Nom de données | Description | Type de données | Format | Taille | Contraintes | Relation | Usage et contexte d'utilisation |
|---|---|---|---|---|---|---|---|
| Order_ID | Identifiant unique de la commande | Numérique | | | Clé primaire | Order-line_ID, User_ID | Identification et affichage de la commande |
| Status | Statut de la commande (panier, plantée (livrée), en attente de paiement, en cours de livraison) | Texte | | | | | Indiquer, afficher et suivre le statut de la commande |
| Date | Date du passage au statut en cours | Texte | Timestampz | | | | Indiquer et afficher la date du passage au statut en cours |

## Entité User

| Nom de données | Description | Type de données | Format | Taille | Contraintes | Relation | Usage et contexte d'utilisation |
|---|---|---|---|---|---|---|---|
| User_ID | Identifiant unique de l'utilisateur | Numérique | | | Clé primaire | Order_ID | Identification et affichage de l'utilisateur |
| Last_name | Nom de famille de l'utilisateur | Texte | | 50 caractères | | | Identification et affichage du nom de famille de l'utilisateur |
| First_name | Prénom de l'utilisateur | Texte | | 20 caractères | | | Identification et affichage du prénom de l'utilisateur |
| E-mail | Adresse e-mail de l'utilisateur | Texte | E-mail | 100 caractères | | | Contact et communication avec l'utilisateur |
| Password | Mot de passe de l'utilisateur | Texte | Haché | | Génération par Argon2 | | Identification et connexion sécurisée de l'utilisateur |
| Phone_number | Numéro de téléphone de l'utilisateur | Texte | Numéro de téléphone | | | | Contact et communication avec l'utilisateur |
| Role | Rôle de l'utilisateur | Texte | | | | | Identifier le rôle et les droits de l'utilisateur |

## Entité Planted Tree

| Nom de données | Description | Type de données | Format | Taille | Contraintes | Relation | Usage et contexte d'utilisation |
|---|---|---|---|---|---|---|---|
| Tree_ID | Identifiant de l'arbre planté | Numérique | | | Clé primaire | Order-line_ID, Project_ID (clés étrangères) | Identification et affichage de l'arbre planté |
| Name | Nom de l'arbre planté | Texte | | 50 caractères | | | Identification et affichage de l'arbre planté |
| Description | Description de l'arbre planté | Texte | | 250 caractères | | | Identification et affichage de l'arbre planté |
| Image | Image de l'arbre planté | Texte | Url | | | | Identification et affichage de l'arbre planté |
