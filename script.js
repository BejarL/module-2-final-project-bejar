// 1. User must input questions
let inputQuestion = localStorage.getItem('inputQuestion')
function returnQuestion(){
    inputQuestion = document.getElementById("user-question").value;
    localStorage.setItem('inputQuestion', inputQuestion)
}

// 2. User must provide answers
let inputAnswer = localStorage.getItem('inputAnswer')
function returnAnswer(){
    inputAnswer = document.getElementById("user-answer").value;
    localStorage.setItem('inputAnswer', inputAnswer)
}
// 3. Only one answer per question is correct



// 4. Once the correct answer is selected the 'next' button appears and the user can continue



``