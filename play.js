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

var getQuotes = function(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://quotes.rest/qod.json?category=inspire", true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				var data = JSON.parse(xhr.responseText);
				if(data.success && data.success.total>0){
					var quote = data.contents.quotes[0];
					console.log(quote.quote.split("."));
					document.getElementById('quote-top').style = "background:linear-gradient(rgba(0, 255, 0, 0.16),rgba(155, 19, 255, 0.56)),url('"+quote.background+"') no-repeat 50% 50%;background-size: cover;-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;-ms-background-size: cover;padding:0%";
					document.getElementById('quote').innerText = quote.quote;
					document.getElementById('quote-author').innerText = quote.author;


/*
					if(quote.quote.length>150){
						var msgs = quote.quote.split(".");
						var initMsg = new SpeechSynthesisUtterance("One inspiration a day keeps the depression away. Your quote for the day is from " + quote.author + ", and says, ");
						initMsg.language = 'en-US';
						ss.speak(initMsg);
						msgs.forEach(function(v,k){
							var msg = new SpeechSynthesisUtterance(v);
							msg.language = 'en-US';
							ss.speak(msg)
						})
					}else{
						 var msg = new SpeechSynthesisUtterance("One inspiration a day keeps the depression away. Your quote for the day is from " + quote.author + ", and says, "+quote.quote);
						 msg.language = 'en-US';
						 ss.speak(msg)
					}
*/					var msg = new SpeechSynthesisUtterance("One inspiration a day keeps the depression away. Your quote for the day is from " + quote.author + ", and says, "+quote.quote);
					msg.language = 'en-US';
					ss.speak(msg)
				}
			}
		}
	};
	xhr.send();
};

//getQuotes();
var getForecast = function(){
	var city = ls("city");
	if(!city)
		city = "Bulawayo"; //because its my home town

	var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID=bcd6b50b317746d1c0898b4a567c6da3&units=metric";
	fetch(url, { method: 'GET' })
		.then(function(fetchResponse){ return fetchResponse.json() })
		.then(function(response) {
			var weather = response.weather[0];

			//setting the image for the day
			getForecastImage(weather);

			var avgTemp = Math.round(number_format(response.main.temp,".",""));
			var minTemp = Math.round(number_format(response.main.temp_min,".",""));
			var weatherDesc = new SpeechSynthesisUtterance("Todays weather description is: " + weather.description+", and average temperature in, "+ls("city")+", will be " + avgTemp + "degrees celcius.");
			ss.speak(weatherDesc);

			document.getElementById('card__weather_description').innerText = weather.main;
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

			switch(weather.main.toLowerCase()){
				case 'thunderstorm' || 'rain' || 'shower rain':
					suggestion.long = "You should carry an umbrella or raincoat with you on your way out.";
					suggestion.short = "Carry umbrella or raincoat.";
					icons.set("icon", 'rain');
					break;
				case 'clouds':
					suggestion.long = "You never know, the rains might come, so just carry that umbrella in case.";
					suggestion.short = "Clouds could mean rains are coming.";
					icons.set("icon", 'cloudy');
					break;
				case 'clear sky' || 'sky':
					suggestion.long = "You will have clear skies above you today, so, if you can spend much time outside and enjoy the goodness of God\'s creation.";
					suggestion.short = "Feel free to wear anything.";
					break;

				default:
					suggestion.short = "Unavailable";
					suggestion.long = "Sometimes as a human being, you just have to do things on your own, So today, naah fam. I a'int telling you what to wear.";
			}

			icons.play();


			if(suggestion.long && suggestion.short){
				document.getElementById('card__suggestion').innerText = suggestion.short;
				var advice = new SpeechSynthesisUtterance(suggestion.long);
				ss.speak(advice);
			}

			/*
			 cardElement.querySelector('.card__title').textContent = response.name;
			 cardElement.querySelector('.card__desc').textContent = response.bio;
			 cardElement.querySelector('.card__img').setAttribute('src', response.avatar_url);
			 cardElement.querySelector('.card__following span').textContent = response.following;
			 cardElement.querySelector('.card__followers span').textContent = response.followers;
			 cardElement.querySelector('.card__temp span').textContent = response.company;
			 */
		})
		.catch(function (error) {
			//If user is offline and sent a request, store it in localStorage
			//Once user comes online, trigger bg sync fetch from application tab to make the failed request
			localStorage.setItem('request', name);
			console.error(error);
		});
}();

var getForecastImage = function(weather){
	var per_page = 50;
	var max;

	var url = "https://pixabay.com/api/?per_page="+per_page+"&min_width=150&q=beautiful+"+weather.main+"&image_type=photo&key="+pixalbayKey+"&order=popular&pretty=true";
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
			//If user is offline and sent a request, store it in localStorage
			//Once user comes online, trigger bg sync fetch from application tab to make the failed request
			localStorage.setItem('request', name);
			console.error(error);
		});
};

var getNews = function(){
	var chosen = [];
	var articles = {};

	//tech
	articles.tech = [];
	var business_spoken = false;
	var sports_spoken = false;
	var entertainment_spoken = false;
	var tech_spoken = false;
	var preferences = ls("preferences");
	articles.business = [];
	articles.entertainment = [];
	articles.sports = [];
	articles.general = [];
	$.each(preferences, function(key,val){
		$.each(newsSources.categories[val], function(k,v){
			var url = "https://newsapi.org/v1/articles?source="+v.short+"&apiKey=c5e14bdca75045708df957ef0d58569d";
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
					//If user is offline sent a request, store it in localStorage
					//Once user comes online, trigger bg sync fetch from application tab to make the failed request
					localStorage.setItem('request', name);
					console.error(error);
				})
		});
	});
};

//lazy
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
