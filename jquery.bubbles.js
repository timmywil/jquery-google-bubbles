/*
*   jQuery Google Bubbles
*   http://github.com/timmywil/googlebubbles
*
*   Author: timmy willison
*   This is a jQuery plugin for changing the look of
*   Google maps pins and info windows.
*   SDG
*   
*   License:   
*   Copyright (c) 2010 timmy willison
*   MIT License
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

;function($) {

    var infoBox = function(opts) {
        google.maps.OverlayView.call(this);
        var ov = this;
        ov.latlng = opts.latlng;
        ov.map = opts.map;
        ov.content = opts.content;
        ov.offsetVertical = -236;
        ov.offsetHorizontal = -20;
        ov.height = 165;
        ov.width = 208;
        ov.boundsChangedListener_ = 
            google.maps.event.addListener(this.map, "bounds_changed", function() {
                return ov.panMap.apply(ov);
            });
        
        ov.setMap(this.map);
    }
    
    infoBox.prototype = new google.maps.OverlayView();
    
    // Clear the way for creating the div
    infoBox.prototype.remove = function() {
        if(this.div_.size()) this.div_.remove();
    }
    
    // Redraw the bar based on the current position and zoom level
    infoBox.prototype.draw = function() {
        this.createElement();
        var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng);
        $(this.div_).css({
            width     : this.width,
            left      : (pixPosition.x + this.offsetHorizontal),
            height    : this.height,
            top       : (pixPosition.y + this.offsetVertical),
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
                width        : this.width,
                height       : this.height,
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
        var map = this.map;
        var bounds = map.getBounds();
        if (!bounds) return;
        
        // The position of the infowindow
        var position = this.latlng;
        
        // The dimension of the infowindow
        var iwWidth = this.width;
        var iwHeight = this.height;
        
        // The offset position of the infowindow
        var iwOffsetX = this.offsetHorizontal;
        var iwOffsetY = this.offsetVertical;
        
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
    
    eee,
    // and Elect, when called, returns an Elect object that's
    // been init()ed with whatever arguments are supplied
    Elect = function() {
        return new eee.init(arguments);
    };
    
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
    
    function attachInfo(map, dealer) {
        var myLatLng = new google.maps.LatLng(dealer.latlng[0], dealer.latlng[1]);
        var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: dealer.name,
                icon: image,
                shadow: shadow
        }); 

        google.maps.event.addListener(marker, 'click', function(){
              var iBox = new infoBox({latlng: marker.getPosition(), map: map, content: contentString});
        });
    }

}(jQuery);