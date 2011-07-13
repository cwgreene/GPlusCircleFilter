/*Filter Circle
* Get the current Circle name
* if it starts with a hash tag
* filter all messages that do not contain that hash tag */
var tagtext="";

/*descend takes a starting DOM node and a list of indices
* and the returns the node at the end of the tree path*/
function descend(start,childlist){
	var curchild = start;
	//console.log(start);
	for(index in childlist) {
		var i = childlist[index];
		curchild = curchild.childNodes[i];
	}
	return curchild;
}

function tryToGetPostText(post){
	try{
		var domchild = post.get(0);
		var magic_path = [0,1,0,0,0];//This will probably break.
		var postText = descend(domchild,magic_path).innerHTML;
	}catch(err){
		postText = "";
//		console.log(post.get(0))
//		console.log("caught err:"+err);//Doesn't work on all?
	}
	//console.log("Text:"+postText);
	return postText;
}

function hideTaggedPost(post,tag,hiddenlist){
	var postText = tryToGetPostText(post);
	try{
	if(postText.match(""+tag)){
		//console.log("tag:"+tag+"//text:"+postText+
			//           post.get(0));
		hidePost(post,hiddenlist);
	}
	}catch(err){
		console.log("hideTaggedPost:");
		console.log(post);
		console.log(err);
	}

}

function hidePost(post,hiddenlist){
	hiddenlist[post.get(0)] = true;
	post.css("display","none");
}

/*takes a boolean function(post,text), and hides those posts*/
function hidePosts(func){
	//Shouldn't hiddenlist get recreated each time this
	//function gets called?
	var hiddenlist = {};
	var selection = $("div[id*=update]");
	selection.each(function (){
			var $post = $(this);
			var text = tryToGetPostText($post);
			if(func($post,text)){
				hidePost($post,hiddenlist);
			}else{
				//For some reason, the next
				//each doesn't work...
				$post.css("display","block");
			}
		});

	/*Explicitly show all non-hidden posts*/
	/*NOTE:...and this doesn't seem to work.*/
	selection.each( function(){
		   var $post = $(this);
		   if(hiddenlist[$post.get(0)] == undefined){
			   $post.css("display","block");
		   }
		});
}

function getCircleHashTag(){
	var contentpane=$("div[id=contentPane]").get(0);
	try{
	var circlename = descend(contentPane,[0,0,0]).innerHTML;
	if(circlename.match("<span class")){
		circlename = descend(contentPane,[0,0,0,0]).innerHTML;
	}
	//console.log(circlename);
	if(circlename[0] == "#"){
		return circlename;
	}
	}catch(err){
		console.log("getCircleHashTag:");
		console.log(contentPane);
		console.log(err);
	}
	return "";
}


function filter_circles(e){
	var circle_hashtag=getCircleHashTag();
	console.log(circle_hashtag);
	var nofollow= "[^a-zA-Z0-9]";
	var hashtag_regex = circle_hashtag+nofollow;
	//console.log(circle_hashtag);
	if(circle_hashtag != ""){
		hidePosts(function(post,text) {
			//console.log(text);
			try{
				//undefined needs to be expanded
				//for larger use cases
				if(text==undefined){
					//If we can't parse it
					//hide it.
					console.log(post);
					return true;
				}
				if(text.match(hashtag_regex)==null){
					return true;
				}
				return false;
			}catch(err){
				console.log("filter_circles:");
				console.log(post);
				console.log(err);
			}
		});
	}else{
		//Show all
		var selection = $("div[id*=update]");
		selection.css("display","block");
	}
}


/*The following needs a lot more work to be general
* For starters, clicking more breaks things. A fast way to
* deal with all posts might be a very good idea.*/
var lastGroup = "";
function checkForChange(force){
	if(force == undefined){
		force = false;
	}
	try{
		var contentpane=$("div[id=contentPane]").get(0);
		var curGroup = descend(contentPane,[0,0,0]).innerHTML;
		if(curGroup != lastGroup || force){
			lastGroup = curGroup;
			filter_circles();
		}
	} catch(err){
		console.log("Error:"+err);
	}
}

console.log($("div[id=contentPane]").get(0));
/*addEventListener("mousedown",
	function(){console.log("hey");
		setTimeout(function(){checkForChange(true)},1000)});*/
setInterval(function(){checkForChange(true)},120)//Hack!Hack!Hack!
