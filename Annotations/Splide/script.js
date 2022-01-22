document.addEventListener("DOMContentLoaded", function () {
  var splide = new Splide("#image-slider", {
    drag: false,
    dragAngleThreshold: 0,
    isNavigation: false,
  }).mount();

  ////////////

  var activeImg =
    document.getElementsByClassName("is-visible")[0].childNodes[3];
  var tool = document.getElementsByClassName("is-visible")[0].childNodes[1];
  console.log(activeImg);
  var config = {
    image: activeImg,
    locale: "auto",
    disableEditor: true,
  };
  var anno = Annotorious.init(config);
  initAnnon(anno, tool);

  ////////////////////////

  splide.on("moved", function () {
    activeImg = document.getElementsByClassName("is-visible")[0].childNodes[3];
    tool = document.getElementsByClassName("is-visible")[0].childNodes[1];
    console.log(activeImg);
    config = {
      image: activeImg,
      locale: "auto",
      disableEditor: true,
    };
    anno = Annotorious.init(config);
    initAnnon(anno, tool);
  });

  splide.on("hidden", function () {
    anno.destroy();
  });
});

function initAnnon(anno, toolbar) {
  /////////////////
  Annotorious.SelectorPack(anno, {
    tools: ["rect", "freehand", "ellipse", "polygon", "point"],
  });
  anno.setDrawingTool("freehand");
  Annotorious.Toolbar(anno, toolbar);

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

    //console.log(annotations);
    await anno.updateSelected(selection);
    anno.saveSelected();
  });
  ////////////////////
}
