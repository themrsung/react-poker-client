import CardNumber, { CardNumberAsArray, getNextCardNumber } from "../../enums/Card/CardNumber"
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
            if (this.getCardsByShape(CardShapeAsArray[i]).length >= 5) shapesWithFlush.push(CardShapeAsArray[i])
        }

        let highestCard: Card | null = null

        for (let i = 0; i < shapesWithFlush.length; i++) {
            const cards = this.getCardsByShape(shapesWithFlush[i])
            cards.sort((a: Card, b: Card) => a.getNumber() - b.getNumber())

            if (highestCard) {
                if (cards[0].getNumber() > highestCard.getNumber()) highestCard = cards[0]
            } else {
                highestCard = cards[0]
            }
        }

        return highestCard
    }

    private hasStraight = () => {
        for (let i = 0; i < CardNumberAsArray.length - 4; i++) {
            const firstNumber: CardNumber = Object.values(CardNumber).indexOf(CardNumberAsArray[i])
            const secondNumber = getNextCardNumber(firstNumber)
            const thirdNumber = getNextCardNumber(secondNumber)
            const fourthNumber = getNextCardNumber(thirdNumber)
            const fifthNumber = getNextCardNumber(fourthNumber)

            const requiredNumbers: Array<CardNumber> = [firstNumber, secondNumber, thirdNumber, fourthNumber, fifthNumber]

            let isStraight = true

            for (let i = 0; i < requiredNumbers.length; i++) {
                if (this.getCardsByNumber(requiredNumbers[i]).length < 1) isStraight = false
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
            highestFlushCard?.getNumber() > highestStraightCard?.getNumber() ? highestStraightCard : highestFlushCard
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
            if (this.getHighestCardInStraightFlush()?.getNumber() === CardNumber.Ace) {
                return CardValue.RoyalStraightFlush
            } else {
                return CardValue.StraightFlush
            }
        }

        if (this.hasFourCard()) return CardValue.FourCard

        if (
            this.hasTriple() &&
            this.getCardNumbersOfPair().filter(cn => cn !== this.getHighestCardInTriple()?.getNumber()).length >= 1
        )
            return CardValue.FullHouse

        if (this.hasFlush()) return CardValue.Flush

        if (this.hasStraight()) return CardValue.Straight

        if (this.hasTriple()) return CardValue.Triple

        if (this.hasPair()) {
            const handWithoutPair = new CardCombination(
                this.cards.filter(card => card.getNumber() !== this.getHighestCardInPair()?.getNumber())
            )
            if (handWithoutPair.hasPair()) return CardValue.TwoPair

            return CardValue.Pair
        }

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
            if (firstHand.getValue() === CardValue.RoyalStraightFlush) return SPLIT
            else if (firstHand.getValue() === CardValue.StraightFlush) {
                const firstHandNumber = firstHand.getHighestCardInStraightFlush()?.getNumber() || -1
                const secondHandNumber = secondHand.getHighestCardInStraightFlush()?.getNumber() || -1

                if (firstHandNumber === secondHandNumber) return SPLIT
                else if (firstHandNumber > secondHandNumber) return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.FourCard) {
                const firstHandNumber = firstHand.getHighestCardInFourCard()?.getNumber() || -1
                const secondHandNumber = secondHand.getHighestCardInFourCard()?.getNumber() || -1

                if (firstHandNumber === secondHandNumber) return SPLIT
                else if (firstHandNumber > secondHandNumber) return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.FullHouse) {
                const firstHandTripleNumber = firstHand.getHighestCardInTriple()?.getNumber() || -1
                const secondHandTripleNumber = secondHand.getHighestCardInTriple()?.getNumber() || -1

                if (firstHandTripleNumber === secondHandTripleNumber) {
                    const firstHandPairNumber = firstHand.getHighestCardInPair()?.getNumber() || -1
                    const secondHandPairNumber = secondHand.getHighestCardInPair()?.getNumber() || -1

                    if (firstHandPairNumber === secondHandPairNumber) return SPLIT
                    else if (firstHandPairNumber > secondHandPairNumber) return FHW
                    else return SHW
                } else if (firstHandTripleNumber > secondHandTripleNumber) return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.Flush) {
                const firstHandFlushNumber = firstHand.getHighestCardInFlush()?.getNumber() || -1
                const secondHandFlushNumber = secondHand.getHighestCardInFlush()?.getNumber() || -1

                if (firstHandFlushNumber === secondHandFlushNumber) return SPLIT
                else if (firstHandFlushNumber > secondHandFlushNumber) return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.Straight) {
                const firstHandStraightNumber = firstHand.getHighestCardInStraight()?.getNumber() || -1
                const secondHandStraightNumber = secondHand.getHighestCardInStraight()?.getNumber() || -1

                if (firstHandStraightNumber === secondHandStraightNumber) return SPLIT
                else if (firstHandStraightNumber > secondHandStraightNumber) return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.Triple) {
                const firstHandTripleNumber = firstHand.getHighestCardInTriple()?.getNumber() || -1
                const secondHandTripleNumber = secondHand.getHighestCardInTriple()?.getNumber() || -1

                if (firstHandTripleNumber === secondHandTripleNumber) {
                    const firstHandWithoutTriple = new CardCombination(
                        firstHand.getCards().filter(card => card.getNumber() !== firstHandTripleNumber)
                    )
                    const secondHandWithoutTriple = new CardCombination(
                        secondHand.getCards().filter(card => card.getNumber() !== secondHandTripleNumber)
                    )

                    const firstHandHighNumber = firstHandWithoutTriple.getHighestCard()?.getNumber() || -1
                    const secondHandHighNumber = secondHandWithoutTriple.getHighestCard()?.getNumber() || -1

                    if (firstHandHighNumber === secondHandHighNumber) {
                        const firstHandHighestCard = firstHandWithoutTriple.getHighestCard()
                        const secondHandHighestCard = secondHandWithoutTriple.getHighestCard()

                        if (!firstHandHighestCard && !secondHandHighestCard) return SPLIT
                        if (!firstHandHighestCard) return SHW
                        if (!secondHandHighestCard) return FHW

                        const firstHandWithoutHighCard = new CardCombination(
                            firstHandWithoutTriple.getCards().filter(card => card !== firstHandHighestCard)
                        )
                        const secondHandWithoutHighCard = new CardCombination(
                            secondHandWithoutTriple.getCards().filter(card => card !== secondHandHighestCard)
                        )

                        const firstHandLowNumber = firstHandWithoutHighCard.getHighestCard()?.getNumber() || -1
                        const secondHandLowNumber = secondHandWithoutHighCard.getHighestCard()?.getNumber() || -1

                        if (firstHandLowNumber === secondHandLowNumber) return SPLIT
                        else if (firstHandLowNumber > secondHandLowNumber) return FHW
                        else return SHW
                    } else if (firstHandHighNumber > secondHandHighNumber) return FHW
                    else return SHW
                } else if (firstHandTripleNumber > secondHandTripleNumber) return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.TwoPair) {
                const firstHandPairNumber = firstHand.getHighestCardInPair()?.getNumber() || -1
                const secondHandPairNumber = secondHand.getHighestCardInPair()?.getNumber() || -1

                if (firstHandPairNumber === secondHandPairNumber) {
                    const firstHandWithoutPair = new CardCombination(
                        firstHand.getCards().filter(card => card.getNumber() !== firstHandPairNumber)
                    )
                    const secondHandWithoutPair = new CardCombination(
                        secondHand.getCards().filter(card => card.getNumber() !== secondHandPairNumber)
                    )

                    const firstHandSecondPairNumber = firstHandWithoutPair.getHighestCardInPair()?.getNumber() || -1
                    const secondHandSecondPairNumber = secondHandWithoutPair.getHighestCardInPair()?.getNumber() || -1

                    if (firstHandSecondPairNumber === secondHandSecondPairNumber) {
                        const firstHandWithoutPairs = new CardCombination(
                            firstHandWithoutPair.getCards().filter(card => card.getNumber() !== firstHandSecondPairNumber)
                        )
                        const secondHandWithoutPairs = new CardCombination(
                            secondHandWithoutPair.getCards().filter(card => card.getNumber() !== secondHandSecondPairNumber)
                        )

                        const firstHandFifthNumber = firstHandWithoutPairs.getHighestCard()?.getNumber() || -1
                        const secondHandFifthNumber = secondHandWithoutPairs.getHighestCard()?.getNumber() || -1

                        if (firstHandFifthNumber === secondHandFifthNumber) return SPLIT
                        else if (firstHandFifthNumber > secondHandFifthNumber) return FHW
                        else return SHW
                    } else if (firstHandSecondPairNumber > secondHandSecondPairNumber) return FHW
                    else return SHW
                } else if (firstHandPairNumber > secondHandPairNumber) return FHW
                else return SHW
            } else if (firstHand.getValue() === CardValue.Pair) {
                const firstHandPairNumber = firstHand.getHighestCardInPair()?.getNumber() || -1
                const secondHandPairNumber = secondHand.getHighestCardInPair()?.getNumber() || -1

                if (firstHandPairNumber === secondHandPairNumber) {
                    const firstHandWithoutPair = new CardCombination(
                        firstHand.getCards().filter(card => card.getNumber() !== firstHandPairNumber)
                    )
                    const secondHandWithoutPair = new CardCombination(
                        secondHand.getCards().filter(card => card.getNumber() !== secondHandPairNumber)
                    )

                    const firstHandThirdCard = firstHandWithoutPair.getHighestCard()
                    const secondHandThirdCard = secondHandWithoutPair.getHighestCard()

                    const firstHandThirdNumber = firstHandThirdCard?.getNumber() || -1
                    const secondHandThirdNumber = secondHandThirdCard?.getNumber() || -1

                    if (firstHandThirdNumber === secondHandThirdNumber) {
                        const firstHandWithoutThirdCard = new CardCombination(
                            firstHandWithoutPair.getCards().filter(card => card !== firstHandThirdCard)
                        )
                        const secondHandWithoutThirdCard = new CardCombination(
                            secondHandWithoutPair.getCards().filter(card => card !== secondHandThirdCard)
                        )

                        const firstHandFourthCard = firstHandWithoutThirdCard.getHighestCard()
                        const secondHandFourthCard = secondHandWithoutThirdCard.getHighestCard()

                        const firstHandFourthNumber = firstHandFourthCard?.getNumber() || -1
                        const secondHandFourthNumber = secondHandFourthCard?.getNumber() || -1

                        if (firstHandFourthNumber === secondHandFourthNumber) {
                            const firstHandWithoutFourthCard = new CardCombination(
                                firstHandWithoutThirdCard.getCards().filter(card => card !== firstHandFourthCard)
                            )
                            const secondHandWithoutFourthCard = new CardCombination(
                                secondHandWithoutThirdCard.getCards().filter(card => card !== secondHandFourthCard)
                            )

                            const firstHandFifthNumber = firstHandWithoutFourthCard.getHighestCard()?.getNumber() || -1
                            const secondHandFifthNumber = secondHandWithoutFourthCard.getHighestCard()?.getNumber() || -1

                            if (firstHandFifthNumber === secondHandFifthNumber) return SPLIT
                            else if (firstHandFifthNumber > secondHandFifthNumber) return FHW
                            else return SHW
                        } else if (firstHandFourthNumber > secondHandFourthNumber) return FHW
                        else return SHW
                    } else if (firstHandThirdNumber > secondHandThirdNumber) return FHW
                    else return SHW
                } else if (firstHandPairNumber > secondHandPairNumber) return FHW
                else return SHW
            } else {
                const firstHandFirstCard = firstHand.getHighestCard()
                const secondHandFirstCard = secondHand.getHighestCard()

                const firstHandFirstNumber = firstHandFirstCard?.getNumber() || -1
                const secondHandFirstNumber = secondHandFirstCard?.getNumber() || -1

                if (firstHandFirstNumber === secondHandFirstNumber) {
                    const firstHandWithoutFirstCard = new CardCombination(
                        firstHand.getCards().filter(card => card !== firstHandFirstCard)
                    )
                    const secondHandWithoutFirstCard = new CardCombination(
                        secondHand.getCards().filter(card => card !== secondHandFirstCard)
                    )

                    const firstHandSecondCard = firstHandWithoutFirstCard.getHighestCard()
                    const secondHandSecondCard = secondHandWithoutFirstCard.getHighestCard()

                    const firstHandSecondNumber = firstHandSecondCard?.getNumber() || -1
                    const secondHandSecondNumber = secondHandSecondCard?.getNumber() || -1

                    if (firstHandSecondNumber === secondHandSecondNumber) {
                        const firstHandWithoutSecondCard = new CardCombination(
                            firstHandWithoutFirstCard.getCards().filter(card => card !== firstHandSecondCard)
                        )
                        const secondHandWithoutSecondCard = new CardCombination(
                            secondHandWithoutFirstCard.getCards().filter(card => card !== secondHandSecondCard)
                        )

                        const firstHandThirdCard = firstHandWithoutSecondCard.getHighestCard()
                        const secondHandThirdCard = secondHandWithoutSecondCard.getHighestCard()

                        const firstHandThirdNumber = firstHandThirdCard?.getNumber() || -1
                        const secondHandThirdNumber = secondHandThirdCard?.getNumber() || -1

                        if (firstHandThirdNumber === secondHandThirdNumber) {
                            const firstHandWithoutThirdCard = new CardCombination(
                                firstHandWithoutSecondCard.getCards().filter(card => card !== firstHandThirdCard)
                            )
                            const secondHandWithoutThirdCard = new CardCombination(
                                secondHandWithoutSecondCard.getCards().filter(card => card !== secondHandThirdCard)
                            )

                            const firstHandFourthCard = firstHandWithoutThirdCard.getHighestCard()
                            const secondHandFourthCard = secondHandWithoutThirdCard.getHighestCard()

                            const firstHandFourthNumber = firstHandFourthCard?.getNumber() || -1
                            const secondHandFourthNumber = secondHandFourthCard?.getNumber() || -1

                            if (firstHandFourthNumber === secondHandFourthNumber) {
                                const firstHandWithoutFourthCard = new CardCombination(
                                    firstHandWithoutThirdCard.getCards().filter(card => card !== firstHandFourthCard)
                                )
                                const secondHandWithoutFourthCard = new CardCombination(
                                    secondHandWithoutThirdCard.getCards().filter(card => card !== secondHandFourthCard)
                                )

                                const firstHandFifthNumber = firstHandWithoutFourthCard.getHighestCard()?.getNumber() || -1
                                const secondHandFifthNumber = secondHandWithoutFourthCard.getHighestCard()?.getNumber() || -1

                                if (firstHandFifthNumber === secondHandFifthNumber) return SPLIT
                                else if (firstHandFifthNumber > secondHandFifthNumber) return FHW
                                else return SHW
                            } else if (firstHandFourthNumber > secondHandFourthNumber) return FHW
                            else return SHW
                        } else if (firstHandThirdNumber > secondHandThirdNumber) return FHW
                        else return SHW
                    } else if (firstHandSecondNumber > secondHandSecondNumber) return FHW
                    else return SHW
                } else if (firstHandFirstNumber > secondHandFirstNumber) return FHW
                else return SHW
            }
        }
    }
}

export default CardCombination
export { CardCombinationCompareResult }
