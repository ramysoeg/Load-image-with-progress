const labelLoaded = document.getElementById("loadetTxt");

function loadImage(imageUrl, onprogress) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    var notifiedNotComputable = false;

    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'arraybuffer';

    xhr.onprogress = function(ev) {
    	let prs = parseInt((ev.loaded / ev.total) * 100);

      if (ev.lengthComputable) {
      	labelLoaded.innerHTML = prs;
        onprogress(prs);
      } else {
        if (!notifiedNotComputable) {
          notifiedNotComputable = true;
          onprogress(-1);
        }
      }

      labelLoaded.innerHTML = (!isNaN(prs) ? prs : 0).toString().concat("%");
    }

    xhr.onloadend = function() {
      if (!xhr.status.toString().match(/^2/)) {
        reject(xhr);
      } else {
        if (!notifiedNotComputable) {
          onprogress(100);
        }

        var options = {}
        var headers = xhr.getAllResponseHeaders();
        var m = headers.match(/^Content-Type\:\s*(.*?)$/mi);

        if (m && m[1]) {
          options.type = m[1];
        }

        var blob = new Blob([this.response], options);

        resolve(window.URL.createObjectURL(blob));
      }
    }
    
    xhr.onerror = function (a, b, c, d) {
    	console.log("Debugando:");
      console.log(a, b, c, d);
    }
    
    xhr.onloadstart = function (a, b, c, d) {
    	console.log("Debugando:");
      console.log(a, b, c, d);
    } 

    xhr.send();
  });
}

var imgContainer = document.getElementById('imgcont');
var progressBar = document.getElementById('progress');

function LoadCat(imageUrl) {
	progressBar.style.display = "block";
  progressBar.value = -1;
	loadImage(imageUrl, (ratio) => {
    if (ratio == -1) {
      progressBar.removeAttribute('value');
    } else {
      progressBar.value = ratio;
    }
  }).then(imgSrc => {
    progressBar.style.display = "none";
    imgContainer.src = imgSrc;
    labelLoaded.innerHTML = "100%";
  }, xhr => {
    // error
  });
}
