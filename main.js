//select elements
let countSpans = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown")

//Set Options
let currentIndex = 0;
let rightAnswers= 0;
let countdownInterval;


//Functions
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    
    myRequest.onreadystatechange = function (){
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            let questionCount = questionsObject.length;
            //create bullets + Set Qusetions Count
            createBullets(questionCount);
            // Add questions Data
            addQuestionData(questionsObject[currentIndex],questionCount);
            //start count down
            countDown(60,questionCount);
            //click on submit
            submitButton.onclick =  () => {
            //get right answer 
            let theRightAnswer = questionsObject[currentIndex].right_answer;
            // increase index
            currentIndex++;
            //check the answer
            checkAnswer(theRightAnswer,questionCount);
            //remove previous questions
            quizArea.innerHTML="";
            //remove previous answers
            answersArea.innerHTML="";
            //add next question and answers
            addQuestionData(questionsObject[currentIndex],questionCount);
            //handel Bullets Spans classes 
            handelBullets();
            //start count down agin
            clearInterval(countdownInterval);
            countDown(60,questionCount);
            //show result
            showResults(questionCount);
            }
        }
    };

    myRequest.open("GET","file:///D:/HTML_CSS_Projects/Quiz%20Application/html_Question.json",true);
    myRequest.send();
}

getQuestions();

function createBullets (num){
    countSpans.innerHTML = num;
    //create spans
    for(let i = 0 ; i < num ; i++){
        let theBullet = document.createElement("span");
        if (i === 0){
            theBullet.className = "on";
        }
    //Append Bullet To main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count){
    if(currentIndex < count){
            //creat h2 question title
    let questionTitle = document.createElement("h2");
    //creat question text
    let questionText = document.createTextNode(obj['title']);
    //append text to heading
    questionTitle.appendChild(questionText);
    //append h2 to quiz area
    quizArea.appendChild(questionTitle);
    //create the answer
        for(let i = 1; i <= 4 ;i++){
            let mainDiv = document.createElement("div");
    //add class to main div
            mainDiv.className = "answer";
    //create radio input
            let radioInput = document.createElement("input");
    //  add type + name + ID + data attribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
    //make first option selected
                if(i === 1 ){
            radioInput.checked = true;
            }
    //add label 
            let theLabel = document.createElement("label");
    // add for attribute
            theLabel.htmlFor = `answer_${i}`;
    //create label text
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
    //add the text to label
            theLabel.appendChild(theLabelText);
    //add input + label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
    // append all dives to answer area
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer,count){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i = 0; i < answers.length; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
    }
}

function handelBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index)=>{
        if(currentIndex === index){
            span.className = "on";
        }
    });
}

function showResults(count) {
    let theResult;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if(rightAnswers > (count/2) && rightAnswers < count){
            theResult = `<span class ="good" >Good</span>, ${rightAnswers} From ${count}`;
        } else if(rightAnswers === count){
            theResult = `<span class ="perfect" >Perfect</span>, All Answers Is Good `;
        } else {
            theResult = `<span class ="bad" >Bad</span>, ${rightAnswers} From ${count}`;
        }
        resultsContainer.innerHTML = theResult;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }
} 

function countDown(duration, count){
    if(currentIndex < count){
        let minutes , seconds;
        countdownInterval = setInterval(function (){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}`: minutes ;
            seconds = seconds < 10 ? `0${seconds}`: seconds ;
            countdownElement.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0 ){
                clearInterval(countdownInterval);
                submitButton.click();
            }
        },1000);
    }
}