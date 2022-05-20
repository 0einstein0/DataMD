document.addEventListener("DOMContentLoaded", function () {
  var currentImage = 0;
  var currentLabel = -1;

  ///////////
  function updateDatabaseLabel() {
    jQuery.ajax({
      type: "GET",
      url: "/ajax/update/labels/classification",
      data: {
        image_id: image_ids[currentImage],
        annotation_class_id: label_ids[currentLabel],
      },
    });
  }

  function pressButtonOfLabel(label_name) {
    btn = document.getElementById(
      "labelButton" + possible_labels.indexOf(label_name)
    );
    selectLabel(btn);
  }

  function unpressAllButtons() {
    document.querySelectorAll(".labelBtn").forEach((button) => {
      button.classList.remove("active");
    });
  }
  ////////////////

  function goNext() {
    console.log("did it press? " + currentLabel);
    // if the user pressed something commit that to db, else do nothing
    if (currentLabel > -1) {
      updateDatabaseLabel();
    }

    // see if any labels to fetch from db for next image
    var nextImage = currentImage + 1;
    if (nextImage >= images.length) {
      nextImage -= 1;
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
          pressButtonOfLabel(fetched.label);
        } else {
          unpressAllButtons();
        }

        // go to next image
        currentImage += 1;
        if (currentImage >= images.length) {
          ////Notification
          $("#alertBox").fadeIn("fast");
          setTimeout(function () {
            $("#alertBox").fadeOut("fast");
          }, 2000);

          currentImage -= 1;
        }
        currentLabel = -1;
        document.getElementById("activeImg").src = images[currentImage];
      },
    });
  }

  function goPrev() {
    // if the user pressed something commit that to db, else do nothing
    if (currentLabel > -1) {
      updateDatabaseLabel();
    }

    // see if any labels to fetch from db for previous image
    var prevImage = currentImage - 1;
    if (prevImage < 0) {
      prevImage = 0;
    }
    // TODO: loading animation ?
    jQuery.ajax({
      type: "GET",
      url: "/ajax/fetch/labels/classification",
      dataType: "json",
      data: {
        image_id: image_ids[prevImage],
      },
      success: function (fetched) {
        console.log(fetched);
        // if labels to fetch
        if (fetched.label != "None") {
          pressButtonOfLabel(fetched.label);
        } else {
          unpressAllButtons();
        }

        // go to prev image
        currentImage -= 1;
        if (currentImage < 0) {
          currentImage = 0;
        }
        currentLabel = -1;
        document.getElementById("activeImg").src = images[currentImage];
      },
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

  var labelsNo = possible_labels.length;
  var labelBtn;
  var labelText;
  var btnDiv = document.getElementById("labelBtns");
  var keyArray = ["a", "s", "d", "j", "g"];
  var colorsArray = [
    "tomato",
    "darkcyan",
    "indianred",
    "olivedrab",
    "dodgerblue",
  ];
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
    labelBtn.style.backgroundColor = colorsArray[i];
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
    console.log("butoon clikced!!!");
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
