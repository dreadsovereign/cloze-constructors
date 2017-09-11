var basicFlash = require("./basiccard.js");
var clozeCard = require("./clozecard.js");

var inquirer = require("inquirer");

var fs = require("fs");

inquirer.prompt([{
  name: "choice",
  message: "Please choose one",
  type: "list",
  choices: [{
    name: "create-flashcard"
  }, {
    name: "show-flashcards"
  }]
}]).then(function(answer) {
  if (answer.choice === "create-flashcard") {
    createCard();
  } else if (answer.choice === "show-flashcards") {
    showCards();
  }
});

var createCard = function() {
  inquirer.prompt([{
    name: "cardType",
    message: "Please choose a card type",
    type: "list",
    choices: [{
      name: "basic-flashcard"
    }, {
      name: "cloze-flashcard"
    }]
  }]).then(function(answer) {
    if (answer.cardType === "basic-flashcard") {
      inquirer.prompt([{
        name: "front",
        message: "Enter flashcard question",
        validate: function(input) {
          if (input === " ") {
            return false;
          } else {
            return true;
          }
        }
      }, {
        name: "back",
        message: "Enter flashcard answer",
        validate: function(input) {
          if (input === " ") {
            console.log("Please enter an answer");
            return false;
          } else {
            return true;
          }
        }
      }]).then(function(answer) {
        var createBasic = new basicFlash(answer.front, answer.back)
        createBasic.create();
        next();
      });
    } else if (answer.cardType === "cloze-flashcard") {
      inquirer.prompt([{
        name: "text",
        message: "Enter text for cloze card",
        validate: function(input) {
          if (input === " ") {
            console.log("Please enter text for cloze card");
            return false;
          } else {
            return true;
          }
        }
      }, {
        name: "cloze",
        message: "Enter cloze text",
        validate: function(input) {
          if (input === " ") {
            console.log("Please enter the cloze text");
            return false;
          } else {
            return true;
          }
        }
      }]).then(function(answer) {
        var text = answer.text;
        var cloze = answer.cloze;
        if (text.includes(cloze)) {
          var newCloze = new clozeCard(text, cloze);
          newCloze.create();
          next();
        } else {
          console.log("The text entered is missing from the full text");
          createCard();
        }
      });
    } 
  });
};

var next = function() {
  inquirer.prompt([{
    name: "nextThing",
    message: "What's next?",
    type: "list",
    choices: [{
      name: "create-new-card"
    }, {
      name: "show-all-cards"
    }, {
      name: "nothing"
    }]
  }]).then(function(answer) {
    if (answer.nextThing === "create-new-card") {
      createCard();
    } else if (answer.nextThing === "show-all-cards") {
      showCards();
    } else if (answer.nextThing === "nothing") {
      return;
    }
  });
};

var showCards = function() {
  fs.readFile('./log.txt', 'utf8', function(error, data) {
  if (error) {
    console.log(`Error occured: ${error}`);
  } 
  var questions = data.split("|");
  var blank = function(value) {
    return value;
  };
  questions = questions.filter(blank);
  var count = 0;
  showQuestions (questions, count);
});
};

var showQuestions = function(array, index) {
  question = array[index];
  var parseQuestion = JSON.parse(question);
  var questionText;
  var correctResponse;
  if (parseQuestion.type === "basic") {
    questionText = parseQuestion.front;
    correctResponse = parseQuestion.back;
  } else if (parseQuestion.type === "cloze") {
    questionText = parseQuestion.clozeDelete;
    correctResponse = parseQuestion.cloze;
  }
  inquirer.prompt([{
    name: "response",
    message: questionText
  }]).then(function(answer) {
    if (answer.response === correctResponse) {
      console.log("Correct!");
      if (index < array.length - 1) {
        showQuestions(array, index + 1);
      }
    } else {
      console.log("Wrong!");
      if (index < array.length -1) {
        showQuestions(array, index + 1);
      }
    }
  });
};
