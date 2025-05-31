class Offer {
  constructor(id, userId, tenderId, amount, createdAt) {
    this.id = id;
    this.userId = userId;
    this.tenderId = tenderId;
    this.amount = amount;
    this.createdAt = createdAt;
  }
}

module.exports = Offer;