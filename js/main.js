/* =====================================================================
   SITE DE VEILLE — Script commun à toutes les pages
   ---------------------------------------------------------------------
   Ce fichier est chargé sur toutes les pages. Chaque fonction vérifie
   d'abord que les éléments dont elle a besoin existent sur la page :
   si ce n'est pas le cas, elle ne fait rien. Il n'y a donc aucune
   erreur sur les pages qui n'utilisent pas une fonctionnalité.

   Sommaire :
     1. Menu burger (téléphone)
     2. Bouton « retour en haut »
     3. URL cliquable (page URL)
     4. Cartes à gratter (page URL)
     5. Carnet de voyage (page Timeline)
     6. Cartes « Maman = numéro » (page Noms de domaine)
     7. Le voyage d'une adresse (page Noms de domaine)
     8. Le memory des extensions (page Noms de domaine)
     9. La bouteille à la mer (page Standards)
    10. Construis ton bateau (page Standards)
    11. Le safari photo du phishing (page Sécurité)
    12. Voiture autour de la planète (page d'accueil)
    13. Liste de bons réflexes à cocher (page Sécurité)
    14. Année automatique dans le pied de page
    15. Lancement de toutes les fonctions
   ===================================================================== */


/* =====================================================================
   1. MENU BURGER
   ---------------------------------------------------------------------
   Sur téléphone, le menu est caché. Un clic sur le bouton ☰ ajoute ou
   retire la classe "menu-ouvert" sur l'en-tête (le CSS fait le reste).

   Éléments utilisés dans le HTML :
     <header class="entete">
     <button class="menu-bouton" aria-expanded="false" aria-controls="menu">
     <nav class="menu" id="menu">
   ===================================================================== */
function initialiserMenu() {
  const entete = document.querySelector(".entete");
  const bouton = document.querySelector(".menu-bouton");
  const menu = document.querySelector(".menu");

  if (!entete || !bouton || !menu) {
    return;
  }

  const icone = bouton.querySelector(".menu-bouton-icone");

  // Ouvre ou ferme le menu
  function changerEtatMenu(ouvrir) {
    entete.classList.toggle("menu-ouvert", ouvrir);
    bouton.setAttribute("aria-expanded", ouvrir ? "true" : "false");

    if (icone) {
      icone.textContent = ouvrir ? "✕" : "☰";
    }
  }

  // Clic sur le bouton burger
  bouton.addEventListener("click", function () {
    const estOuvert = entete.classList.contains("menu-ouvert");
    changerEtatMenu(!estOuvert);
  });

  // Touche Échap : ferme le menu et remet le focus sur le bouton
  document.addEventListener("keydown", function (evenement) {
    if (evenement.key === "Escape" && entete.classList.contains("menu-ouvert")) {
      changerEtatMenu(false);
      bouton.focus();
    }
  });

  // Clic sur un lien du menu : on referme le menu
  menu.querySelectorAll("a").forEach(function (lien) {
    lien.addEventListener("click", function () {
      changerEtatMenu(false);
    });
  });

  // Si on agrandit la fenêtre (passage au menu ordinateur), on remet à zéro
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 900) {
      changerEtatMenu(false);
    }
  });
}


/* =====================================================================
   2. BOUTON « RETOUR EN HAUT »
   ---------------------------------------------------------------------
   Le bouton apparaît quand on a descendu la page d'au moins 400px.

   Élément utilisé dans le HTML :
     <button class="retour-haut" aria-label="Retour en haut de la page">↑</button>
   ===================================================================== */
function initialiserRetourHaut() {
  const bouton = document.querySelector(".retour-haut");

  if (!bouton) {
    return;
  }

  const SEUIL_APPARITION = 400; // en pixels

  function mettreAJourVisibilite() {
    bouton.classList.toggle("visible", window.scrollY > SEUIL_APPARITION);
  }

  window.addEventListener("scroll", mettreAJourVisibilite, { passive: true });
  mettreAJourVisibilite();

  bouton.addEventListener("click", function () {
    window.scrollTo({ top: 0 });
  });
}


/* =====================================================================
   3. URL CLIQUABLE (page URL)
   ---------------------------------------------------------------------
   Chaque morceau de l'URL est un bouton. Quand on clique dessus, la
   fiche correspondante s'affiche dans la carte d'explication, qui
   prend la couleur du morceau choisi. Un deuxième clic sur le même
   morceau fait disparaître le texte.

   Les textes des explications NE SONT PAS dans ce fichier : ils sont
   dans url.html, dans les blocs <article class="url-fiche">.

   Éléments utilisés dans le HTML :
     <p class="url-exemple">
       <button class="url-partie" data-partie="schema" data-fiche="fiche-schema">https://</button>
     </p>
     <div class="url-carte">
       <article class="url-fiche" id="fiche-schema" hidden>…</article>
     </div>
   ===================================================================== */
