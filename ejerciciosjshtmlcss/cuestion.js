const apiUrl = 'https://raw.githubusercontent.com/cesarmcuellar/CuestionarioWeb/refs/heads/main/cuestionario.json';
let multipleChoiceQuestions = [];
let trueFalseQuestions = [];
let answers = [];

document.addEventListener('DOMContentLoaded', async () => {
  
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    multipleChoiceQuestions = data.multiple_choice_questions;
    trueFalseQuestions = data.true_false_questions;
    
    shuffle(multipleChoiceQuestions);
    shuffle(trueFalseQuestions);

    displayQuestions();
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
}
function displayQuestions() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = ''; 
    
let questionIndex = 0;
    
multipleChoiceQuestions.forEach((question, index) => {
    questionIndex++;
    const questionDiv = createQuestionDiv(question, questionIndex, 'multiple_choice');
    questionContainer.appendChild(questionDiv);
});
    
trueFalseQuestions.forEach((question, index) => {
    questionIndex++;
    const questionDiv = createQuestionDiv(question, questionIndex, 'true_false');
    questionContainer.appendChild(questionDiv);
});

}

function createQuestionDiv(question, index, type) {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    
    const questionText = document.createElement('p');
    questionText.innerText = `${index}. ${question.question}`;
    questionDiv.appendChild(questionText);
    
    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');
    
if (type === 'multiple_choice') {

    question.options.forEach(option => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${index}`;
        input.value = option;
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        optionsDiv.appendChild(label);
});
} else if (type === 'true_false') {
    ['true', 'false'].forEach(option => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question-${index}`;
        input.value = option === 'true' ? 'true' : 'false';
        label.appendChild(input);
        label.appendChild(document.createTextNode(option === 'true' ? 'Verdadero' : 'Falso'));
        optionsDiv.appendChild(label);
});
}
questionDiv.appendChild(optionsDiv);
return questionDiv;
}

function showResult() {
    let correctAnswers = 0;
    let totalQuestions = multipleChoiceQuestions.length + trueFalseQuestions.length;

multipleChoiceQuestions.forEach((question, index) => {
    const selectedOption = document.querySelector(`input[name="question-${index + 1}"]:checked`);
    if (selectedOption && selectedOption.value === question.correct_answer) {
        correctAnswers++;
    }
});
    
trueFalseQuestions.forEach((question, index) => {
    const selectedOption = document.querySelector(`input[name="question-${multipleChoiceQuestions.length + index + 1}"]:checked`);
    if (selectedOption && selectedOption.value === question.correct_answer) {
        correctAnswers++;
    }
});

const percentage = (correctAnswers / totalQuestions) * 100;
    
const resultDiv = document.getElementById('result');
resultDiv.innerHTML = `Has respondido correctamente el ${percentage.toFixed(2)}% de las preguntas.`;
}