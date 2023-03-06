enum CardValue {
    HighCard = 1,
    Pair = 2,
    TwoPair = 3,
    Triple = 4,
    Straight = 5,
    Flush = 6,
    FullHouse = 7,
    FourCard = 8,
    StraightFlush = 9,
    RoyalStraightFlush = 10
}

const CardValueAsArray = [
    CardValue.HighCard,
    CardValue.Pair,
    CardValue.TwoPair,
    CardValue.Triple,
    CardValue.Straight,
    CardValue.Flush,
    CardValue.FullHouse,
    CardValue.FourCard,
    CardValue.StraightFlush,
    CardValue.RoyalStraightFlush
]

export default CardValue
export { CardValueAsArray }