function initialiserUrlInteractive() {
  const parties = document.querySelectorAll(".url-partie");
  const carte = document.querySelector(".url-carte");
  const adresse = document.querySelector(".url-exemple");

  if (parties.length === 0 || !carte) {
    return;
  }

  const fiches = carte.querySelectorAll(".url-fiche");
  const ficheDepart = document.getElementById("fiche-depart");

  // Revient à l'état de départ : aucune partie choisie, fiche d'accueil visible
  function masquerFiche() {
    parties.forEach(function (autre) {
      autre.classList.remove("active");
      autre.setAttribute("aria-pressed", "false");
    });

    fiches.forEach(function (autreFiche) {
      autreFiche.hidden = autreFiche !== ficheDepart;
      autreFiche.classList.remove("apparition");
    });

    if (ficheDepart) {
      void ficheDepart.offsetWidth;
      ficheDepart.classList.add("apparition");
    }

    delete carte.dataset.partie;
  }

  function afficherFiche(partie) {
    const fiche = document.getElementById(partie.dataset.fiche);

    if (!fiche) {
      return;
    }

    // Le morceau cliqué devient « actif », les autres non
    parties.forEach(function (autre) {
      const estChoisi = autre === partie;
      autre.classList.toggle("active", estChoisi);
      autre.setAttribute("aria-pressed", estChoisi ? "true" : "false");
    });

    // Une seule fiche visible à la fois
    fiches.forEach(function (autreFiche) {
      autreFiche.hidden = autreFiche !== fiche;
      autreFiche.classList.remove("apparition");
    });

    // Petite animation d'apparition (relancée à chaque clic)
    void fiche.offsetWidth;
    fiche.classList.add("apparition");

    // La carte prend la couleur du morceau choisi
    carte.dataset.partie = partie.dataset.partie;

    // On arrête l'animation d'invitation après le premier clic
    if (adresse) {
      adresse.classList.add("deja-clique");
    }
  }

  parties.forEach(function (partie) {
    partie.setAttribute("aria-pressed", "false");
    partie.addEventListener("click", function () {
      // Deuxième clic sur la même partie : le texte s'en va
      if (partie.classList.contains("active")) {
        masquerFiche();
      } else {
        afficherFiche(partie);
      }
    });
  });
}


/* =====================================================================
   4. CARTES À GRATTER (page URL)
   ---------------------------------------------------------------------
   Une couche argentée (un <canvas>) est posée sur le contenu de chaque
   carte. On la gratte avec la souris ou le doigt. Dès qu'environ un
   tiers est gratté, la carte se révèle entièrement, sans attendre
   qu'on lâche la souris.
   Le bouton « Tout révéler » découvre la carte d'un coup ; une fois la
   carte révélée, il devient « Regratter » pour recommencer.

   Réglages ci-dessous :
     TAILLE_GRATTOIR : taille du « doigt » qui gratte, en pixels
     SEUIL_REVELATION : part à gratter avant la révélation (0.3 = 30 %)

   Éléments utilisés dans le HTML :
     <article class="carte-grattage">
       <div class="grattage-zone">
         <div class="grattage-contenu">… texte caché …</div>
       </div>
       <button class="grattage-bouton">Tout révéler</button>
     </article>
   ===================================================================== */
