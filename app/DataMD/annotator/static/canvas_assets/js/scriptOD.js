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
    var createButton = function (clr, value, key) {
      var button = document.createElement("button");
      var labelKey = document.createElement("p");
      if (clr == currentColorValue) button.className = "selected";

      button.dataset.tag = clr;
      button.style.backgroundColor = clr;

      labelKey.innerText = "Press: " + key.toUpperCase();

      button.innerText = value + "\n" + labelKey.textContent;
      button.setAttribute("id", "label" + key);
      button.addEventListener("click", addTag);
      return button;
    };

    var container = document.createElement("div");
    var keyArray = ["a", "s", "d", "j", "g"];
    var colorsArray = [
      "tomato",
      "darkcyan",
      "indianred",
      "olivedrab",
      "dodgerblue",
    ];
    container.className = "colorselector-widget";

    for (var i = 0; i < possible_labels.length; i++) {
      var button = createButton(
        colorsArray[i],
        possible_labels[i],
        keyArray[i]
      );
      container.appendChild(button);
    }

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
    widgets: [ColorSelectorWidget],
    formatter: ColorFormatter,
  };

  var anno = Annotorious.init(config);
  selectAnno(type);
  initAnnon(anno);

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
      widgets: [ColorSelectorWidget],
      formatter: ColorFormatter,
    };

    anno = Annotorious.init(config);

    initAnnon(anno);
    selectAnno(type);
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
      widgets: [ColorSelectorWidget],
      formatter: ColorFormatter,
    };
    anno = Annotorious.init(config);

    initAnnon(anno);
    selectAnno(type);
  }
  ////////////
  document.onkeydown = function (e) {
    if (e.key === "ArrowRight") {
      goNext();
    } else if (e.key === "ArrowLeft") {
      goPrev();
    } else if (e.key === "Enter") {
      anno.saveSelected();
    } else {
      var btn = document.getElementById("label" + e.key);
      btn.click();
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
    anno.on("startSelection", function (point) {
      const annotations = anno.getAnnotations();
      if (annotations.length === 1) {
        var ele = document.querySelector("a9s-annotationlayer");
        ele.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      }
    });

    anno.once("createAnnotation", async function (selection) {
      const annotations = anno.getAnnotations();
      await anno.updateSelected(selection);
      anno.saveSelected();
    });

    anno.on("updateAnnotation", function (annotation, previous) {});

    anno.on("deleteAnnotation", function (annotation) {
      anno.clearAnnotations();
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
