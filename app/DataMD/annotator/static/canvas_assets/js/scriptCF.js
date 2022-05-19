document.addEventListener("DOMContentLoaded", function () {
  var currentImage = 0;
  var currentLabel = -1;

  function goNext() {
    // if the user pressed something commit that to db, else do nothing
    if (currentLabel > -1) {
      jQuery.ajax({
        type: "GET",
        url: "/ajax/update/labels/classification",
        data: {
          image_id: image_ids[currentImage],
          annotation_class_id: label_ids[currentLabel],
        },
      });
    }

    // see if any labels to fetch from db for next image
    nextImage = currentImage + 1;
    if (nextImage >= images.length) {
      nextImage = 0;
    }
    // TODO: loading animation ?
    jQuery.ajax({
      type: "GET",
      url: "/ajax/fetch/labels/classification",
      dataType: "json",
      data: {
        image_id: image_ids[nextImage],
      },
      success: function (fetched) {
        console.log(fetched);
        // if labels to fetch
        if (fetched.label != "None") {
          // make the button pressed
          console.log("button press");
        } else {
          // make the buttons all unpressed
          document.querySelectorAll(".labelBtn").forEach((button) => {
            button.classList.remove("active");
          });
        }

        // go to next image
        currentImage += 1;
        if (currentImage >= images.length) {
          currentImage = 0;
        }
        currentLabel = -1;
        console.log("after " + currentLabel);
        document.getElementById("activeImg").src = images[currentImage];
      },
    });
  }

  function goPrev() {
    currentImage -= 1;
    if (currentImage < 0) {
      currentImage = images.length - 1;
    }
    document.getElementById("activeImg").src = images[currentImage];
    document.querySelectorAll(".labelBtn").forEach((button) => {
      button.classList.remove("active");
    });
  }

  ////////////

  document.onkeyup = function (e) {
    //////
    if (e.key === "ArrowRight") {
      goNext();
    } else if (e.key === "ArrowLeft") {
      goPrev();
    }
  };

  //////

  ////

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
    return "hsl(" + ((colorNum * (300 / colors)) % 300) + ",63%,50%)";
  }

  function setCurrentLabel(i) {
    currentLabel = i;
    console.log("currentLabel = " + currentLabel);
  }

  var labelsNo = possible_labels.length;
  var labelBtn;
  var labelText;
  var btnDiv = document.getElementById("labelBtns");
  var keyArray = ["a", "s", "d", "j", "g"];
  var labelKey;

  for (let i = 0; i < labelsNo; ++i) {
    labelBtn = document.createElement("button");
    labelBtn.setAttribute("id", "labelButton" + i);
    labelBtn.setAttribute("class", "labelBtn");
    labelBtn.onclick = function () {
      currentLabel = i;
      console.log("currentLabel = " + currentLabel); // DEBUG
      selectLabel(this);
    };
    labelBtn.style.backgroundColor = selectColor(i, labelsNo);
    labelText = document.createTextNode(possible_labels[i]);
    labelKey = document.createTextNode("Press: " + keyArray[i].toUpperCase());
    linebreak = document.createElement("br");
    labelBtn.appendChild(labelText);
    labelBtn.appendChild(linebreak);
    labelBtn.appendChild(labelKey);
    btnDiv.appendChild(labelBtn);
  }

  document.onkeydown = function (e) {
    if (keyArray.includes(e.key)) {
      i = keyArray.indexOf(e.key);
      btn = document.getElementById("labelButton" + i);
      currentLabel = i;
      console.log("currentLabel = " + currentLabel); // DEBUG
      selectLabel(btn);
    }
  };
  ////////////////////
  function selectLabel(btn) {
    document.querySelectorAll(".labelBtn").forEach((button) => {
      button.classList.remove("active");
    });
    btn.classList.add("active");
  }

  ////////

  jQuery(document).ready(function () {
    function checkWidth() {
      var windowSize = jQuery(window).width();
      if (windowSize < 1000) {
        jQuery("#myModal").modal("show");
        console.log("screen width is less than 100px");
      } else {
        jQuery("#myModal").modal("hide");
      }
    }
    // Execute on load
    checkWidth();
    // Bind event listener
    jQuery(window).resize(checkWidth);
  });
});
