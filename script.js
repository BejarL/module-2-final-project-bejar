class Quiz {
    constructor() {
        // Initialize state variables like questions array, current question index, etc.
        this.initializeStateVariables();
        // Set up the DOM elements required for the quiz functionality
        this.initializeDOMElements();
        // Load previously saved questions from localStorage if available
        this.loadQuestionsFromStorage();
        // Set up event listeners for user interactions like button clicks
        this.setupEventListeners();
    }

    // Initializes essential state variables for the quiz
    initializeStateVariables() {
        this.questions = []; // Store quiz questions
        this.currentQuestionIndex = 0; // Track the current question being displayed
        this.correctAnswerSelected = false; // Indicate if the correct answer was chosen
        this.score = 0; // Initialize the score of the quiz
    }

    // Set up and initialize DOM elements used in the quiz
    initializeDOMElements() {
        this.elements = {
            // Get elements from the DOM and store them for easy access and manipulation
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
            quitButton: document.getElementById('quit'),
            quitButtonEnd: document.getElementById('quit-end'), // Quit button at the end of the quiz
            finalScore: document.getElementById('final-score'),
            quizEndDisplay: document.getElementById('quiz-end-display')
        };
        // Initially hide the 'Try Again' button as it's not needed until the end
        this.elements.tryAgainButton.style.display = 'none'; 
    }

    // Attach event listeners to various buttons and elements for interaction
    setupEventListeners() {
        // Each button is given an event listener to handle the respective actions
        this.elements.addQuestionButton.addEventListener('click', () => this.addQuestion());
        this.elements.startQuizButton.addEventListener('click', () => this.startQuiz());
        this.elements.nextQuestionButton.addEventListener('click', () => this.showNextQuestion());
        this.elements.optionsButtons.forEach(button => button.addEventListener('click', () => this.checkAnswer(button.textContent)));
        this.elements.tryAgainButton.addEventListener('click', () => this.restartQuiz());
        this.elements.quitButton.addEventListener('click', () => this.quitQuiz());
        this.elements.quitButtonEnd.addEventListener('click', () => this.quitQuiz());
    }

    // Load stored questions from localStorage to enable quiz continuity
    loadQuestionsFromStorage() {
        // Retrieve and parse the stored quiz questions, if available
        const storedQuestions = localStorage.getItem('quizQuestions');
        if (storedQuestions) {
            this.questions = JSON.parse(storedQuestions);
        }
    }

    // Save the current set of questions to localStorage for persistence
    saveQuestionsToStorage() {
        localStorage.setItem('quizQuestions', JSON.stringify(this.questions));
    }

    // Allow users to add new questions to the quiz
    addQuestion() {
        // Get the question and answer from the input fields
        const userQuestion = this.elements.userQuestionInput.value;
        const correctAnswer = this.elements.correctAnswerInput.value;
        // Validate input and add the question to the array if valid
        if (userQuestion && correctAnswer) {
            this.questions.push({ question: userQuestion, answer: correctAnswer });
            this.clearQuestionInputFields();
            alert('Question added!');
            this.saveQuestionsToStorage();
        } else {
            alert('Please enter both a question and an answer.');
        }
    }

    // Clear input fields after a new question is added
    clearQuestionInputFields() {
        // Reset the input fields to be ready for new inputs
        this.elements.userQuestionInput.value = '';
        this.elements.correctAnswerInput.value = '';
    }

    // Start the quiz, ensuring there are enough questions
    startQuiz() {
        // Check if there are enough questions to start the quiz
        if (this.questions.length >= 4) {
            this.elements.questionsDiv.style.display = 'none';
            this.elements.quizContainer.style.display = 'block';
            this.elements.quitButton.style.display = 'block'; // Ensure Quit button is visible
            this.displayQuestion();
        } else {
            alert('Please add at least four questions.');
        }
    }

    // Display the current question and its options
    displayQuestion() {
        // Reset certain states and display the current question with options
        this.correctAnswerSelected = false;
        this.elements.nextQuestionButton.style.display = 'none';
        this.resetOptionButtonStyles();
        this.elements.optionsButtons.forEach(button => button.disabled = false);

        const currentQuestion = this.questions[this.currentQuestionIndex];
        this.elements.questionElement.textContent = currentQuestion.question;
        const options = this.generateOptions(this.currentQuestionIndex);
        options.forEach((option, index) => this.elements.optionsButtons[index].textContent = option);
    }

    // Generate a set of options (answers) for the current question
    generateOptions(currentIndex) {
        // Create a unique set of options, including the correct answer
        let options = new Set([this.questions[currentIndex].answer]);
        while (options.size < 4) {
            const randomIndex = Math.floor(Math.random() * this.questions.length);
            if (randomIndex !== currentIndex) {
                options.add(this.questions[randomIndex].answer);
            }
        }
        return this.shuffleArray(Array.from(options));
    }

    // Shuffle the array of options to randomize their order
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Move to the next question in the quiz or end the quiz if it's the last question
    showNextQuestion() {
        // Increment question index and check if there are more questions
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.displayQuestion();
        } else {
            this.endQuiz();
        }
    }

    // Check if the user's selected option is correct
    checkAnswer(selectedOption) {
        // Compare the selected option with the correct answer
        const selectedButton = Array.from(this.elements.optionsButtons).find(button => button.textContent === selectedOption);
        this.elements.optionsButtons.forEach(button => button.disabled = true);
        this.correctAnswerSelected = selectedOption === this.questions[this.currentQuestionIndex].answer;
        selectedButton.style.backgroundColor = this.correctAnswerSelected ? 'green' : 'red';
        if (this.correctAnswerSelected) this.score++;
        this.elements.nextQuestionButton.style.display = 'block';
        this.elements.resultElement.textContent = this.correctAnswerSelected ? 'Correct!' : '';
    }

    // Reset the styles of option buttons for a new question
    resetOptionButtonStyles() {
        // Clear any styling applied to option buttons from the previous question
        this.elements.optionsButtons.forEach(button => button.style.backgroundColor = '');
    }

    // Handle the end of the quiz, display the final score and options
    endQuiz() {
        // Show the final score and options like 'Try Again' or 'Quit'
        this.elements.quizContainer.style.display = 'none';
        this.elements.quizEndDisplay.style.display = 'block';
        this.elements.tryAgainButton.style.display = 'block';
        this.elements.quitButton.style.display = 'block'; // Ensure Quit button is visible
        this.elements.resultElement.textContent = 'Quiz ended. Try again?';
        this.elements.finalScore.textContent = `Score: ${this.score}`;
        this.saveQuestionsToStorage();
    }

    // Restart the quiz, resetting necessary states
    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.elements.quizEndDisplay.style.display = 'none';
        this.startQuiz();
        this.elements.resultElement.textContent = '';
        this.elements.tryAgainButton.style.display = 'none';
    }

    // Handle the 'Quit' action, reset to the initial state
    quitQuiz() {
        // Hide quiz container and quiz end display
        this.elements.quizContainer.style.display = 'none';
        this.elements.quizEndDisplay.style.display = 'none';
        // Show the initial questions div or main menu
        this.elements.questionsDiv.style.display = 'block';
        // Reset other necessary elements or states
        this.elements.resultElement.textContent = '';
        this.currentQuestionIndex = 0;
    }
}

// Instantiate the Quiz class after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => new Quiz());
