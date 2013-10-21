var makeAPI = new Make({
	apiURL: "https://makeapi.webmaker.org"
});

Kettle.extend(Kettle.prototype, {
	search: function(searchTerm, fn){
		var self = this;
		makeAPI.or()
			.tags(searchTerm.split(/\s+/))
			.description(searchTerm)
			.sortByField('updatedAt', 'asc')
			//.contentType("application/x-popcorn")
			.then(function(err, makes){
				if(err){
					// handle error
					console.log();
					return;
				}


				// dumb update (will likely cause duplicates)
				// self.playQueue = self.playQueue.concat(makes);

				// stick the searchTerm into the playQueue for auto updating
				Kettle.forEach(makes, function(make){
					if (make.updatedAt > self.playQueue.prototype.mostRecentTime){
						self.playQueue.prototype.mostRecentTime = make.updatedAt;
						self.playQueue.push(make);
					}
				});

				self.playQueue.prototype.searchTerm = searchTerm;

				// callback
				if(fn){
					fn(self.playQueue);
					return;
				}
			});
	}
});