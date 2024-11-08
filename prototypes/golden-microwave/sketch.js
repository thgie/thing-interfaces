let _activities, font;

function preload() {
  _activities = loadStrings('activities.txt');
  font = loadFont('IBMPlexMono-Regular.ttf');
}

let activities = [];

let text_size = 24,
    label_length = 28;
let sort_attr = 'label', // count
    size_by_count = false,
    limit_label = false,
    mode = 'list';

let layout, w, h;

function setup() {
  
  w = window.innerWidth;
  h = window.innerHeight;
  
  createCanvas(w, h);
  _activities.forEach((el, i) => {
    activities.push({
      'label': el,
      'count': 5 + Math.floor(Math.random() * 15),
      'item': new Text()
    });
  });
  
  textFont(font);
  
  _list();
  
  _cloud();
  document.querySelector("#cloud").style.opacity = 0;
  
}

function draw() {
  switch(mode) {
    case 'list':
      document.querySelector("#cloud").style.opacity = 0;
      _list();
      break;
    case 'cloud':
      clear();
      document.querySelector("#cloud").style.opacity = 1;
      break;
    default: _list()
  }
}

function _list() {
  
  activities.sort(sort_by);

  background(244);
  
  let _x = _base_x = text_size / 4, 
      _y = _base_y = text_size,
      _column = 0, _translate_x = 0, _widest_text = 0;
  
  activities.forEach((el, i) => {
    
    let _label =  el.label;
    
    if(limit_label) {
      _label = _label.length > label_length ? _label.substring(0, label_length) + '...' : _label;
    }
    
    let _text_size = size_by_count ? text_size * (el.count / 10) : text_size;
    textSize(_text_size);
    
    _widest_text = _widest_text < textWidth(_label) ? textWidth(_label) : _widest_text;
    
    if(_y + text_size > window.innerHeight) {
      _column++;
      _translate_x += _widest_text + text_size / 4;
      _widest_text = 0;
    }
    
    _x = _base_x + _translate_x;
    _y = _base_y + i * text_size - _column * window.innerHeight;
    
    textAlign(LEFT, CENTER);
    text(_label, _x, _y)
       
  });
}

function _cloud() {
  
    layout = d3.layout.cloud()
      .size([w, h])
      .words(activities.map(function(d) {
        return {text: d.label, size: d.count * 2};
      }))
      .rotate(function() { return 0; })
      .font("IBM Plex Mono")
      .fontSize(function(d) { return d.size; })
      .on("end", _draw_cloud);

  layout.start();
  
}


function _draw_cloud(words) {
  
  d3.select("body").append("svg")
      .attr("id", "cloud")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "IBM Plex Mono")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}

function keyPressed() {
  if (key === '1') {
    sort_attr = 'label';
  }
  
  if (key === '2') {
    sort_attr = 'count';
  }
  
  if (key === '3') {
    size_by_count = !size_by_count;
  }
  
  if (key === '4') {
    limit_label = !limit_label;
  }
  
  if (key == '5') {
    mode = 'list';
  }
  
  if (key == '6') {
    mode = 'cloud';
  }
}


window.onresize = function() {

  w = window.innerWidth;
  h = window.innerHeight;  
  resizeCanvas(w, h);

}

function sort_by(a, b) {
  if ( a[sort_attr] < b[sort_attr] ){
    return -1;
  }
  if ( a[sort_attr] > b[sort_attr] ){
    return 1;
  }
  return 0;
}