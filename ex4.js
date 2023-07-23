(function () {
    let status = true;
    let col = 4;
    let row = 4;
    let delay1 = 0.5;
    let gameName;
    const best = 100;
    let scoresList = []

    /** A function that receives the elements and activates a toggle on them.
     * from d-nones, the elements become nones
     * @param elm: element
     */
    function toggleElement(elm) {
        document.getElementById(`${elm}`).classList.toggle("d-none");
    }

    document.addEventListener("DOMContentLoaded", function () {

        document.forms['register-form'].addEventListener("submit", function (event) {

            event.preventDefault();
            /** Checks the validity of the name that the user enters
             */
            if (validateName(this.username.value.trim())) {
                document.querySelector(".username-error").innerText = "Please match the requested format";
                status = false;
            } else {
                gameName = this.username.value.toLowerCase();
                document.querySelector(".username-error").innerText = "";
                status = true;
            }
            if (status) {
                toggleElement("setting")
                play.createGrid();

            }

            /**
             * Checks if the name entered by the user contains only letters and numbers,
             * and is up to 12 characters long
             * @param str: the name of the player
             * @returns {boolean}
             */
            function validateName(str) {
                let regex = /[\w 0-9]/
                let result = regex.test(str);

                return (str.toString().length < 12 && result && !str.toString().includes(" "));
            }

            return false;
        });

        document.getElementById("settingButton").addEventListener("click", (event) => {
            toggleElement("addSetting");

        });

        document.getElementById("backButton").addEventListener("click", (event) => {
            play.setCurrSteps();
            toggleElement("Game");
            toggleElement("setting");

        });
        document.getElementById("HighScore").addEventListener("click", (event) => {
            play.createTable("modalScore");
        });


        document.getElementById("okButton").addEventListener("click", (event) => {
            toggleElement("setting");
            toggleElement("win");

        });

        /** A function that checks if the board size is even.
         * If the board size is odd an error message will be returned.
         */
        function validateBoardSize() {
            row = document.getElementById("numOfRows").value;
            col = document.getElementById("numOfCols").value;
            delay1 = document.getElementById("numOfSeconds").value;

            if ((row * col) % 2 === 1) {
                document.querySelector(".error-grid").innerText = "Number of cards (rows X columns) must be" +
                    " even, please correct your choice";
                status = false;
            } else {
                document.querySelector(".error-grid").innerText = "";
                status = true;
            }
        }

        document.getElementById("numOfCols").addEventListener('change', validateBoardSize);
        document.getElementById("numOfRows").addEventListener('change', validateBoardSize);

        let divs = document.querySelectorAll("#grid");
        play.flipCards(divs);

    });

    /** Starting the game, after the player clicked play
     * @returns {{createTable: createTable, createGrid: createGrid, flipCards: flipCards, setCurrSteps: setCurrSteps}}
     */
    const play = function () {

        //Checks how many cards are open
        let numOfOpenCards = 0;
        //The size of the board
        let matrix = [row * col];
        //Check how many steps the player do
        let currStep = 0;
        //To find a pairs
        let card1, card2;
        //Checks the number of pairs on the board
        let pairs = 0;
        //The current score
        let currScore = 0;
        //The user rank
        let rank;

        /** A function that creates the game board, and displays cards according to
         * the size of the board, that the user chose in the settings
         */
        function createGrid() {
            createShuffleArray();
            toggleElement("Game")
            document.querySelector("#grid").innerText = "";

            let newGame = document.createElement("div");
            document.getElementById("grid").appendChild(newGame);

            let currCard = 0;
            //Builds the game board and puts the image of the upside down card into it
            for (let i = 0; i < row; i++) {
                let newRow = document.createElement("div");
                newRow.classList.add("row", "justify-content-center");
                newGame.appendChild(newRow);

                for (let j = 0; j < col; j++) {
                    let newCol = document.createElement("div");
                    newCol.classList.add('col-2');
                    let newImg = document.createElement('img')
                    newImg.setAttribute("id", `${currCard}`);
                    newImg.setAttribute('src', 'images/card.jpg');
                    newImg.classList.add("img-fluid");
                    newImg.classList.add("img-thumbnail");
                    newCol.appendChild(newImg);
                    newRow.appendChild(newCol);
                    currCard++;
                }
            }
            //Show how many steps the user do
            document.querySelector(".steps").innerText = `Steps: ${currStep}`;
        }

        /** A function that mixes the images and is responsible for
         * each game having different images
         */
        function createShuffleArray() {
            let place = 0;
            document.querySelector(".steps").innerText = "";

            //16 is the number of the cards that can be on the screen
            let rand = 16 - ((row * col) / 2);
            let start = Math.floor(Math.random() * rand)
            let end = (row * col) / 2 + start;
            for (let i = start; i < end; i++) {
                matrix[place] = i;
                matrix[place + 1] = i;
                place += 2;
            }
            for (let i = (row * col) - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * i);
                exchange(i, j);
            }
        }

        /** Function that exchange i and j in the matrix
         * @param i
         * @param j
         */
        function exchange(i, j) {
            let temp = matrix[i];
            matrix[i] = matrix[j];
            matrix[j] = temp;
        }

        /** A function that flips the card when the user clicks on it. In the game only two cards can be
         * open at the same time. If two identical cards are found they will remain open,
         * otherwise they will be closed.
         * @param grid
         */
        function flipCards(grid) {
            const flipCard = e => {
                //Open card number one
                if (numOfOpenCards === 0)
                    card1 = e.target;
                //Open card number two
                else if (numOfOpenCards === 1) {
                    card2 = e.target;
                }
                //To put a picture instead of the card
                if (numOfOpenCards !== 2 && card1 !== card2) {
                    let img = matrix[e.target.id];
                    e.target.setAttribute('src', `images/${img}.jpg`);
                    currStep++;
                    numOfOpenCards++;
                    document.querySelector(".steps").innerText = `Steps: ${currStep}`;
                }

                /* If the cards are different, they will flip back according to the
                 time the user selected in the settings
                 */
                if (numOfOpenCards === 2) {
                    if (matrix[card1.id] !== matrix[card2.id]) setTimeout(closeCards, delay1 * 1000);
                    else {
                        numOfOpenCards = 0;
                        pairs++;
                    }
                }
                //If the two cards selected are the same
                if (pairs === (row * col) / 2)
                    setWinGame();
            }

            grid.forEach(div => {
                div.addEventListener("click", flipCard);
            })

        }

        /** A function closes the cards, meaning that the opposite card will appear
         */
        function closeCards() {
            card1.setAttribute('src', `images/card.jpg`);
            card2.setAttribute('src', `images/card.jpg`);
            numOfOpenCards = 0;
        }

        /** Reset the number of steps taken by the player in the game
         */
        function setCurrSteps() {
            currStep = 0;
        }

        /** After all the pairs in the game have been found, the end screen will
         * appear with a leaderboard, score, player rating and the size of
         * the board the player played on, and reset the data for the next game.
         */
        function setWinGame() {

            updateScore();
            pairs = 0;
            currStep = 0;

            toggleElement("Game");
            let str = `Number of cards played: ${row * col}`;
            str += "\n" + `Score: ${currScore}.`
            str += "\n" + `You are ranked ${rank} out of 3`

            toggleElement("win");
            document.querySelector(".winText").innerText = `${str}`;

        }

        /** A function that calculates the current score, and displays
         * the player's three highest scores both in the leaderboard and
         * at the end of the game
         */
        function updateScore() {
            currScore = Math.trunc(((row * col) / currStep) * best);

            if (!nameInTable()) {
                //To push the score to the array scores
                scoresList.push({name: gameName, score: currScore});
            }
            sortScores();

            if (scoresList.length > 3) {
                scoresList.pop();
            }

            if (scoresList.length === 1) {
                createTable("Score");
                createTable("modalScore");
            } else {
                createTable("Score");
                createTable("modalScore");
            }
        }

        /** Function that check if the names of the players is in the table score
         * @returns {boolean}
         */
        function nameInTable() {
            return scoresList.find((element) => {
                if (element.name === gameName) {
                    if (element.score < currScore)
                        element.score = currScore;
                    return true;
                }
                return false;
            });
        }


        /** Creating the leaderboard
         * @param place (the place that we represent the table)
         */
        function createTable(place) {

            let num = 1;
            let newThead = document.createElement("thead");
            document.querySelector(`#${place}`).innerText = "";
            document.getElementById(`${place}`).appendChild(newThead);

            createTableHeaders(newThead);

            scoresList.forEach(a => {
                let newTr2 = document.createElement("tr");
                let newRow = document.createElement("th");
                newRow.setAttribute('scope', "row")
                newRow.innerHTML = `${num}`;
                let newTd1 = document.createElement("td");
                if (a.name === gameName)
                    rank = num;
                newTd1.innerHTML = `${a.name}`;
                let newTd2 = document.createElement("td");
                newTd2.innerHTML = `${a.score}`;
                newTr2.appendChild(newRow);
                newTr2.appendChild(newTd1);
                newTr2.appendChild(newTd2);
                newThead.appendChild(newTr2);
                num++
            })

        }

        /** A function that creates the headers in the table: rank, player name and his score
         * @param newThead
         */
        function createTableHeaders(newThead) {
            let newTr1 = document.createElement("tr");
            let newTh1 = document.createElement("th");
            newTh1.innerHTML = "Rank";
            let newTh2 = document.createElement("th");
            newTh2.innerHTML = "Player";
            let newTh3 = document.createElement("th");
            newTh3.innerHTML = "Score";
            newTr1.appendChild(newTh1);
            newTr1.appendChild(newTh2);
            newTr1.appendChild(newTh3);
            newThead.appendChild(newTr1);
        }

        /**
         * Sort the scores for the table score
         */
        function sortScores() {
            scoresList.sort((a, b) => (a.score > b.score) ? -1 : 1);
        }

        return {
            createGrid: createGrid,
            flipCards: flipCards,
            setCurrSteps: setCurrSteps,
            createTable: createTable

        }

    }();
})();





