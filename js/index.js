import { data } from "./data.js"

/********* Select all the objects  *********/

const quizContainer = document.querySelector("#quiz");
const nextButton = document.querySelector('#next');
const prevButton = document.querySelector('#prev');
const submitButton = document.querySelector("#submit");
const skipButton = document.querySelector("#skip");
const resultContainer = document.querySelector('#result');
const retryButton = document.querySelector('#retry');
const showAnswerButton = document.querySelector("#show_answer")

let currentQuestion = 0;
let points = 0;
let incorrectAnswers = []
let selectedValue = []

const initialised = () => {
    for (let i = 0; i < data.length; i++) {
        selectedValue[i] = ""
    }
}

initialised()

/********* Display question *********/

const displayQuestion = () => {
    const questionData = data[currentQuestion]

    if (currentQuestion == 0)
        prevButton.classList.add('hide')
    else
        prevButton.classList.remove('hide')


    if (currentQuestion == data.length - 1)
        submitButton.classList.remove('hide'), nextButton.classList.add('hide'), skipButton.classList.add('hide');
    else
        submitButton.classList.add('hide'), nextButton.classList.remove('hide'), skipButton.classList.remove('hide');

    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = `${currentQuestion + 1}) ${questionData.question}`;

    const optionsElement = document.createElement('div');
    optionsElement.className = 'options';

    const options = [...questionData.options]

    for (let item of options) {
        const option = document.createElement('label')
        option.className = 'option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'quiz'
        radio.value = item
        radio.className = 'mcq'

        if (radio.value == selectedValue[currentQuestion])
            radio.checked = true;

        const optionText = document.createTextNode(`${item}`);
        option.appendChild(radio);
        option.appendChild(optionText);
        optionsElement.append(option)
    }

    quizContainer.innerHTML = ''
    quizContainer.appendChild(questionElement)
    quizContainer.appendChild(optionsElement)
}

prevButton.addEventListener('click', () => {
    currentQuestion -= 1;
    displayQuestion()
})

const addAnswerToThearray = () => {
    const selectedOption = document.querySelector("input[name='quiz']:checked")
    let isChecked = false;
    if (selectedOption) {
        selectedValue[currentQuestion] = selectedOption.value
        isChecked = true;
    }
    return isChecked
}

nextButton.addEventListener('click', () => {
    if (addAnswerToThearray()) {
        currentQuestion += 1
        displayQuestion()
    }

})

skipButton.addEventListener('click', () => {
    currentQuestion += 1;
    selectedValue[currentQuestion] = ""
    displayQuestion()
})

submitButton.addEventListener('click', () => {
    addAnswerToThearray()
    let point = checkAnswer1();
    quizContainer.innerHTML = ''
    submitButton.classList.add('hide')
    prevButton.classList.add('hide')
    retryButton.classList.remove('hide')
    showAnswerButton.classList.remove('hide')
    resultContainer.innerHTML = `You scored ${point} out of ${data.length}`
})

retryButton.addEventListener('click', () => {
    currentQuestion = 0;
    points = 0;
    incorrectAnswers = [];
    resultContainer.innerHTML = '';
    retryButton.classList.add('hide');
    showAnswerButton.classList.add('hide');
    quizContainer.classList.remove('hide')
    initialised()
    displayQuestion()
})

/********* Checking answer *********/

const checkAnswer1 = () => {
    for (let i = 0; i < selectedValue.length; i++) {
        if (selectedValue[i] === data[i].answer)
            points++;
        else {
            if (selectedValue[i] !== "") {
                incorrectAnswers.push({
                    question: data[i].question,
                    incorrectAnswer: selectedValue[i],
                    correctAnswer: data[i].answer,
                })
            }
        }
    }
    return points
}



/********* Showing Answer *********/

showAnswerButton.addEventListener('click', () => {
    quizContainer.classList.add('hide')
    submitButton.classList.add('hide')
    retryButton.classList.remove('hide')
    showAnswerButton.classList.add('hide')

    let incorrectAnswersHtml = '';
    for (let i = 0; i < incorrectAnswers.length; i++) {
        incorrectAnswersHtml += `
        <p>
          <strong>Question:</strong> ${incorrectAnswers[i].question}<br>
          <strong>Your Answer:</strong> ${incorrectAnswers[i].incorrectAnswer}<br>
          <strong>Correct Answer:</strong> ${incorrectAnswers[i].correctAnswer}
        </p>
      `;
    }

    resultContainer.innerHTML = `
      <p>You scored ${points} out of ${data.length}!</p>
      ${incorrectAnswers.length == 0 && points == 0 ? "<p>You have not attempted any question" : "<p>Incorrect Answers:</p>" + incorrectAnswersHtml}
    `;
})

displayQuestion()
