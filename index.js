// Transforms a CSV file to a plain text file
// Don't call this unless you want to process a csv file
function processCSVFile() {
    colors = [];
    csv_file = "data/onlyrgb.csv";
    d3.csv(csv_file, function(d) {
        csv = d;
        numIDs = Object.keys(d).length - 1;
        var num_entries = Object.keys(d[0]).length;
        for (var i = 0; i < (numIDs - 1) / 2; i++) {
            colors[i] = [];
            keys = Object.keys(d[0]);
            for (var j = 0; j < num_entries; j++) {
                //var letter = String.fromCharCode(Math.floor(j / 3) + "A".charCodeAt(0));c
                var letter = Math.floor(j / 3);
                if (colors[i][letter] == null)
                    colors[i][letter] = {};
                if (j % 3 == 0) { // R
                    colors[i][letter]["R"] = parseFloat(csv[i * 2][keys[j]]);
                } else if (j % 3 == 1) { // G
                    colors[i][letter]["G"] = parseFloat(csv[i * 2][keys[j]]);
                } else { // B
                    colors[i][letter]["B"] = parseFloat(csv[i * 2][keys[j]]);
                    var hsv = rgb2hsv(colors[i][letter].R, colors[i][letter].G, colors[i][letter].B);
                    colors[i][letter]["H"] = hsv.h;
                    colors[i][letter]["S"] = hsv.s;
                    colors[i][letter]["V"] = hsv.v;
                }
            }

        }

        colors_string = JSON.stringify(colors)
        blob = new Blob([colors_string], {
                type: 'text/plain'
            }),
            anchor = document.createElement('a');

        anchor.download = "output.txt";
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        anchor.click();

    });
}

//https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
function rgb2hsv(r, g, b) {
    var rr, gg, bb,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c) {
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        } else if (g === v) {
            h = (1 / 3) + rr - bb;
        } else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

// takes a color in HSV format and returns a string of the color classification
function classifyColor(hsv) {
    if (hsv.V < 20) return "black";
    if (hsv.V > 90 && hsv.S < 10) return "white";

    if (hsv.S < 25) return "gray";

    if (hsv.H < 30) return "red";
    if (hsv.H < 60) return "orange";
    if (hsv.H < 90) return "yellow";
    if (hsv.H < 150) return "green";
    if (hsv.H < 210) return "cyan";
    if (hsv.H < 270) return "blue";
    if (hsv.H < 320) return "purple";
    if (hsv.H < 335) return "pink";
    return "red"
}


// var orderedColorbyLetter = {"A":[], "B":[], "C":[], "D":[], "E":[], "F":[], "G":[],
//     "H":[], "I":[], "J":[], "K":[], "L":[], "M":[], "N":[], "O":[], "P":[], "Q":[],
//     "R":[], "S":[], "T":[], "U":[], "V":[], "W":[], "X":[], "Y":[], "Z":[]};
function orderColor() {
    for (var i = 0; i < letters.length; i++) {
        var colorCountList = [];
        /*
        for (var j = 0; j < colors.length; j++) {
            colorCountList.push([colors[j], letterColorCounts[letters[i]][colors[j]].toString()]);
        }
        */
        for (var color in colors) {
            colorCountList.push([color, letterColorCounts[letters[i]][color]]);
        }
        colorCountList = orderColorArr(colorCountList);
        orderedColorbyLetter[letters[i]] = colorCountList;
    }
}

function orderColorArr(colorCountArr) {
    colorCountArr.sort(function(a, b) {
        return (+a[1]) - (+b[1])
    });
    return colorCountArr;
}

function updateToyImages() {
    if (toyImages.magnets == "off" && toyImages.bluesClues == "off" && toyImages.chickaBoom == "off" && toyImages.crayons == "off") {
        magnetsImage.style("opacity", "1");
        chickaBoomImage.style("opacity", "1");
        bluesCluesImage.style("opacity", "1");
        crayonsImage.style("opacity", "1");
        return;
    }
    if (toyImages.magnets == "on" || toyImages.magnets == "persist")
        magnetsImage.style("opacity", "1");
    else
        magnetsImage.style("opacity", ".2");

    if (toyImages.bluesClues == "on" || toyImages.bluesClues == "persist")
        bluesCluesImage.style("opacity", "1");
    else
        bluesCluesImage.style("opacity", ".2");

    if (toyImages.chickaBoom == "on" || toyImages.chickaBoom == "persist")
        chickaBoomImage.style("opacity", "1");
    else
        chickaBoomImage.style("opacity", ".2");
    if (toyImages.crayons == "on" || toyImages.crayons == "persist")
        crayonsImage.style("opacity", "1");
    else
        crayonsImage.style("opacity", ".2");
}


