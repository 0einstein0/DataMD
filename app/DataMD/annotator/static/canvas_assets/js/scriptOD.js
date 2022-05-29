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

  if (images_available) {
    var anno = Annotorious.init(config);
    selectAnno(type);
    eventAnno(anno);
  }

  ////////////////////

  const NO_ANNOTATION = { label: -1 };
  /*
  if (hasModel) {
    r = prediction[0];
    bbox = r["rois"];
    val = {
      x: bbox[1],
      y: bbox[0],
      w: bbox[3] + bbox[1],
      h: bbox[2] + bbox[0],
    };
    renderAnnotation(val);
    jQuery("#predicting").text("Model Prediction: " + r);
    pressButtonOfLabel(r[0]);
  }

  */
  ///////////////////

  var currentImage = 0;
  var currentAnnotation = NO_ANNOTATION;
  var colorsArray = [
    "tomato",
    "darkcyan",
    "indianred",
    "olivedrab",
    "dodgerblue",
  ];
  var keyArray = ["a", "s", "d", "j", "g"];

  function updateDatabaseLabel() {
    jQuery.ajax({
      type: "GET",
      url: "/ajax/update/labels/object_detection",
      data: {
        image_id: image_ids[currentImage],
        annotation_class_id: currentAnnotation.label_db_id,
        h: currentAnnotation.h,
        w: currentAnnotation.w,
        x: currentAnnotation.x,
        y: currentAnnotation.y,
      },
    });
  }

  function deleteDatabaseLabel() {
    jQuery.ajax({
      type: "GET",
      url: "/ajax/delete/labels/object_detection",
      data: {
        image_id: image_ids[currentImage],
      },
    });
  }

  function getLabelFromColor(color) {
    // the label value stored in this array is fetched from colors array.
    // the colorArray[n] corresponds to possible_label[n]
    return possible_labels[colorsArray.indexOf(color)];
  }

  function getColorFromLabel(label) {
    return colorsArray[possible_labels.indexOf(label)];
  }

  function getAnnotationObject(label, x, y, w, h) {
    return [
      {
        type: "Annotation",
        body: [
          {
            type: "TextualBody",
            purpose: "highlighting",
            value: getColorFromLabel(label),
          },
        ],
        target: {
          selector: {
            type: "FragmentSelector",
            conformsTo: "http://www.w3.org/TR/media-frags/",
            value: `xywh=pixel:${x},${y},${w},${h}`,
          },
        },
        id: label + x + y + w + h,
      },
    ];
  }

  function renderAnnotation(vals) {
    var annotation_object = getAnnotationObject(
      vals.label,
      vals.x,
      vals.y,
      vals.w,
      vals.h
    );
    console.log(vals.x);
    anno.setAnnotations(annotation_object);

    //var btn = document.getElementById("label" + keyArray[possible_labels.indexOf(vals.label)]);
    //btn.click();
  }

  ///////

  function goNext() {
    // if the user pressed something commit that to db, else do nothing
    console.log("currentAnnotation ::");
    console.log(currentAnnotation);
    if (currentAnnotation != NO_ANNOTATION) {
      updateDatabaseLabel();
    }

    // see if any labels to fetch from db for next image
    var nextImage = currentImage + 1;
    if (nextImage >= images.length) {
      nextImage -= 1;
    }
    jQuery.ajax({
      type: "GET",
      url: "/ajax/fetch/labels/object_detection",
      dataType: "json",
      data: {
        image_id: image_ids[nextImage],
      },
      success: function (fetched) {
        console.log(fetched);

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
        currentAnnotation = NO_ANNOTATION;
        document.getElementById("activeImg").src = images[currentImage];

        anno.clearAnnotations(); // clear screen to make way for next

        // if annotations to fetch
        if (fetched.label != "None") {
          renderAnnotation(fetched);
        }
      },
    });

    /*config = {
      image: document.getElementById("activeImg"),
      locale: "auto",
      widgets: [ColorSelectorWidget],
      formatter: ColorFormatter,
    };
    anno = Annotorious.init(config);
    eventAnno(anno);
    selectAnno(type);*/
  }

  document.getElementById("dark-icon").onclick = function () {
    var element = document.body;
    element.classList.toggle("dark-mode");
  };

  function goPrev() {
    // if the user pressed something commit that to db, else do nothing
    console.log("currentAnnotation ::");
    console.log(currentAnnotation);
    if (currentAnnotation != NO_ANNOTATION) {
      updateDatabaseLabel();
    }

    // see if any labels to fetch from db for prev image
    var prevImage = currentImage - 1;
    if (prevImage < 0) {
      prevImage = 0;
    }
    jQuery.ajax({
      type: "GET",
      url: "/ajax/fetch/labels/object_detection",
      dataType: "json",
      data: {
        image_id: image_ids[prevImage],
      },
      success: function (fetched) {
        console.log(fetched);

        // go to next image
        currentImage -= 1;
        if (currentImage < 0) {
          currentImage = 0;
        }
        currentAnnotation = NO_ANNOTATION;
        document.getElementById("activeImg").src = images[currentImage];

        anno.clearAnnotations(); // clear screen to make way for next

        // if annotations to fetch
        if (fetched.label != "None") {
          renderAnnotation(fetched);
        }
      },
    });

    /*config = {
      image: document.getElementById("activeImg"),
      locale: "auto",
      widgets: [ColorSelectorWidget],
      formatter: ColorFormatter,
    };
    anno = Annotorious.init(config);
    eventAnno(anno);
    selectAnno(type);*/
  }
  ////////////
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

  /////////////////////
  function pressButtonOfLabel(label_name) {
    btn = document.getElementById(
      "labelButton" + possible_labels.indexOf(label_name)
    );
    selectLabel(btn);
  }

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
  function getAnnotationValues(selection) {
    var result = {};
    var boundingbox_string = selection.target.selector.value;
    var coordinate_string = boundingbox_string.split(":")[1];
    var coords = coordinate_string.split(",");

    result.label = getLabelFromColor(selection.body[0].value);

    // take from coords
    result.x = coords[0];
    result.y = coords[1];
    result.w = coords[2];
    result.h = coords[3];

    // label db id
    result.label_db_id = label_ids[possible_labels.indexOf(result.label)];
    console.log("result.label_db_id ", result.label_db_id);

    return result;
  }

  /////////

  function eventAnno(anno) {
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
      console.log("startSelection");
      const annotations = anno.getAnnotations();
      if (annotations.length === 1) {
        var ele = document.querySelector("a9s-annotationlayer");
        ele.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      }
    });

    anno.on("createAnnotation", async function (selection) {
      console.log("createAnnotation");

      // set currentAnnotation values and coordinates
      currentAnnotation = getAnnotationValues(selection);
      updateDatabaseLabel();

      console.log(currentAnnotation);

      //await anno.updateSelected(selection);
      //anno.saveSelected();
    });

    anno.on("updateAnnotation", function (annotation, previous) {
      console.log("updateAnnotation");

      // set currentAnnotation values and coordinates
      currentAnnotation = getAnnotationValues(annotation);
      updateDatabaseLabel();

      //await anno.updateSelected(selection);
      //anno.saveSelected();
    });

    anno.on("deleteAnnotation", function (annotation) {
      console.log("deleteAnnotation");

      // delete from csv and db
      deleteDatabaseLabel();

      // unset currentAnnotation value
      currentAnnotation = NO_ANNOTATION;
      console.log(currentAnnotation);

      anno.clearAnnotations();
    });

    anno.on("createSelection", function (selection) {
      console.log("createSelection");
    });

    anno.on("cancelSelection", function (selection) {
      console.log("cancelSelection");
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
