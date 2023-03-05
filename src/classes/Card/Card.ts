import CardNumber from "../../enums/Card/CardNumber"
import CardShape from "../../enums/Card/CardShape"

class Card {
    constructor(number: CardNumber, shape: CardShape) {
        this.number = number
        this.shape = shape
    }

    private number: CardNumber
    private shape: CardShape

    // prettier-ignore
    getNumber() { return this.number }

    // prettier-ignore
    getShape() { return this.shape }
}

export default Card
