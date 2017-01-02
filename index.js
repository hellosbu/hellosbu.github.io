notyNot('Sbu App', {
	body: 'This is some body content!',
	title:'Sbu App'
}, function(){
});
var ss = window.speechSynthesis;
var greeting = new Greeting();
//because it's good practise to cancel ss before using it
ss.cancel();
//getting the Greeting text from the Hard coded greeting class, most probably you'd want to use something else, maybe an api IDK 
var greeting_text = greeting.getGreeting();

if(greeting_text)
	speak(greeting_text);

if(!greeting.doneToday())
	greeting.setGDT();

/*
	Ok, so my source of quotes has a freemium and paid plans of which im not necessarily willing to pay $5 subscription for a quotes api...
	like S\'bu would say, naah Fam
 */

var getQuotes = function(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://quotes.rest/qod.json?category=inspire", true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var data = JSON.parse(xhr.responseText);
				if(data.success && data.success.total>0){
					var quote = data.contents.quotes[0];
					document.getElementById('quote-top').style = "background:linear-gradient(rgba(0, 255, 0, 0.16),rgba(155, 19, 255, 0.56)),url('"+quote.background+"') no-repeat 50% 50%;background-size: cover;-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;-ms-background-size: cover;padding:0%";
					document.getElementById('quote').innerText = quote.quote;
					document.getElementById('quote-author').innerText = quote.author;

					/*
						You might also want to randomise this one inspiration a day thing, because after some time it gets boring to hear.
						also you might to do something about the fact that after 300 speak() breaks and everything else falls apart, you
						could use the onerror of speechSynthesis, maybe pass a second callback to speak and let it handle errors
					 */

					if(quote.quote.length<300)
						speak("One inspiration a day keeps the depression away. Your quote for the day is from " + quote.author + ", and says, "+quote.quote, function(){
							
						})

				}
			}
		}
	};

	/*
		Comment out the line below during development, for the rate limiting thing or you could use caching, or 
		the offline first approach as explained by Jake Archibold in this 
		talk https://www.youtube.com/watch?v=cmGr0RszHc8. This then means ditching XHR and using fetch or in your
		service-worker listen for the xhr event IDK the exact event name.
	*/
	xhr.send();

};
getQuotes();

var getForecast = function(){
	var city = ls("city");
	if(!city)
		city = "Bulawayo"; //because its my home town

//	var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID="+openWeatherMapKey+"&units=metric";
	var url = "https://api.apixu.com/v1/current.json?key=bc6d41af8b2f4c3f9fc210445163112&q=Bulawayo";
	/*
		PS. The Fetch API is totally cool with the promises and all, but I'll not even rant.
	 */
	fetch(url, { method: 'GET' })
		.then(function(fetchResponse){ return fetchResponse.json() })
		.then(function(response) {
			var weather = response.current;

			//setting the forecast image image for the day

			var avgTemp = Math.round(number_format(weather.temp_c,".",""));
			var minTemp = Math.round(number_format(weather.feelslike_c,".",""));

			speak("Todays weather description is: " + weather.condition.text+", and average temperature in, "+ls("city")+", will be " + avgTemp + "degrees celcius.");

			document.getElementById('card__weather_description').innerText = weather.condition.text;
			document.getElementById('card__average_temperature').innerText = avgTemp+" °C";
			document.getElementById('card__min_temperature').innerText = minTemp + "°C (min)";

			var icons = new Skycons({"color": "white"});
			var suggestion = {};

			/*
			//regex way
			switch (true) {
				case /xyz/.weather.description:
					display("• Matched 'xyz' test");
					break;
				case /test/.test(str):
					display("• Matched 'test' test");
					break;
				case /ing/.test(str):
					display("• Matched 'ing' test");
					break;
				default:
					display("• Didn't match any test");
					break;
			}

*/

			var description = weather.condition.text;
			var forecastImgText = '';
			if(description.indexOf('thunderstorm')!=-1 || description.indexOf('rain')!=-1 || description.indexOf('shower rain')!=-1){
				suggestion.long = "You should carry an umbrella or raincoat with you on your way out.";
				suggestion.short = "Carry umbrella or raincoat.";
				icons.set("icon", 'rain');
				forecastImgText='rain';
			}else if(description.indexOf('clouds')!=-1){
				suggestion.long = "You never know, the rains might come, so just carry that umbrella in case.";
				suggestion.short = "Clouds could mean rains are coming.";
				icons.set("icon", 'cloudy');
				forecastImgText='clouds';
			}else if(description.indexOf('clear sky')!=-1 || description.indexOf('sky')){
				suggestion.long = "You will have clear skies above you today, so, if you can spend much time outside and enjoy the goodness of God\'s creation.";
				suggestion.short = "Feel free to wear anything.";
				forecastImgText='clear sky';
			}else{
				if((new Date()).getHours()<18)
					forecastImgText='clear sky';
				else
					forecastImgText = 'beautiful night';

				suggestion.short = "Unavailable";
				suggestion.long = "Sometimes as a human being, you just have to do things on your own, So today, naah fam. I a'int telling you what to wear.";
			}
			getForecastImage(forecastImgText);

			//the result of laziness is shown below, do not follow this route.

			icons.play();


			if(suggestion.long && suggestion.short){
				document.getElementById('card__suggestion').innerText = suggestion.short;
				var advice = new SpeechSynthesisUtterance(suggestion.long);
				ss.speak(advice);
			}

		})
		.catch(function (error) {
			console.error(error);
		});
}();

