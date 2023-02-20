
// alert("hiiiiii");
let cl = console.log;
const postContainer = document.getElementById("postContainer");	
const postform = document.getElementById("postform");	
const titleControl = document.getElementById("title");		
const contentControl = document.getElementById("content"); 		
const submitBtn = document.getElementById("submitBtn");			
const updateBtn = document.getElementById("updateBtn");		

let baseUrl = "https://jsonplaceholder.typicode.com/posts";			

const createcard = (obj) =>{										
	let div = document.createElement("div");
	div.className = "card mb-4";
	div.setAttribute(`data-id`, obj.id);									
	div.innerHTML = `
							<div class="card-header">
								<h3>
									${obj.title}
								</h3>
							</div>
							<div class="card-body">
								<p>
									${obj.body}
								</p>
							</div>
							<div class="card-footer text-right">
								<button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
								<button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
							</div>	
	
	`
	postContainer.prepend(div)
}
const templating = (arr) =>{			
	let result = "";
	arr.forEach(obj => {
		result += `
					<div class="card mb-4" id="${obj.id}">
						<div class="card-header">
							<h3>
								${obj.title}
							</h3>
						</div>
						<div class="card-body">
							<p>
								${obj.body}
							</p>
						</div>
						<div class="card-footer text-right">
							<button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
							<button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
						</div>
					</div>
		
		`
	});
	postContainer.innerHTML = result;										
}

function makeApiCall(methodName, apiUrl, body){								
	let xhr = new XMLHttpRequest();												
	// xhr.open(methodName)
	xhr.open(methodName, apiUrl);						
	xhr.onload = function(){ 													
		if(xhr.status === 200){
			//cl(xhr.response); 												
			// cl("data got!!!!")
			let data = JSON.parse(xhr.response)				
			if(Array.isArray(data)){								
				// cl(data);
				templating(data)								

			}else{ 																		
				// cl(data)
				// titleControl.value = data.title;											
				// contentControl.value = data.body;										
				// submitBtn.classList.add("d-none");									
				// updateBtn.classList.remove("d-none");									
				if(methodName === "GET"){												
					//cl(data)
					titleControl.value = data.title;									
					contentControl.value = data.body;										
					submitBtn.classList.add("d-none");									
					updateBtn.classList.remove("d-none");									
				}else if(methodName === "PATCH"){											
					//cl(data)

					let getId = localStorage.getItem("updateId")
					//cl(getId)
					let card = document.querySelector(`[id = "${getId}"]`)
					let child = [...card.children];
					//cl(child)
					child[0].innerHTML = body.title;
					child[1].innerHTML = body.body;
					submitBtn.classList.remove("d-none");								
					updateBtn.classList.add("d-none");

				}
			}
		}else if(xhr.status === 201){														
			//cl("data sent !!!!!")															
			//cl(xhr.response)																
			//cl(JSON.parse(xhr.response))
			body.id = JSON.parse(xhr.response).id;											
			//cl(body)
			createcard(body)																
		}
	}
	//xhr.send();																		
	xhr.send(JSON.stringify(body)); 													
}
makeApiCall("GET", baseUrl, null)														 



const onpostsubmit = (eve) =>{														
	eve.preventDefault();																
	let obj = {																			
		title : titleControl.value,														
		body : contentControl.value,													
		userId : Math.ceil(Math.random() * 10)											
	}
	// cl(obj)

	makeApiCall("POST", baseUrl, obj)												
	postform.reset();
	Swal.fire('Post is Submitted Successfully!!!!')
}


const onEdit = (ele) =>{
	//cl(ele)
	//cl(ele.closest(".card").id)
	//cl(ele.closest(".card").dataset.id)  												
	//let getEditid = ele.closest(".card").dataset.id;									
	let getEditid = ele.closest(".card").id;
	localStorage.setItem("updateId", getEditid);										
	let getobjUrl = `${baseUrl}/${getEditid}`											
	makeApiCall("GET", getobjUrl, null)												
	
}

const onpostUpdate = () =>{																
	//cl("update!!")
	let updateID = localStorage.getItem("updateId");									
	//cl(updateID)
	let updateUrl = `${baseUrl}/${updateID}`;											
	//cl(updateUrl);
	let obj = {																			
		title :  titleControl.value,													
		body : contentControl.value,													
	}
	postform.reset();
	makeApiCall("PATCH", updateUrl, obj)			
	Swal.fire({
		position: 'center',
		icon: 'success',
		title: 'Information Updated Successful',
		showConfirmButton: false,
		timer: 2500
	  })
}


const onDelete = (ele) =>{
	let deleteId = ele.closest('.card').id;
	//cl(deleteId);
	let deleteUrl = `${baseUrl}/${deleteId}`;

	makeApiCall("DELETE", deleteUrl, null);
	//cl(ele)
	ele.closest('.card').remove();
	//cl(deleteId);
	Swal.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
			Swal.fire(
				'Deleted!',
				'Your file has been deleted.',
				'success'
			)
			}
		})
}

postform.addEventListener("submit", onpostsubmit);  									
updateBtn.addEventListener("click", onpostUpdate);										



























