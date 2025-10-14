//@author hcadavid

apimock=(function(){

	var mockdata=[];

	mockdata["johnconnor"] = [
                        {author: "johnconnor", name: "house", points: [{x:150, y:120}, {x:215, y:115}]},
                        {author: "johnconnor", name: "gear", points: [{x:340, y:240}, {x:15, y:215}]},
                        {author: "johnconnor", name: "car", points: [{x:50, y:60}, {x:120, y:80}, {x:200, y:150}, {x:250, y:100}]},
                        {author: "johnconnor", name: "robot", points: [{x:300, y:200}, {x:310, y:220}, {x:320, y:210}, {x:330, y:230}, {x:340, y:225}]}
                    ];

                    mockdata["maryweyland"] = [
                        {author: "maryweyland", name: "house2", points: [{x:140, y:140}, {x:115, y:115}]},
                        {author: "maryweyland", name: "gear2", points: [{x:140, y:140}, {x:115, y:115}]},
                        {author: "maryweyland", name: "bridge", points: [{x:50, y:200}, {x:80, y:220}, {x:120, y:210}, {x:160, y:230}, {x:200, y:220}, {x:240, y:200}]},
                        {author: "maryweyland", name: "tree", points: [{x:100, y:150}, {x:105, y:140}, {x:110, y:135}, {x:115, y:130}, {x:120, y:125}, {x:125, y:120}]}
                    ];



	return {
		getBlueprintsByAuthor:function(authname,callback){
			callback(
				mockdata[authname]
			);
		},

		getBlueprintsByNameAndAuthor:function(authname,bpname,callback){

			callback(
				mockdata[authname].find(function(e){return e.name===bpname})
			);
		}
	}

})();