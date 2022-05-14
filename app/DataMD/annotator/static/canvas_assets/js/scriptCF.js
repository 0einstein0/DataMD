document.addEventListener("DOMContentLoaded", function () {
  var currentImage = 0;

  function goNext() {
    currentImage += 1;
    if (currentImage >= images.length) {
      currentImage = 0;
    }

    document.getElementById("activeImg").src = images[currentImage];
  }

  function goPrev() {
    currentImage -= 1;
    if (currentImage < 0) {
      currentImage = images.length - 1;
    }

    document.getElementById("activeImg").src = images[currentImage];
  }
  ////////////

  document.onkeydown = function (e) {
    //////
    if (e.key === "ArrowRight") {
      goNext();
    } else if (e.key === "ArrowLeft") {
      goPrev();
    }

    ///////

    ///////
  };

  document.getElementById("arrow-next").onclick = function () {
    goNext();
  };

  document.getElementById("arrow-prev").onclick = function () {
    goPrev();
  };

  ////////////
  var labelsNo = possible_labels.length;
  var labelBtn;
  var labelText;
  var btnDiv = document.getElementById("labelBtns");

  switch (labelsNo) {
    case 1:
      labelBtn = document.createElement("button");
      labelBtn.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      labelText = document.createTextNode(possible_labels[0]);
      labelBtn.appendChild(labelText);
      btnDiv.appendChild(labelBtn);
      break;
    case 2:
      labelBtn = document.createElement("button");
      labelBtn.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      labelText = document.createTextNode(possible_labels[0]);
      labelBtn.appendChild(labelText);
      btnDiv.appendChild(labelBtn);
      labelBtn = document.createElement("button");
      labelBtn.style.backgroundColor = "rgba(0, 0, 255, 0.5)";
      labelText = document.createTextNode(possible_labels[1]);
      labelBtn.appendChild(labelText);
      btnDiv.appendChild(labelBtn);
      break;
    case 3:
      labelBtn = document.createElement("button");
      labelBtn.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      labelText = document.createTextNode(possible_labels[0]);
      labelBtn.appendChild(labelText);
      btnDiv.appendChild(labelBtn);
      labelBtn = document.createElement("button");
      labelBtn.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
      labelText = document.createTextNode(possible_labels[1]);
      labelBtn.appendChild(labelText);
      btnDiv.appendChild(labelBtn);
      labelBtn = document.createElement("button");
      labelBtn.style.backgroundColor = "rgba(0, 0, 255, 0.5)";
      labelText = document.createTextNode(possible_labels[2]);
      labelBtn.appendChild(labelText);

      break;
    // code block
    default:
      break;
  }

  ////////////////////
});
