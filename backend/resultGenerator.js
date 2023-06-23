export function resultGenerator(pointsList, players) {
  const player1Name = players[0].name;
  const player2Name = players[1].name;

  let currentScorePlayer1 = 0;
  let currentScorePlayer2 = 0;

  let winnedGamePlayer1 = 0;
  let winnedGamePlayer2 = 0;

  let winnedSetsPlayer1 = 0;
  let winnedSetsPlayer2 = 0;

  let setResult = [];
  let matchOver = false;
  let matchWinner = "";

  let currentIndex = 0;

  const refreshCurrentScores = () => {
    currentScorePlayer1 = 0;
    currentScorePlayer2 = 0;
  };

  const refreshGamesCounter = () => {
    winnedGamePlayer1 = 0;
    winnedGamePlayer2 = 0;
  };

  while (
    currentIndex < pointsList.length &&
    (winnedSetsPlayer1 < 3 || winnedSetsPlayer2 < 3)
  ) {
    const point = pointsList[currentIndex];

    if (winnedGamePlayer1 === 6 && winnedGamePlayer2 === 6) {
      // Tie break
      refreshCurrentScores();

      while (currentIndex < pointsList.length) {
        const tieBreakPoint = pointsList[currentIndex];

        if (tieBreakPoint.pointWinner === player1Name) {
          currentScorePlayer1++;
        } else {
          currentScorePlayer2++;
        }

        if (
          currentScorePlayer1 >= 7 &&
          currentScorePlayer1 - currentScorePlayer2 >= 2
        ) {
          winnedGamePlayer1++;
          setResult.push([
            {
              tieBreak: true,
              player1Name: player1Name,
              winnedGames: winnedGamePlayer1,
            },
            {
              tieBreak: true,
              player2Name: player2Name,
              winnedGames: winnedGamePlayer2,
            },
          ]);
          refreshGamesCounter();
          refreshCurrentScores();
          currentIndex++;
          break;
        } else if (
          currentScorePlayer2 >= 7 &&
          currentScorePlayer2 - currentScorePlayer1 >= 2
        ) {
          winnedGamePlayer2++;
          setResult.push([
            {
              tieBreak: true,
              player1Name: player1Name,
              winnedGames: winnedGamePlayer1,
            },
            {
              tieBreak: true,
              player2Name: player2Name,
              winnedGames: winnedGamePlayer2,
            },
          ]);
          refreshGamesCounter();
          refreshCurrentScores();
          currentIndex++;
          break;
        }

        currentIndex++;
      }
    } else {
      // Normal counting for points / games / sets
      if (point.pointWinner === player1Name) {
        currentScorePlayer1++;
      } else {
        currentScorePlayer2++;
      }

      if (
        currentScorePlayer1 >= 4 &&
        currentScorePlayer1 - currentScorePlayer2 >= 2
      ) {
        winnedGamePlayer1++;
        refreshCurrentScores();
      } else if (
        currentScorePlayer2 >= 4 &&
        currentScorePlayer2 - currentScorePlayer1 >= 2
      ) {
        winnedGamePlayer2++;
        refreshCurrentScores();
      }
      currentIndex++;
    }

    // Winned sets counter
    if (winnedGamePlayer1 >= 6 && winnedGamePlayer1 - winnedGamePlayer2 >= 2) {
      winnedSetsPlayer1++;
      setResult.push([
        {
          player1Name: player1Name,
          winnedGames: winnedGamePlayer1,
        },
        {
          player2Name: player2Name,
          winnedGames: winnedGamePlayer2,
        },
      ]);
      refreshGamesCounter();
    } else if (
      winnedGamePlayer2 >= 6 &&
      winnedGamePlayer2 - winnedGamePlayer1 >= 2
    ) {
      winnedSetsPlayer2++;
      setResult.push([
        {
          player1Name: player1Name,
          winnedGames: winnedGamePlayer1,
        },
        {
          player2Name: player2Name,
          winnedGames: winnedGamePlayer2,
        },
      ]);
      refreshGamesCounter();
    }

    // check if winner
    if (winnedSetsPlayer1 === 3 || winnedSetsPlayer2 === 3) {
      matchWinner =
        winnedSetsPlayer1 === 3
          ? player1Name
          : winnedSetsPlayer2 === 3
          ? player2Name
          : "";
      matchOver = true;
      break;
    }
  }

  const formatCurrentScore = (currentScorePlayer1, currentScorePlayer2) => {
    const scoreTraduction = {
      0: "0",
      1: "15",
      2: "30",
      3: "40",
    };

    let player1FormattedScore, player2FormattedScore;

    if (
      (currentScorePlayer1 >= 4 &&
        currentScorePlayer1 - currentScorePlayer2 === 1) ||
      (currentScorePlayer2 >= 4 &&
        currentScorePlayer2 - currentScorePlayer1 === 1)
    ) {
      if (currentScorePlayer1 > currentScorePlayer2) {
        player1FormattedScore = "AV";
        player2FormattedScore = "-";
      } else {
        player1FormattedScore = "-";
        player2FormattedScore = "AV";
      }
    } else {
      player1FormattedScore = scoreTraduction[currentScorePlayer1];
      player2FormattedScore = scoreTraduction[currentScorePlayer2];
    }

    return {
      player1FormattedScore,
      player2FormattedScore,
    };
  };

  const formatedscores = formatCurrentScore(
    currentScorePlayer1,
    currentScorePlayer2
  );

  const matchResult = {
    matchOver: matchOver,
    winner: matchWinner,
    completedSets: setResult,
    currentScores: [
      {
        player1: player1Name,
        winnedGames: winnedGamePlayer1,
        currentScore: formatedscores.player1FormattedScore,
      },
      {
        player2: player2Name,
        winnedGames: winnedGamePlayer2,
        currentScore: formatedscores.player2FormattedScore,
      },
    ],
  };
  return matchResult;
}
