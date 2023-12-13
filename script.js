// 1. User must input questions and provides the right answer then submit
// 2. Once submitted the user can start the quiz
// 3. A random quiz is generated and the user is presented with four options
// 4. If the answer is wrong the button turns red
// 3. Once the correct answer is selected it turns green and the 'next' button appears and the user can continue

class Quiz {
    constructor() {
        // State variables
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.correctAnswerSelected = false;

        // Initialize DOM elements
        this.elements = {
            addQuestionButton: document.getElementById('add-question'),
            startQuizButton: document.getElementById('start-quiz'),
            nextQuestionButton: document.getElementById('next-question'),
            userQuestionInput: document.getElementById('user-question'),
            correctAnswerInput: document.getElementById('correct-answer'),
            quizContainer: document.getElementById('quiz-container'),
            questionElement: document.getElementById('question'),
            optionsButtons: document.querySelectorAll('.option-button'),
            resultElement: document.getElementById('result'),
            questionsDiv: document.querySelector('.questions')
        };

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.elements.addQuestionButton.addEventListener('click', () => this.addQuestion());
        this.elements.startQuizButton.addEventListener('click', () => this.startQuiz());
        this.elements.nextQuestionButton.addEventListener('click', () => this.showNextQuestion());
        this.elements.optionsButtons.forEach(button => {
            button.addEventListener('click', () => this.checkAnswer(button.textContent));
        });
    }

    addQuestion() {
        const userQuestion = this.elements.userQuestionInput.value;
        const correctAnswer = this.elements.correctAnswerInput.value;

        if (userQuestion && correctAnswer) {
            this.questions.push({ question: userQuestion, answer: correctAnswer });
            this.elements.userQuestionInput.value = '';
            this.elements.correctAnswerInput.value = '';
            alert('Question added!');
        } else {
            alert('Please enter both a question and an answer.');
        }
    }

    startQuiz() {
        if (this.questions.length >= 4) {
            this.elements.questionsDiv.style.display = 'none';
            this.elements.quizContainer.style.display = 'block';
            this.displayQuestion();
        } else {
            alert('Please add at least four questions.');
        }
    }

    showNextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            this.endQuiz();
        }
    }

    displayQuestion() {
        this.correctAnswerSelected = false;
        this.elements.nextQuestionButton.style.display = 'none';
        this.resetOptionButtonStyles();
        let currentQuestion = this.questions[this.currentQuestionIndex];
        this.elements.questionElement.textContent = currentQuestion.question;
        let options = this.generateOptions(this.currentQuestionIndex);
        options.forEach((option, index) => {
            this.elements.optionsButtons[index].textContent = option;
        });
    }

    generateOptions(currentIndex) {
        let options = new Set();
        options.add(this.questions[currentIndex].answer);

        while (options.size < 4) {
            let randomIndex = Math.floor(Math.random() * this.questions.length);
            if (randomIndex !== currentIndex) {
                options.add(this.questions[randomIndex].answer);
            }
        }

        return this.shuffleArray(Array.from(options));
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    checkAnswer(selectedOption) {
        let selectedButton = Array.from(this.elements.optionsButtons).find(button => button.textContent === selectedOption);
    
        if (selectedOption === this.questions[this.currentQuestionIndex].answer) {
            this.elements.resultElement.textContent = 'Correct!';
            this.correctAnswerSelected = true;
            // Show the next button
            this.elements.nextQuestionButton.style.display = 'block'; 
            selectedButton.style.backgroundColor = 'green';
        } else {
            selectedButton.style.backgroundColor = 'red';
            this.elements.resultElement.textContent = 'Wrong answer! Try again.';
        }
    }
    

    resetOptionButtonStyles() {
        this.elements.optionsButtons.forEach(button => {
            // Reset to default style
            button.style.backgroundColor = ''; 
        });
    }

    endQuiz() {
        this.elements.quizContainer.style.display = 'none';
        this.elements.questionsDiv.style.display = 'block';
        this.elements.resultElement.textContent = '';
        this.currentQuestionIndex = 0;
        alert('Quiz ended! Start again?');
    }
}

// Instantiate the Quiz class after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new Quiz();
});