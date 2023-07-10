let side = 10;
let map = 50;
lIsRaining = false;
lIsSnowing = false;
const socket = io();

function main() {

    socket.on("send matrix", drawMatrix)
    socket.on("isRaining", (pIsRaining) => {
        lIsRaining = pIsRaining
        if (lIsRaining == true) {
            document.getElementById("isRaining").innerHTML = "Raining : true";
        } else {
            document.getElementById("isRaining").innerHTML = "Raining : false";
        }
    })
    socket.on("isSnowing", (pIsSnowing) => {
        lIsSnowing = pIsSnowing;
        if (lIsSnowing == true) {
            document.getElementById("isSnowing").innerHTML = "Snowing: true";
        } else {
            document.getElementById("isSnowing").innerHTML = "Snowing: false";
        }
    })
    socket.on("checkLivings", (pLivingsCounter) => {
        lLivingsCounter = pLivingsCounter;
        document.getElementById("livingsCounter").innerHTML = lLivingsCounter;
    })

    function killAllGrasses() {
        // sende Nachrichten an Server
        socket.emit('killAllGrasses', 'Poison');
    }
    function killAllGrazers() {
        // sende Nachrichten an Server
        socket.emit('killAllGrazers', 'Plague');
    }
    let btn = document.getElementById('killAllGrasses');
    btn.onclick = killAllGrasses;

    let btn2 = document.getElementById('killAllGrazers');
    btn2.onclick = killAllGrazers;
}

function setup() {
    createCanvas(map * side + 1, map * side + 1);
    background("white");
}

function drawMatrix(matrix) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            fill('white');
            if (matrix[y][x] == 1) { //Grass
                if (lIsRaining == true) {
                    fill("#0d3b24");
                } else if (lIsSnowing == true) {
                    fill("#979c99");
                } else {
                    fill("#28764F");
                }
            } else if (matrix[y][x] == 2) { //Grazer
                if (lIsRaining == true) {
                    fill("#785207");
                } else if (lIsSnowing == true) {
                    fill("#d9bf8b");
                } else {
                    fill("#DB960B");
                }
            } else if (matrix[y][x] == 3) { //Predator
                if (lIsRaining == true) {
                    fill("#631005");
                } else if (lIsSnowing == true) {
                    fill("#b36359");
                } else {
                    fill("#961707");
                }
            }
            rect(x * side, y * side, side, side);

            fill("black");
        }
    }
}

main();
