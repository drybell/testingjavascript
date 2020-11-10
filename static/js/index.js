// Initialize number of bins

var bins = 10; 
var ul   = document.getElementById('eq');
for (let i=0; i < bins; i++){
	var bin = document.createElement("li");
	ul.appendChild(bin);
}

function changeHeight(id, height){
	column = ul.children[id];
	// if (height > 200) height=200;
	// if (height < 10) height=10;
	column.style.height = height+"px";
}

// function randomNumber(min, max) {
//   number =  Math.floor((Math.random()*(max-min))+ min);
//   return number;
// }


// for (let i=0; i < bins; i++){
// 	changeHeight(i, randomNumber(10,200));
// }

function getFFTUpdate(){ 
	// make fetch or XMLHTTPRequest here 
	

	//make call every 100ms and update eq 
	setTimeout(getFFTUpdate, 100)
}