/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        var imgDetectionPlugin = window.plugins.ImageDetectionPlugin || new ImageDetectionPlugin();


        var c = document.getElementById("coords");
        c.width = window.innerWidth;
        c.height = window.innerHeight;

        imgDetectionPlugin.startProcessing(true, function(success){console.log(success);}, function(error){console.log(error);});

        imgDetectionPlugin.isDetecting(function(success){
          console.log(success);
          var resp = JSON.parse(success);
          var coords = resp.coords;
          var c = document.getElementById("coords");
          var ctx = c.getContext("2d");
          ctx.clearRect(0, 0, c.width, c.height);
          drawRect(coords);
          drawCoord(coords["1"].x, coords["1"].y, "#FFFF00");
          drawCoord(coords["2"].x, coords["2"].y, "#FF00FF");
          drawCoord(coords["3"].x, coords["3"].y, "#FFFFFF");
          drawCoord(coords["4"].x, coords["4"].y, "#FF0000");
          drawCoord(resp.center.x, resp.center.y, "green");
          alert("Index detected: " + resp.index + ", Image detected: " + indexes[resp.index]);
        }, function(error){console.log(error);});

        function setAllPatterns(patterns) {
          imgDetectionPlugin.setPatterns(patterns, function(success){console.log(success);}, function(error){console.log(error);});
        }

        function drawRect(coords) {
          var c = document.getElementById("coords");
          var ctx = c.getContext("2d");
          ctx.beginPath();
          ctx.moveTo(coords["1"].x, coords["1"].y);
          ctx.lineTo(coords["2"].x, coords["2"].y);
          ctx.lineTo(coords["3"].x, coords["3"].y);
          ctx.lineTo(coords["4"].x, coords["4"].y);
          ctx.lineTo(coords["1"].x, coords["1"].y);
          ctx.strokeStyle="#FF0000";
          ctx.stroke();
        }

        function drawCoord(x, y, color) {
          var c = document.getElementById("coords");
          var ctx = c.getContext("2d");
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, 2 * Math.PI);
          ctx.fillStyle = color ? color : 'red';
          ctx.fill();
          ctx.stroke();
        }

        var loadAllImg = 0;
        var patternsHolder = [];
        var indexes = {};
        var limit = 3;

        function ToDataURL (self) {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var dataURL;
          canvas.height = self.height;
          canvas.width = self.width;
          ctx.drawImage(self, 0, 0);
          dataURL = canvas.toDataURL("image/jpeg", 0.8);
          patternsHolder.push(dataURL);
          indexes[loadAllImg] = self.src.substr(self.src.lastIndexOf("/") + 1);
          loadAllImg += 1;
          console.log("!!!", loadAllImg, indexes);
          if(loadAllImg == limit){
            console.log("patterns set", patternsHolder);
            setAllPatterns(patternsHolder);
          }
          canvas = null;
        }

        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function(){
          ToDataURL(this)
        };
        img.src = "img/patterns/target1.jpg";

        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function(){
          ToDataURL(this)
        };
        img.src = "img/patterns/target2.jpg";

        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function(){
          ToDataURL(this)
        };
        img.src = "img/patterns/target3.jpg";
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
