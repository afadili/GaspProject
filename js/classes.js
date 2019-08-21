class Project{
	constructor(id,link,name,role){
		this._id = id;
		this._link = link
		this._srcCode = "";
		this._name = name;
		this._role = role;
		this._author = "";
	}

	set setSrcCode(src){
		this._srcCode = src;
	}
	set setName(name){
		this._name = name;
	}

	get src(){return this._srcCode;}
	get name(){return this._name;}
	get link(){return this._link;}
	get role(){return this._role;}
	get id(){return this._id;}
	get author(){return this._author;}


	async saveProject(name, src){
		var payload = {
			src: src,
			name: name
		};
		var data = JSON.stringify(payload);

 		let response = await fetch('https://serene-forest-42732.herokuapp.com/project/create',{
			method: 'POST',
			body: data,
			mode: 'cors',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://serene-forest-42732.herokuapp.com"
			},
			credentials: 'include'
		});

		let result = await response.json();
 		if(result.success){
 			window.location.replace("https://lucaslavallee.github.io/GAsp#"+result.link);
 			menuAccount.style.display = "block";
 		}
 		else{
 		}	 
	}

	async loadProject(link){
		var payload = {
			link: link
		};
		var data = JSON.stringify( payload );

 		let response = await fetch('https://serene-forest-42732.herokuapp.com/project/infos',{
			method: 'POST',
			body: data,
			mode: 'cors',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://serene-forest-42732.herokuapp.com"
			},
			credentials: 'include'
		});

		let result = await response.json();
 		if(result.success){
 			result.projects[0].id_project
	 		this._id = result.projects[0].id;
			this._link = result.projects[0].link;
			this._srcCode = result.projects[0].srcCode;
			this._name = result.projects[0].name;
			this._author = result.projects[0].username;
 		}
 		else{
 		}	
	}

	async updateProject(src){
		var payload = {
			src: src,
			link: this._link
		}
		var data = JSON.stringify(payload);
		let response = await fetch('https://serene-forest-42732.herokuapp.com/project/changeCode',{
			method: 'PUT',
			body: data,
			mode: 'cors',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://serene-forest-42732.herokuapp.com"
			},
			credentials: 'include'
		});

		let result = await response.json();
	    var msg = new Message(result.msg,true,null);
	    msg.display();
	}

	async updateShareInfos(){
		var payload = {
			id: this._id
		}
		var data = JSON.stringify(payload);
		let response = await fetch('https://serene-forest-42732.herokuapp.com/project/coworkers',{
			method: 'POST',
			body: data,
			mode: 'cors',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://serene-forest-42732.herokuapp.com"
			},
			credentials: 'include'
		});

		let coworks = await response.json();
		document.getElementById('linkShare').value = "https://lucaslavallee.github.io/GAsp/#"+this._link;
		var list = document.getElementById('allCoworkers');
		if(coworks.success){
			list.innerHTML = "";
			coworks.projects.forEach(function(element) {
	            var div = document.createElement('div');
	            div.classList.add('coworkers');
	            div.innerHTML = '<p>'+element.username+'</p>';
	            list.appendChild(div);
	        });
	    }
	    else{
	    	list.innerHTML = "(empty)";
	    }
	}

	async addCoworkers(username, idProj){
		var payload = {
			username: username,
			id_project: idProj
		};
		var data = JSON.stringify(payload);

 		let response = await fetch('https://serene-forest-42732.herokuapp.com/project/addCoworkers',{
			method: 'POST',
			body: data,
			mode: 'cors',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://serene-forest-42732.herokuapp.com"
			},
			credentials: 'include'
		});

		let result = await response.json();
 		if(result.success){
 			this.updateShareInfos();
 		}
 		var mess = new Message(result.msg,true,null);
 		mess.display();	 
	}

	async removeCoworkers(username, idProj){
		var payload = {
			username: username,
			id_project: idProj
		};
		var data = JSON.stringify(payload);
		let response = await fetch('https://serene-forest-42732.herokuapp.com/project/rmCoworkers',{
			method: 'POST',
			body: data,
			mode: 'cors',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://serene-forest-42732.herokuapp.com"
			},
			credentials: 'include'
		});
		let result = await response.json();
 		if(result.success){
 			this.updateShareInfos();
 		}
 		var mess = new Message(result.msg,true,null);
 		mess.display();
	}
}



class Message{
	constructor(msg,typeCont,container){
		this._msg = msg;
		this._lvlError = 0;
		this._typeContainer = typeCont;
		this._container = container;
	}
	display(){
		if(this._typeContainer){
			var msgCont = document.getElementById('error');
			msgCont.classList.add("error");
			//Reset css animation
			var newone = msgCont.cloneNode(true);
			msgCont.parentNode.replaceChild(newone, msgCont);
         	newone.innerHTML = this._msg;
		}else{
         this._container.innerHTML = this._msg; 
		}
	}
}
