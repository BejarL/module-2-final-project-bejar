// 1. User must input questions
// 2. User must provide answers
// 3. Only one answer per question is correct
// 4. Once the correct answer is selected the 'next' button appears and the user can continue

document.addEventListener('DOMContentLoaded', function () {
    let questions = [];
    let currentQuestionIndex = 0;

    const addQuestionButton = document.getElementById('add-question');
    const startQuizButton = document.getElementById('start-quiz');
    const userQuestionInput = document.getElementById('user-question');
    const correctAnswerInput = document.getElementById('correct-answer');
    const optionsInputs = [document.getElementById('option1'), document.getElementById('option2'), document.getElementById('option3'), document.getElementById('option4')];
    const quizContainer = document.getElementById('quiz-container');
    const questionElement = document.getElementById('question');
    const optionsButtons = document.querySelectorAll('.option-button');
    const resultElement = document.getElementById('result');
    const questionsDiv = document.querySelector('.questions');

    addQuestionButton.addEventListener('click', function () {
        const userQuestion = userQuestionInput.value;
        const correctAnswer = correctAnswerInput.value;
        const options = optionsInputs.map(input => input.value);

        if (userQuestion && options.every(option => option) && correctAnswer) {
            questions.push({ question: userQuestion, options: options, answer: correctAnswer });
            userQuestionInput.value = '';
            correctAnswerInput.value = '';
            optionsInputs.forEach(input => input.value = '');
            alert('Question added!');
        } else {
            alert('Please enter a question, four options, and the correct answer number.');
        }
    });

    startQuizButton.addEventListener('click', function () {
        if (questions.length > 0) {
            questionsDiv.style.display = 'none';
            quizContainer.style.display = 'block';
            displayQuestion();
        } else {
            alert('Please add at least one question.');
        }
    });

    optionsButtons.forEach((button, index) => {
        button.addEventListener('click', () => checkAnswer(index + 1));
    });

    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        currentQuestion.options.forEach((option, index) => {
            optionsButtons[index].textContent = option;
        });
    }

    function checkAnswer(selectedOption) {
        if (selectedOption.toString() === questions[currentQuestionIndex].answer) {
            resultElement.textContent = 'Correct!';
        } else {
            resultElement.textContent = 'Wrong! The correct answer was: ' + questions[currentQuestionIndex].options[questions[currentQuestionIndex].answer - 1];
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setTimeout(displayQuestion, 2000);
        } else {
            setTimeout(endQuiz, 2000);
        }
    }

    function endQuiz() {
        quizContainer.style.display = 'none';
        questionsDiv.style.display = 'block';
        resultElement.textContent = '';
        currentQuestionIndex = 0;
        alert('Quiz ended! Start again?');
    }
});
