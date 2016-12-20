var city = "",
	country = "",
	country_short;


var ss = window.speechSynthesis;

//handles the animation when S'bu is talking in start.html. Also do not say anything
var SW = new SiriWave({
	width: 250,
	height: 100,
	speed: 0.32,
	amplitude: 1,
	container: document.getElementById('siric'),
	style:"ios9"
});

function checkSpeaking(){
	if(!ss.speaking){
		ss.cancel();
		SW.stop();
		document.getElementById('siric').style.display = "none";
		document.getElementById('name-section').style.display = "";
	}else{
		setTimeout(checkSpeaking,2500)
	}
}

var g = new Greeting().introductions;
var user = new User();
var greeting = g[rand(0,g.length-1)];
var interim_transcript = '';
var final_transcript='',final_span = document.getElementById('final-result'), interim_span = document.getElementById('interim-result');

function doneGreeting(){
	//greeting done today, for choosing the appropriate greeting message once it goes to index.html
	(new Greeting().setGDT());
	SW.stop();
	document.getElementById('siric').style.display = "none";
	document.getElementById('name-section').style.display = "";
	if(!('webkitSpeechRecognition' in window)){
		document.getElementById('say-it-out-not').style.display = "none";
	}
	var recognition = new webkitSpeechRecognition();
	recognition.onresult = function(event) {
		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			} else {
				interim_transcript += event.results[i][0].transcript;
			}
		}
		document.getElementById('name').value(interim_transcript);
		document.getElementById('name').value(final_transcript);
	};
	recognition.start();
}

function askPreferences(){
	$('#name-section').slideUp();
	$('#preferences-section').fadeIn();
	speak("It's nice to meet you "+user.get('name')+". So what are your preferences for news? Choose atleast one.", function(){

	})
}

function saveName(proceed){
	var name = (final_transcript!=null && final_transcript!='') ? final_transcript : document.getElementById('name').value;
	if(!name){
		speak("I didn't quite get your name, try just typing it in.");
	}
	sls("sbu-user-name", name);
	if(proceed && proceed=="true"){
		askPreferences();
	}
}
function saveUserPreferences(){
	var checkedValues = $('input:checkbox:checked').map(function() {
		return this.name;
	}).get();
	sls("preferences", checkedValues);
	$("#preferences-section").fadeOut("", function(){
		speak("Thank you, that will be all.", function(){
			sls("preference_set",1);
			sls("ftud",1);
			window.location = 'index.html?utm=start'
		});
	});
}


if('geolocation' in navigator)
	getGeolocation(function(loc){
		loc = loc.coords;
		var loc_data = {lat:loc.latitude,lng:loc.longitude, altitude:loc.altitude};

		sls("geolocation",loc_data);

		getLocationData(loc_data,function(d){

			var address_components = d.results[0].address_components;
			address_components.forEach(function(v,k){
				if(v.types.indexOf("locality")!=-1 && v.types.indexOf("political")!=-1){
					city = v.long_name;
				}
			});
			country = address_components[address_components.length-1].long_name;
			country_short = address_components[address_components.length-1].short_name;
			sls("city", city);
			sls("country", country);
			sls("country_short", country_short);
		});
	}, function(e){
		console.log('loc error',e)
	});
else{
	getLocationDataFromIP(function(d){
		sls("city",d.city);
		sls("country",d.country);
		sls("country_short",d.countryCode);

		var loc_data = {lat:d.lat,lng:d.lon};
		sls("geolocation", loc_data);

	})
}

newsSources.types.forEach(function(v,k){
	var card_id = v.toLocaleLowerCase()+"-card-top";

	//if you want you can comment out the lines below
	if(v=="Tech")
		v = "technology";

	//the actual card is general-card-top not General News.
	if(v=="General News"){
		card_id = "general-card-top";
	}
	getImageFromPixelBay(v,function(image){
		document.getElementById(card_id).style = "background:linear-gradient(rgba("+rand(0,253)+", "+rand(0,253)+", "+rand(0,253)+", 0.16),rgba(0, 0, 0, 0.56)),url('"+image.webformatURL+"') no-repeat 50% 50%;background-size: cover;-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;-ms-background-size: cover;padding:0%";
	})
});

//recursively checks if S'bu is talking. Don't say it.
setTimeout(checkSpeaking,3000);

cancelSpeak();
speak(greeting, function(){
//	doneGreeting();
});
SW.start();