function initialiserCartesAGratter() {
  const cartes = document.querySelectorAll(".carte-grattage");

  if (cartes.length === 0) {
    return;
  }

  const TAILLE_GRATTOIR = 40;      // avant : 22
  const SEUIL_REVELATION = 0.8;    // avant : 0.5

  // Couleurs lues dans style.css (section 1), pour ne les changer qu'à un endroit
  const styles = getComputedStyle(document.documentElement);
  const couleurCouche = styles.getPropertyValue("--grattage-couleur").trim() || "#B7BCC4";
  const couleurTexte = styles.getPropertyValue("--grattage-texte").trim() || "#5A616C";
  const policeDessin = styles.getPropertyValue("--police-dessin").trim() || "cursive";

  cartes.forEach(function (carte) {
    const zone = carte.querySelector(".grattage-zone");
    const bouton = carte.querySelector(".grattage-bouton");

    if (!zone) {
      return;
    }

    // Création de la couche à gratter
    const couche = document.createElement("canvas");
    couche.className = "grattage-couche";
    couche.setAttribute("aria-hidden", "true");
    zone.appendChild(couche);

    const pinceau = couche.getContext("2d");
    let enTrainDeGratter = false;
    let dernierPoint = null;

    // Dessine (ou redessine) la couche argentée
    function dessinerCouche() {
      const ratio = window.devicePixelRatio || 1;
      const largeur = zone.clientWidth;
      const hauteur = zone.clientHeight;

      couche.width = largeur * ratio;
      couche.height = hauteur * ratio;
      pinceau.setTransform(ratio, 0, 0, ratio, 0, 0);

      pinceau.globalCompositeOperation = "source-over";
      pinceau.fillStyle = couleurCouche;
      pinceau.fillRect(0, 0, largeur, hauteur);

      // Petits points pour imiter la texture d'un ticket à gratter
      pinceau.fillStyle = "rgba(255, 255, 255, 0.25)";
      for (let x = 6; x < largeur; x += 12) {
        for (let y = 6; y < hauteur; y += 12) {
          pinceau.beginPath();
          pinceau.arc(x + ((y / 12) % 2) * 6, y, 1.4, 0, Math.PI * 2);
          pinceau.fill();
        }
      }

      // Texte au centre
      pinceau.fillStyle = couleurTexte;
      pinceau.textAlign = "center";
      pinceau.textBaseline = "middle";
      pinceau.font = "26px " + policeDessin;
      pinceau.fillText("Grattez ici !", largeur / 2, hauteur / 2 - 12);
      pinceau.font = "34px sans-serif";
      pinceau.fillText("☝", largeur / 2, hauteur / 2 + 26);
    }

    // Efface la couche là où passe le doigt ou la souris
    function gratter(evenement) {
      const rect = couche.getBoundingClientRect();
      const point = {
        x: evenement.clientX - rect.left,
        y: evenement.clientY - rect.top
      };

      pinceau.globalCompositeOperation = "destination-out";
      pinceau.lineCap = "round";
      pinceau.lineJoin = "round";
      pinceau.lineWidth = TAILLE_GRATTOIR * 2;

      pinceau.beginPath();
      if (dernierPoint) {
        pinceau.moveTo(dernierPoint.x, dernierPoint.y);
      } else {
        pinceau.moveTo(point.x, point.y);
      }
      pinceau.lineTo(point.x + 0.1, point.y + 0.1);
      pinceau.stroke();

      dernierPoint = point;
    }

    // Calcule la part de la couche déjà grattée (entre 0 et 1)
    function partGrattee() {
      const pixels = pinceau.getImageData(0, 0, couche.width, couche.height).data;
      let transparents = 0;
      let total = 0;

      // On vérifie un pixel sur 16 pour aller plus vite
      for (let i = 3; i < pixels.length; i += 4 * 16) {
        total++;
        if (pixels[i] === 0) {
          transparents++;
        }
      }

      return total === 0 ? 0 : transparents / total;
    }

    function revelerCarte() {
      carte.classList.add("revelee");
      if (bouton) {
        bouton.textContent = "Regratter";
      }
    }

    function recouvrirCarte() {
      carte.classList.remove("revelee");
      dessinerCouche();
      if (bouton) {
        bouton.textContent = "Tout révéler";
      }
    }

    // Souris, doigt ou stylet : les « pointer events » gèrent les trois
    couche.addEventListener("pointerdown", function (evenement) {
      evenement.preventDefault();
      enTrainDeGratter = true;
      dernierPoint = null;
      couche.setPointerCapture(evenement.pointerId);
      gratter(evenement);
    });

    // On vérifie la progression pendant le grattage (toutes les 150 ms au plus)
    let derniereVerification = 0;

    couche.addEventListener("pointermove", function (evenement) {
      if (!enTrainDeGratter) {
        return;
      }
      gratter(evenement);

      const maintenant = Date.now();
      if (maintenant - derniereVerification > 150) {
        derniereVerification = maintenant;
        if (partGrattee() >= SEUIL_REVELATION) {
          enTrainDeGratter = false;
          revelerCarte();
        }
      }
    });

    function arreterDeGratter() {
      if (!enTrainDeGratter) {
        return;
      }
      enTrainDeGratter = false;
      dernierPoint = null;
      if (partGrattee() >= SEUIL_REVELATION) {
        revelerCarte();
      }
    }

    couche.addEventListener("pointerup", arreterDeGratter);
    couche.addEventListener("pointercancel", arreterDeGratter);

    if (bouton) {
      bouton.addEventListener("click", function () {
        if (carte.classList.contains("revelee")) {
          recouvrirCarte();
        } else {
          revelerCarte();
        }
      });
    }

    // Si la taille de la carte change (rotation du téléphone…), on redessine
    let largeurPrecedente = zone.clientWidth;
    window.addEventListener("resize", function () {
      if (zone.clientWidth !== largeurPrecedente && !carte.classList.contains("revelee")) {
        largeurPrecedente = zone.clientWidth;
        dessinerCouche();
      }
    });

    // On attend que la police soit chargée pour écrire « Grattez ici ! »
    dessinerCouche();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (!carte.classList.contains("revelee")) {
          dessinerCouche();
        }
      });
    }
  });
}


/* =====================================================================
   5. CARNET DE VOYAGE (page Timeline)
   ---------------------------------------------------------------------
   Un petit livre dont on tourne les pages :
   - avec les flèches ← → sous le livre ;
   - avec les flèches du clavier ;
   - en faisant glisser le doigt sur téléphone ;
   - en cliquant sur une borne du chemin.
   La voiture roule sur le chemin jusqu'à la borne de l'étape (et fait
   demi-tour quand on revient en arrière).

   Les textes et les images NE SONT PAS dans ce fichier : ils sont dans
   timeline.html, dans les blocs <article class="carnet-page">.

   Réglage ci-dessous :
     DISTANCE_GLISSEMENT : distance (en pixels) que le doigt doit
                           parcourir pour tourner la page

   Éléments utilisés dans le HTML :
     <div class="carnet">
       <div class="chemin"> <img class="chemin-voyageur"> <button class="chemin-borne">… </div>
       <div class="carnet-livre"> <article class="carnet-page">… </div>
       <button class="carnet-precedent"> <p class="carnet-compteur"> <button class="carnet-suivant">
     </div>
   ===================================================================== */
