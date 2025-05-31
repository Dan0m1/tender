class Offer {
  constructor(id, userId, tenderId, amount, isActive, createdAt) {
    this.id = id;
    this.userId = userId;
    this.tenderId = tenderId;
    this.amount = amount;
    this.isActive = isActive;
    this.createdAt = createdAt;
  }
}

module.exports = Offer;