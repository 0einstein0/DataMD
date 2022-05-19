document.addEventListener("DOMContentLoaded", function () {
  var ColorSelectorWidget = function (args) {
    // 1. Find a current color setting in the annotation, if any
    var currentColorBody = args.annotation
      ? args.annotation.bodies.find(function (b) {
          return b.purpose == "highlighting";
        })
      : null;

    // 2. Keep the value in a variable
    var currentColorValue = currentColorBody ? currentColorBody.value : null;

    // 3. Triggers callbacks on user action
    var addTag = function (evt) {
      if (currentColorBody) {
        args.onUpdateBody(currentColorBody, {
          type: "TextualBody",
          purpose: "highlighting",
          value: evt.target.dataset.tag,
        });
      } else {
        args.onAppendBody({
          type: "TextualBody",
          purpose: "highlighting",
          value: evt.target.dataset.tag,
        });
      }
    };

    // 4. This part renders the UI elements
    var createButton = function (clr, value) {
      var button = document.createElement("button");

      if (clr == currentColorValue) button.className = "selected";

      button.dataset.tag = clr;
      button.style.backgroundColor = clr;
      button.innerText = value;
      button.addEventListener("click", addTag);
      return button;
    };

    var container = document.createElement("div");
    container.className = "colorselector-widget";

    var button1 = createButton("RED", "Label A");
    var button2 = createButton("BLUE", "Label B");
    var button3 = createButton("GREEN", "Label C");

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);

    return container;
  };

  var ColorFormatter = function (annotation) {
    var highlightBody = annotation.bodies.find(function (b) {
      return b.purpose == "highlighting";
    });

    if (highlightBody) return highlightBody.clr;
  };

  var config = {
    image: document.getElementById("activeImg"),
    locale: "auto",
    widgets: [ColorSelectorWidget, "COMMENT"],
    formatter: ColorFormatter,
  };

  var anno = Annotorious.init(config);
  anno.on("createSelection", function () {
    var annotations = anno.getAnnotations();
    if (annotations.length === 0) {
      initAnnon(anno);
      selectAnno(type);
    } else {
      if (annotations.length !== 0) {
        var ele = document.querySelector("a9s-annotationlayer");
        anno.on("startSelection", function () {
          ele.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        });
      }
    }
  });

  /////
  jQuery("div").on("click", ".a9s-annotationlayer", function () {
    console.log("click");
  });
  ////

  var currentImage = 0;
  //////

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
      widgets: [ColorSelectorWidget, "COMMENT"],
      formatter: ColorFormatter,
    };

    anno = Annotorious.init(config);

    anno.on("createSelection", function () {
      var annotations = anno.getAnnotations();
      if (annotations.length === 0) {
        initAnnon(anno);
        selectAnno(type);
      } else {
        if (annotations.length !== 0) {
          var ele = document.querySelector("a9s-annotationlayer");
          anno.on("startSelection", function () {
            ele.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
          });
        }
      }
    });
  }

  document.getElementById("dark-icon").onclick = function () {
    var element = document.body;
    element.classList.toggle("dark-mode");
  };

  function goPrev() {
    anno.destroy();
    currentImage -= 1;
    if (currentImage < 0) {
      currentImage = images.length - 1;
    }

    document.getElementById("activeImg").src = images[currentImage];
    config = {
      image: document.getElementById("activeImg"),
      locale: "auto",
      widgets: [ColorSelectorWidget, "COMMENT"],
      formatter: ColorFormatter,
    };
    anno = Annotorious.init(config);
    anno.on("createSelection", function () {
      var annotations = anno.getAnnotations();
      if (annotations.length === 0) {
        initAnnon(anno);
        selectAnno(type);
      } else {
        if (annotations.length !== 0) {
          var ele = document.querySelector("a9s-annotationlayer");
          anno.on("startSelection", function () {
            ele.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
          });
        }
      }
    });
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
      id: username,
      displayName: username,
    });

    ////////////////

    //////

    anno.once("createAnnotation", async function (selection) {
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

  //////

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

  ////////////////
});
