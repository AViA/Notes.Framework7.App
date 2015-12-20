var notes = new Framework7({
  material:true
});

var $$ = Dom7;

var mainView = notes.addView('.view-main', {
  domCache: true
});

/*Init localStorage*/
var toDoArr = [];
if (JSON.parse(localStorage.getItem("toDoArray")) !== null) {
  toDoArr = JSON.parse(localStorage.getItem("toDoArray"));
}

/* localStorage*/
function updateStorage () {
  var str = "[";
  for (var i = 0; i < toDoArr.length; i++) {
    str += JSON.stringify(toDoArr[i]) + ", ";
  }
  str += "]";
  /*notes.alert(str);*/
  localStorage.setItem("toDoArray", str);
}

/*! Loading layout func when localStorage is empty*/
function loadEmptyLayout () {
  var data = "<div class=\"content-block\">" +
                "<div class=\"chip\">" +
                  "<div class=\"chip-label\">В данный момент у Вас нет задач.</div>" +
                "</div>" +
              "</div>";
  document.getElementById("notes-home").innerHTML = data;
}
/*! Loading to-dos func when localStorage is not empty*/
function loadLayout () {
  var data = "<div class=\"list-block\">" +
              "<ul>";
  for (var i = 0; i < toDoArr.length; i++) {
    data +=  "<li class=\"item-content\">" +
                  "<label class=\"label-checkbox\">" +
                    "<input type=\"checkbox\" id=\"to-do\" name=\"" + i + "\" value=\"" + toDoArr[i].value + "\"" + toDoArr[i].checked + ">" +
                    "<div class=\"item-media\">" +
                      "<i class=\"icon icon-form-checkbox\"></i>" +
                    "</div>" +
                  "</label>" +
                  "<a href=\"#notes-edit\" class=\"item-link fit-with-label\" id=\"to-do-edit\">" +
                    "<div class=\"item-inner\">" +
                      "<div class=\"item-title\">" + toDoArr[i].value + "</div>" +
                    "</div>" +
                  "</a>" +
              "</li>";
  }
  data +=   "</ul>" +
          "</div>";
  document.getElementById("notes-home").innerHTML = data;
}

/*! Callback for loading to-dos from localStorage when app is loaded*/
notes.onPageInit('notes-home', function (page) {
  if (localStorage.getItem("toDoArray") === "[]") {
    /*notes.alert('localStorage is empty');*/
    loadEmptyLayout();
  } else {
    /*notes.alert('localStorage is NOT empty');*/
    loadLayout();
  }
}).trigger();
/*! Callback for loading to-dos from localStorage when back from other pages*/
notes.onPageReinit('notes-home', function (page) {
  if (localStorage.getItem("toDoArray") === "[]") {
    /*notes.alert('localStorage is empty');*/
    loadEmptyLayout();
  } else {
    /*notes.alert('localStorage is NOT empty');*/
    loadLayout();
  }
});

/*! Handling click event on #note-add save button*/
$$(document).on('click', '#note-add', function () {
  toDoArr[toDoArr.length] = {
    value: document.getElementById("textarea-add").value,
    checked: ""
  };
  /*notes.alert(toDoArr[toDoArr.length-1].value);*/
  document.getElementById("textarea-add").value = "";
  updateStorage();
  mainView.router.load({pageName: 'notes-home'});
});

/*! Handling click event on #to-do to save checked property*/
$$(document).on('click', '#to-do', function () {
  if (this.checked == true) {
    toDoArr[this.name].checked = "checked=\"checked\"";
  } else {
    toDoArr[this.name].checked = "";
  }
  updateStorage();
});

/*! Assign global variable to store which to-do has been clicked*/
var todoid;
$$(document).on('click', '#to-do-edit', function () {
  todoid = this.parentNode.firstChild.firstChild.name;
  document.getElementById("textarea-edit").value = this.parentNode.firstChild.firstChild.value;
});
/*! Handling click event on Save button to save changed value*/
$$(document).on('click', '#note-save', function () {
  toDoArr[todoid] = {
    value: document.getElementById("textarea-edit").value
  };
  updateStorage();
  mainView.router.load({pageName: 'notes-home'});
  document.getElementById("textarea-edit").value = "";
});

/*! Handling click event on Delete button delete to-do from array*/
$$(document).on('click', '#note-delete', function () {
  toDoArr.splice(todoid, 1);
  updateStorage();
  mainView.router.load({pageName: 'notes-home'});
  document.getElementById("textarea-edit").value = "";
});
