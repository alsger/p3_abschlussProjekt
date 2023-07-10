const LivingCreature = require('./livingCreature');
const myFuncs = require('../Functions/functions');
const random = require('../Functions/utils');
module.exports = class Predator extends LivingCreature {
    constructor(x, y) {
        super(x, y);
        // Farbe - red
        this.colorValue = 3;

        this.eatCount = 0;
        this.notEaten = 0;
    }

    getNewCoordinates() {
        this.directions = [
            [this.x - 1, this.y - 1],
            [this.x, this.y - 1],
            [this.x + 1, this.y - 1],
            [this.x - 1, this.y],
            [this.x + 1, this.y],
            [this.x - 1, this.y + 1],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ]
    }

    chooseCell(creature) {
        this.getNewCoordinates();
        return super.chooseCell(creature);
    }

    updateGameAndPos(newX, newY) {
        matrix[newY][newX] = this.colorValue;
        matrix[this.y][this.x] = 0;
        this.x = newX;
        this.y = newY;
    }

    eat() {
        let fields = this.chooseCell(2);
        if (fields.length > 0) {
            let pos = random(fields);
            this.updateGameAndPos(pos[0], pos[1]);
            myFuncs.removeFromList(this, grazerArr); // Grasfresser löschen

            this.eatCount++;
            this.notEaten = 0;

            this.mul();

        } else {
            this.notEaten++;
            this.eatCount = 0;
            if (this.notEaten >= 8) {
                this.die();
            } else {
                this.move();
                this.mul();
            }
        }
    }

    move() {
        let emptyFields = this.chooseCell(0);
        if (emptyFields.length > 0) {
            let pos = random(emptyFields);
            this.updateGameAndPos(pos[0], pos[1]);
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        myFuncs.removeFromList(this, predatorArr);
    }

    mul() {
        if (isRaining && this.eatCount >= 8) {
            let emptyCells = this.chooseCell(0);
            let theChosenField = emptyCells[Math.floor(Math.random() * emptyCells.length)]
            if (theChosenField) {
                let newGrazerObj = new Predator(theChosenField[0], theChosenField[1])
                grazerArr.push(newGrazerObj)
                matrix[theChosenField[1]][theChosenField[0]] = 2
            }
            this.eatCount = 0;
        }
        else if (this.eatCount >= 10) {
            let emptyCells = this.chooseCell(0);
            let theChosenField = emptyCells[Math.floor(Math.random() * emptyCells.length)]
            if (theChosenField) {
                let newGrazerObj = new Predator(theChosenField[0], theChosenField[1])
                grazerArr.push(newGrazerObj)
                matrix[theChosenField[1]][theChosenField[0]] = 2
            }
            this.eatCount = 0;
        }
        else if (isSnowing && this.eatCount >= 12) {
            let emptyCells = this.chooseCell(0);
            let theChosenField = emptyCells[Math.floor(Math.random() * emptyCells.length)]
            if (theChosenField) {
                let newGrazerObj = new Predator(theChosenField[0], theChosenField[1])
                grazerArr.push(newGrazerObj)
                matrix[theChosenField[1]][theChosenField[0]] = 2
            }
            this.eatCount = 0;
        }
    }
}