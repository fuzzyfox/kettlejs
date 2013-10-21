/*
 * kettle.js version 0.1
 *
 * Copyright 2013, {contributors}
 * Licensed under the Mozilla Pulbic License Version 2.0
 */
(function(window, document, undefined){

	// Kettle.js requires popcorn.js and the make api client
	if(!window.Popcorn || !window.Popcorn.isSupported || !window.Make){
		window.Kettle = {
			isSupported: false
		};

		// prevent lots of un-needed errors being caused
		var methods = ("").split(/\s+/);

		while(methods.length){
			window.Kettle[methods.shift()] = function(){};
		}

		return;
	}

	var forEach = Array.prototype.forEach,
		slice = Array.prototype.slice,
		hasOwn = Object.prototype.hasOwnProperty,
		toString = Object.prototype.toString;

	// Non-Public variable
	// Our make api instance
	var makeAPI = new window.Make({
			apiURL: "https://makeapi.webmaker.org"
		}),
		playQueue = [];

	// Declare constructor
	// Returns an instance object
	Kettle = function(entity, options){
		return new Kettle.prototype.init(entity, options || null);
	};

	// Kettle API version
	Kettle.version = "0.1";

	// Boolean flag allowing client to determine if Kettle can be supported
	Kettle.isSupported = true;

	// Definition of the new prototype for our Kettle constructor
	Kettle.prototype = {
		init: function(entity, options){
			var self = this;
		}
	};

	// Extend constructor to allow chaining methods to instances.
	Kettle.prototype.init.prototype = Kettle.prototype;

	Kettle.forEach = function(obj, fn, context){
		if(!obj || !fn){
			return {};
		}

		context = context || this;

		var key, len;

		// Use native forEach where possible (native code is always quicker)
		if(forEach && obj.forEach === forEach){
			return obj.forEach(fn, context);
		}

		if(toString.call(obj) === "[object NodeList]"){
			for(key = 0, len = obj.length; key < len; key++){
				fn.call(context, obj[key], key, obj);
			}
			return obj;
		}

		for(key in obj){
			if(hasOwn.call(obj, key)){
				fn.call(context, obj[key], key, obj);
			}
		}
		return obj;
	};

	Kettle.extend = function(obj){
		var dest = obj, src = slice.call(arguments, 1);

		Kettle.forEach(src, function(copy){
			for(var prop in copy){
				dest[prop] = copy[prop];
			}
		});

		return obj;
	};

	Kettle.extend(Kettle.prototype, {
		search: function(searchTerm, fn){
			var self = this;
			makeAPI.or()
				.tags(searchTerm.split(/\s+/))
				//.description(searchTerm)
				.sortByField('updatedAt', 'asc')
				.then(function(err, makes){
					if(err){
						console.log(err);
						return;
					}

					Kettle.forEach(makes, function(make){
						if(make.updatedAt > self.playQueue.prototype.mostRecentTime &&
							make.contentType == 'application/x-popcorn'){
							self.playQueue.prototype.mostRecentTime = make.updatedAt;
							self.playQueue.push(make);
						}
					});

					self.playQueue.searchTerm = searchTerm;

					if(typeof fn === 'function'){
						fn(self.playQueue);
						return;
					}
				});
		}
	});

	window.Kettle = Kettle;
})(this, this.document);
