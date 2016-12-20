//I'm an informal person so I set it that way, but for your users, you might want a settings tab or page where they can change this.
localStorage.setItem(lsPrefix+'formality', 'informal');

var Greeting  = function(){
	this.time = date;
	this.returning_greetings = {
		morning:{
			formal:[
				'Welcome back sir.',
				'Welcome back.'
			],
			informal:[
				'Yo!',
				'Warup',
				'Zkhiphani',
				'My Niqqer',
				'Hey',
				'Hi'
			]
		},
		afternoon:{
			formal:[
				'Again a good afternoon to you sir.'
			],
			informal:[
				'Yo!',
				'Warup',
				'Zkhiphani',
				'My Niqqer',
				'Hey',
				'Hi'
			]
		},
		evening:{
			formal:[
				'Good day sir'
			],
			informal:[
				'Warup Warup',
				'What is up!'
			]
		}
	};
	this.ftu_greetings = {
		morning:{
			formal:[
				'Good morning sir.',
				'A refreshing morning to you sir.'
			],
			informal:[
				'Yo! Wakey Wakey',
				'Good Morning '+ ls('short_name'),
				'Zkhiphani bro',
				'My Niqqer',
				'Hey',
				'Hi'
			]
		},
		afternoon:{
			formal:[
				'Again a good afternoon to you sir.'
			],
			informal:[
				'Yo!',
				'Nigger, what is up!',
				'Zkhiphani',
				'Howzt man.'
			]
		},
		evening:{
			formal:[
				'Good evening sir'
			],
			informal:[
				'Yo!',
				'Nigger, what is up!',
				'Zkhiphani',
				'Howzt man.'
			]
		}
	};
	this.doneToday = function(){
		return Date.parse(ls('dt'))-Date.parse(new Date())<0;
	};
	this.type_of_greeting = function(){
		if(this.doneToday()){
			if(date.getHours()<12){
				return "returning_greetings-morning-"+ls('formality');
			}else if(date.getHours()>12 && date.getHours()<18){
				return "returning_greetings-afternoon-"+ls('formality');
			}else{
				return "returning_greetings-evening-"+ls('formality');
			}
		}else{
			if(date.getHours()<12){
				return "ftu_greetings-morning-"+ls('formality');
			}else if(date.getHours()>12 && date.getHours()<18){
				return "ftu_greetings-afternoon-"+ls('formality');
			}else{
				return "ftu_greetings-evening-"+ls('formality');
			}
		}
	};
	this.construct_greeting = function(){
		var g = this.type_of_greeting();
		var parts = g.split('-');
		var selection =this[parts[0]][parts[1]][parts[2]];
		return selection[rand(0,selection.length)];
	};
	this.getGreeting = function(){
		return this.construct_greeting();
	};
	this.setGDT = function(){
		localStorage.setItem(lsPrefix+'dt',date);
		localStorage.setItem(lsPrefix+'gdt',1)
	};

	//PS it failed to pronounce S'bu so I called it Sibu, its closest trust me.
	this.introductions = [
		"Hi! My name, is Sibu. I am an artificial personal assistant, and I can help you get informed and stay motivated throughout your day. So, to personalise your experience, I need to know some things about you. For starters, What is your name?",
	]

};
