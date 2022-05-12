document.addEventListener("DOMContentLoaded", function () {
  var currentImage = 0;

  function goNext() {
    document.getElementById("rect").style.display = "none";
    currentImage += 1;
    if (currentImage >= images.length) {
      currentImage = 0;
    }

    elements = document.getElementsByClassName("btnIcon");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = "#d5d5d5";
    }

    document.getElementById("activeImg").src = images[currentImage];
  }

  function goPrev() {
    document.getElementById("rect").style.display = "none";
    currentImage -= 1;
    if (currentImage < 0) {
      currentImage = images.length - 1;
    }
    elements = document.getElementsByClassName("btnIcon");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = "#d5d5d5";
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
    else if (e.key === "x") {
      label1();
    } else if (e.key === "c") {
      label2();
    }

    ///////
  };

  document.getElementById("arrow-next").onclick = function () {
    goNext();
  };

  document.getElementById("arrow-prev").onclick = function () {
    goPrev();
  };

  ////////////

  ////////////////////
});
