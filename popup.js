
var popup_element_content = `
    <div id="popup-content" class="popup-content">
    </div>
`;
//var rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
var selected_text = "";
var mytimer;
var popup_options;
var excl_domains;
var selected_element;
var copied_text;

var popup_element = document.createElement("div");

var default_popup_options = {
  "Copy": "clipboard",
  "Search": "https://search.brave.com/search?q=%s",
  "Maps": "http://maps.google.com/?q=%s"
};

var default_excl_domains = ["https://docs.google.com"];

var popup_name = "popup_popup";

let get_data = browser.storage.sync.get("data");
get_data.then(load_data, onError);

function onError(error) {
 console.log(`Error: ${error}`);
}

function load_data(data){
  if (data.data === undefined) {
    popup_options = default_popup_options;
    excl_domains = default_excl_domains;
  }
  else {
    popup_options = data.data.data;
    excl_domains = data.data.excl_domains;
  }
  //popup_options = data.data.data ?? default_popup_options;
  //excl_domains = data.data.excl_domains ?? default_excl_domains;

}

//document.addEventListener("DOMContentLoaded", function(){
  popup_element.className += " popupZZ";
  popup_element.id = popup_name;
  popup_element.innerHTML = popup_element_content;
  document.body.appendChild(popup_element);

//listen for click for popup options
popup_element.addEventListener("mousedown", function(event){
  event.preventDefault();
  if (event.target.id == "Copy"){
    document.getElementById(popup_name).style.display = "none";
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    //navigator.clipboard.writeText(selected_text);
  }
  else {
    selected_text = selected_text.replace(/\s/g, "%20");
    window.getSelection().removeAllRanges();
    var redirectWindow = window.open(popup_options[event.srcElement.id].replace(/%s/g, selected_text), '_blank');
    redirectWindow.location;
  }
});

document.addEventListener("contextmenu",event=>{
  document.getElementById(popup_name).style.display = "none";

});

//listen for mouseup then match on what is highlighted
document.addEventListener("mouseup",event=>{
  let selection = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString() ;

  //selRange = document.getSelection().getRangeAt(0);
  //console.log(selRange);

  var element = document.getElementById(popup_name);
  //console.log("element: " + element);
  var popup_link = "<a id='YYY'>XXX</a>";
  let url_string = window.location.hostname;

  if (selection == "" || excl_domains.includes("https://" + url_string)) {
    element.style.display = "none";

    //mytimer > 0 ? clearTimeout(mytimer) : null;
  }
  else {
    element.style.setProperty('top', (event.clientY + 12) + "px");
    element.style.setProperty('left', (event.clientX + 10) + "px");

    selected_text = selection;
    //navigator.clipboard.writeText(selected_text);
    document.getElementById("popup-content").innerHTML = "";
    for (const [key, value] of Object.entries(popup_options)) {
      document.getElementById("popup-content").innerHTML += popup_link.replace(/YYY/g, key).replace(/XXX/g, key);
      document.getElementById("popup-content").innerHTML += "<br>";
    }

    mytimer == undefined ? null : clearTimeout(mytimer);
    element.style.display = "block";
    mytimer = setTimeout((function(){
      element.style.display = "none";
    }), 6000);
  }


});
