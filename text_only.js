var tagtext="";

/*descend takes a starting DOM node and a list of indices
* and the returns the node at the end of the tree path*/
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
		var magic_path = [1,0,0,0];//This will probably break.
		var postText = descend(domchild,magic_path).innerHTML;
	}catch(err){
		postText = "";
		//console.log("caught err:"+err);//Doesn't work on all?
	}
	return postText;
}

function inList(value,alist){
	//console.log(value+":"+alist)
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
		//console.log("tag:"+tag+"//text:"+postText+
		//           post.get(0));
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
setInterval(
	function(){
		var newtext=gettags();
		if(newtext!=tagtext){
			tagtext=newtext;
			hideTaggedPosts(gettags());
		}
	},250);
