# RegionBretagne_TerminalDuNaye

## Démarrage

```
npm install
npm run dev
```

La page d'accueil (`landingImage`), la vue aérienne (`aerialView`, avec ses POIs liés à des images), les étages, POIs et logos sont configurés dans `src/config/building.json`.

Un POI peut ne pas avoir de média (`panoramaUrl` pour un étage, `image` pour la vue aérienne) : il reste alors un simple marqueur. Ajouter `showTitle: true` à un POI affiche son titre en permanence ; sinon, le titre apparaît au survol ou au focus.

Le panorama de démonstration local vient du projet [zesage/panorama](https://github.com/zesage/panorama/tree/538fd948892357088afeeb4d90de04b3ccb91668/example/assets) et est distribué sous licence Apache 2.0 (voir `src/panoramas/LICENSE`).
