var exam;

var currentQuestion = 1;
var questionNavItems;

var totalQuestions;

function schwartzianTransform(unshuffledArray) {
  let shuffledArray = unshuffledArray
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

  return shuffledArray;
}

function updateQuestionGUI(question) {
  document.getElementById("question").innerText = question.question;
  const answerOptions = document.getElementById("answer-options");

  var allOptions = question.otherOptions.concat(question.correctAnswer);
  allOptions = schwartzianTransform(allOptions);

  answerOptions.replaceChildren();
  allOptions.forEach((option) => {
    var newOption = document.createElement("li");
    
    var optionRadioButton = document.createElement("input");
    optionRadioButton.setAttribute("type", "radio");
    optionRadioButton.setAttribute("name", "answer");

    newOption.appendChild(optionRadioButton);
    newOption.appendChild(document.createTextNode(option));
    answerOptions.appendChild(newOption);
  });
}

async function loadExam(jsonRaw) {
  exam = JSON.parse(jsonRaw);
  totalQuestions = exam.questions.length;

  // Question navigation setup
  var questionNav = document.getElementById("question-nav");

  for (let i = 0; i < totalQuestions; ++i) {
    var newQuestionNavItem = document.createElement("div");
    newQuestionNavItem.classList.add("question-nav-item");
    newQuestionNavItem.textContent = (i + 1);

    if (i == 0) {
      newQuestionNavItem.classList.add("selected");
    }

    questionNav.appendChild(newQuestionNavItem);
  }

  // Loads the first question
  updateQuestionGUI(exam.questions[0]);

  // Hide the exam selection
  document.getElementById("loadFile").style.display = "none";
}

document.addEventListener("DOMContentLoaded", async function(event) {
  questionNavItems = document.getElementsByClassName("question-nav-item");

  // GUI events
  document.getElementById("loadFile").addEventListener('submit', (event) => {
    const reader = new FileReader();
    const [file] = document.getElementById("uploadInput").files;

    reader.addEventListener('load', async (event) => {
      await loadExam(reader.result)
    });

    if (file) {
      reader.readAsText(file);
    }

    event.preventDefault();
  });

  document.getElementById('previous').addEventListener('click', () => {
    if (currentQuestion != 1) {
      questionNavItems[currentQuestion - 1].classList.remove("selected");
      currentQuestion--;
      questionNavItems[currentQuestion - 1].classList.add("selected");

      updateQuestionGUI(exam.questions[currentQuestion - 1]);
    }
  });

  document.getElementById('next').addEventListener('click', () => {
    if (currentQuestion != totalQuestions) {
      questionNavItems[currentQuestion - 1].classList.remove("selected");
      currentQuestion++;
      questionNavItems[currentQuestion - 1].classList.add("selected");

      updateQuestionGUI(exam.questions[currentQuestion - 1]);
    }
  });
});


