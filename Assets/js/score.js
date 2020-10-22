// creating html elements in main div for score page
// really could have done this in index.js / index.html but wanted a second document
let title = $('<h1>');
title.text('Highscores');
let scoreList = $('<ol>');
scoreList.attr('id', 'highscore-list');
let linkBtn = $('<a>');
linkBtn.attr('href', 'index.html');
linkBtn.html('<button class="horizontal-button">Take Again</button>');
let clearBtn = $('<button>');
clearBtn.text('Clear All Scores');
clearBtn.addClass('horizontal-button');
clearBtn.attr('id', 'clear');

$('.main-content').append(title, scoreList, linkBtn, clearBtn);

// on click listener for #clearBtn to clear highscore list
$('#clear').on('click', function(){
    localStorage.removeItem('highscores');
    // reload page to show changes
    location.reload();
});

// if no scores, don't grab any, if there are, grab them
scores = JSON.parse(localStorage.getItem('highscores')) || [];

// take the array we just got and sort it by score int (if we got one)
if(scores.length > 0) {
    scores.sort(function(score1, score2) {
        tempNum = score2.score - score1.score;
        return tempNum;
    });
}

// create a score li and append to highscores parent
for(let i = 0; i < scores.length; i++) {
    let tempScore = $('<li>');
    tempScore.text(`${scores[i].name}: ${scores[i].score} points`);
    $('#highscore-list').append(tempScore);
}