function initialiserCarnet() {
  const carnet = document.querySelector(".carnet");

  if (!carnet) {
    return;
  }

  const DISTANCE_GLISSEMENT = 50;

  const livre = carnet.querySelector(".carnet-livre");
  const pages = carnet.querySelectorAll(".carnet-page");
  const bornes = carnet.querySelectorAll(".chemin-borne");
  const voyageur = carnet.querySelector(".chemin-voyageur");
  const boutonPrecedent = carnet.querySelector(".carnet-precedent");
  const boutonSuivant = carnet.querySelector(".carnet-suivant");
  const compteur = carnet.querySelector(".carnet-compteur");

  if (pages.length === 0) {
    return;
  }

  let pageActuelle = 0;

  // Place la voiture au-dessus de la borne de l'étape en cours
  function placerVoyageur() {
    const borne = bornes[pageActuelle];
    if (!voyageur || !borne) {
      return;
    }
    const chemin = voyageur.parentElement.getBoundingClientRect();
    const rect = borne.getBoundingClientRect();
    const demiVoiture = voyageur.offsetWidth / 2;
    let position = rect.left - chemin.left + rect.width / 2;

    // La voiture ne dépasse jamais du chemin, ni à gauche ni à droite
    position = Math.max(demiVoiture, Math.min(position, chemin.width - demiVoiture));
    voyageur.style.left = position + "px";
  }

  // Affiche l'étape numéro "index" (0 = première étape)
  function afficherPage(index) {
    if (index < 0 || index >= pages.length || index === pageActuelle) {
      return;
    }

    const sens = index > pageActuelle ? "tourne-suivant" : "tourne-precedent";
    pageActuelle = index;

    pages.forEach(function (page, i) {
      page.hidden = i !== index;
      page.classList.remove("tourne-suivant", "tourne-precedent");
    });

    // Relance l'animation de la page qui arrive
    void pages[index].offsetWidth;
    pages[index].classList.add(sens);

    mettreAJour();

    // La voiture regarde dans le sens de la marche et roule
    if (voyageur) {
      voyageur.classList.toggle("marche-arriere", sens === "tourne-precedent");
      voyageur.classList.remove("en-marche");
      void voyageur.offsetWidth;
      voyageur.classList.add("en-marche");
    }
  }

  // Met à jour les bornes, les flèches et le compteur
  function mettreAJour() {
    bornes.forEach(function (borne, i) {
      if (i === pageActuelle) {
        borne.setAttribute("aria-current", "step");
      } else {
        borne.removeAttribute("aria-current");
      }
      borne.classList.toggle("passee", i < pageActuelle);
    });

    if (boutonPrecedent) {
      boutonPrecedent.disabled = pageActuelle === 0;
    }
    if (boutonSuivant) {
      boutonSuivant.disabled = pageActuelle === pages.length - 1;
    }
    if (compteur) {
      compteur.textContent = "Étape " + (pageActuelle + 1) + " sur " + pages.length;
    }

    placerVoyageur();
  }

  // Flèches sous le livre
  if (boutonPrecedent) {
    boutonPrecedent.addEventListener("click", function () {
      afficherPage(pageActuelle - 1);
    });
  }
  if (boutonSuivant) {
    boutonSuivant.addEventListener("click", function () {
      afficherPage(pageActuelle + 1);
    });
  }

  // Bornes du chemin
  bornes.forEach(function (borne, i) {
    borne.addEventListener("click", function () {
      afficherPage(i);
    });
  });

  // Flèches du clavier (quand on est dans le carnet)
  carnet.addEventListener("keydown", function (evenement) {
    if (evenement.key === "ArrowRight") {
      afficherPage(pageActuelle + 1);
    } else if (evenement.key === "ArrowLeft") {
      afficherPage(pageActuelle - 1);
    }
  });

  // Glissement du doigt sur téléphone (swipe)
  let departX = null;
  let departY = null;

  if (livre) {
    livre.addEventListener("touchstart", function (evenement) {
      departX = evenement.touches[0].clientX;
      departY = evenement.touches[0].clientY;
    }, { passive: true });

    livre.addEventListener("touchend", function (evenement) {
      if (departX === null) {
        return;
      }
      const ecartX = evenement.changedTouches[0].clientX - departX;
      const ecartY = evenement.changedTouches[0].clientY - departY;
      departX = null;

      // On ne tourne la page que si le geste est surtout horizontal
      if (Math.abs(ecartX) > DISTANCE_GLISSEMENT && Math.abs(ecartX) > Math.abs(ecartY)) {
        if (ecartX < 0) {
          afficherPage(pageActuelle + 1);   // glisser vers la gauche = page suivante
        } else {
          afficherPage(pageActuelle - 1);   // glisser vers la droite = page précédente
        }
      }
    }, { passive: true });
  }

  // Si la fenêtre change de taille, on replace le personnage
  window.addEventListener("resize", placerVoyageur);

  mettreAJour();
}


/* =====================================================================
   6. CARTES « MAMAN = NUMÉRO » À RETOURNER (page Noms de domaine)
   ---------------------------------------------------------------------
   Un clic sur une carte la retourne. Le bouton « Traduire en numéros »
   retourne les deux cartes en même temps.

   Éléments utilisés dans le HTML :
     <button class="traduction-carte">…</button>
     <button class="traduction-bouton">Traduire en numéros</button>
   ===================================================================== */
function initialiserTraduction() {
  const cartes = document.querySelectorAll(".traduction-carte");
  const bouton = document.querySelector(".traduction-bouton");

  if (cartes.length === 0) {
    return;
  }

  function retourner(carte, etat) {
    carte.classList.toggle("retournee", etat);
    carte.setAttribute("aria-pressed", etat ? "true" : "false");
  }

  function mettreAJourBouton() {
    if (!bouton) {
      return;
    }
    const toutesRetournees = Array.from(cartes).every(function (carte) {
      return carte.classList.contains("retournee");
    });
    bouton.textContent = toutesRetournees ? "Revenir aux noms" : "Traduire en numéros";
  }

  cartes.forEach(function (carte) {
    carte.addEventListener("click", function () {
      retourner(carte, !carte.classList.contains("retournee"));
      mettreAJourBouton();
    });
  });

  if (bouton) {
    bouton.addEventListener("click", function () {
      const toutesRetournees = Array.from(cartes).every(function (carte) {
        return carte.classList.contains("retournee");
      });
      cartes.forEach(function (carte) {
        retourner(carte, !toutesRetournees);
      });
      mettreAJourBouton();
    });
  }
}


/* =====================================================================
   7. LE VOYAGE D'UNE ADRESSE SUR LA MONTAGNE (page Noms de domaine)
   ---------------------------------------------------------------------
   Le personnage grimpe de station en station. À chaque étape, le texte
   correspondant s'affiche à côté de la montagne. Au sommet, un drapeau
   est planté et le bouton propose de recommencer.

   Les textes des étapes sont dans noms-de-domaine.html, dans les blocs
   <article class="dns-fiche">. La position de chaque station est
   dans l'attribut style du bouton <button class="dns-station">.
   ===================================================================== */