function restoreAllRects() {
    rects.style("opacity", "1")
        .style("stroke", "none")
        .style("stroke-width", "none");
}

function fadeAllRects() {
    rects.style("opacity", ".2")
        .style("stroke", "none")
        .style("stroke-width", "none");
}

function updateRects() {
    if (rectsOn.length == 0) {
        restoreAllRects();
        return;
    }
    fadeAllRects();
    rectsOn.forEach(function(className) {
        rectMap[className].rect.style("opacity", "1")
            .style("stroke", "black")
            .style("stroke-width", 1);
    });
}

function onBtnClick() {
    $('html, body').animate({
        scrollTop: $('#sortedDiv').offset().top
    }, 250, 'linear');
}


//http://bl.ocks.org/srosenthal/2770072
//https://stackoverflow.com/questions/46629188/multidimensional-array-for-d3
//https://zenodo.org/record/14285?fbclid=IwAR2tjoxmDO2rVjoiOopMJYaE6rd4THfhrWyGuYS_vfvOq6a5LxvcT3QFVGE
//https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0118996&


data = colorData;
numIDs = data.length;
numLetters = 26;
rectsOn = [];
rectMap = {};
enableIDMouseOver = false;

var toys = d3.select("#toys"),
    toyWidth = +toys.attr("width"),
    toyHeight = +toys.attr("height");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


