document.addEventListener("DOMContentLoaded", function () {
  var config = {
    image: document.getElementById("activeImg"),
    locale: "auto",
    disableEditor: true,
  };
  var anno = Annotorious.init(config);
  initAnnon(anno);

  var images = [
    "./Assets/xray_1.png",
    "./Assets/xray_2.png",
    "./Assets/xray_3.png",
  ];
  var currentImage = 0;

  ////////////
  function goNext() {
    anno.destroy();
    currentImage += 1;
    if (currentImage >= images.length) {
      currentImage = 0;
    }

    document.getElementById("activeImg").src = images[currentImage];

    config = {
      image: document.getElementById("activeImg"),
      locale: "auto",
      disableEditor: true,
    };
    anno = Annotorious.init(config);

    initAnnon(anno);
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
  document.getElementById("arrow-next").onclick = function () {
    goNext();
  };

  document.getElementById("arrow-prev").onclick = function () {
    goPrev();
  };
  ////////////
  document.getElementById("ellipse").onclick = function () {
    anno.setDrawingTool("ellipse");
  };
  document.getElementById("freehand").onclick = function () {
    anno.setDrawingTool("freehand");
  };
  document.getElementById("polygon").onclick = function () {
    anno.setDrawingTool("polygon");
  };

  document.getElementById("square").onclick = function () {
    anno.setDrawingTool("rect");
  };
  document.getElementById("point").onclick = function () {
    anno.setDrawingTool("point");
  };

  ////////////

  function initAnnon(anno) {
    /////////////////
    Annotorious.SelectorPack(anno, {
      tools: ["rect", "freehand", "ellipse", "polygon", "point"],
    });

    ////////////////

    anno.setAuthInfo({
      id: "0einstein0",
      displayName: "einstein",
    });

    ////////////////

    anno.on("createSelection", async function (selection) {
      selection.body = [
        {
          type: "TextualBody",
          purpose: "tagging",
          value: "label",
          created: "2020-05-18T09:39:47.582Z",
          creator: {
            id: "http://recogito.example.com/rainer",
            name: "rainer",
          },
        },
      ];

      const annotations = anno.getAnnotations();
      console.log(selection.target.selector.value);
      console.log(selection.target.source);

      console.log(annotations);
      await anno.updateSelected(selection);
      anno.saveSelected();
    });
    ////////////////////
  }
});
