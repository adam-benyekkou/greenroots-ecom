# MLD

- Arbre (<u>CodeArbre</u>, Nom, Description ,Prix ,Miniature )

- Utilisateur (<u>CodeUtilisateur</u>, Nom, Prénom, E-mail, Mot de passe, Téléphone, Rôle  )

- Localisation (<u>CodeLocalisation</u>, Pays, Continent )

- Commande (<u>CodeCommande</u>, Statut, date)

- Projet (<u>CodeProjet</u>, Nom, Description, Miniature)

- Arbre Planté (<u>CodeArbrePlanté</u>, Date)

- INCLURE (<u>#CodeArbre</u>, <u>#CodeCommande</u>, Quantité, Prix unitaire)

- APPARTENIR (<u>#Codeprojet</u>, <u>#CodeArbre</u>)

- DÉPENDRE (<u>#CodeProjet</u>, <u>#CodeArbrePlanté</u>)

- SUIVRE (<u>#CodeCommande</u>, <u>#CodeArbrePlanté</u>)

- SE SITUER (<u>#CodeLocalisation</u>, <u>#CodeProjet</u>)

- PASSER (<u>#CodeCommande</u>, <u>#CodeUtilisateur</u>)