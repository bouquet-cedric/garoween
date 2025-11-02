const joueurs = [];
var nbPlayer = 0;
function getPlayers() {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    const nbCards = roles.reduce((prev, curr) => prev + curr.quantity, 0);
    modal.innerHTML = `
    <div class="modal-content">
        <div class="flex w-full items-center justify-center mb-12">
            <h2 class="halloween">Choix des joueurs</h2>
        </div>
        <div class="flex flex-col w-full items-center justify-around mb-12" id="player-container">
            
        </div>
        <div class="flex w-full items-center justify-center mb-12">
            <button onclick="addSomeBody(${nbCards})">+</button>
        </div>
        <div class="flex w-full items-center justify-center">
            <button class="halloween" id="submit">Démarrer la partie</button>
        </div>
    </div>`;

    document.body.appendChild(modal);
    addSomeBody(nbCards);

    const submit = document.getElementById("submit");
    submit.addEventListener("click", function () {
      const elements = Array.from(document.getElementsByClassName("somebody"));
      const players = elements.map((el) => el.value);
      modal.remove();
      resolve(players);
    });
  });
}

function addSomeBody(nbCards) {
  if (nbPlayer < nbCards) {
    const div = document.getElementById("player-container");
    const input = document.createElement("input");
    input.autofocus = true;
    input.type = "text";
    input.classList.add("halloween", "mb-2", "somebody");
    ++nbPlayer;
    div.appendChild(input);
  }
}

