class Quiz {
    constructor() {
        // Initializes state variables

        // Stores quiz questions
        this.questions = []; 
        // Index of the current question being displayed
        this.currentQuestionIndex = 0; 
        // Tracks if the correct answer was selected
        this.correctAnswerSelected = false; 

        // Load questions from the browser's localStorage
        this.loadQuestionsFromStorage();

        // Initializes DOM elements for interaction
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
            questionsDiv: document.querySelector('.questions'),
            tryAgainButton: document.getElementById('try-again'),
            quitButton: document.getElementById('quit')            
        };

        // Initially hides the 'Try Again' button
        this.elements.tryAgainButton.style.display = 'none';

        // Sets up event listeners for user interactions
        this.setupEventListeners();
    }
    // Adds event listeners to buttons for handling user actions
    setupEventListeners() {
        this.elements.tryAgainButton.addEventListener('click', () => this.restartQuiz());
        this.elements.quitButton.addEventListener('click', () => this.quitQuiz());
        this.elements.addQuestionButton.addEventListener('click', () => this.addQuestion());
        this.elements.startQuizButton.addEventListener('click', () => this.startQuiz());
        this.elements.nextQuestionButton.addEventListener('click', () => this.showNextQuestion());
        this.elements.optionsButtons.forEach(button => {
            button.addEventListener('click', () => this.checkAnswer(button.textContent));
        });
    }
    // Saves the current set of questions to localStorage
    saveQuestionsToStorage() {
        localStorage.setItem('quizQuestions', JSON.stringify(this.questions));
    }

    // Loads questions from localStorage if available
    loadQuestionsFromStorage() {
        const storedQuestions = localStorage.getItem('quizQuestions');
        if (storedQuestions) {
            this.questions = JSON.parse(storedQuestions);
        }
    }

    // Adds a new question to the quiz
    addQuestion() {
        const userQuestion = this.elements.userQuestionInput.value;
        const correctAnswer = this.elements.correctAnswerInput.value;

        // Validates input and updates the questions array
        if (userQuestion && correctAnswer) {
            this.questions.push({ question: userQuestion, answer: correctAnswer });
            this.elements.userQuestionInput.value = '';
            this.elements.correctAnswerInput.value = '';
            alert('Question added!');
            
            // Saves updated questions
            this.saveQuestionsToStorage();
        } else {
            alert('Please enter both a question and an answer.');
        }
    }

    // Starts the quiz if enough questions are added
    startQuiz() {
        if (this.questions.length >= 4) {
            this.elements.questionsDiv.style.display = 'none';
            this.elements.quizContainer.style.display = 'block';
            this.displayQuestion();
        } else {
            alert('Please add at least four questions.');
        }
    }

    // Shows the next question in the quiz
    showNextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            this.endQuiz();
        }
    }

    // Displays the current question and its options
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

    // Generates a set of options for the current question
    generateOptions(currentIndex) {
        let options = new Set();
        options.add(this.questions[currentIndex].answer);

        // Adds random options from other questions
        while (options.size < 4) {
            let randomIndex = Math.floor(Math.random() * this.questions.length);
            if (randomIndex !== currentIndex) {
                options.add(this.questions[randomIndex].answer);
            }
        }

        // Shuffles and returns the options
        return this.shuffleArray(Array.from(options));
    }

    // Function to shuffle an array
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    // Checks if the selected option is correct
    checkAnswer(selectedOption) {
        let selectedButton = Array.from(this.elements.optionsButtons).find(button => button.textContent === selectedOption);
    
        if (selectedOption === this.questions[this.currentQuestionIndex].answer) {
            this.elements.resultElement.textContent = 'Correct!';
            this.correctAnswerSelected = true;

            // Displays the 'Next' button and highlights correct answer
            this.elements.nextQuestionButton.style.display = 'block'; 
            selectedButton.style.backgroundColor = 'green';
        } else {
            // Highlights incorrect answer
            selectedButton.style.backgroundColor = 'red';
        }
    }
    
    // Resets the styles of option buttons
    resetOptionButtonStyles() {
        this.elements.optionsButtons.forEach(button => {
            button.style.backgroundColor = ''; 
        });
    }
    // End of the quiz
    endQuiz() {
        this.elements.tryAgainButton.style.display = 'block';
        this.elements.nextQuestionButton.style.display = 'none';
        this.elements.resultElement.textContent = 'Quiz ended. Try again?';

        // Saves the current state of questions
        this.saveQuestionsToStorage();
    }

    // Restarts the quiz when the user clicks the "Try Again" button
    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.startQuiz();
        this.elements.tryAgainButton.style.display = 'none';
    }

    // Quitting the quiz when the user clicks the "Quit" button
    quitQuiz() {
        this.elements.quizContainer.style.display = 'none';
        this.elements.questionsDiv.style.display = 'block';
        this.elements.resultElement.textContent = '';
        this.currentQuestionIndex = 0;
    }   
}

// Instantiate the Quiz class after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    new Quiz();
});
