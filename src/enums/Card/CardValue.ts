enum CardValue {
    HighCard = "High Card",
    Pair = "Pair",
    TwoPair = "Two Pair",
    Triple = "Three of a Kind",
    Straight = "Straight",
    Flush = "Flush",
    FullHouse = "Full House",
    FourCard = "Four of a Kind",
    StraightFlush = "Straight Flush",
    RoyalStraightFlush = "Royal Straight Flush"
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
