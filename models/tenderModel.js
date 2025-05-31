class Tender {
    constructor(id, title, startingPrice, description, userId, currentPrice, winnerId, isActive, isHidden) {
      this.id = id;
      this.title = title;
      this.startingPrice = startingPrice;
      this.description = description;
      this.userId = userId;
      this.currentPrice = currentPrice;
      this.winnerId = winnerId;
      this.isActive = isActive;
      this.isHidden = isHidden;
    }
}

module.exports = Tender;
  