function initialiserVoyageDns() {
  const montagne = document.querySelector(".dns-montagne");

  if (!montagne) {
    return;
  }

  const stations = montagne.querySelectorAll(".dns-station");
  const randonneur = montagne.querySelector(".dns-randonneur");
  const drapeau = montagne.querySelector(".dns-drapeau");
  const fiches = document.querySelectorAll(".dns-fiche");
  const bouton = document.querySelector(".dns-suivant");
  const derniere = stations.length - 1;
  let etape = 0;

  function allerA(index) {
    etape = index;

    stations.forEach(function (station, i) {
      station.classList.toggle("atteinte", i <= index);
      if (i === index) {
        station.setAttribute("aria-current", "step");
      } else {
        station.removeAttribute("aria-current");
      }
    });

    fiches.forEach(function (fiche, i) {
      fiche.hidden = i !== index;
    });

    // Le personnage se place sur la station (mêmes coordonnées en %)
    if (randonneur && stations[index]) {
      randonneur.style.left = stations[index].style.left;
      randonneur.style.top = stations[index].style.top;
    }

    if (drapeau) {
      drapeau.classList.toggle("visible", index === derniere);
    }

    if (bouton) {
      bouton.textContent = index === derniere ? "Recommencer ↺" : "Étape suivante ↑";
    }
  }

  stations.forEach(function (station, i) {
    station.addEventListener("click", function () {
      allerA(i);
    });
  });

  if (bouton) {
    bouton.addEventListener("click", function () {
      allerA(etape === derniere ? 0 : etape + 1);
    });
  }

  allerA(0);
}


/* =====================================================================
   8. LE MEMORY DES EXTENSIONS (page Noms de domaine)
   ---------------------------------------------------------------------
   On retourne deux cartes. Si elles ont le même data-paire, elles
   restent visibles avec un petit drapeau. Sinon, elles se recachent.
   Les cartes sont mélangées au chargement et à chaque « Rejouer ».

   Réglage ci-dessous :
     TEMPS_AVANT_RECACHER : durée (en millisecondes) pendant laquelle
                            deux cartes différentes restent visibles

   Éléments utilisés dans le HTML :
     <div class="memo-grille"> <button class="memo-carte" data-paire="com">… </div>
     <p class="memo-compteur"> <button class="memo-rejouer"> <p class="memo-bravo">
   ===================================================================== */
function initialiserMemory() {
  const grille = document.querySelector(".memo-grille");

  if (!grille) {
    return;
  }

  const TEMPS_AVANT_RECACHER = 900;

  const cartes = Array.from(grille.querySelectorAll(".memo-carte"));
  const compteur = document.querySelector(".memo-compteur");
  const boutonRejouer = document.querySelector(".memo-rejouer");
  const bravo = document.querySelector(".memo-bravo");
  const totalPaires = cartes.length / 2;

  let cartesVisibles = [];
  let coups = 0;
  let pairesTrouvees = 0;
  let bloque = false;

  // Mélange les cartes (algorithme de Fisher-Yates)
  function melanger() {
    for (let i = cartes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cartes[i], cartes[j]] = [cartes[j], cartes[i]];
    }
    cartes.forEach(function (carte) {
      grille.appendChild(carte);
    });
  }

  function afficherScore() {
    if (compteur) {
      compteur.textContent =
        coups + " coup" + (coups > 1 ? "s" : "") + " · " +
        pairesTrouvees + " paire" + (pairesTrouvees > 1 ? "s" : "") + " sur " + totalPaires;
    }
  }

  // Montre ou cache une carte (et met à jour ce que lit un lecteur d'écran)
  function montrer(carte, visible) {
    carte.classList.toggle("retournee", visible);
    const face = carte.querySelector(".memo-face");
    carte.setAttribute("aria-label", visible && face ? face.textContent.trim() : "Carte cachée");
  }

  function clicSurCarte(carte) {
    if (bloque || carte.classList.contains("retournee") || carte.classList.contains("trouvee")) {
      return;
    }

    montrer(carte, true);
    cartesVisibles.push(carte);

    if (cartesVisibles.length < 2) {
      return;
    }

    coups++;
    const premiere = cartesVisibles[0];
    const deuxieme = cartesVisibles[1];
    cartesVisibles = [];

    if (premiere.dataset.paire === deuxieme.dataset.paire) {
      // Paire trouvée !
      [premiere, deuxieme].forEach(function (c) {
        c.classList.remove("retournee");
        c.classList.add("trouvee");
      });
      pairesTrouvees++;
      if (pairesTrouvees === totalPaires && bravo) {
        bravo.hidden = false;
      }
    } else {
      // Pas la bonne paire : on recache après un petit moment
      bloque = true;
      setTimeout(function () {
        montrer(premiere, false);
        montrer(deuxieme, false);
        bloque = false;
      }, TEMPS_AVANT_RECACHER);
    }

    afficherScore();
  }

  function nouvellePartie() {
    cartes.forEach(function (carte) {
      carte.classList.remove("trouvee");
      montrer(carte, false);
    });
    cartesVisibles = [];
    coups = 0;
    pairesTrouvees = 0;
    bloque = false;
    if (bravo) {
      bravo.hidden = true;
    }
    afficherScore();
    // On attend que les cartes soient retournées avant de les mélanger
    setTimeout(melanger, 300);
  }

  cartes.forEach(function (carte) {
    carte.addEventListener("click", function () {
      clicSurCarte(carte);
    });
  });

  if (boutonRejouer) {
    boutonRejouer.addEventListener("click", nouvellePartie);
  }

  melanger();
  afficherScore();
}


