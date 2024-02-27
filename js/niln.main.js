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

  const questionNumber = document.getElementById("question-number");
  questionNumber.innerText = `Item ${currentQuestion} of ${totalQuestions}`

  const questionId = document.getElementById("question-id");
  questionId.innerText = `Question ID: ${question.id}`

  const answerOptions = document.getElementById("answer-options");

  if (question.scrambledOptions) {
    allOptions = quesetion.options;
  } else {
    
  }
  var allOptions = question.otherOptions.concat(question.correctAnswer);
  allOptions = schwartzianTransform(allOptions);

  answerOptions.replaceChildren();
  allOptions.forEach((option) => {
    var newOption = document.createElement("li");
    
    var optionRadioButton = document.createElement("input");
    optionRadioButton.setAttribute("type", "radio");
    optionRadioButton.setAttribute("name", "answer");
    optionRadioButton.setAttribute("value", option);

    if (option == question.attemptAnswer) {
      optionRadioButton.setAttribute("checked", '');
    }

    newOption.appendChild(optionRadioButton);
    newOption.appendChild(document.createTextNode(option));
    answerOptions.appendChild(newOption);
  });
}

async function loadExam(jsonRaw) {
  exam = JSON.parse(jsonRaw);
  totalQuestions = exam.questions.length;

  // Loads the first question
  updateQuestionGUI(exam.questions[0]);

  // Hide the exam selection
  document.getElementById("loadFile").style.display = "none";
}

document.addEventListener("DOMContentLoaded", async function(event) {
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
      exam.questions[currentQuestion - 1]['attemptAnswer'] = document.querySelector('input[name=answer]:checked')?.value;
      currentQuestion--;
      updateQuestionGUI(exam.questions[currentQuestion - 1]);
    }
  });

  document.getElementById('next').addEventListener('click', () => {
    if (currentQuestion != totalQuestions) {
      exam.questions[currentQuestion - 1]['attemptAnswer'] = document.querySelector('input[name=answer]:checked')?.value;
      currentQuestion++;
      
      updateQuestionGUI(exam.questions[currentQuestion - 1]);
    }
  });

  document.getElementById('end-exam').addEventListener('click', () => {
    var grading = []

    exam.questions[currentQuestion - 1]['attemptAnswer'] = document.querySelector('input[name=answer]:checked')?.value;

    exam.questions.forEach(question => {
      grading.push(question.correctAnswer == question.attemptAnswer);
    });

    var table = document.createElement('table');
    table.style.width = '100px';
    table.style.border = '1px solid black';

    for (var i = 0; i < grading.length; i++) {
      const tr = table.insertRow();

      const number = tr.insertCell();
      number.appendChild(document.createTextNode(i + 1));

      const correctStatus = tr.insertCell();

      if (grading[i]) {
        correctStatus.appendChild(document.createTextNode('✔️'));
      } else {
        correctStatus.appendChild(document.createTextNode('❌'));
      }
    }

    const questionBox = document.getElementById('question-box');
    questionBox.innerHTML = '';
    questionBox.appendChild(table);
  });
});


