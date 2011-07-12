function descend(start,childlist){
	var curchild = start;
	for(index in childlist) {
		var i = childlist[index];
		curchild = curchild.childNodes[i];
	}
	return curchild;
}

function tryToGetPostText(post){
	try{
		var domchild = post.children()[0];
		var postText = descend(domchild,[1,0,0,0]).innerHTML;
	}catch(err){
		postText = "";
		//console.log("caught err:"+err);
	}
	return postText;
}

function inList(value,alist){
	console.log(value+":"+alist)
	for(var index in alist){
		if(value == alist[index]){
			return true;
		}
	}
	return false;
}

function hideTaggedPost(post,tag,hiddenlist){
	var postText = tryToGetPostText(post);
	if(postText.match(""+tag)){
		console.log("tag:"+tag+"//text:"+postText+
		            post.get(0));
		hiddenlist[post.get(0)]=true;
		post.css("display","none");
	}
}


function hideTaggedPosts(tags){
	var hiddenlist = {};
	var selection = $("div[id*=update]");
	for(var index in tags){
		var tag = tags[index];
		if(tag != ""){
			selection.each(function (){
				var $post = $(this);
				hideTaggedPost($post,tag,hiddenlist);
			});
		}
	}
	selection.each( function(){
		   var $post = $(this);
		   if(hiddenlist[$post.get(0)] == undefined){
			   $post.css("display","block");
		   }
		});
}

function gettags(){
	var match = $('div').
	             filter(function(){return this.id.match(/\:..\.f/)});
	return match.text().split(" ");
}
setInterval(function(){hideTaggedPosts(gettags());},1000);


