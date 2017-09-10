function clozeCard(text, cloze) {
  this.text = text;
  this.cloze = cloze;
  this.clozeDelete = this.text.replace(this.cloze, "_____");
  this.create = function () {
    
  }
}
