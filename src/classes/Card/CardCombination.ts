import CardNumber, {
    CardNumberAsArray,
    getNextCardNumber
} from "../../enums/Card/CardNumber"
import CardShape, { CardShapeAsArray } from "../../enums/Card/CardShape"
import CardValue from "../../enums/Card/CardValue"
import Card from "./Card"

class CardCombination {
    constructor(cards: Array<Card>) {
        this.cards = cards
    }

    private cards: Array<Card>

    // prettier-ignore
    getCards() { return this.cards }

    // prettier-ignore
    getCardsByShape(shape: CardShape) { return this.cards.filter(c => c.getShape() === shape) }

    // prettier-ignore
    getCardsByNumber(number: CardNumber) { return this.cards.filter(c => c.getNumber() === number) }

    private hasFlush = () => {
        for (let i = 0; i < CardShapeAsArray.length; i++) {
            const shape = CardShapeAsArray[i]
            if (this.getCardsByShape(CardShapeAsArray[i]).length >= 5)
                return true
        }

        return false
    }

    private getHighestCardInFlush = () => {
        const shapesWithFlush: Array<CardShape> = []

        for (let i = 0; i < CardShapeAsArray.length; i++) {
            if (this.getCardsByShape(CardShapeAsArray[i]).length >= 5)
                shapesWithFlush.push(CardShapeAsArray[i])
        }

        let highestCard: Card | null = null

        for (let i = 0; i < shapesWithFlush.length; i++) {
            const cards = this.getCardsByShape(shapesWithFlush[i])
            cards.sort((a: Card, b: Card) => a.getNumber() - b.getNumber())

            if (highestCard) {
                if (cards[0].getNumber() > highestCard.getNumber())
                    highestCard = cards[0]
            } else {
                highestCard = cards[0]
            }
        }

        return highestCard
    }

    private hasStraight = () => {
        for (let i = 0; i < CardNumberAsArray.length - 4; i++) {
            const firstNumber: CardNumber = Object.values(CardNumber).indexOf(
                CardNumberAsArray[i]
            )
            const secondNumber = getNextCardNumber(firstNumber)
            const thirdNumber = getNextCardNumber(secondNumber)
            const fourthNumber = getNextCardNumber(thirdNumber)
            const fifthNumber = getNextCardNumber(fourthNumber)

            const requiredNumbers: Array<CardNumber> = [
                firstNumber,
                secondNumber,
                thirdNumber,
                fourthNumber,
                fifthNumber
            ]

            let isStraight = true

            for (let i = 0; i < requiredNumbers.length; i++) {
                if (this.getCardsByNumber(requiredNumbers[i]).length < 1)
                    isStraight = false
            }

            if (isStraight) return true
        }

        return false
    }

    private getHighestCardInStraightFlush = () => {
        const highestFlushCard = this.getHighestCardInFlush()
        const highestStraightCard = this.getHighestCardInStraight()

        if (!highestFlushCard || !highestStraightCard) return null

        const highestCard =
            highestFlushCard?.getNumber() > highestStraightCard?.getNumber()
                ? highestStraightCard
                : highestFlushCard
        return highestCard
    }

    private getHighestCardInStraight = () => {
        let lastHighestCardInStraight = null
        let straightStreak = 0

        for (let i = 0; i < CardNumberAsArray.length; i++) {
            const cards = this.getCardsByNumber(CardNumberAsArray[i])
            if (cards.length > 0) {
                if (straightStreak >= 5) {
                    lastHighestCardInStraight = cards[i]
                }

                straightStreak++
            } else {
                straightStreak = 0
            }
        }

        return lastHighestCardInStraight
    }

    private hasFourCard = () => {
        for (let i = 0; i < CardNumberAsArray.length; i++) {
            const cards = this.getCardsByNumber(CardNumberAsArray[i])
            if (cards.length >= 4) return true
        }

        return false
    }

    getCardCombinationValue() {
        if (this.hasFlush() && this.hasStraight()) {
            if (
                this.getHighestCardInStraightFlush()?.getNumber() ===
                CardNumber.Ace
            ) {
                return CardValue.RoyalStraightFlush
            } else {
                return CardValue.StraightFlush
            }
        }

        if (this.hasFourCard()) return CardValue.FourCard

        // full house

        if (this.hasFlush()) return CardValue.Flush

        if (this.hasStraight()) return CardValue.Straight

        // triple

        // 2p

        // 1p

        return CardValue.HighCard
    }
}

export default Card