function addPlayer(playersAvailable) {
  return new Promise((resolve) => {
    const realPlayers = playersAvailable.filter(
      (el) => !joueurs.some((joueur) => joueur.name === el)
    );
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
    <div class="modal-content w-[800px]">
        <div class="flex w-full items-center justify-center mb-12">
            <h2 class="halloween">Création d'un joueur</h2>
        </div>
        <div class="w-full flex flex text-center justify-around items-stretch">
            <div class="w-1/3 flex justify-around items-center">
                <div class="w-full h-[70%] flex flex-col rounded-lg bg-[lightgray] text-center justify-around items-center">
                    <div class="flex w-full items-center justify-around">
                        <label class="halloween" for="name">Nom</label>
                        <select class="halloween" id="name" autofocus></select>
                    </div>
                    <div class="flex w-full items-center justify-around">
                        <label class="halloween" for="role">Rôle</label>
                        <select class="halloween" id="role"></select>
                    </div>
                    <div class="flex w-full items-center justify-center">
                        <button class="halloween" id="submit">Ajouter</button>
                    </div>
                </div>
            </div>
            <div class="flex w-1/2" id="legend"></div>
    </div>
    `;

    document.body.appendChild(modal);
    addMiniRecapContent(document.getElementById("legend"));
    const role = document.getElementById("role");
    const realRoles = roles.filter((el) => el.quantity > 0);
    realRoles.forEach((el) => {
      const option = document.createElement("option");
      option.classList.add("halloween");
      option.value = JSON.stringify(el);
      option.textContent = el.name;
      role.appendChild(option);
    });

    const name = document.getElementById("name");
    realPlayers.forEach((el) => {
      const option = document.createElement("option");
      option.classList.add("halloween");
      option.value = el;
      option.textContent = el;
      name.appendChild(option);
    });

    const submit = document.getElementById("submit");
    submit.addEventListener("click", function () {
      modal.remove();
      const valueRole = JSON.parse(role.value);
      roles.find((el) => el.name === valueRole.name).quantity--;
      resolve({ name: name.value, role: role.value });
    });
  });
}

function addMiniRecapContent(container) {
  const table = document.createElement("table");
  table.classList.add("!m-0");
  const tr = document.createElement("tr");
  tr.id = "tr-header";
  const ths = ["Rôle", "Heure de passage", "Cycle"];
  ths.forEach((el) => {
    const th = document.createElement("th");
    th.textContent = el;
    th.classList.add("halloween");
    tr.appendChild(th);
  });
  table.appendChild(tr);

  roles
    .map((el) => ({
      name: el.name,
      heure: { show: el.firstHeure, value: el.valueHeure },
      cycle: el.cycle,
    }))
    .sort((el, el2) => el.heure.value - el2.heure.value)
    .forEach((el, indexJoueur) => {
      const trRole = document.createElement("tr");

      const { name, heure, cycle } = el;

      const tds = [name, heure.show, cycle];

      tds.forEach((item, index) => {
        const td = document.createElement("td");
        td.id = "td_" + indexJoueur + "_" + index;
        td.classList.add("halloween");
        if (index === 0) {
          td.classList.add(item.toLowerCase().replaceAll(" ", "-"));
          td.textContent = item;
        } else if (typeof item === "boolean") {
          td.textContent = item ? "\u2713" : "\u2715";
          td.classList.add(item ? "text-green-500" : "text-red-500", "bold");
        } else {
          td.textContent = item;
        }

        trRole.appendChild(td);
      });
      table.appendChild(trRole);
    });
  container.appendChild(table);
}

function addRecapContent() {
  const content = document.getElementById("content");
  const table = document.createElement("table");
  const tr = document.createElement("tr");
  tr.id = "tr-header";
  const ths = [
    "Joueur",
    "Rôle",
    "Tour",
    "Cycle",
    "Protégé des Loups-Garous",
    "Protégé de la Sorcière",
    "Actions",
  ];
  ths.forEach((el) => {
    const th = document.createElement("th");
    th.textContent = el;
    th.classList.add("halloween");
    tr.appendChild(th);
  });
  table.appendChild(tr);

  joueurs
    .sort((el, el2) => el.role.tour - el2.role.tour)
    .forEach((el, indexJoueur) => {
      const trJ = document.createElement("tr");

      const { name: nomJoueur, role, elimine } = el;
      const {
        name: nomRole,
        tour,
        tourProtectedLG,
        cycle,
        immuniseSorciere,
      } = role;
      const tds = [
        nomJoueur,
        nomRole,
        tour,
        cycle,
        tourProtectedLG,
        immuniseSorciere,
        elimine,
      ];

      tds.forEach((item, index) => {
        const td = document.createElement("td");
        td.id = "td_" + indexJoueur + "_" + index;
        td.classList.add("halloween");
        if (index === 0) {
          const div = document.createElement("div");
          div.classList.add("flex", "w-full", "justify-between", "px-2");
          const span = document.createElement("span");
          span.textContent = item;
          const listeActions = document.createElement("select");
          const options = [
            null,
            "Empoisonné",
            "Dépecé",
            "Protégé",
            "Ensorcelé",
          ];
          options.forEach((el) => {
            const option = document.createElement("option");
            option.value = el;
            option.textContent = el;
            listeActions.appendChild(option);
          });
          div.appendChild(span);
          div.appendChild(listeActions);
          td.appendChild(div);
        } else if (index === 1) {
          td.classList.add(item.toLowerCase().replaceAll(" ", "-"));
          td.textContent = item;
        } else if (index === 6) {
          td.classList.add("p-1");
          const button = document.createElement("button");
          button.textContent = "Eliminé";
          button.dataset.index = indexJoueur;
          button.addEventListener("click", function () {
            joueurs[this.dataset.index].elimine = true;
            document
              .getElementById("td_" + this.dataset.index + "_0")
              .classList.add("inactif");
            this.parentElement.style.backgroundColor = "black";
            this.remove();
          });
          td.appendChild(button);
        } else if (index === 4) {
          td.textContent = item > 0 ? `\u2713 (${item})` : "\u2715";
          td.classList.add(
            item > 0 ? "text-green-500" : "text-red-500",
            "bold"
          );
        } else {
          if (typeof item === "boolean") {
            td.textContent = item ? "\u2713" : "\u2715";
            td.classList.add(item ? "text-green-500" : "text-red-500", "bold");
          } else {
            td.textContent = item;
          }
        }
        trJ.appendChild(td);
      });
      table.appendChild(trJ);
    });
  content.appendChild(table);
}

function addSummaryRoles() {
  const footer = document.getElementsByTagName("footer")[0];
  footer.classList.add("inactive");
  footer.dataset.active = "false";
  footer.addEventListener("click", function () {
    const value = this.dataset.active === "true";
    this.dataset.active = (!value).toString();

    if (value) {
      this.classList.add("inactive");
      this.classList.remove("active");
    } else {
      this.classList.add("active");
      this.classList.remove("inactive");
    }
  });
  const usedRole = joueurs
    .map((el) => el.role)
    .filter((obj, i, s) => i === s.findIndex((o) => o.name === obj.name))
    .sort((el, el2) => el.tour - el2.tour);

  usedRole.forEach((el) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.title = "Supprimer ce rôle ?";
    div.style.cursor = "pointer";
    div.addEventListener("click", function (event) {
      event.stopPropagation();
      this.remove();
    });
    div.style.backgroundImage = `url('./images/fond/${el.name}.png')`;
    div.style.backgroundSize = "cover";
    const span = document.createElement("span");
    span.classList.add("halloween");
    const image = document.createElement("img");
    image.src = "." + el.image;
    image.style.width = "100px";
    image.style.height = "100px";
    const p = document.createElement("p");
    p.classList.add("description");
    span.textContent = el.name;
    p.textContent = el.description;
    div.classList.add(el.name.toLowerCase().replaceAll(" ", "-"));
    div.appendChild(span);
    div.appendChild(image);
    div.appendChild(p);
    footer.appendChild(div);
  });
}

function colorizeTheme() {
  const heure = new Date().getHours();
  if (heure >= 17 || heure <= 8) {
    document.body.classList.add("!bg-[rgba(0,0,0,0.7)]", "dark-theme");
    const applyHalloweenStyle = (el) => {
      el.classList.add(
        "!text-[darkred]",
        "!text-shadow-lg",
        "!text-shadow-black"
      );
    };
    const applyHalloweenStyleModal = (el) => {
      el.classList.add("!bg-[gray]");
    };
    Array.from(document.getElementsByTagName("h1")).forEach(
      applyHalloweenStyle
    );
    Array.from(document.getElementsByTagName("h2")).forEach(
      applyHalloweenStyle
    );
    Array.from(document.getElementsByClassName("modal-content")).forEach(
      applyHalloweenStyleModal
    );

    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // élément HTML
            if (["h1", "h2"].includes(node.nodeName)) {
              applyHalloweenStyle(node);
            }
            if (node.classList.contains("modal-content")) {
              applyHalloweenStyleModal(node);
            }
            // Vérifie aussi tous les descendants
            node.querySelectorAll?.("h1").forEach(applyHalloweenStyle);
            node.querySelectorAll?.("h2").forEach(applyHalloweenStyle);
            node
              .querySelectorAll?.(".modal-content")
              .forEach(applyHalloweenStyleModal);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}

window.onload = async function () {
  colorizeTheme();
  const players = await getPlayers();
  for (let index = 0; index < players.length; ++index) {
    const choice = await addPlayer(players);

    joueurs.push({
      name: choice.name,
      role: JSON.parse(choice.role),
      elimine: false,
    });
  }
  addRecapContent();
  addSummaryRoles();
};