var getForecastImage = function(weather_description){
	var per_page = 50;
	var max;

	var url = "https://pixabay.com/api/?per_page="+per_page+"&min_width=150&q=beautiful+"+weather_description+"&image_type=photo&key="+pixalbayKey+"&order=popular&pretty=true";
	fetch(url, { method: 'GET' })
		.then(function(fetchResponse){ return fetchResponse.json() })
		.then(function(response) {
			if(response.total>=1){
				max = (response.total>1) ? response.total-1 : 1;
				var image = response.hits[rand(0,max)];
				if(!image)
					image = response.hits[0];

				document.getElementById('weather-card-top').style = "background:linear-gradient(rgba(155, 255, 0, 0.16),rgba(155, 200, 255, 0.56)),url('"+image.webformatURL+"') no-repeat 50% 50%;background-size: cover;-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;-ms-background-size: cover;padding:0%";

			}
		})
		.catch(function (error) {
			console.error(error);
		});
};

var getNews = function(){
	/*
		Ok, Disclaimer, the below lines may seem nolonger "framework agnostic", but it had to be done. And anyway is jQuery even a framework?
	 */
	
	var articles = {};

	var business_spoken = false;
	var sports_spoken = false;
	var entertainment_spoken = false;
	var tech_spoken = false;
	var preferences = ls("preferences");
	articles.tech = [];
	articles.business = [];
	articles.entertainment = [];
	articles.sports = [];
	articles.general = [];
	
	/*
		Using the user's preference to get news from newsapi.org... totally cool api, which I somehow feel will discontinue their
		service given the way people will be abusing it. When you're in development, comment out the function when you're now satisfied 
		with how it integrates with your app so that you dont reach your quota or rate limit. One way to do this is to just remove the "()" 
		at the end of the function.
	 */
	
	$.each(preferences, function(key,val){
		$.each(newsSources.categories[val], function(k,v){
			var url = "https://newsapi.org/v1/articles?source="+v.short+"&apiKey="+newsAPIKey;
			fetch(url, { method:"GET"})
				.then(function(fetchResponse){ return fetchResponse.json() })
				.then(function(d) {
					if(d.status=="ok"){
						$.each(d.articles, function(kk,vv){
							if(kk<1){
								vv.source = v;
								appendToNews(val,vv);
								articles[val].push(vv);
							}
						});

						//yes, there are 4 if statements

						if(val=="tech")
							if(!tech_spoken){
								//now you have to change the code so that the utterences are random
								var techMsg = new SpeechSynthesisUtterance("In the world of Tech... " + articles.tech[rand(0,articles.tech.length-1)].title+".");
								ss.speak(techMsg);
								tech_spoken = true;
							}

						if(val=="business")
							if(!business_spoken){
								var article = articles.business[rand(0,articles.business.length-1)];
								var businessMsg = new SpeechSynthesisUtterance("Today in business. " + article.title + ". This Article is written by " + article.author + " of " + article.source.name)
								ss.speak(businessMsg);
								business_spoken = true;
							}

						if(val=="sports")
							if(!sports_spoken){
								var sportsMsg = new SpeechSynthesisUtterance("Topping in sports,  " + articles.sports[rand(0,articles.sports.length-1)].title+".");
								ss.speak(sportsMsg);
								sports_spoken = true;
							}

						if(val=="entertainment")
							if(!entertainment_spoken) {
								var entertainmentMsg = new SpeechSynthesisUtterance("Today in the glitz and glam,  " + articles.entertainment[rand(0, articles.entertainment.length - 1)].title+".");
								ss.speak(entertainmentMsg);
								entertainment_spoken = true;
							}

					}
				})
				.catch(function (error) {
					console.error(error);
				})
		});
	});
}();


/*
	Here, this is definitely not advised, maybe depending on the framework you are going to use there will be an efficient way that doesnt break the DOM the way this does 
 */
function appendToNews(type,vv){
	$('.'+type+'-news').append('' +
		'<a class="card" id="news-card">'+
		'<div class="card__spinner"></div>'+
		'<div class="card__container">'+
		'<div class="news-card-top" id="news-card-top" style="background:linear-gradient(rgba(0, 0, 0, 0.88),rgba('+rand(0,255)+', '+rand(0,255)+', '+rand(0,255)+', 0.56)),url('+vv.urlToImage+') no-repeat 50% 50%;background-size: cover;-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;-ms-background-size: cover;padding:0%">'+
		'<p onclick=goToURL("'+vv.url+'") class="" style="color:white;text-decoration:none;font-size:22pt;text-align:left;padding:2%">'+
		'<span id="article-title">'+vv.title+'</span>'+
		'</p>'+
		'<p id="card__weather_description" class="card__weather_description" style="color:white;text-decoration:none;font-size:16pt;text-align:center;display: block;width: 100%;margin-bottom:2%">'+vv.source.name+'</p>'+
		'</div>'+
		'<p class="card__temp">'+
		vv.description+
		'</p>'+
		'</div>'+
		'</a>'
	);
	$('.'+type+'-news-title').show();
}
