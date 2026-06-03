# Divi Contact File Upload

Plugin WordPress pour `Divi 5` qui ajoute des options d'upload directement dans les champs du module `Contact Form`.

## Ce que fait cette version

- Ajoute des options d'upload dans l'éditeur d'un champ du formulaire de contact Divi 5.
- Permet de transformer un champ précis en champ de fichier.
- Permet de définir, pour chaque champ upload :
  - le texte affiché,
  - le texte d'aide,
  - les types de fichiers autorisés,
  - la taille maximale,
  - si le fichier est obligatoire.
- Permet d'utiliser `2 fichiers différents` en ajoutant simplement `2 champs upload séparés` dans le même formulaire.
- Attache les fichiers à l'email envoyé par WordPress.

## Installation

1. Copiez le dossier `divi-contact-file-upload` dans `wp-content/plugins/`.
2. Activez **Divi Contact File Upload** dans WordPress.
3. Ouvrez un module `Contact Form` dans `Divi 5`.
4. Ajoutez un ou deux champs comme d'habitude.
5. Ouvrez chaque champ concerné.
6. Regardez d'abord dans `Field Options + Upload`.
7. Si ce groupe n'apparaît pas dans votre build Divi, regardez dans `Admin Label`, où le plugin ajoute aussi un mode de compatibilité.
8. Activez `Use As File Upload`.

## Exemple pour 2 fichiers différents

Créez deux champs distincts dans le formulaire :

1. Champ `CV`
   Types autorisés : `pdf,doc,docx`
2. Champ `Lettre de motivation`
   Types autorisés : `pdf`

Chaque champ aura sa propre configuration et son propre fichier joint dans l'email.

## Réglages ajoutés dans le builder

Dans l'éditeur du champ, le plugin ajoute :

- `Use As File Upload`
- `Displayed Label`
- `Help Text`
- `Allowed File Types`
- `Max File Size (MB)`
- `Upload Required`

Sur certaines versions/builds de Divi 5, ces réglages peuvent apparaître dans `Admin Label` au lieu d'un groupe dédié.

## Limites actuelles

- Cette version vise `Divi 5`.
- Elle s'appuie sur les hooks publics du builder Divi 5 pour ajouter les réglages.
- Comme l'API publique Divi documente mieux l'ajout d'options que la transformation native du rendu du champ, cette version remplace le champ en front-end quand l'option upload est activée.
- Si Elegant Themes modifie le slug interne du sous-module `Contact Form Field` dans une future version, la partie builder pourra nécessiter un petit ajustement.
- Je n'ai pas pu exécuter de lint PHP ou JS dans cet environnement, car `php` et `node` n'y sont pas installés.
