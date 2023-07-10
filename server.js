const Grass = require("./Classes/grass.js");
const Grazer = require("./Classes/grazer.js");
const Predator = require("./Classes/predator.js");

const express = require("express");
const app = express();

let httpServer = require("http").Server(app);
let { Server } = require("socket.io");
const io = new Server(httpServer);

app.use(express.static("./"));

app.get("./", function (req, res) {
    res.redirect("client.html");
})

matrix = randomMatrix(50, 50);
isRaining = false;
isSnowing = false;
let interval = 500;

grassArr = [];
grazerArr = [];
predatorArr = [];

function randomMatrix(x, y) {
    let matrix = [];
    for (let i = 0; i < y; i++) {
        matrix[i] = [];
        for (let j = 0; j < x; j++) {
            let randInt = Math.floor(Math.random() * 5) + 1;
            if (randInt == 1) matrix[i][j] = 1;
            else if (randInt == 2) {
                if (Math.floor(Math.random() * 2) == 1) matrix[i][j] = 2;
                else matrix[i][j] = 0;
            } else if (randInt == 3) {
                if (Math.floor(Math.random() * 8) == 1) matrix[i][j] = 3;
                else matrix[i][j] = 0;
            } else if (randInt == 4 || randInt == 5) {
                matrix[i][j] = 0;
            }
        }
    }
    return matrix;
}

function killAllGrasses() {
    for (let i = 0; i < grassArr.length; i++) {
        let grassObj = grassArr[i];
        matrix[grassObj.y][grassObj.x] = 0;
    }
    grassArr = [];
}

function killAllGrazers() {
    for (let i = 0; i < grazerArr.length; i++) {
        matrix[grazerArr[i].y][grazerArr[i].x] = 0;
    }
    grazerArr = [];
}

function checkCreatures() {
    return grassArr.length + grazerArr.length + predatorArr.length;
}

function initGame() {
    for (let z = 0; z < matrix.length; z++) {
        for (let s = 0; s < matrix[z].length; s++) {
            if (matrix[z][s] == 1) grassArr.push(new Grass(s, z));
            else if (matrix[z][s] == 2) grazerArr.push(new Grazer(s, z));
            else if (matrix[z][s] == 3) predatorArr.push(new Predator(s, z));
        }
    }
}

function updateGame() {
    if (checkCreatures() <= 6) {
        matrix = randomMatrix(50, 50);

        grassArr = [];
        grazerArr = [];
        predatorArr = [];

        initGame();
    }
    for (let i in grassArr) {
        grassArr[i].mul();
    }
    for (let i in grazerArr) {
        grazerArr[i].eat();
        grazerArr[i].mul();
    }
    for (let i in predatorArr) {
        predatorArr[i].eat();
        predatorArr[i].mul();
    }

    io.emit("send matrix", matrix);
    io.emit("isRaining", isRaining);
    io.emit("isSnowing", isSnowing);
    io.emit("checkLivings", checkCreatures());
}

io.on("connection", function (socket) {
    console.log("client ws connection established...")
    io.emit("send matrix", matrix);
    io.emit("isRaining", isRaining);
    io.emit("isSnowing", isSnowing);

    socket.on("killAllGrasses", killAllGrasses);
    socket.on("killAllGrazers", killAllGrazers);
})

initGame();
setInterval(() => {
    updateGame();
    isRaining = false;
    isSnowing = false;

    if (isRaining) {
        interval = 1000;
    } else {
        interval = 500;
    }
}, interval)
updateGame();

setInterval(function () {
    isRaining = !isRaining;
    isSnowing = false;
    console.log("isRaining: " + isRaining)
    io.on("connection", (socket) => {
        socket.emit("isRaining", isRaining)
    })
}, interval * 4)

setInterval(function () {
    if (!isRaining) {
        isSnowing = true;
        console.log("isSnowing: " + isSnowing);
        io.on("connection", (socket) => {
            socket.emit("isSnowing", isSnowing);
        })
    }
}, interval * 2)

httpServer.listen(3000, function () {
    console.log("Server läuft auf Port 3000...")
})
