document.addEventListener("DOMContentLoaded", function () {
  var currentImage = 0;
  var currentLabel = -1;

  function goNext() {

    jQuery.ajax({
      type: 'GET',
      url: '/ajax/update/labels/classification',
      data: {
        image_id: image_ids[currentImage],
        annotation_class_id: (currentLabel > -1) ? label_ids[currentLabel] : 'None'
      }
    })

    currentImage += 1;
    if (currentImage >= images.length) {
      currentImage = 0;
    }

    currentLabel = -1; //TODO: fetch the actual label
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

  function setCurrentLabel(i) {
    currentLabel = i;
    console.log("currentLabel = " + currentLabel);
  }

  var labelsNo = possible_labels.length;
  var labelBtn;
  var labelText;
  var btnDiv = document.getElementById("labelBtns");
  var keyArray = ["A", "L", "D", "J", "G"];
  var labelKey;

  for (let i = 0; i < labelsNo; ++i) {
    labelBtn = document.createElement("button");
    labelBtn.setAttribute('id', 'labelButton'+i);
    labelBtn.onclick = function() {
      currentLabel = i;
      console.log("currentLabel = " + currentLabel);
    }
    //labelBtn.setAttribute("onclick","setCurrentLabel(" + i + ");");
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