var svg = d3.select("#unsorted"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
var graphWidth = +svg.attr("width");
var graphHeight = +svg.attr("height") - 45;

var rectWidth = (graphWidth - 25) / numLetters;
var rectHeight = graphHeight / numIDs;
var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
    "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];
var colors = {
    "white": "#FFF5F0",
    "black": "#252525",
    "gray": "gray",
    "red": "#BD0026",
    "orange": "#fc5e03",
    "yellow": "#FEC44F",
    "green": "#006837",
    "cyan": "#4EB3D3",
    "blue": "#253494",
    "purple": "#3F007D",
    "pink": "#f071c4"
};

var slider = document.getElementById("myRange");
var sliderVal = document.getElementById("sliderVal");
var currID = 0;
sliderVal.innerHTML = "Synesthete ID: " + slider.value; // Display the default slider value


// draw the sorted rectangles onto svg
var persistRects = false;
var xOffset = yOffset = 0;
for (var letter in orderedColorbyLetter) {
    orderedColorbyLetter[letter].forEach(function(colorCount) {
        var color = colorCount[0];
        var count = colorCount[1];
        var key = `${color} ${letter}`;
        rectMap[key] = {};
        rectMap[key]["ids"] = [];
        rectMap[key]["rect"] = svg.append("rect")
            .attr("width", rectWidth)
            .attr("height", rectHeight * count)
            .attr("x", xOffset)
            .attr("y", yOffset)
            .attr("fill", colors[color])
            .attr("class", `${color} ${letter}`)
            .on("mouseover", function() {
                var color = this.classList[0];
                var letter = this.classList[1];
                var xPos = d3.event.pageX;
                var yPos = d3.event.pageY;
                var percent = ((letterColorCounts[letter][color] / numIDs) * 100).toFixed(2) + '%';
                //var tooltipText = percent + " of " + letter + " is " + color;
                var tooltipText = percent + " of  synesthetes see " + letter + " as " + color;
                tooltip.style("opacity", .9);
                tooltip.html(tooltipText)
                    .style("left", (xPos + 10) + "px")
                    .style("top", (yPos - 25) + "px");
            })
            .on("mousemove", function() {
                tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                if (enableIDMouseOver) {
                    if(!persistRects){
                        var yRelative = +d3.mouse(svg.node())[1];
                        var ids = rectMap[this.getAttribute("class")].ids;
                        var yBase = +this.getAttribute("y");
                        var currHeight = +this.getAttribute("height");
                        var numIDsToShow = Math.ceil(currHeight / (height / 30));
                        var percentage = (yRelative - yBase) / currHeight;
                        var min = 8;
                        var max = 15;
                        var roundTo = max - (numIDsToShow - min);
                        var id = Math.round(percentage*100 / roundTo) * roundTo / 100;
                        var id = ids[Math.min(Math.floor(id * ids.length), ids.length - 1)];
                        currID = id;
                        var base = "A".charCodeAt(0);
                        rectsOn = [];
                        for(var i = 0; i < letters.length; i++){
                            if(data[id] == null)// not sure why this happens, but it does
                                break;
                            var letter = String.fromCharCode(base + i);
                            var color = classifyColor(data[id][i]);
                            rectsOn.push(`${color} ${letter}`);
                        }
                        updateRects();
                    }
                }
            })
            .on("mouseout", function(d) {
                    if(!persistRects && curr_view != "env"){
                        rectsOn = [];
                        updateRects();

                    }
                    tooltip.style("opacity", 0);

            });
        yOffset += rectHeight * count;
    })
    yOffset = 0;
    xOffset += rectWidth + 1;
}

for (var i = 0; i < numIDs; i++) {
    for (var j = 0; j < letters.length; j++) {
        var base = "A".charCodeAt(0);
        var letter = String.fromCharCode(base + j);
        var hsv = data[i][j];
        var color = classifyColor(hsv);
        rectMap[`${color} ${letter}`].ids.push(i);
    }
}


var prevClicked = null;
rects = svg.selectAll("rect")
    .on("click", function() {
        if (curr_view == "color") {
            var clickedColor = this.classList[0];
            var loadOriginal = clickedColor == prevClicked;

            prevClicked = loadOriginal ? null : clickedColor;
            var clicked_count = 0;
            var xOffset = yOffset = 0;
            for (var letter in orderedColorbyLetter) {
                orderedColorbyLetter[letter].forEach(function(colorCount) {
                    var color = colorCount[0];
                    var count = colorCount[1];
                    if (clickedColor != color || loadOriginal) {
                        d3.select("." + color + "." + letter)
                            .transition()
                            .duration(700)
                            .ease(d3.easeExpInOut)
                            .attr("y", yOffset)
                        yOffset += rectHeight * count;
                    }
                })
                if (!loadOriginal) {
                    d3.select("." + clickedColor + "." + letter)
                        .transition()
                        .duration(700)
                        .ease(d3.easeExpInOut)
                        .attr("y", yOffset)
                }
                yOffset = 0;
            }
        } else if(enableIDMouseOver){
            if (persistRects) {
                rectsOn = []
                updateRects();
                for (letter in toyRects) {
                    toyRects[letter].attr("fill", "white");
                }
            }
            persistRects = !persistRects;
            slider.value = currID;
            sliderVal.innerHTML = "Synesthete ID: " + currID;
            for (var i = 0; i < letters.length; i++){
                var id = slider.value;
                if(data[id] == null)// not sure why this happens, but it does
                    break;
                var letter = letters[i];
                var color = classifyColor(data[id][i]);
                toyRects[letter].attr("fill", colors[color]);
            }
        }
    });

svg.selectAll("text")
    .data(letters)
    .enter()
    .append("text")
    .attr("class", "graphLabel")
    .attr("transform", function(d, i) {
        if (letters[i] == 'W' || letters[i] == 'M') {
            return `translate(${ i*rectWidth + i + rectWidth / 2 - 6},${numIDs * rectHeight + 20})`
        }
        return `translate(${ i*rectWidth + i + rectWidth / 2 - 3},${numIDs * rectHeight + 20})`
    })
    .style("font-family", "impact")
    .style("font-size", "16px")
    .style("opacity", "1")
    .style("fill", function(d, i) {
        var letter = letters[i];
        var color = orderedColorbyLetter[letter][10][0];
        if (color == "white") {
            this.setAttribute("stroke", "black");
            this.setAttribute("stroke-width", "0.2px");
        }
        return colors[color];
    })
    .text(function(d, i, j) {
        return d;
    });


function resetViz() {
    var xOffset = yOffset = 0;
    for (var letter in orderedColorbyLetter) {
        orderedColorbyLetter[letter].forEach(function(colorCount) {
            var color = colorCount[0];
            var count = colorCount[1];
            d3.select("." + color + "." + letter)
                .transition()
                .duration(700)
                .ease(d3.easeExpInOut)
                .attr("y", yOffset)
                .style("opacity", "1")
                .style("stroke", "none")
                .style("stroke-width", "none");
            yOffset += rectHeight * count;
        })
        yOffset = 0;
    }
    for (letter in toyRects) {
        toyRects[letter].attr("fill", "white");
    }

    toyDescription.text("Pick an item!");
    toyImages.magnets = "off";
    toyImages.bluesClues = "off";
    toyImages.chickaBoom = "off";
    toyImages.crayons = "off";
    updateToyImages();
    persistRects = false;
    prevClicked = null;

}


var curr_view = 'color';
slider.style.opacity = "0";
sliderVal.style.opacity = "0";
$("#myRange").attr("disabled", "disabled");

function toggleView(view) {
    if (view != curr_view) {
        resetViz();

        var btns = document.getElementsByClassName("toggleBtn");
        for (var i = 0; i < btns.length; i++) {
            btns[i].style.color = "black";
            btns[i].style.opacity = "0.5";
        }
        var btn = document.getElementById(view);
        btn.style.color = "white";
        btn.style.opacity = "1.0";

        var desc = document.getElementById("btnHelp");
        if (view == "color") {
            desc.innerText = "Explore by color frequency!";
            $("#myRange").attr("disabled", "disabled");

        } else if (view == "indiv") {
            desc.innerText = "Explore by individuals' grapheme-color associations!";
            $("#myRange").removeAttr("disabled");
        } else if (view == "env") {
            desc.innerText = "Explore by environmental factors!";
            $("#myRange").attr("disabled", "disabled");
        }

        if (view == "indiv") {
            slider.style.opacity = "1.0";
            sliderVal.style.opacity = "1.0";
        } else {
            slider.style.opacity = "0";
            sliderVal.style.opacity = "0";
        }

        enableIDMouseOver = (view == 'indiv');
        var svg_container = document.getElementById("unsorted");

        $('#toys').addClass('shrink');
        // slider.style.display = "none";
        // sliderVal.style.display = "none";

        if (view == 'env') {
            $('#toys').removeClass('shrink')
        } else if (view == 'indiv') {
            slider.style.display = "block";
            sliderVal.style.display = "block";
        }
        curr_view = view;
    }
}

var toyRects = {};
for (var i = 0; i < letters.length; i++) {
    var letter = letters[i];
    toyRects[letter] =
        svg.append("rect")
        .attr("width", rectWidth)
        .attr("height", rectWidth)
        .attr("y", numIDs * rectHeight + 30)
        .attr("x", i * rectWidth + i)
        .attr("fill", "white")
        .style("cursor", "default")
        .style("opacity", "1");
}

var toyDescription = toys.append("text")
    .attr("x", "250")
    .attr("y", "25")
    .attr("text-anchor", "middle")
    .style("font-family", "Roboto", "serif")
    .style("font-size", "16px")
    .text("Pick an item!");

var magnetsImage = toys.append("image")
    // .attr('xlink:href', 'magnets.jpeg')
    .attr('xlink:href', 'fisher-price.JPG')
    .attr("x", "100")
    .attr("y", "65")
    .attr("width", "120")
    .attr("height", "120")
    .attr("align", "center")
    .on("click", function(d) {
        if (toyImages.magnets == "persist") {
            rects.style("opacity", "1")
                .style("stroke", "none")
                .style("stroke-width", "none");
            toyImages.magnets = "off";
            for (letter in toyRects) {
                toyRects[letter].attr("fill", "white");
            }
            updateToyImages();
        } else {
            rects.style("opacity", ".2").style("stroke", "none").style("stroke-width", "none");
            for (var letter in magnets) {
                var color = magnets[letter];
                svg.selectAll(`.${letter}`).filter(`.${color}`)
                .style("opacity", "1")
                .style("stroke", "black")
                .style("stroke", "1");
                toyRects[letter].attr("fill", colors[color]);
            }
            toyImages.bluesClues = "off";
            toyImages.chickaBoom = "off";
            toyImages.magnets = "persist";
            toyImages.crayons = "off";
            updateToyImages();
        }
    })
    .on("mouseout", function(d) {
        if (toyImages.magnets != "persist")
            toyImages.magnets = "off";
        updateToyImages();
    })
    .on("mouseover", function(d) {
        if (toyImages.magnets != "persist")
            toyImages.magnets = "on";
        updateToyImages();
        toyDescription.text("Fisher-Price Magnet Set");
    });


var chickaBoomImage = toys.append("image")
    .attr('xlink:href', 'ccbb.jpg')
    .attr("x", "280")
    .attr("y", "65")
    .attr("width", "120")
    .attr("height", "120")
    .attr("align", "center")
    .on("click", function(d) {
        if (toyImages.chickaBoom == "persist") {
            rects.style("opacity", "1")
                .style("stroke", "none")
                .style("stroke-width", "none");
            toyImages.chickaBoom = "off";
            for (letter in toyRects) {
                toyRects[letter].attr("fill", "white");
            }
            updateToyImages();
        } else {
            rects.style("opacity", ".2").style("stroke", "none").style("stroke-width", "none");
            for (var letter in chickaBoom) {
                var color = chickaBoom[letter];
                svg.selectAll(`.${letter}`).filter(`.${color}`)
                .style("opacity", "1")
                .style("stroke", "black")
                .style("stroke", "1");
                toyRects[letter].attr("fill", colors[color]);
            }
            toyImages.bluesClues = "off";
            toyImages.chickaBoom = "persist";
            toyImages.magnets = "off";
            toyImages.crayons = "off";
            updateToyImages();
        }
    })
    .on("mouseout", function(d) {
        if (toyImages.chickaBoom != "persist")
            toyImages.chickaBoom = "off";
        updateToyImages();
    })
    .on("mouseover", function(d) {
        if (toyImages.chickaBoom != "persist")
            toyImages.chickaBoom = "on";
        updateToyImages();
        toyDescription.text("\"Chicka Chicka Boom Boom\" illust. by Lois Ehlert");
    });

var bluesCluesImage = toys.append("image")
    .attr('xlink:href', 'blueclue.jpg')
    .attr("x", "100")
    .attr("y", "220")
    .attr("width", "120")
    .attr("height", "120")
    .attr("align", "center")
    .on("click", function(d) {
        if (toyImages.bluesClues == "persist") {
            rects.style("opacity", "1")
                .style("stroke", "none")
                .style("stroke-width", "none");
            toyImages.bluesClues = "off";
            for (letter in toyRects) {
                toyRects[letter].attr("fill", "white");
            }
            updateToyImages();
        } else {
            rects.style("opacity", ".2").style("stroke", "none").style("stroke-width", "none");
            for (var letter in bluesClues) {
                var color = bluesClues[letter];
                svg.selectAll(`.${letter}`).filter(`.${color}`)
                .style("opacity", "1")
                .style("stroke", "black")
                .style("stroke", "1");
                toyRects[letter].attr("fill", colors[color]);
            }
            toyImages.bluesClues = "persist";
            toyImages.chickaBoom = "off";
            toyImages.magnets = "off";
            toyImages.crayons = "off";
            updateToyImages();
        }
    })
    .on("mouseout", function(d) {
        if (toyImages.bluesClues != "persist")
            toyImages.bluesClues = "off";
        updateToyImages();
    })
    .on("mouseover", function(d) {
        if (toyImages.bluesClues != "persist")
            toyImages.bluesClues = "on";
        updateToyImages();
        toyDescription.text("\"Alphabet Train\" on Blue's Clues");
    });

var crayonsImage = toys.append("image")
    // .attr('xlink:href', 'crayons.jpeg')
    .attr('xlink:href', 'crayola.jpg')
    .attr("x", "280")
    .attr("y", "220")
    .attr("width", "120")
    .attr("height", "120")
    .on("click", function(d) {
        if (toyImages.crayons == "persist") {
            rects.style("opacity", "1")
                .style("stroke", "none")
                .style("stroke-width", "none");
            toyImages.crayons = "off";
            for (letter in toyRects) {
                toyRects[letter].attr("fill", "white");
            }
            updateToyImages();
        } else {
            for (letter in toyRects) {
                toyRects[letter].attr("fill", "white");
            }
            rects.style("opacity", ".2").style("stroke", "none").style("stroke-width", "none");
            for (var letter in crayons) {
                if(letter == "B" || letter == "P"){
                    var color = crayons[letter];
                    toyRects[letter].attr("fill", colors[color[0]]);
                    rectMap[`${color[0]} ${letter}`].rect.style("opacity","1").style("stroke", "black").style("stroke-width", "1");
                    rectMap[`${color[1]} ${letter}`].rect.style("opacity","1").style("stroke", "black").style("stroke-width", "1");
                }else{
                    var color = crayons[letter];
                    toyRects[letter].attr("fill", colors[color]);
                    rectMap[`${color} ${letter}`].rect.style("opacity","1").style("stroke", "black").style("stroke-width", "1");
                }
            }
            toyImages.bluesClues = "off";
            toyImages.chickaBoom = "off";
            toyImages.magnets = "off";
            toyImages.crayons = "persist";
            updateToyImages();
        }
    })
    .on("mouseout", function(d) {
        if (toyImages.crayons != "persist")
            toyImages.crayons = "off";
        updateToyImages();
    })
    .on("mouseover", function(d) {
        if (toyImages.crayons != "persist")
            toyImages.crayons = "on";
        updateToyImages();
        toyDescription.text("Crayola Crayons (B for Blue!)");
    });


var toyImages = {
    "magnets": "off",
    "chickaBoom": "off",
    "bluesClues": "off",
    "crayons":"off"
};



// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    sliderVal.innerHTML = "Synesthete ID: " + this.value;
    if (curr_view == 'indiv') {
        var id = this.value;
        var base = "A".charCodeAt(0);
        rectsOn = [];
        for (var i = 0; i < letters.length; i++){
            if(data[id] == null)// not sure why this happens, but it does
                break;
            var letter = String.fromCharCode(base + i);
            var color = classifyColor(data[id][i]);
            rectsOn.push(`${color} ${letter}`);
        }
        updateRects();
        persistRects = true;
    }
}

