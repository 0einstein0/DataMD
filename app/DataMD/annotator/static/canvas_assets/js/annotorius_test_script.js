document.addEventListener("DOMContentLoaded", function () {
  src = document.getElementById("activeImg").src;
  config = {
    image: document.getElementById("activeImg"),
    locale: "auto",
    disableEditor: true,
  };
  flag = 1;
  anno = Annotorious.init(config);
  initAnnon(anno);

  anno.loadAnnotations("annotations.w3c.json").then(function (annotations) {
    anno.selectAnnotation(annotations);
  });
  //anno.addAnnotation(annotationS);
  // add an array of annotations
  //anno.setAnnotations(annotations);

  var images = [
    "./Assets/xray_1.png",
    "./Assets/xray_2.png",
    "./Assets/xray_3.png",
  ];
  var currentImage = 0;

  ////////////
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
    console.log(e.key);
    if (e.key === "ArrowRight") {
      goNext();
    } else if (e.key === "ArrowLeft") {
      goPrev();
    }
  };
  ////////////

  ////////////

  function initAnnon(anno) {
    /////////////////

    ////////////////

    ////////////////

    anno.once("createSelection", async function (selection) {
      console.log(selection);
      var dataJSON = JSON.stringify(selection);
      console.log(dataJSON);
      const fs = require("fs");
      fs.writeFileSync("annotations.w3c.json", dataJSON);

      var bb = selection.target.selector.value;
      var re = bb.split(":")[1];
      var x = re.split(",")[0];
      var y = re.split(",")[1];
      var w = re.split(",")[2];
      var h = re.split(",")[3];

      await anno.updateSelected(selection);
      anno.saveSelected();
    });

    ////////////////////
  }

  ////////////
});
