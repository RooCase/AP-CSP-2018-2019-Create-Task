//This below code declares global variables and sometimes sets them
var newLog = {};
var recordList = [];
var numCheckCorrect;
var recordList = [];
var jobNameList = [];
var stopTimer = false;
var timerUpdate = {};
var singleTimer = false;
var resetDone = false;

//this code calls the reset() and the timer reset cod function
reset();
resetTimer();

//this literally rounds n to the second decimal place
function round(number){
  var result = Math.floor(number * 100) / 100;
  return result;
}

//My abstraction
//this sets the dropdown 
function setDropdown(boxID, displayBox){
  recordList = [];
  jobNameList = [];
  readRecords("jobs", {}, function(records) {
        if (records.length > 0) {
            for (var i = 0; i < records.length; i++) {
              appendItem(recordList, records[i]);
              appendItem(jobNameList, records[i].name);
            }
        }
  setProperty(boxID, "options", jobNameList);
  setMainTextBox("jobsDropdown", displayBox);
  });}


//this function sets the text box in the timer screen that shows how much time has passed.
function setTimerText(boolean){
  var showText = {};
  if(boolean == false){
    showText.hour = timerUpdate.hour;
    showText.minutes = timerUpdate.minutes;
    showText.seconds = timerUpdate.seconds;
    //if a unit of time does not have two didgits, 
    //this code adds a 0 to the beginning to make it 2 digits.
    if(timerUpdate.hour <= 9){
      showText.hour = "0" + timerUpdate.hour.toString();
    }
    if(timerUpdate.minutes <= 9){
      showText.minutes = "0" + timerUpdate.minutes.toString();
    }
    if(timerUpdate.seconds <= 9){
      showText.seconds = "0" + timerUpdate.seconds.toString();
    }
    //this code sets the text using variables and their objects declared earlier.
    setText("timerDisplay", showText.hour + ":" + showText.minutes + ":" + showText.seconds);
}
  else{
    //if no time has occured, time is set at "00:00:00"
   setText("timerDisplay", "00:00:00");
}}

// Oh god. Don't look at this. This is the worst code I've ever written.
//This updates the time variable associated with a specific job stored in the database "jobs"
//Main Algorithm
function addTime(job, timeinput){
  var update = {};
  var original = {};
  var newTime;
  update.name = job;
  update.time = timeinput;
  update.time = numCheck(update.time);
  if(numCheckCorrect == true){
   numCheck(update.time);
   readRecords("jobs", {name: update.name}, function(records) {
     console.log(records);
     original.id = records[0].id;
     original.name = records[0].name;
     original.client = records[0].client;
     original.pph = records[0].pricePerHour;
     original.time = records[0].time;
     newTime = original.time + update.time;
     update.totalCharge = (newTime * (original.pph / 60));
     console.log(original.id + " is the id that will be assigned");
     console.log(original);
    updateRecord("jobs",{id:original.id, name: original.name, client: original.client, pricePerHour: original.pph, time: newTime, totalCharge: update.totalCharge}, function(record, success) {
     console.log(record);
     if(success){
       console.log("Updated successfully. ID: " + original.id);
     }
     reset();
});});}}
//You looked, didn't you?

//First Child Function
//this checks and makes sure an input is in fact a number and does not contain non-numerical elements.
function numCheck(n){
    var numberN = Number(n);
    if(numberN == n){
      console.log(Number(n));
      numCheckCorrect = true;
      return numberN;
    }else{
      numCheckCorrect = false;
    }
}

//Second Child function
//This code sets the individual counters to 0.
function resetTimer(){
  timerUpdate.seconds = 0;
  timerUpdate.totalSeconds = 0;
  timerUpdate.minutes = 0;
  timerUpdate.hour = 0;
}


//this function sets the text box in the main screen and delete screen.
function setMainTextBox(jobsDropdownID, jobBox){
  var show = {};
  show.name = getText(jobsDropdownID);
  readRecords("jobs", {name: show.name}, function(records) {
  if (records.length > 0){
   show.name = "Name: " + records[0].name;
   show.client = "Client: " + records[0].client;
   show.pph = "Price Per Hour: $" + round(records[0].pricePerHour);
   show.time = "Time Worked: " + round(records[0].time) + " minutes \n (" + round(records[0].time / 60) + " hours)" ;
   var preZero  = round(records[0].totalCharge);
   var postZero = addZeroToDecimal(preZero);
   show.totalCharge = "Total Charge: $" + postZero;
   setText(jobBox, show.name + "\n" + show.client + "\n" + show.pph + "\n" + show.time + "\n" + show.totalCharge);
   }
});
}