slider.onmouseup = function() {
    for (var i = 0; i < letters.length; i++){
        var id = this.value;
        if(data[id] == null)// not sure why this happens, but it does
            break;
        var letter = letters[i];
        var color = classifyColor(data[id][i]);
        toyRects[letter].attr("fill", colors[color]);
    }
}

var lastElementClicked;
$(document).click(function(event) {
   lastElementClicked = event.target;
});

document.onkeydown = function(e) {
    var id;
    // up or right
    if (curr_view == 'indiv' && lastElementClicked == slider) {
        if (e.keyCode == '38' || e.keyCode == '39') {
            id = +slider.value + 1;
        }
        // left or down
        else if (e.keyCode == '40' || e.keyCode == '37') {
            id = +slider.value - 1;

        }
        else { return; }
        for (var i = 0; i < letters.length; i++){
            if(data[id] == null)// not sure why this happens, but it does
                break;
            var letter = letters[i];
            var color = classifyColor(data[id][i]);
            toyRects[letter].attr("fill", colors[color]);
        }
    }
    else if (curr_view == 'indiv') {
        if (e.keyCode == '38' || e.keyCode == '39') {
            id = +slider.value + 1;
            slider.value = id;
        }
        // left or down
        else if (e.keyCode == '40' || e.keyCode == '37') {
            id = +slider.value - 1;
            slider.value = id;

        }
        else { return; }
        sliderVal.innerHTML = "Synesthete ID: " + id;
        rectsOn = [];

        for (var i = 0; i < letters.length; i++){
            if(data[id] == null)// not sure why this happens, but it does
                break;
            var letter = letters[i];
            var color = classifyColor(data[id][i]);
            toyRects[letter].attr("fill", colors[color]);
            rectsOn.push(`${color} ${letter}`);
        }

        updateRects();
        persistRects = true;
    }
}
