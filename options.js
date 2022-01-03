var plus_circle = `
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi-plus-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
  </svg>
`;

var add_section = `
    <div class="add_item">
      <div id="add_item_MMM" class="add_item_svg"> ${plus_circle} </div>
      <div>
        <span class="avoidwrap">
          <label for="color_code">Label:</label>
          <input type="text" style="width:6em;" id="label_MMM" name="label"></input>

          <label for="color_desc">URL:</label>
          <input type="text" style="width:20em;" id="url_MMM" name="url"></input>
        </span>

      </div>
    </div>
`;

var entry_counter;
var default_popup_options = {
  "Copy": "clipboard",
  "Search": "https://www.ecosia.org/search?q=%s",
  "Maps": "http://maps.google.com/?q=%s"
};

var default_excl_domains = ["https://docs.google.com"];

var stored_options = {};
var excl_domains = [];

document.addEventListener("DOMContentLoaded", function(){
  //document.getElementById("data_section").insertAdjacentHTML('beforeend', add_section.replace(/MMM/g, "1"));
  restoreOptions();
  });

document.getElementById("main_body").addEventListener("click", function(event){
  event.preventDefault();
  if (event.target.id == "save_all"){
    save_data();
  }
  else if (event.target.id == "reset_data")  {
    reset_data();
  }
  else if (event.target.getAttribute("class") == "bi-plus-circle"){
    add_item(event.target);
  }
});

function add_item(elem){
  entry_counter++;
  document.getElementById("data_section").insertAdjacentHTML('beforeend',
    add_section.replace(/MMM/g, entry_counter.toString()));
  document.getElementById("add_item_MMM".replace(/MMM/g, (entry_counter - 1).toString())).style.visibility = "hidden";
}

function populate_data(){
  entry_counter = 0;
  var data_length = Object.keys(stored_options).length;
  for (const [key, value] of Object.entries(stored_options)) {
    entry_counter++;
    document.getElementById("data_section").insertAdjacentHTML('beforeend',
      add_section.replace(/MMM/g, entry_counter.toString()));
    document.getElementById("label_" + entry_counter.toString()).value = key;
    document.getElementById("url_" + entry_counter.toString()).value = value;
    entry_counter < data_length ? document.getElementById("add_item_MMM".replace(/MMM/g, entry_counter.toString())).style.visibility = "hidden" : null;
  }

  document.getElementById("excluded_domains").value = "";
  excl_domains.forEach((item, i) => {
    document.getElementById("excluded_domains").value += item + "\n";
  });
}

function restoreOptions(){
  let get_data = browser.storage.sync.get("data");
  get_data.then(setCurrentChoice, onError);

  function setCurrentChoice(result) {
    if (result.data === undefined) {
      stored_options = default_popup_options;
      excl_domains = default_excl_domains;
    }
    else {
      stored_options = result.data.data;
      excl_domains = result.data.excl_domains;
    }
    //stored_options = result.data.data || default_popup_options;
    //excl_domains = result.data.excl_domains || default_excl_domains;
    entry_counter = Object.keys(stored_options).length;
    populate_data();
  }

  function onError(error) {
   console.log(`Error: ${error}`);
 }

}

function save_data(){
  var save_object = {};
  save_object.data = {};
  save_object.excl_domains = [];
  for (i=1; i<=entry_counter; i++) {
    if (document.getElementById("url_"+i.toString()).value != "" &&
      document.getElementById("label_"+i.toString()).value != "") {
        save_object.data[document.getElementById("label_"+i.toString()).value] =
          document.getElementById("url_"+i.toString()).value;
      }
  }

  document.getElementById("excluded_domains").value.split("\n").forEach((item, i) => {
    if (item != "") {
      if (item.split("//")[1]==undefined) {
        save_object.excl_domains.push("https://" + item);
      }
      else {
        save_object.excl_domains.push(item);
      }
    }
  });

  browser.storage.sync.set({
    data: save_object
  }).then(function(){
    document.getElementById("msg").innerHTML = "saved!";
    const mytimer2 = setTimeout((function(){
      document.getElementById("msg").innerHTML = "";
    }), 2000);
  });

}

function reset_data(){
  document.getElementById("data_section").innerHTML = "";
  restoreOptions();
}
