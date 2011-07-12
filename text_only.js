function hidetag(tags){
	//alert("hi!"+tags);
	for(tag in tags){
		if(tags[tag] == "")
		{
		}
		else{
			var selection = $("div[id*=update]");
			console.log(selection)
			console.log(selection.filter(":contains("+tag+")"))
			selection.filter(":contains("+tag+")")
			.css("text-decoration","underline");
		}
	}
}

function gettags(){
	var match = $('div').
	             filter(function(){return this.id.match(/\:..\.f/)});
	return match.text().split(" ");
}
setInterval(function(){hidetag(gettags())},2000);
hidetag(gettags())


