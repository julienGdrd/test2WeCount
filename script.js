import { resultGenerator } from "./backend/resultGenerator.js";

let players = [];
let points = [];

const startBtn = document.getElementById("startBtn");
const resultBtn = document.getElementById("resultBtn");
resultBtn.style.display = "none";

const scoreTab = document.getElementById("scoreTab");
scoreTab.style.display = "none";

const resultTitle = document.querySelector("caption");
const resultTableHeads = document.getElementById("colHead");
const row1Head = document.getElementById("rowPlayer1Name");
const row2Head = document.getElementById("rowPlayer2Name");
const rowPlayer1 = document.getElementById("rowPlayer1");
const rowPlayer2 = document.getElementById("rowPlayer2");

resultBtn.addEventListener("click", function () {
  // Get result table
  import("./backend/resultGenerator.js")
    .then((module) => {
      const resultGenerator = module.resultGenerator;
      const matchResults = resultGenerator(points, players);
      console.log("result from back", matchResults);

      // Clear previous table content
      while (resultTableHeads.children.length > 1) {
        resultTableHeads.removeChild(resultTableHeads.children[1]);
      }
      while (rowPlayer1.children.length > 1) {
        rowPlayer1.removeChild(rowPlayer1.children[1]);
      }
      while (rowPlayer2.children.length > 1) {
        rowPlayer2.removeChild(rowPlayer2.children[1]);
      }

      scoreTab.style.display = "block";
      // Display result in table :
      row1Head.textContent = matchResults.completedSets[0][0].player1Name;
      row2Head.textContent = matchResults.completedSets[0][1].player2Name;

      for (let i = 0; i < matchResults.completedSets.length; i++) {
        const tabHead = document.createElement("th");
        tabHead.setAttribute("scope", "col");
        tabHead.textContent = `Set ${i + 1}`;
        resultTableHeads.appendChild(tabHead);
      }

      const pointsRowPlayer1 = matchResults.completedSets.map(
        (set) => set[0].winnedGames
      );
      const pointsRowPlayer2 = matchResults.completedSets.map(
        (set) => set[1].winnedGames
      );

      const cellsPlayer1 = pointsRowPlayer1.map((points) => {
        const cellPlayer1 = document.createElement("td");
        cellPlayer1.textContent = points;
        return cellPlayer1;
      });

      const cellsPlayer2 = pointsRowPlayer2.map((points) => {
        const cellPlayer2 = document.createElement("td");
        cellPlayer2.textContent = points;
        return cellPlayer2;
      });

      cellsPlayer1.forEach((cell) => {
        rowPlayer1.appendChild(cell);
      });

      cellsPlayer2.forEach((cell) => {
        rowPlayer2.appendChild(cell);
      });

      // Match is not finished
      if (matchResults.matchOver === false) {
        startBtn.textContent = "Pousuivre le match";

        resultTitle.textContent = `Résultat : Jeu en cours, pas de vainqueur`;
        const currentSetHead = document.createElement("th");
        currentSetHead.setAttribute("scope", "col");
        currentSetHead.textContent = "Current set";
        resultTableHeads.appendChild(currentSetHead);

        const currentScoreHead = document.createElement("th");
        currentScoreHead.setAttribute("scope", "col");
        currentScoreHead.textContent = "Current score";
        resultTableHeads.appendChild(currentScoreHead);

        const cellCurrentSetPlayer1 = document.createElement("td");
        cellCurrentSetPlayer1.textContent =
          matchResults.currentScores[0].winnedGames;
        rowPlayer1.appendChild(cellCurrentSetPlayer1);

        const cellCurrentSetPlayer2 = document.createElement("td");
        cellCurrentSetPlayer2.textContent =
          matchResults.currentScores[1].winnedGames;
        rowPlayer2.appendChild(cellCurrentSetPlayer2);

        const cellCurrentGameScorePlayer1 = document.createElement("td");
        cellCurrentGameScorePlayer1.textContent =
          matchResults.currentScores[0].currentScore;
        rowPlayer1.appendChild(cellCurrentGameScorePlayer1);

        const cellCurrentGameScorePlayer2 = document.createElement("td");
        cellCurrentGameScorePlayer2.textContent =
          matchResults.currentScores[1].currentScore;
        rowPlayer2.appendChild(cellCurrentGameScorePlayer2);
      } else {
        resultTitle.textContent = `Résultat : ${matchResults.winner} a gagné le match !`;
        resultBtn.style.display = "none";
        startBtn.textContent = "Nouveau match";
        startBtn.addEventListener("click", function () {
          window.location.reload();
        });
      }
    })
    .catch((error) => {
      console.log("erreur :", error);
    });
});

// Get players details and execute makePointsList()
document
  .getElementById("playersInfos")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const player1Name = document.getElementById("player1_name").value.trim();
    const player2Name = document.getElementById("player2_name").value.trim();
    const player1 = {
      name: player1Name.charAt(0).toUpperCase() + player1Name.slice(1),
      level: parseInt(document.getElementById("player1_level").value),
    };
    players.push(player1);

    const player2 = {
      name: player2Name.charAt(0).toUpperCase() + player2Name.slice(1),
      level: parseInt(document.getElementById("player2_level").value),
    };
    players.push(player2);

    console.log(player1);
    console.log(player2);

    if (player1.name.length === 0 || player2.name.length === 0) {
      console.log("missing name");
      alert("Veuillez saisir les noms des deux joueurs");
    } else if (player1.name === player2.name) {
      alert("Veuillez saisir des noms de joueurs différents");
    } else {
      makePointsList(player1, player2);
    }
  });

// Generate point list
const makePointsList = (player1, player2) => {
  console.log("makePointList :", player1, player2);

  const maxPointsLength = 150;

  const totalLevels = player1.level + player2.level;

  const winProbabilityPlayer1 = player1.level / totalLevels;

  for (let i = 0; i < maxPointsLength; i++) {
    const randomValue = Math.random();

    let pointWinner = "";

    if (winProbabilityPlayer1 > randomValue) {
      pointWinner = player1.name;
    } else {
      pointWinner = player2.name;
    }

    points.push({
      pointWinner: pointWinner,
    });
  }

  // Display point list
  const pointResultList = points.map((point, i) => {
    return `<li>Point ${i + 1} : remporté par ${point.pointWinner}</li>`;
  });

  document.getElementById("pointResultList").innerHTML =
    pointResultList.join("");

  resultBtn.style.display = "block";

  return points;
};
