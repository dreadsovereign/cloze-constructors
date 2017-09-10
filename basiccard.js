function basicCard (front, back) {
  this.front = front;
  this.back = back;

  this.create = function () {

    var data = {
      front: this.front,
      back: this.back,
      type: "basic",
    };
  }
}

module.exports = basicCard;
