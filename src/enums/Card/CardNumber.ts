enum CardNumber {
    Deuce = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Ace = 14
}

const CardNumberAsArray = [
    CardNumber.Deuce,
    CardNumber.Three,
    CardNumber.Four,
    CardNumber.Five,
    CardNumber.Six,
    CardNumber.Seven,
    CardNumber.Eight,
    CardNumber.Nine,
    CardNumber.Ten,
    CardNumber.Jack,
    CardNumber.Queen,
    CardNumber.King,
    CardNumber.Ace
]

function getNextCardNumberOf(number: CardNumber) {
    switch (number) {
        case CardNumber.Ace:
            return CardNumber.Deuce

        case CardNumber.Deuce:
            return CardNumber.Three

        case CardNumber.Three:
            return CardNumber.Four

        case CardNumber.Four:
            return CardNumber.Five

        case CardNumber.Five:
            return CardNumber.Six

        case CardNumber.Six:
            return CardNumber.Seven

        case CardNumber.Seven:
            return CardNumber.Eight

        case CardNumber.Eight:
            return CardNumber.Nine

        case CardNumber.Nine:
            return CardNumber.Ten

        case CardNumber.Ten:
            return CardNumber.Jack

        case CardNumber.Jack:
            return CardNumber.Queen

        case CardNumber.Queen:
            return CardNumber.King

        case CardNumber.King:
            return CardNumber.Ace
    }
}

function getPreviousCardNumberOf(number: CardNumber) {
    switch (number) {
        case CardNumber.Ace:
            return CardNumber.King

        case CardNumber.Deuce:
            return CardNumber.Ace

        case CardNumber.Three:
            return CardNumber.Deuce

        case CardNumber.Four:
            return CardNumber.Three

        case CardNumber.Five:
            return CardNumber.Four

        case CardNumber.Six:
            return CardNumber.Five

        case CardNumber.Seven:
            return CardNumber.Six

        case CardNumber.Eight:
            return CardNumber.Seven

        case CardNumber.Nine:
            return CardNumber.Eight

        case CardNumber.Ten:
            return CardNumber.Nine

        case CardNumber.Jack:
            return CardNumber.Ten

        case CardNumber.Queen:
            return CardNumber.Jack

        case CardNumber.King:
            return CardNumber.Queen
    }
}

export default CardNumber
export { CardNumberAsArray }
export { getNextCardNumberOf, getPreviousCardNumberOf }
