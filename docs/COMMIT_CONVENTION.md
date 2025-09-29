# Convention des commits

Nous pouvons partir sur la convention définie ici => [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Types principaux

- `feat` : Nouvelle fonctionnalité pour l'utilisateur
- `fix` : Correction de bug
- `docs` : Modifications de la documentation uniquement
- `style` : Changements qui n'affectent pas le sens du code (espaces, formatage, etc.)
- `refactor` : Modification du code qui ne corrige pas de bug et n'ajoute pas de fonctionnalité
- `test` : Ajout ou modification de tests
- `build` : Modifications des outils de build, dépendances, etc.

**Structure** :
```
<type>[portée optionnelle]: <description>
```

**Exemple** :
```
docs(conception): specifications update
```

À noter que nous pouvons "lier" un commit à une issue en mentionnant son numéro précédé de dièse :
```
feat(auth): implement authentication #1234
```

Il est également possible d'apporter plus de précisions aux commits en y ajoutant des lignes (corps et pied de page).

**Structure** :
```
<type>[portée optionnelle]: <description>

[corps optionnel]

[pied de page optionnel]
```

**Exemple** :
```
fix(api): correct date validation

Dates in ISO format were not correctly validated, causing 500 errors on the /events endpoint.

Fixes #567
```

Les co-auteurs peuvent être ajouté aux pieds de page : `Co-authored-by: Name <email>`

```
docs(conception): specifications document

Complete specifications document

Co-authored-by: ChloeGarciaMillerand <ChloeGarciaMillerand@users.noreply.github.com>
Co-authored-by: VincentVautier <vincent.vautier@oclock.school>
Co-authored-by: Adam Benyekkou <adam-benyekkou@users.noreply.github.com>
Co-authored-by: JohanRozanOclock <JohanRozanOclock@users.noreply.github.com>
Co-authored-by: Cédric FAMIBELLE-PRONZOLA <contact@cedric-pronzola.dev>
```

Pour utiliser le template prédéfini, définir une seule fois le template par défaut dans le repo :
`git config commit.template .gitmessage`

Pour utiliser le template faire la commande :
`git commit`

## Breaking Changes

Lorsqu'un changement "casse" la compatibilité, le type doit être suivi d'un point d'exclamation :
```
feat!: no longer supports node 18
```

---

Quelques bonnes pratiques :
- commencer par une minuscule
- pas de point final
- utiliser l'imprératif
