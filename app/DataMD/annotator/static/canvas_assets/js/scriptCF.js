document.addEventListener("DOMContentLoaded", function () {
  var config;
  var anno;
  var label = 0;
  var flag = 0;
  var labels = [];
  var src = "";
  let csv = "";
  csv += "src, x, y, w, h, label,\r\n";
  var l;

  //////////////

  //////////////////////

  var currentImage = 0;

  function goNext() {
    if (flag === 1) {
      anno.destroy();
      flag = 0;
    }

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
    if (flag === 1) {
      anno.destroy();
      flag = 0;
    }

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
    ////////
    else if (e.key === "p") {
      for (let row = 0; row < labels.length; row++) {
        let keysAmount = Object.keys(labels[row]).length;
        let keysCounter = 0;

        for (let key in labels[row]) {
          csv +=
            labels[row][key] + (keysCounter + 1 < keysAmount ? "," : "\r\n");
          keysCounter++;
        }

        keysCounter = 0;
      }
      console.log(csv);
    } else if (e.key === "d") {
      // Loop the array of objects
      console.log(csv);
      // Once we are done looping, download the .csv by creating a link
      var hiddenElement = document.createElement("a");
      hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
      hiddenElement.target = "_blank";

      // Provide the name for the CSV file to be downloaded
      hiddenElement.download = "labels.csv";
      hiddenElement.click();
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

  document.getElementById("lab1").onclick = function () {
    label1(this);
  };

  document.getElementById("lab2").onclick = function () {
    label2(this);
  };

  function label1() {
    label = 1;
    createAnnotation();
    elements = document.getElementsByClassName("btnIcon");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = "#d5d5d5";
    }

    document.getElementById("rect").style.display = "block";
    document.getElementById("lab1").style.backgroundColor = "#999999";
  }

  function label2() {
    if (flag === 1) {
      anno.destroy();
      flag = 0;
    }
    src = document.getElementById("activeImg").src;
    label = 0;

    l = { src: src, x: "", y: "", w: "", h: "", label: label };
    labels.push(l);
    elements = document.getElementsByClassName("btnIcon");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = "#d5d5d5";
    }

    document.getElementById("lab2").style.backgroundColor = "#999999";
  }

  //////
  function createAnnotation() {
    src = document.getElementById("activeImg").src;
    config = {
      image: document.getElementById("activeImg"),
      locale: "auto",
      disableEditor: true,
    };
    flag = 1;
    anno = Annotorious.init(config);
    initAnnon(anno);
  }

  /////////////

  function initAnnon(anno) {
    /////////////////
    Annotorious.SelectorPack(anno, {
      tools: ["rect", "freehand", "ellipse", "polygon", "point"],
    });

    ////////////////

    ////////////////

    anno.once("createSelection", async function (selection) {
      selection.body = [
        {
          type: "TextualBody",
          purpose: "tagging",
          value: "label",
          created: "2020-05-18T09:39:47.582Z",
        },
      ];

      var bb = selection.target.selector.value;
      var re = bb.split(":")[1];
      var x = re.split(",")[0];
      var y = re.split(",")[1];
      var w = re.split(",")[2];
      var h = re.split(",")[3];
      l = { src: src, x: x, y: y, w: w, h: h, label: label };
      labels.push(l);

      await anno.updateSelected(selection);
      anno.saveSelected();
    });

    ////////////////////
  }
});