/* =====================================================================
   9. LA BOUTEILLE À LA MER (page Standards du web)
   ---------------------------------------------------------------------
   Les deux boutons de la barre (« Sans standards » / « Avec standards »)
   changent l'attribut data-mode de .bouteille-jeu. Tout l'affichage
   « cassé » des îles est géré dans style.css.

   Éléments utilisés dans le HTML :
     <div class="bouteille-jeu" data-mode="sans">
       <button class="barre-option" data-mode="sans"> / data-mode="avec"
       <p class="bouteille-message" data-mode="sans"> / data-mode="avec"
       <article class="ile">…
   ===================================================================== */
function initialiserBouteille() {
  const jeu = document.querySelector(".bouteille-jeu");

  if (!jeu) {
    return;
  }

  const options = jeu.querySelectorAll(".barre-option");
  const messages = jeu.querySelectorAll(".bouteille-message");
  const iles = jeu.querySelectorAll(".ile");

  function choisirMode(mode) {
    jeu.dataset.mode = mode;

    options.forEach(function (option) {
      option.setAttribute("aria-pressed", option.dataset.mode === mode ? "true" : "false");
    });

    messages.forEach(function (message) {
      message.hidden = message.dataset.mode !== mode;
    });

    // Petite éclaboussure : la bouteille arrive sur chaque île
    iles.forEach(function (ile) {
      ile.classList.remove("arrivee");
      void ile.offsetWidth;
      ile.classList.add("arrivee");
    });
  }

  options.forEach(function (option) {
    option.addEventListener("click", function () {
      choisirMode(option.dataset.mode);
    });
  });
}


/* =====================================================================
   10. CONSTRUIS TON BATEAU (page Standards du web)
   ---------------------------------------------------------------------
   Trois boutons à cliquer dans l'ordre : HTML, CSS puis JavaScript.
   Chaque clic change l'attribut data-etape de .chantier (de 0 à 3) ;
   style.css affiche le bateau et la mini-page selon l'étape.
   À l'étape 3, le bouton de la mini-page devient cliquable.

   Éléments utilisés dans le HTML :
     <div class="chantier" data-etape="0">
       <button class="chantier-bouton" data-etape="1"> (2, 3)
       <p class="chantier-explication" data-etape="0"> (1, 2, 3)
       <button class="chantier-action"> <p class="chantier-reaction">
       <button class="chantier-recommencer">
   ===================================================================== */
function initialiserChantier() {
  const chantier = document.querySelector(".chantier");

  if (!chantier) {
    return;
  }

  const boutons = chantier.querySelectorAll(".chantier-bouton");
  const explications = chantier.querySelectorAll(".chantier-explication");
  const action = chantier.querySelector(".chantier-action");
  const reaction = chantier.querySelector(".chantier-reaction");
  const recommencer = chantier.querySelector(".chantier-recommencer");
  const derniere = boutons.length;
  let etape = 0;

  function allerA(nouvelleEtape) {
    etape = nouvelleEtape;
    chantier.dataset.etape = String(etape);

    boutons.forEach(function (bouton) {
      const numero = Number(bouton.dataset.etape);
      bouton.classList.toggle("fait", numero <= etape);
      // Seul le bouton de l'étape suivante est cliquable
      bouton.disabled = numero !== etape + 1;
    });

    explications.forEach(function (explication) {
      explication.hidden = Number(explication.dataset.etape) !== etape;
    });

    if (action) {
      action.tabIndex = etape === derniere ? 0 : -1;
    }
    if (reaction) {
      reaction.hidden = true;
    }
    if (recommencer) {
      recommencer.hidden = etape !== derniere;
    }
  }

  boutons.forEach(function (bouton) {
    bouton.addEventListener("click", function () {
      allerA(Number(bouton.dataset.etape));
    });
  });

  // Le bouton de la mini-page ne réagit qu'une fois JavaScript ajouté
  if (action && reaction) {
    action.addEventListener("click", function () {
      if (etape === derniere) {
        reaction.hidden = !reaction.hidden;
      }
    });
  }

  if (recommencer) {
    recommencer.addEventListener("click", function () {
      allerA(0);
    });
  }

  allerA(0);
}


/* =====================================================================
   11. LE SAFARI PHOTO DU PHISHING (page Sécurité)
   ---------------------------------------------------------------------
   Chaque sortie est un faux message. On touche les indices suspects
   (<button class="indice">) pour les « photographier » : ils sont
   entourés et ajoutés au carnet de safari. Toucher ailleurs affiche
   « Rien de suspect ici ». Quand tous les indices sont trouvés (ou
   révélés), on passe à la sortie suivante.

   Les messages et les explications sont dans securite.html.
   ===================================================================== */
