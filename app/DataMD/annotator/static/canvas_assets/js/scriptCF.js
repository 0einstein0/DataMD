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

  document.getElementById("dark-icon").onclick = function () {
    var element = document.body;
    element.classList.toggle("dark-mode");
  };

  document.getElementById("arrow-next").onclick = function () {
    goNext();
  };

  document.getElementById("arrow-prev").onclick = function () {
    goPrev();
  };

  ////////////

  function selectColor(colorNum, colors) {
    if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
    return "hsl(" + ((colorNum * (360 / colors)) % 360) + ",63%,50%)";
  }
  var labelsNo = possible_labels.length;
  var labelBtn;
  var labelText;
  var btnDiv = document.getElementById("labelBtns");
  var keyArray = ["A", "S", "D", "F", "G"];
  var labelKey;

  for (var i = 0; i < labelsNo; ++i) {
    labelBtn = document.createElement("button");
    labelBtn.style.backgroundColor = selectColor(i, labelsNo);
    labelText = document.createTextNode(possible_labels[i]);
    labelKey = document.createTextNode("Press: " + keyArray[i]);
    linebreak = document.createElement("br");
    labelBtn.appendChild(labelText);
    labelBtn.appendChild(linebreak);
    labelBtn.appendChild(labelKey);
    btnDiv.appendChild(labelBtn);
  }

  ////////////////////
});
