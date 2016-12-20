var ss = window.speechSynthesis;
//you can also check out https://newsapi.org/sources for the list of supported news sources
var newsSources = {
	categories: {
		tech:[
			{
				name:"TNW",
				short:"the-next-web",
				logo:""
			},
			{
				name:"The Verge",
				short:"the-verge",
				logo:""
			},
			{
				name:"Tech Crunch",
				short:"techcrunch",
				logo:""
			},
			{
				name:"Recode",
				short:"recode",
				logo:""
			},
			{
				name:"Polygon",
				short:"polygon",
				logo:""
			},
			{
				name:"Mashable",
				short:"mashable",
				logo:""
			},
			{
				name:"Engadget",
				short:"engadget",
				logo:""
			},
			{
				name:"ars Technica",
				short:"ars-technica",
				logo:""
			},{
				name:"TechRadar",
				short:"techradar",
				logo:""
			}
		],
		sports: [
			{
				name:"ESPN",
				short:"espn",
				logo:""
			},
			{
				name:"ESPN CricInfo",
				short:"espn-cric-info",
				logo:""
			},
			{
				name:"BBC Sport",
				short:"bbc-sport",
				logo:""
			},
			{
				name:"Four Four Two",
				short:"four-four-two",
				logo:""
			},
			{
				name:"NFL News",
				short:"nfl-news",
				logo:""
			},
			{
				name:"Sky Sports News",
				short:"sky-sports-news",
				logo:""
			},
			{
				name:"TalkSport",
				short:"talksport",
				logo:""
			},
			{
				name:"The Sport Bible",
				short:"the-sport-bible",
				logo:""
			}
		],
		business:[
			{
				name:"Business Insider",
				short:"business-insider",
				logo:""
			},
			{
				name:"CNBC",
				short:"cnbc",
				logo:""
			},
			{
				name:"Financial Times",
				short:"financial-times",
				logo:""
			},
			{
				name:"Fortune",
				short:"fortune",
				logo:""
			},
			{
				name:"The Economist",
				short:"the-economist",
				logo:""
			},
			{
				name:"The New York Times",
				short:"the-new-york-times",
				logo:""
			},
			{
				name:"The Times of India",
				short:"the-times-of-india",
				logo:""
			},
			{
				name:"The Wall Street Journal",
				short:"the-wall-street-journal",
				logo:""
			},
			{
				name:"The Washington Post",
				short:"the-washington-post",
				logo:""
			}
		],
		general:[
			{
				name:"Time Magazine",
				short:"time",
				logo:""
			},
			{
				name:"USA Today",
				short:"usa-today",
				logo:""
			},
			{
				name:"The Huffington Post",
				short:"the-huffington-post",
				logo:""
			},
			{
				name:"The Telegraph",
				short:"the-telegraph",
				logo:""
			},
			{
				name:"Reuters",
				short:"reuters",
				logo:""
			},
			{
				name:"Sky News",
				short:"sky-news",
				logo:""
			},
			{
				name:"Google News",
				short:"google-news",
				logo:""
			}
		],
		entertainment:[
			{
				name:"Entertainment Weekly",
				short:"entertainment-weekly"
			},
			{
				name:"BuzzFeed",
				short:"buzzfeed"
			},
			{
				name:"IGN Entertainment",
				short:"ign",
				logo:""
			}

		]
	},
	types:[
		'Tech',
		'Sports',
		'Business',
		'General News',
		'Entertainment'
	]
};
var date = new Date();
//ftu is First Time Use
var lsPrefix = 'sbu-';
//gets a string from localStorage using key
var ls = function(k){
	var stored_val = localStorage.getItem(lsPrefix + k);
	try {
		var o = JSON.parse(stored_val);
		if (o && typeof o === "object") {
			return JSON.parse(stored_val);
		}
	}
	catch (e) { }
	return stored_val;
};
//sets a string in localStorage with key
var sls = function(k,v){
	if(typeof v=="object"){
		v = JSON.stringify(v);
	}
	localStorage.setItem(lsPrefix+k,v)
};
function rand(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}
String.prototype.ucwords = function() {
	str = this.toLowerCase();
	return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
		function($1){
			return $1.toUpperCase();
		});
};
function goToURL(url){
	window.open(url, "_blank");
}
function speak(ttspeak, c){
	//c is a callback function
	var utterance = new SpeechSynthesisUtterance();
	utterance.text = ttspeak;
	ss.cancel();
	ss.speak(utterance);
	utterance.addEventListener('end', function(e){
		console.log('end')
	});
	utterance.onend = function(e){
		typeof c == "function" && c();
	};
}
function cancelSpeak(){
	ss.cancel();	
}
function getImageFromPixelBay(text,c){
	text = text.replace(" ","+");
	var per_page = 50;
	var max;

	var url = "https://pixabay.com/api/?per_page="+per_page+"&min_width=150&q="+text+"&image_type=photo&key="+pixalbayKey+"&order=popular&pretty=true";
	fetch(url, { method: 'GET' })
		.then(function(fetchResponse){ return fetchResponse.json() })
		.then(function(response) {
			if(response.total>=1){
				max = (response.total>1) ? response.total-1 : 1;
				var image = response.hits[rand(0,max)];
				if(!image)
					image = response.hits[0];
				typeof c == "function" && c(image);
			}
		})
		.catch(function (error) {

		});
	
}

function getGeolocation(c,cf){
	if('geolocation' in navigator){
		navigator.geolocation.getCurrentPosition(function(loc){
			c(loc);
		}, function(e){
			cf(e);
			console.log("Geolocation Error",e)
		})
	}
}

function getLocationData(loc,c){
	var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+loc.lat+","+loc.lng+"&sensor=false";
	fetch(url,{method:"GET"})
		.then(function(fetchResponse){return fetchResponse.json()})
		.then(function(d){
			c(d)
		})
}

function getLocationDataFromIP(c){
	var url = "http://ip-api.com/json";
	fetch(url,{method:"GET"})
		.then(function(fetchResponse){return fetchResponse.json()})
		.then(function(d){
			c(d)
		})
}
