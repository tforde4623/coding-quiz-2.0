// cache the DOM (only for stuff we have already made in html file)
let $contentEl = $('.main-content');
let $timerEl = $('#time-keeper');


// starting question index
let questionsIndex = 0;
// start timer (5 questions * 20 seconds for each)
let timer = 100;
// initiate a variable for interval so you can use it for it's ID later
let iterval;


function renderStart() {
    // creating the html elements for start page
    let title = $('<h1>');
    let body = $('<p>');
    let startBtn = $('<button>');
    // set timer placeholder
    $timerEl.text(`Time: ${timer}`);
    // adding text to those elements
    title.text('Coding Quiz');
    body.text("Answer the following programming questions. Rules: Time will be used as your 'score'. Finish before the time runs out. If you decided you want to get a question wrong, you will be docked time for that question. You will be given 20 seconds to answer each of the questions. Good luck!");
    startBtn.text('Lets go!');
    $contentEl.append(title, body, startBtn);

    // renderquiz function (quiz page) when startBtn clicked (eventlistener)
    startBtn.click(function(){
        renderQuiz();
        Timer();
    })
}


function renderQuiz() {
    // first thing we need to do is clear the start page, or the last quesiton
    $contentEl.empty();
    // check if we run out of questions
    if(questionsIndex === questions.length) {
        endQuiz();
    } else {
        let questionHead = $('<h1>');
        questionHead.text(questions[questionsIndex].question);

        // creating the answers
        let answerList = $('<ul>');
        $.each(questions[questionsIndex].answers, function(i, value){
            let tempBtn = $('<button>');
            tempBtn.text(value);
            let tempLi = $('<li>');
            tempLi.html(tempBtn);
            // set an id so we can access those lis/buttons for listeners
            tempLi.attr('onclick', `btnPress(${i})`);
            // append each one to list
            answerList.append(tempLi);
    });
        // set page content to the question (in h1) and the answers (as btns in <li>s in a list)
        $contentEl.append(questionHead, answerList);
    }
}


function btnPress(num) {
    // saving which answer you clicked to a variable using the btn number to index answers
    let clicked = questions[questionsIndex].answers[num];
    // saving correct answer to variable using currect question index
    let correct = questions[questionsIndex].correctAnswer;
    // see if answer clicked is write or wrong
    if(clicked !== correct) {
        // if wrong subtract 10 points (half time for that question)
        timer -= 10;
        // set time to 0 if it goes below
        if(timer <= 0) {
            timer = 0;
        }
        // display 'Wrong'
        displayFeedback('You are wrong');
    } else {
        // display 'correct'
        displayFeedback('You are correct');
    }
    // add one to index so next time we renderQuiz() it'll move on to next question
    questionsIndex++;
}


function Timer() {

    interval = setInterval(function(){
        $timerEl.text(`Time: ${timer}`);
        timer--;
    }, 1000);
}


function displayFeedback(feedback) {
    // remove any currect feedback (if answering super fast for example)
    $('#feedback-div').remove();
    // create div with feedback in it
    let newDiv = $('<div>');
    newDiv.html(`<hr> <div>${feedback}!</div>`);
    newDiv.attr('id', 'feedback-div');
    // append div with feedback in it
    $contentEl.append(newDiv);

    // remove it after 3/4 a second
    let timeout = setTimeout(function(){
        $('#feedback-div').remove();
        // move to next question
        renderQuiz();
    }, 750);
}


function endQuiz() {
    clearInterval(interval);
    // render an end screen
    let title = $('<h2>');
    let scoreIn = $('<p>');
    let subScore = $('<p>');
    
    title.text('Finished Quiz');

    scoreIn.text(timer);
    scoreIn.attr('id', 'score-input');

    subScore.html('Enter name: <input type="text" id="userName" /><button id="submit-userName">Submit Score</button>');
    $contentEl.append(title, scoreIn, subScore);
    // push final time to html just so it matches up exactly with the printed score
    $timerEl.text(`Time: ${timer}`);

    // set listeners to submit button and for the enter key to run submit();
    $('#submit-userName').on('click', submit);

    $('#userName').on('keypress', function(e){
        if(e.key === 'Enter'){
            submit();
        }
    });
}


function submit() {
    console.log($('#userName').val());
    if($('#userName').val().length > 0){
        // if we already have scores, get them, if not, lets create some in this array here
        let currentScores = JSON.parse(localStorage.getItem('highscores')) || [];

        // push new score as an object (JSON format) to empty list or other scores
        currentScores.push({score: timer, name: $('#userName').val()});
        let scores = JSON.stringify(currentScores);
        localStorage.setItem('highscores', scores);
        location.href = 'score.html';
    } else {
        // flash a message if they don't put in any initials/ a name
        displayFeedback('Please input valid initials/username');
    }
}


// call function to actually make a start page, and start the whole thing
renderStart();