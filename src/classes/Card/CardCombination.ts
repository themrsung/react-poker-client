import CardNumber, {
    CardNumberAsArray,
    getNextCardNumber
} from "../../enums/Card/CardNumber"
import CardShape, { CardShapeAsArray } from "../../enums/Card/CardShape"
import CardValue from "../../enums/Card/CardValue"
import Card from "./Card"

enum CardCombinationCompareResult {
    FirstHandWins,
    Split,
    SecondHandWins
}
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
            if (this.getCardsByShape(shape).length >= 5) return true
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

    private getHighestCardInFourCard = () => {
        let highestCard = null

        for (let i = 0; i < CardNumberAsArray.length; i++) {
            const cards = this.getCardsByNumber(CardNumberAsArray[i])
            if (cards.length >= 4) {
                highestCard = cards[0]
            }
        }

        return highestCard
    }

    private hasTriple = () => {
        for (let i = 0; i < CardNumberAsArray.length; i++) {
            const cards = this.getCardsByNumber(CardNumberAsArray[i])
            if (cards.length >= 3) return true
        }

        return false
    }

    private getHighestCardInTriple = () => {
        let highestCard = null

        for (let i = 0; i < CardNumberAsArray.length; i++) {
            const cards = this.getCardsByNumber(CardNumberAsArray[i])
            if (cards.length >= 3) {
                highestCard = cards[0]
            }
        }

        return highestCard
    }

    private hasPair = () => {
        for (let i = 0; i < CardNumberAsArray.length; i++) {
            const cards = this.getCardsByNumber(CardNumberAsArray[i])
            if (cards.length >= 2) return true
        }

        return false
    }

    private getHighestCardInPair = () => {
        let highestCard = null

        for (let i = 0; i < CardNumberAsArray.length; i++) {
            const cards = this.getCardsByNumber(CardNumberAsArray[i])
            if (cards.length === 2) {
                highestCard = cards[0]
            }
        }

        return highestCard
    }

    private getCardNumbersOfPair = () => {
        const numbers: Array<CardNumber> = []

        for (let i = 0; i < CardNumberAsArray.length; i++) {
            const cards = this.getCardsByNumber(CardNumberAsArray[i])
            if (cards.length === 2) {
                numbers.push(cards[0].getNumber())
            }
        }

        return numbers
    }

    private getHighestCard = () => {
        let highestCard: Card | null = null

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i]
            if (!highestCard) {
                highestCard = card
            } else if (highestCard.getNumber() < card.getNumber()) {
                highestCard = card
            }
        }

        return highestCard
    }

    getValue() {
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

        if (
            this.hasTriple() &&
            this.getCardNumbersOfPair().filter(
                cn => cn !== this.getHighestCardInTriple()?.getNumber()
            ).length >= 1
        )
            return CardValue.FullHouse

        if (this.hasFlush()) return CardValue.Flush

        if (this.hasStraight()) return CardValue.Straight

        if (this.hasTriple()) return CardValue.Triple

        if (this.hasPair()) return CardValue.Pair

        return CardValue.HighCard
    }

    static compare(firstHand: CardCombination, secondHand: CardCombination) {
        const FHW = CardCombinationCompareResult.FirstHandWins
        const SPLIT = CardCombinationCompareResult.Split
        const SHW = CardCombinationCompareResult.SecondHandWins

        if (firstHand.getValue() !== secondHand.getValue()) {
            if (firstHand.getValue() > secondHand.getValue()) return FHW
            else return SHW
        } else {
            if (firstHand.getValue() === CardValue.RoyalStraightFlush)
                return SPLIT
            else if (firstHand.getValue() === CardValue.StraightFlush) {
                const firstHandNumber =
                    firstHand.getHighestCardInStraightFlush()?.getNumber() || -1
                const secondHandNumber =
                    secondHand.getHighestCardInStraightFlush()?.getNumber() ||
                    -1

                if (firstHandNumber === secondHandNumber) return SPLIT
                else if (firstHandNumber > secondHandNumber) return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.FourCard) {
                const firstHandNumber =
                    firstHand.getHighestCardInFourCard()?.getNumber() || -1
                const secondHandNumber =
                    secondHand.getHighestCardInFourCard()?.getNumber() || -1

                if (firstHandNumber === secondHandNumber) return SPLIT
                else if (firstHandNumber > secondHandNumber) return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.FullHouse) {
                const firstHandTripleNumber =
                    firstHand.getHighestCardInTriple()?.getNumber() || -1
                const secondHandTripleNumber =
                    secondHand.getHighestCardInTriple()?.getNumber() || -1

                if (firstHandTripleNumber === secondHandTripleNumber) {
                    const firstHandPairNumber =
                        firstHand.getHighestCardInPair()?.getNumber() || -1
                    const secondHandPairNumber =
                        secondHand.getHighestCardInPair()?.getNumber() || -1

                    if (firstHandPairNumber === secondHandPairNumber)
                        return SPLIT
                    else if (firstHandPairNumber > secondHandPairNumber)
                        return FHW
                    else return SHW
                } else if (firstHandTripleNumber > secondHandTripleNumber)
                    return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.Flush) {
                const firstHandFlushNumber =
                    firstHand.getHighestCardInFlush()?.getNumber() || -1
                const secondHandFlushNumber =
                    secondHand.getHighestCardInFlush()?.getNumber() || -1

                if (firstHandFlushNumber === secondHandFlushNumber) return SPLIT
                else if (firstHandFlushNumber > secondHandFlushNumber)
                    return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.Straight) {
                const firstHandStraightNumber =
                    firstHand.getHighestCardInStraight()?.getNumber() || -1
                const secondHandStraightNumber =
                    secondHand.getHighestCardInStraight()?.getNumber() || -1

                if (firstHandStraightNumber === secondHandStraightNumber)
                    return SPLIT
                else if (firstHandStraightNumber > secondHandStraightNumber)
                    return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.Triple) {
                const firstHandTripleNumber =
                    firstHand.getHighestCardInTriple()?.getNumber() || -1
                const secondHandTripleNumber =
                    secondHand.getHighestCardInTriple()?.getNumber() || -1

                if (firstHandTripleNumber === secondHandTripleNumber) {
                    const firstHandWithoutTriple = new CardCombination(
                        firstHand
                            .getCards()
                            .filter(
                                card =>
                                    card.getNumber() !== firstHandTripleNumber
                            )
                    )
                    const secondHandWithoutTriple = new CardCombination(
                        secondHand
                            .getCards()
                            .filter(
                                card =>
                                    card.getNumber() !== secondHandTripleNumber
                            )
                    )

                    const firstHandHighNumber =
                        firstHandWithoutTriple.getHighestCard()?.getNumber() ||
                        -1
                    const secondHandHighNumber =
                        secondHandWithoutTriple.getHighestCard()?.getNumber() ||
                        -1

                    if (firstHandHighNumber === secondHandHighNumber) {
                        const firstHandHighestCard =
                            firstHandWithoutTriple.getHighestCard()
                        const secondHandHighestCard =
                            secondHandWithoutTriple.getHighestCard()

                        if (!firstHandHighestCard && !secondHandHighestCard)
                            return SPLIT
                        if (!firstHandHighestCard) return SHW
                        if (!secondHandHighestCard) return FHW

                        const firstHandWithoutHighCard = new CardCombination(
                            firstHandWithoutTriple
                                .getCards()
                                .filter(card => card !== firstHandHighestCard)
                        )
                        const secondHandWithoutHighCard = new CardCombination(
                            secondHandWithoutTriple
                                .getCards()
                                .filter(card => card !== secondHandHighestCard)
                        )

                        const firstHandLowNumber =
                            firstHandWithoutHighCard
                                .getHighestCard()
                                ?.getNumber() || -1
                        const secondHandLowNumber =
                            secondHandWithoutHighCard
                                .getHighestCard()
                                ?.getNumber() || -1

                        if (firstHandLowNumber === secondHandLowNumber)
                            return SPLIT
                        else if (firstHandLowNumber > secondHandLowNumber)
                            return FHW
                        else return SHW
                    } else if (firstHandHighNumber > secondHandHighNumber)
                        return FHW
                    else return SHW
                } else if (firstHandTripleNumber > secondHandTripleNumber)
                    return FHW
                else return SHW
            }

            // 2P
            // top pair 비교 -> low pair 비교 -> 1장 비교

            // 1P
            // pair 비교 -> 하이카드 3번 비교

            // 하이카드
            // 5번 비교
        }
    }
}

export default CardCombination
export { CardCombinationCompareResult }
