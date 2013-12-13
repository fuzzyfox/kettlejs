/*
 * kettle.js version 0.2
 *
 * Copyright 2013, William Duyck, Jessica Draper, Simon Phillips, Matt Mullarky-Toner, Mohamad Hussien, Elena Klaudis
 * Licensed under the Mozilla Pulbic License Version 2.0
 */
(function(window, document, undefined){

	// Kettle.js requires popcorn.js and the make api client
	if(!window.Make){
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
	var Kettle = function(entity, options){
		return new Kettle.prototype.init(entity, options || null);
	};

	// Kettle API version
	Kettle.version = "0.2";

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

	Kettle.prototype.playQueue = [];

	Kettle.extend(Kettle.prototype, {
		latestMake: null,
		search: function(searchTerm, fn){
			var self = this;
			makeAPI.or()
				.tags(searchTerm.split(/\s+/))
				.sortByField('updatedAt', 'asc')
				.then(function(err, makes){
					if(err){
						console.log(err);
						return;
					}

					Kettle.forEach(makes, function(make){
						if(make.updatedAt > self.latestMake &&
							make.contentType == 'application/x-popcorn'){
							self.latestMake = make.updatedAt;
							make.url += '_';
							self.playQueue.push(make);
						}
					});

					if(typeof fn === 'function'){
						fn(self.playQueue);
						return;
					}
				});
		},
		getQueryVariable: function(variable, queryString){
			queryString = queryString || window.location.search;

			var query = queryString.substr(1),
				vars  = query.split('&'),
				pairs;

			for(var i = 0, j = vars.length; i < j; i++){
				pairs = vars[i].split('=');

				if(decodeURIComponent(pairs[0]) === variable){
					return decodeURIComponent(pairs[1]);
				}
			}

			return null;
		}
	});

	// Kettle.extend(Kettle.prototype.playQueue.prototype, {
	// 	cycle: function(){
	// 		var rtn = this.shift();
	// 		this.push(rtn);
	// 		return rtn;
	// 	},
	// 	shuffle: function(){
	// 		for(var j, x, i = this.length; i; j = parseInt(Math.random() * i, 10), x = this[--i], this[i] = this[j], this[j] = x);
	// 	}
	// });

	window.Kettle = Kettle;
})(this, this.document);
