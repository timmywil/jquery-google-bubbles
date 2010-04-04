/*
*   jQuery Google Bubbles
*   http://github.com/timmywil/googlebubbles
*
*   Author: timmy willison
*   This is a jQuery plugin for changing the look of
*   Google maps pins and info windows.
*   
*   
*   About: Release History
*   
*   Unreleased.  This code is not useable yet.
*   
*   Example:
*
*   GitHub: http://github.com/timmywil/jquery-google-bubbles
*   Source: http://github.com/timmywil/jquery-google-bubbles/raw/master/jquery.google-bubbles.js
*   (Minified): http://github.com/timmywil/jquery-google-bubbles/raw/master/jquery.google-bubbles.min.js (kb)
*
*/

;function() {
    var GBubbles = function ($){
        
        
        var yfp,
        YanFo = function(){
            return new yfp.init(arguments);
        };
        
    
        yfp = YanFo.prototype = {
            init: function(){
                var args = Array.prototype.slice.call(arguments[0]),
                        opts = args[0] || {};
                this.map = opts.map;
                this.content = opts.content || '';
                
                if(! $('#YanFo').size())
                    $('<div id="YanFo"></div>').appendTo('body').hide();
                this.yanfo = $('#YanFo');
                
                return this;
            },
            
            open: function(){
                var off = {
                    left: $('#dealer-map').position().left + $('#dealer-box').position().left,
                    top: $('#dealer-map').position().top + $('#dealer-box').position().top},
                pos = (new google.maps.Ov(map)).lltp(this.dealer.marker.position);
                this.yanfo.html(this.content);
                this.yanfo.css({'position':'absolute',
                    'top':off.top + pos.y - (this.yanfo.outerHeight() / 1.5) + 'px',
                    // 'top': off.top + 'px',
                    'left':off.left + pos.x - (this.yanfo.outerWidth() / 10) + 'px'});
                    // 'left': off.left + 'px'});
                                
                this.yanfo.fadeIn();
            }
            
        };
        yfp.init.prototype = yfp;
    
        google.maps.Ov = function(map) {
          google.maps.OverlayView.call(this);
          this.setMap(map); 
        }
        google.maps.Ov.prototype = new google.maps.OverlayView(); 
        google.maps.Ov.prototype.draw = function () { 
          if (!this.ready) { 
            this.ready = true; 
            google.maps.event.trigger(this, 'ready'); 
          } 
        };
        google.maps.Ov.prototype.lltp = function(latlng){
            return this.getProjection().fromLatLngToDivPixel(latlng);
        };
        
        $(document).ready(function(){
            
            var latlng = new google.maps.LatLng(36.915, -95.225);
            var map = new google.maps.Map(
                $('#dealer-map')[0], 
                { zoom: 4,
                scrollwheel: 0,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false,
                    navigationControlOptions: {
                        style: google.maps.NavigationControlStyle.ZOOM_PAN
                    }
            });        
            
            if(! window.map) window.map = map;
            
            setMarkers(map);
            
            function setMarkers(map) {
              // Add markers to the map
              for (var i = 0; i < dealers.length; i++) {
                    attachInfo(map, dealers[i]);
              }
            };
            
            // 248 x 205
            /**************************************************************
                                    CUSTOM INFO WINDOW
             **************************************************************/
            var infoBox = function(opts) {
                google.maps.OverlayView.call(this);
                var ov = this;
                ov.latlng_ = opts.latlng;
                ov.map_ = opts.map;
                ov.content = opts.content;
                ov.offsetVertical_ = -236;
                ov.offsetHorizontal_ = -20;
                ov.height_ = 165;
                ov.width_ = 208;
                ov.boundsChangedListener_ = 
                    google.maps.event.addListener(this.map_, "bounds_changed", function() {
                        return ov.panMap.apply(ov);
                    });
                
                ov.setMap(this.map_);
            }
            
            infoBox.prototype = new google.maps.OverlayView();
            
            // Clear the way for creating the div
            infoBox.prototype.remove = function() {
                if(this.div_.size()) this.div_.hide();
            }
            
            // Redraw the bar based on the current position and zoom level
            infoBox.prototype.draw = function() {
                this.createElement();
                var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
                $(this.div_).css({
                    width     : this.width_,
                    left      : (pixPosition.x + this.offsetHorizontal_),
                    height    : this.height_,
                    top       : (pixPosition.y + this.offsetVertical_),
                    'display' : 'block'
                });
            }
            
            // Creates the DIV representing this InfoBox in the floatPane.  If the panes
            // object, retrieved by calling getPanes, is null, remove the element from the
            // DOM.  If the div exists, but its parent is not the floatPane, move the div
            // to the new pane.
            // Called from within draw.  Alternatively, this can be called specifically on
            // a panes_changed event.
            infoBox.prototype.createElement = function() {
                var box = this;
                var panes = box.getPanes();
                var div = box.div_;
                if(!div) {
                    div = box.div_ = $('<div/>').css({
                        'border'       : '0 none',
                        'position'   : 'absolute',
                        'background' : 'url(/media/images/google-maps-infobox.png) no-repeat top left',
                        width        : this.width_,
                        height       : this.height_,
                        'padding'    : '10px 20px 30px 20px'
                    });
                    
                    var topDiv = $('<div/>').css({'textAlign': 'right', 'marginBottom' : '-5px'})
                    var closeImg = $('<img/>')
                        .css({
                            width    : 11,
                            height   : 11,
                            'cursor' : 'pointer'
                        })
                        .attr('src', '/media/images/google-maps-close.png')
                        .appendTo(topDiv);
                    
                    function removeInfoBox(ib) {
                        return function() {
                            ib.setMap(null);
                        };
                    }
                    
                    //google.maps.event.addDomListener(closeImg, 'click', removeInfoBox(this));
                    closeImg.click(function() {
                        div.hide();
                    });
                    topDiv.appendTo(div);
                    $(box.content).appendTo(div);
                    div.hide();
                    $(panes.floatPane).append(div);
                    this.panMap();
                } else if (div.parentNode != panes.floatPane) {
                    // The panes have changed.  Move the div.
                    div.hide();
                    $(panes.floatPane).append(div);
                }
            }
            
            // Pan the map to fit the InfoBox.
            infoBox.prototype.panMap = function() {
                // If we go beyond map, pan map
                var map = this.map_;
                var bounds = map.getBounds();
                if (!bounds) return;
                
                // The position of the infowindow
                var position = this.latlng_;
                
                // The dimension of the infowindow
                var iwWidth = this.width_;
                var iwHeight = this.height_;
                
                // The offset position of the infowindow
                var iwOffsetX = this.offsetHorizontal_;
                var iwOffsetY = this.offsetVertical_;
                
                // Padding on the infowindow
                var padX = 40;
                var padY = 40;
                
                // The degrees per pixel
                var mapDiv = map.getDiv();
                var mapWidth = mapDiv.offsetWidth;
                var mapHeight = mapDiv.offsetHeight;
                var boundsSpan = bounds.toSpan();
                var longSpan = boundsSpan.lng();
                var latSpan = boundsSpan.lat();
                var degPixelX = longSpan / mapWidth;
                var degPixelY = latSpan / mapHeight;
                
                // The bounds of the map
                var mapWestLng = bounds.getSouthWest().lng();
                var mapEastLng = bounds.getNorthEast().lng();
                var mapNorthLat = bounds.getNorthEast().lat();
                var mapSouthLat = bounds.getSouthWest().lat();
                
                // The bounds of the infowindow
                var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
                var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
                var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
                var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
                
                // calculate center shift
                var shiftLng =
                    (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
                    (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
                var shiftLat =
                    (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
                    (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);
                
                // The center of the map
                var center = map.getCenter();
                
                // The new map center
                var centerX = center.lng() - shiftLng;
                var centerY = center.lat() - shiftLat;
                
                // center the map to the new shifted center
                map.setCenter(new google.maps.LatLng(centerY, centerX));
                
                // Remove the listener after panning is complete.
                google.maps.event.removeListener(this.boundsChangedListener_);
                this.boundsChangedListener_ = null;
            };
            
            function attachInfo(map, dealer) {
                var myLatLng = new google.maps.LatLng(dealer.latlng[0], dealer.latlng[1]);
                var image = '/media/images/google-maps-icon.png';
                var shadow = '/media/images/google-maps-shadow.png';
                var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        title: dealer.name,
                        icon: image,
                        shadow: shadow
                });
                var contentString = '<div class="map_marker_details">'+
                        '<h3>'+dealer.name+'</h3>'+
                        '<h4>'+ripNone(dealer.address[0])+'<br />'
                        +ripNone(dealer.address[1])+'</h4>'+
                        '<p><b>P </b>'+ dealer.phone + '<br/>'
                        + '<b>F </b>'+ dealer.fax + '</p>'
                        + '<p>Please call dealer to verify hours of operation.</p>'
                        +'<p><a target="_blank" href="http://maps.google.com/maps?hl=en&q='+googlefy(dealer.address[0])+'+'+googlefy(dealer.address[1])+'" class="get_directions" name="'+dealer.address+'">Get Directions</a>'
                        +'</div>'; 
    
                google.maps.event.addListener(marker, 'click', function(){
                      var iBox = new infoBox({latlng: marker.getPosition(), map: map, content: contentString}); //SDG
                });
            }
            
            /************************* END CUSTOM INFO WINDOW ***********************/
              
            function ripNone(val) {
                val = val.replace(', None', '');
                return val.replace('None', '');
            }
              
            function googlefy(val) {
                val = val.replace(', None', '');
                val = val.replace('None', '');
                return val.replace(' ', '+');
            }      
            
        });
    };
    // Make sure jQuery 1.4.2 is loaded
    // Then revert back to original page
    ;(function(e,a,g,h,f,c,b,d){if(!(f=e.jQuery)||g>f.fn.jquery||h(f)){c=a.createElement("script");c.type="text/javascript";c.src="http://ajax.googleapis.com/ajax/libs/jquery/"+g+"/jquery.min.js";c.onload=c.onreadystatechange=function(){if(!b&&(!(d=this.readyState)||d=="loaded"||d=="complete")){h((f=e.jQuery).noConflict(1),b=1);f(c).remove()}};a.documentElement.childNodes[0].appendChild(c)}})(window,document,"1.4.2",function($,L){GBubbles});
}();