function initialiserSafari() {
  const jeu = document.querySelector(".safari-jeu");

  if (!jeu) {
    return;
  }

  const messages = Array.from(jeu.querySelectorAll(".safari-message"));
  const jumelles = jeu.querySelector(".jumelles");
  const etiquetteSortie = jeu.querySelector(".safari-sortie");
  const compteur = jeu.querySelector(".safari-compteur");
  const liste = jeu.querySelector(".carnet-safari-liste");
  const carnetVide = jeu.querySelector(".carnet-safari-vide");
  const rien = jeu.querySelector(".safari-rien");
  const fin = jeu.querySelector(".safari-fin");
  const finTexte = jeu.querySelector(".safari-fin-texte");
  const boutonReveler = jeu.querySelector(".safari-reveler");
  const boutonSuivant = jeu.querySelector(".safari-suivant");

  let sortie = 0;
  let termine = false;
  let totalTrouves = 0;
  let totalIndices = 0;
  let minuteurRien = null;

  messages.forEach(function (message) {
    totalIndices += message.querySelectorAll(".indice").length;
  });

  function indicesDeLaSortie() {
    return Array.from(messages[sortie].querySelectorAll(".indice"));
  }

  function mettreAJourCompteur() {
    const indices = indicesDeLaSortie();
    const trouves = indices.filter(function (i) { return i.classList.contains("reperee"); }).length;
    compteur.textContent =
      trouves + " indice" + (trouves > 1 ? "s" : "") + " photographié" + (trouves > 1 ? "s" : "") +
      " sur " + indices.length;
    return { trouves: trouves, total: indices.length };
  }

  // Ajoute une ligne au carnet de safari
  function noterDansLeCarnet(indice, revele) {
    const ligne = document.createElement("li");
    if (revele) {
      ligne.classList.add("carnet-revele");
    }
    const titre = document.createElement("strong");
    titre.textContent = indice.dataset.titre + (revele ? " (révélé)" : "");
    const explication = document.createElement("span");
    explication.textContent = indice.dataset.explication;
    ligne.append(titre, explication);
    liste.appendChild(ligne);
    carnetVide.hidden = true;
  }

  function flashPhoto() {
    jumelles.classList.remove("declenche");
    void jumelles.offsetWidth;
    jumelles.classList.add("declenche");
  }

  function afficherSortie(index) {
    sortie = index;
    termine = false;
    messages.forEach(function (message, i) {
      message.hidden = i !== index;
    });
    liste.innerHTML = "";
    carnetVide.hidden = false;
    fin.hidden = true;
    rien.hidden = true;
    boutonReveler.hidden = false;
    boutonSuivant.hidden = true;
    etiquetteSortie.textContent = "Sortie " + (index + 1) + " sur " + messages.length;
    mettreAJourCompteur();
  }

  function terminerSortie(toutTrouve) {
    termine = true;
    boutonReveler.hidden = true;
    boutonSuivant.hidden = false;
    fin.hidden = false;

    let texte = toutTrouve
      ? "Bravo ! Vous avez photographié tous les indices : ce message est une arnaque."
      : "Voici tous les indices : ce message est une arnaque !";

    if (sortie === messages.length - 1) {
      texte += " Bilan du safari : " + totalTrouves + " indices photographiés sur " + totalIndices + ".";
      boutonSuivant.textContent = "Recommencer le safari ↺";
    } else {
      boutonSuivant.textContent = "Sortie suivante →";
    }
    finTexte.textContent = texte;
  }

  // Un clic dans le message : sur un indice, ou à côté
  messages.forEach(function (message) {
    message.addEventListener("click", function (evenement) {
      if (termine) {
        return;
      }
      const indice = evenement.target.closest(".indice");

      if (indice) {
        if (indice.classList.contains("reperee")) {
          return;
        }
        indice.classList.add("reperee");
        totalTrouves++;
        flashPhoto();
        noterDansLeCarnet(indice, false);
        rien.hidden = true;
        const score = mettreAJourCompteur();
        if (score.trouves === score.total) {
          terminerSortie(true);
        }
      } else {
        rien.hidden = false;
        clearTimeout(minuteurRien);
        minuteurRien = setTimeout(function () {
          rien.hidden = true;
        }, 1400);
      }
    });
  });

  boutonReveler.addEventListener("click", function () {
    indicesDeLaSortie().forEach(function (indice) {
      if (!indice.classList.contains("reperee")) {
        indice.classList.add("revelee");
        noterDansLeCarnet(indice, true);
      }
    });
    terminerSortie(false);
  });

  boutonSuivant.addEventListener("click", function () {
    if (sortie < messages.length - 1) {
      afficherSortie(sortie + 1);
    } else {
      // Nouveau safari : on efface tout
      jeu.querySelectorAll(".indice").forEach(function (indice) {
        indice.classList.remove("reperee", "revelee");
      });
      totalTrouves = 0;
      afficherSortie(0);
    }
  });

  afficherSortie(0);
}


/* =====================================================================
   12. VOITURE AUTOUR DE LA PLANÈTE (page d'accueil)
   ---------------------------------------------------------------------
   La voiture roule sur l'anneau : elle passe devant la planète en bas
   et derrière en haut (un peu plus petite, comme au loin). Dans les
   virages, sur les côtés, elle s'affine et se retourne, ce qui donne
   une petite impression de 3D.
   Elle fait NOMBRE_TOURS tours, puis s'arrête devant la planète.
   Un clic sur la planète la relance… ou l'arrête si elle roule.

   Réglages ci-dessous :
     DUREE_TOUR   : durée d'un tour, en secondes (plus grand = plus lent)
     NOMBRE_TOURS : nombre de tours avant de s'arrêter
   ===================================================================== */