//correction! THIS is the worst code in this project. 
//I could have used ".toFixed(2)" but didn't realize this existed.
function addZeroToDecimal(number){
  var numberList = [];
  var concat;
  numberList = number.toString().split('');
  var strNum = numberList.length;
  for(var j = 0; j <= numberList.length; j++){
      if(j === numberList.length){
      console.log(numberList);
      if(numberList[j - 2] === "."){
        removeItem(numberList, numberList.length -1);
        concat = numberList.join("");
        console.log(concat);
        return concat;
      }else{
      appendItem(numberList, ".");
      j--;
      continue;
      }
      }
    if(numberList[j] === "."){
        if(j === (strNum - 3)){
        concat = numberList.join("");
        console.log(concat);
        return concat;
      }else if(j === (strNum)){
        appendItem(numberList, "0");
        appendItem(numberList, "0");
        concat = numberList.join("");
        console.log(concat);
        return concat;
      }else if(j === (strNum-2)){
        appendItem(numberList, "0");
        concat = numberList.join("");
        console.log(concat);
        return concat;
      }else{
        continue;
      }
   }else{
     continue;
}}}

//this resets a few variables and calls 'setDropdown()'
function reset(){
  recordList = [];
  jobNameList = [];
  setDropdown("jobsDropdown", "jobDetail");
  setText("timeInput", "");
}

//when the add button is clicked from the main screen
onEvent("addButton", "click", function(){
  newLog.time = getText("timeInput");
  newLog.addTo = getText("jobsDropdown");
  addTime(newLog.time, newLog.addTo);
});

// This is basic navigation Button click events.
onEvent("menuButton", "click", function() {
  setScreen("menuScreen");
});
onEvent("returnToMain", "click", function() {
  setScreen("openingScreen");
  reset();
});
onEvent("newJobBtn", "click", function() {
  setScreen("newJobScreen");
});
onEvent("timerButton", "click", function() {
  setScreen("timer");
  setDropdown("jobsDropdown2", "jobDetail2");
});
onEvent("backToMenu", "click", function() {
  setScreen("menuScreen");
});
onEvent("returnToMenu4", "click", function() {
  setScreen("menuScreen");
});
onEvent("deleteScreenButton", "click", function() {
  setScreen("deleteScreen");
  setDropdown("jobsDropdown3", "jobDetail2");
});
onEvent("backTimer", "click", function() {
  setScreen("menuScreen");
});
onEvent("jobsDropdown", "change", function() {
  setMainTextBox("jobsDropdown", "jobDetail");
});
onEvent("jobsDropdown3", "change", function() {
  setMainTextBox("jobsDropdown3", "jobDetail2");
});

// The below code takes the inputs of the add form and then submits it to the Data table. 
onEvent("submitNewJob", "click", function() {
  var newJob = {};
  newJob.name = getText("nameInput");
  newJob.client = getText("clientInput");
  newJob.pph = getText("pricePerHourInput");
  newJob.time = 0;
  setText("successOrFailure","Attempting To Add...");
  if(newJob.name != "" || newJob.client != "" || newJob.pph != ""){
  numCheck(newJob.pph);
  if(numCheckCorrect == true){
    var addpph = numCheck(newJob.pph);
    createRecord("jobs", {name: newJob.name, client: newJob.client, pricePerHour: addpph, time: newJob.time , totalCharge: ((addpph / 60) *  newJob.time)}, function(record) {
      if(record){
        setText("successOrFailure","Success! Job Created.");
        console.log(recordList);
        setText("nameInput", "");
        setText("clientInput", "");
        setText("pricePerHourInput", "");
        reset();
      }else{
        setText("successOrFailure", "There was an error creating new item.");
      }
      
});}
    else{
    setText("successOrFailure", "You must use only numbers in the 'Price Per Hour' section.");
    }
  }});
  
onEvent("addButton", "click", function(){
  addTime(getText("jobsDropdown"), getText("timeInput"));
});


onEvent("startTimer", "click", function() {
  if(resetDone != true){
  resetTimer();
  resetDone = true;
  }
  stopTimer = false;
  if(singleTimer == false){
  singleTimer = true;
  timedLoop(1000, function() {
    timerUpdate.seconds += 1;
    timerUpdate.totalSeconds += 1;
    if(timerUpdate.seconds == 60){
      timerUpdate.seconds = 0;
      timerUpdate.minutes += 1;
    }
    if(timerUpdate.minutes == 60){
      timerUpdate.minutes = 0;
      timerUpdate.hour += 1;
    }
    setTimerText(false);
    if(stopTimer === true){
          console.log(timerUpdate);
          singleTimer = false;
          stopTimedLoop();
}});}});

onEvent("resetTimer", "click", function() {
  resetTimer();
  stopTimer = true;
  setTimerText(false);
});
onEvent("stopTimer", "click", function() {
  stopTimer = true;
});
onEvent("add3", "click", function() {
  var updateTime = Math.round(timerUpdate.totalSeconds / 60);
  var updateAddTime = getText("jobsDropdown2");
  addTime(updateAddTime, updateTime);
  setTimerText(true);
});

onEvent("deleteButton", "click", function() {
  var show = {};
  show.name = getText("jobsDropdown3");
  readRecords("jobs", {name: show.name}, function(records) {
  if (records.length > 0){
   show.ID = records[0].id;
   console.log(show.ID);
   deleteRecord("jobs", {id:show.ID}, function() {
   setDropdown("jobsDropdown3", "jobDetail2");
   });
   }
});
});
