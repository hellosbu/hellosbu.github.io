//you can do way more than me
var User = function(){
	this.name = ls('name');
	this.short_name = ls('short_name');
	this.prefix = lsPrefix+"user-";

	this.set = function(k,v){
		sls(this.prefix+k,v)
	};
	
	this.get = function(k){
		return ls(this.prefix+k);
	}
};
