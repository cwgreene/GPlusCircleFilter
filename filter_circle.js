/*Filter Circle
* Get the current Circle name
* if it starts with a hash tag
* filter all messages that do not contain that hash tag */
var tagtext="";

/*descend takes a starting DOM node and a list of indices
* and the returns the node at the end of the tree path*/
function descend(start,childlist){
	var curchild = start;
	console.log(start);
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
		console.log("caught err:"+err);//Doesn't work on all?
	}
	console.log("Text:"+postText);
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
		hidePost(post,hiddenlist);
	}
}

function hidePost(post,hiddenlist){
	hiddenlist[post.get(0)] = true;
	post.css("display","none");
}

/*takes a boolean function(post,text), and hides those posts*/
function hidePosts(func){
	var hiddenlist = {};
	var selection = $("div[id*=update]");
	selection.each(function (){
			var $post = $(this);
			var text = tryToGetPostText($post);
			if(func($post,text)){
				hidePost($post,hiddenlist);
			}
		});
	/*Explicitly show all non-hidden posts*/
	selection.each( function(){
		   var $post = $(this);
		   if(hiddenlist[$post.get(0)] == undefined){
			   $post.css("display","block");
		   }
		});
}

function getCircleHashTag(){
	var ahref = descend($("div[class='a-la-h-ga a-la-h-Pa']").get(0),
                            [0]);
	var circlename = ahref.innerHTML;
	if(circlename[0] == "#"){
		return circlename;
	}
	return "";
}

var circle_hashtag=getCircleHashTag();
console.log(circle_hashtag);
if(circle_hashtag != ""){
	hidePosts(function(post,text) {
		console.log(text);
		if(text.match(circle_hashtag)==null){return true;}
		return false;
	});
}
