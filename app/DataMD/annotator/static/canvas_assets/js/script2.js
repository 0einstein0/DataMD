document.addEventListener("DOMContentLoaded", function () {
  var config = {
    image: document.getElementById("activeImg"),
    locale: "auto",
    widgets: [
      "COMMENT",
      { widget: "TAG", vocabulary: possible_labels },
    ],
  };
  var anno = Annotorious.init(config);
  initAnnon(anno);
  selectAnno(type);
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
      widgets: [
        "COMMENT",
        { widget: "TAG", vocabulary: possible_labels },
      ],
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

  function selectAnno(type) {
    switch (type) {
      case 0:
        //label task
        break;
      case 1:
        anno.setDrawingTool("rect");
        break;
      case 2:
        anno.setDrawingTool("ellipse");
        break;
      case 3:
        anno.setDrawingTool("point");
        break;
      case 4:
        anno.setDrawingTool("polygon");
        break;
      case 5:
        anno.setDrawingTool("freehand");
        break;
    }
  }

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
      //  console.log(selection.target.selector.value);
      //  console.log(selection.target.source);

      // console.log(annotations);

      await anno.updateSelected(selection);
      anno.saveSelected();
    });
    ////////////////////
  }
});
