var apiKey = 'fba887dbfc1da151e8e5779421d09c56'
var requestURL = 'https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid=' & apiKey; 

fetch(requestURL).then(function(response){
    if (response.ok) {
        response.json().then(function(data){
            console.log(data); 
        })
    }
})

var messageEl = $('#message-bar'); 

var eventList = new Array(); 

function initPage() {
    // get the saved events in local storage and render the timeblock
    //eventList = JSON.parse(localStorage.getItem("eventList"));

    //renderSearchHist(); 
}

function renderSearchHist() {
    //reset the timeblock element
    //timeBlockEl.empty(); 
/*
    for(var i = 9; i <= 17; i++) {
        var sectionEl = $('<section>')

        // create hour column
        sectionEl.addClass('row d-flex'); 
        sectionEl.attr('data-hour', i); 
        timeBlockEl.append(sectionEl); 

        var hourEl = $('<div>'); 
        hourEl.addClass('hour col-3 col-md-2 col-lg-1'); 
        var hourTextEl = $('<p>'); 
        hourTextEl.text(moment(i, 'HH').format("hA")); 
        hourTextEl.attr('style', 'margin-top:40%'); 
        hourEl.append(hourTextEl); 
        sectionEl.append(hourEl); 

        // create description column 
        var descEl = $('<textarea>'); 

        // populate the save event if any
        if (eventList !== null) {
            for (var j = 0; j < eventList.length; j++) {
                if (eventList[j].date == moment().format('YYYYMMDD') && 
                    eventList[j].hour == i) {
                    descEl.text(eventList[j].desc); 
                }
            }
        }

        // set the background color based on the time 
        if (moment().format('H') < i) {
            descEl.addClass('description future col-6 col-md-8 col-lg-10'); 
            descEl.attr('disabled', false); 
            descEl.attr('style', 'color:blue'); 
        } else if (moment().format('H') == i) {
            descEl.addClass('description present col-6 col-md-8 col-lg-10');
            descEl.attr('disabled', false);  
        } else {
            descEl.addClass('description past col-6 col-md-8 col-lg-10'); 
            descEl.attr('disabled', true); 
            descEl.attr('style', 'color:black'); 
        }

        sectionEl.append(descEl); 

        // create the save button 
        var saveEl = $('<button>'); 
        saveEl.addClass('saveBtn col-3 col-md-2 col-lg-1'); 

        var iconEl = $('<i>'); 
        iconEl.addClass('fa fa-save'); 
        iconEl.attr('style', 'color:white'); 
        saveEl.append(iconEl); 
        sectionEl.append(saveEl); 
    }
*/
}

function saveSearchHist(event){
/*
    var btnClicked = $(event.target);

    
    if (btnClicked.prop('localName') === 'button') {
        // get values if the target is the button
        var eventItem = {
            hour: btnClicked.parent('section').data('hour'), 
            desc: btnClicked.parent('section').children().eq(1).val().trim(), 
            date: moment().format('YYYYMMDD')
        }
    } else {
        // get values if the target is the icon on the button 
        var eventItem = {
            hour: btnClicked.parent('button').parent('section').data('hour'), 
            desc: btnClicked.parent('button').parent('section').children().eq(1).val().trim(), 
            date: moment().format('YYYYMMDD')
        }
    }

    // validate the input 
    if (eventItem.hour < moment().format('H')) {
        displayMessage('Cannot save past event.'); 
        return; 
    }

    if (eventItem.desc === '') {
        displayMessage('No input on the event description.')
        return; 
    }

    if (eventList === null) {
        eventList = new Array(); 
        eventList.push(eventItem);    
    } else {
        // if there is an existing event for the same time, remove the old one from local storage
        for (var i = 0; i < eventList.length; i++) {
            if (eventList[i].date == moment().format('YYYYMMDD') && 
                eventList[i].hour == eventItem.hour) {
                eventList.splice(i, 1); 
                break; 
            }
        }

        eventList.push(eventItem);
    }

    localStorage.setItem('eventList', JSON.stringify(eventList)); 
    displayMessage('Event Information is saved successfully.'); 

    renderSearchHist(); 
*/
}

function displayMessage(strMessage) {
    messageEl.text(strMessage);  
    messageEl.show(); 

    setTimeout(function(){messageEl.hide()}, 1500); 
}

// delegate the event listener to the save buttons from the time block element
//timeBlockEl.on('click', '.saveBtn', saveEvent);

initPage(); 

