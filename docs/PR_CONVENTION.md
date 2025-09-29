# Convention des Pull Request

## Nommage des branches

Utilisez le format suivant pour nommer vos branches :
- **feature-[nom-descriptif]** : Pour les nouvelles fonctionnalités (ex: `feature-user-authentication`)
- **docs-[nom-descriptif]** : Pour les améliorations de documentation (ex: `docs-improve-pr-convention`)
- **fix-[nom-descriptif]** : Pour les corrections de bugs (ex: `fix-login-error`)
- **style-[nom-descriptif]** : Pour les modifications de style/design (ex: `style-button-redesign`)
- **refactor-[nom-descriptif]** : Pour le refactoring de code (ex: `refactor-user-service`)

## Création de la PR

### Titre de la PR
Utilisez un titre court et descriptif en français qui décrit brièvement les changements apportés.

**Exemples :**
- `Ajout du système d'authentification utilisateur`
- `Amélioration de la convention des PR`
- `Correction de l'erreur de validation de connexion`
- `Mise à jour du design des boutons`
- `Refactorisation de l'architecture du service utilisateur`

### Lors de la création de la PR, sélectionnez et remplissez le template associé :

#### Méthode 1 : URL avec template automatique
Pour utiliser un template spécifique, utilisez une URL de la forme :
```
https://github.com/O-clock-Freyja/greenroots/compare/main...VOTRE_BRANCHE?quick_pull=1&template=TEMPLATE.md
```

Remplacez `VOTRE_BRANCHE` par le nom de votre branche et `TEMPLATE.md` par l'un des templates disponibles :
- **feature.md** : Pour les nouvelles fonctionnalités
- **docs.md** : Pour les améliorations de documentation
- **fix.md** : Pour les corrections de bugs
- **style.md** : Pour les modifications de style/design
- **refactor.md** : Pour le refactoring de code
- **conception.md** : Pour les documents de conception, architecture et éléments graphiques

**Exemple :**
```
https://github.com/O-clock-Freyja/greenroots/compare/main...docs-improve-pr-convention?quick_pull=1&template=docs.md
```

#### Méthode 2 : Copié-collé du template
Si l'URL ne fonctionne pas, copiez-collez le contenu du template correspondant :

- **[feature.md](../.github/PULL_REQUEST_TEMPLATE/feature.md)** : Pour les nouvelles fonctionnalités
- **[docs.md](../.github/PULL_REQUEST_TEMPLATE/docs.md)** : Pour les améliorations de documentation
- **[fix.md](../.github/PULL_REQUEST_TEMPLATE/fix.md)** : Pour les corrections de bugs
- **[style.md](../.github/PULL_REQUEST_TEMPLATE/style.md)** : Pour les modifications de style/design
- **[refactor.md](../.github/PULL_REQUEST_TEMPLATE/refactor.md)** : Pour le refactoring de code
- **[conception.md](../.github/PULL_REQUEST_TEMPLATE/conception.md)** : Pour les documents de conception, architecture et éléments graphiques

### Ajoutez ou moins 2 reviewers.

### Rattachez la PR à une issue avec le mot clé associé
Si une issue existe, utilisez un mot clé suivi de son numéro pour qu'elle se ferme après le merge de la PR (resolves #1234)

*liste des mots clés*
```
close
closes
closed
fix
fixes
fixed
resolve
resolves
resolved
```