function initialiserOrbite() {
  const scene = document.querySelector(".planete-anneau");
  const voiture = scene ? scene.querySelector(".anneau-voiture") : null;

  if (!voiture) {
    return;
  }

  const DUREE_TOUR = 13;
  const NOMBRE_TOURS = 2;

  // Forme de l'anneau, en % de la scène (même forme que le dessin)
  const CENTRE_X = 50;
  const CENTRE_Y = 54;
  const RAYON_X = 40;
  const RAYON_Y = 11;

  // Position de départ et d'arrivée : devant la planète, au milieu
  const ANGLE_DEPART = Math.PI / 2;

  let enRoute = false;
  let debut = null;
  let angleActuel = ANGLE_DEPART;
  let angleDebut = ANGLE_DEPART;   // où la voiture était au moment du départ
  let distance = 0;                // angle à parcourir pendant ce trajet

  // Place la voiture sur l'anneau pour un angle donné
  function placer(angle) {
    const sinus = Math.sin(angle);
    const cosinus = Math.cos(angle);

    const x = CENTRE_X + RAYON_X * cosinus;
    const y = CENTRE_Y + RAYON_Y * sinus;
    const devant = sinus > 0;                          // en bas = devant la planète
    const versLaDroite = sinus > 0;                    // sens de déplacement
    const taille = 0.8 + 0.2 * (sinus + 1) / 2;        // plus petite au loin
    const virage = 0.25 + 0.75 * Math.abs(sinus);      // s'affine sur les côtés
    const inclinaison = -cosinus * 8 * (devant ? 1 : -1); // suit la courbe

    voiture.style.left = x + "%";
    voiture.style.top = y + "%";
    voiture.style.zIndex = devant ? 4 : 1;
    voiture.style.transform =
      "translate(-50%, -80%) rotate(" + inclinaison + "deg) scale(" +
      (versLaDroite ? 1 : -1) * taille * virage + ", " + taille + ")";
  }

  // Démarrage et arrêt en douceur
  function adoucir(t) {
    return 0.5 - 0.5 * Math.cos(Math.PI * t);
  }

  function animer(temps) {
    if (!enRoute) {
      return;
    }
    if (debut === null) {
      debut = temps;
    }
    const dureeTotale = (distance / (Math.PI * 2)) * DUREE_TOUR * 1000;
    const progression = Math.min((temps - debut) / dureeTotale, 1);

    // Angle qui diminue : la voiture roule vers la droite quand elle est devant
    angleActuel = angleDebut - adoucir(progression) * distance;
    placer(angleActuel);

    if (progression < 1) {
      requestAnimationFrame(animer);
    } else {
      arreter();
    }
  }

  function demarrer() {
    // Les tours demandés + ce qu'il faut pour finir pile devant la planète
    const tour = Math.PI * 2;
    const resteAvantDevant = ((angleActuel - ANGLE_DEPART) % tour + tour) % tour;
    angleDebut = angleActuel;
    distance = NOMBRE_TOURS * tour + resteAvantDevant;
    enRoute = true;
    debut = null;
    scene.setAttribute("aria-label", "Arrêter la voiture");
    requestAnimationFrame(animer);
  }

  function arreter() {
    enRoute = false;
    scene.setAttribute("aria-label", "Relancer la voiture autour de la planète");
  }

  // Un clic sur la planète : relance la voiture, ou l'arrête si elle roule
  scene.addEventListener("click", function () {
    if (enRoute) {
      arreter();
    } else {
      // Elle repart de là où elle s'était arrêtée
      demarrer();
    }
  });

  placer(ANGLE_DEPART);

  // Si la personne a demandé moins d'animations, la voiture attend un clic
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    demarrer();
  }
}


/* =====================================================================
  13. LISTE DE BONS RÉFLEXES À COCHER (page Sécurité)
   ---------------------------------------------------------------------
   Compte les cases cochées et affiche le résultat, par exemple :
   « 3 réflexes sur 6 ».

   Éléments utilisés dans le HTML :
     <ul class="checklist">
       <li><label><input type="checkbox"><span>Texte</span></label></li>
     </ul>
     <p class="checklist-compteur" aria-live="polite"></p>
   ===================================================================== */
function initialiserChecklist() {
  const cases = document.querySelectorAll('.checklist input[type="checkbox"]');
  const compteur = document.querySelector(".checklist-compteur");

  if (cases.length === 0 || !compteur) {
    return;
  }

  function mettreAJourCompteur() {
    const total = cases.length;
    let cochees = 0;

    cases.forEach(function (caseACocher) {
      if (caseACocher.checked) {
        cochees++;
      }
    });

    let message = cochees + " réflexe" + (cochees > 1 ? "s" : "") + " sur " + total + " dans le sac";

    if (cochees === total) {
      message = "Le sac est prêt : vous avez tous les bons réflexes, bon safari !";
    }

    compteur.textContent = message;
  }

  cases.forEach(function (caseACocher) {
    caseACocher.addEventListener("change", mettreAJourCompteur);
  });

  mettreAJourCompteur();
}


/* =====================================================================
  14. ANNÉE AUTOMATIQUE DANS LE PIED DE PAGE
   ---------------------------------------------------------------------
   Remplit automatiquement l'année en cours.

   Élément utilisé dans le HTML :
     <span class="annee"></span>
   ===================================================================== */
function afficherAnnee() {
  const elements = document.querySelectorAll(".annee");
  const annee = new Date().getFullYear();

  elements.forEach(function (element) {
    element.textContent = annee;
  });
}


/* =====================================================================
  15. LANCEMENT
   ---------------------------------------------------------------------
   Le script est chargé avec l'attribut "defer" dans le HTML : il
   s'exécute donc une fois que toute la page est construite.
   ===================================================================== */
initialiserMenu();
initialiserRetourHaut();
initialiserUrlInteractive();
initialiserCartesAGratter();
initialiserCarnet();
initialiserTraduction();
initialiserVoyageDns();
initialiserMemory();
initialiserBouteille();
initialiserChantier();
initialiserSafari();
initialiserOrbite();
initialiserChecklist();
afficherAnnee();
