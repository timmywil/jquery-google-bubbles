/*
*   jQuery Google Bubbles
*   http://github.com/timmywil/googlebubbles
*
*   author: timmy willison
*   This is a jQuery plugin for changing the look of
*   Google maps pins and info windows.
*   SDG
*   
*   license:   
*   Copyright (c) 2010 timmy willison
*   MIT License
*
*   about: Release History
*   
*   0.1 : First release ( 5/2/10 )
*   
*   examples: $('#google-map').bubbles();
*
*     $('#another-map').bubbles({
*      
*       // If you wish to use the default map, 
*       // but just want to change the center
*       // ****NOTE: This gets overwritten if a map is passed in (see next).
*       center: { lat: 36.915, lng: -95.225 },
*        
*       // Your own map that you created with the Google V3 API
*       map: myGoogleMap,
*        
*       // An unlimited number of markers may be put on the map.
*       // Add latitudes and longitudes for where they should be placed,
*       // a title for each marker,
*       // and a content string for their corresponding info window.
*       // ex: [ { lat : 35.289, lng : -94.756, title : 'woot', content : '<div class="iw-content"><p>Hello World!!</p></div>' }, 
*       //   { lat : 35.289, lng : -94.756, title : 'woot', content : '<div class="iw-content"><p>Hello World!!</p></div>' } ]
*       markers: [ { lat : 35.289, 
*                    lng : -94.756, 
*                    title: 'woot', 
*                    content : '<div class="iw-content"><p>Hello World!!</p></div>' } ],
*        
*       // Custom image for the marker
*       markerIcon: 'images/google-maps-icon.png',
*        
*       // The shadow for the marker image
*       markerShadow: 'images/google-maps-shadow.png',
*                    
*       // The info window background image (includes its own shadow if one is needed)
*       windowImage: 'images/google-maps-infobox.png',
*        
*       // The close image/button that goes on the info window
*       closeImage: 'images/google-maps-close.png',
*        
*       // Offsets for the position of the info window
*       // relative to the marker
*       offsetVertical: -226,
*       offsetHorizontal: -20,
*        
*       // Width and Height of the info window background image
*       iwWidth: 208,
*       iwHeight: 165
*     });
*   
*   tip: If all you need is a custom pin and no custom info window,
*     don't use this plugin.  That is too easy with the normal
*     Google API (see the attachInfo function below).
*
*   demo: http://timmywillison.com/samples/bubbles/example.html
*   github: http://github.com/timmywil/jquery-google-bubbles
*   source: http://github.com/timmywil/jquery-google-bubbles/raw/master/bubbles.jquery.js ( 11.9 kb )
*   (minified): http://github.com/timmywil/jquery-google-bubbles/raw/master/bubbles.jquery.min.js ( 4.9 kb )
*/

;(function($) {

    // A reference to the bubbles prototype
    var bp,
    // When called, initialize bubbles with arguments given
    bubbles = function() {
        return new bp.init(arguments);
    };
    
    bp = bubbles.prototype = {
        
        opts : {
        
            // This is just a shortcut if you want the same kind
            // of default map, just with a different center
            // Defaults to center of USA, or if you prefer,
            // create your own map and pass that in instead (see init).
            center: { lat: 36.915, lng: -95.225 },
            
            // An unlimited number of markers.
            // Add latitudes and longitudes for where they should be placed,
            // a title for each marker,
            // and a content string for their corresponding info window.
            // ex: [ { lat : 35.289, lng : -94.756, title : 'woot', content : '<div class="iw-content"><p>Hello World!!</p></div>' }, 
            //   { lat : 35.289, lng : -94.756, title : 'woot', content : '<div class="iw-content"><p>Hello World!!</p></div>' } ]
            markers: [ { lat : 35.289, lng : -94.756, title: 'woot', content : '<div class="iw-content"><p>Hello World!!</p></div>' } ],
            
            // Icon image for all the markers
            markerIcon: 'images/google-maps-icon.png',
            
            // Shadow for all the marker images
            markerShadow: 'images/google-maps-shadow.png',
            
            // The info window background image
            windowImage: 'images/google-maps-infobox.png',
            
            // The close image that goes on the info window
            closeImage: 'images/google-maps-close.png',
            
            // Offsets for the position of the info window
            // relative to the marker
            offsetVertical: -226,
            offsetHorizontal: -20,
            
            // Width and Height of the info window
            // background image.
            iwWidth: 208,
            iwHeight: 165
            
        },
        init : function(a) {
            // Put args in an array
            var args = Array.prototype.slice.call(a);
            
            // Pop the first arg off the array, which is the element
            // Bubbles was called on
            this.mapEl = $(args.shift());
            
            // Create a default map with the given 
            // element id that bubbles was called on.
            // This can be replaced with arguments.
            //   ex: $('#google-map').bubbles({ map : myMap });
            this.opts.map = new google.maps.Map(this.mapEl[0], { 
                    zoom : 4, 
                    scrollwheel : 0, 
                    center : new google.maps.LatLng(this.opts.center.lat, this.opts.center.lng),
                    mapTypeId : google.maps.MapTypeId.ROADMAP, 
                    mapTypeControl : true, 
                    navigationControlOptions : { style: google.maps.NavigationControlStyle.ZOOM_PAN }
                });
            
            // Add in options to opts        
            $.extend(this.opts, args[0] || {});       
            
            this.setMarkers(this.opts.map, this.opts.markers);
            
        },
        
        // Add all markers to the map
        setMarkers : function(map, markers) {
          for (var i = 0; i < markers.length; i++) {
            this.attachInfo(map, markers[i]);
          }
        },
        
        // Add an individual marker to the map
        attachInfo : function(map, marker) {
            var map = this.opts.map,
                title = marker.title,
                icon = this.opts.markerIcon,
                shadow = this.opts.markerShadow,
                content = marker.content,
                mLatLng = new google.maps.LatLng(marker.lat, marker.lng),
                g_marker = new google.maps.Marker({
                    position : mLatLng,
                    map : map,
                    title : title,
                    icon : icon,
                    shadow : shadow
                });
            var b = this.opts;
            google.maps.event.addListener(g_marker, 'click', function() {
                  var iBox = new infoBox({ latlng: g_marker.getPosition(), map: map, content: content, offsetVertical: b.offsetVertical, 
                    offsetHorizontal: b.offsetHorizontal, height: b.iwHeight, width: b.iwWidth, windowImage: b.windowImage, 
                    closeImage: b.closeImage });
            });
        }
    };
    bp.init.prototype = bp;
    
    var infoBox = function(args) {
        var ibox = this;
        google.maps.OverlayView.call(ibox);
        ibox.latlng = args.latlng;
        ibox.map = args.map;
        ibox.content = args.content;
        ibox.offsetVertical = args.offsetVertical;
        ibox.offsetHorizontal = args.offsetHorizontal;
        ibox.height = args.height;
        ibox.width = args.width;
        ibox.windowImage = args.windowImage;
        ibox.closeImage = args.closeImage;
        ibox.boundsChangedListener = 
            google.maps.event.addListener(ibox.map, "bounds_changed", function() {
                return ibox.panMap.apply(ibox);
            });
        
        ibox.setMap(this.map);
    };
    
    infoBox.prototype = new google.maps.OverlayView();
    
    // Creates the DIV representing this InfoBox in the floatPane.  If the panes
    // object, retrieved by calling getPanes, is null, remove the element from the
    // DOM.  If the div exists, but its parent is not the floatPane, move the div
    // to the new pane.
    // Called from within draw.  Alternatively, this can be called specifically on
    // a panes_changed event.
    infoBox.prototype.createElement = function() {
        var box = this,
            panes = box.getPanes(),
            div = box.div_;
        if(!div) {
            div = box.div_ = $('<div/>').css({
                'border'       : '0 none',
                'position'   : 'absolute',
                'background' : 'url(' + box.windowImage + ') no-repeat top left',
                width        : this.width,
                height       : this.height,
                'padding'    : '10px 20px 30px 20px'
            });
            
            var topDiv = $('<div/>').css({'textAlign': 'right', 'marginBottom' : '-5px'});
            var closeImg = $('<img/>')
                .css({
                    width    : 11,
                    height   : 11,
                    'cursor' : 'pointer'
                })
                .attr('src', box.closeImage)
                .appendTo(topDiv);
            
            function removeInfoBox(ib) {
                return function() {
                    ib.setMap(null);
                };
            }
            
            google.maps.event.addDomListener(closeImg[0], 'click', removeInfoBox(this));

            topDiv.appendTo(div);
            $(box.content).appendTo(div);
            div.remove().
              appendTo(panes.floatPane);
            this.panMap();
        } else if (div.parentNode != panes.floatPane) {
            // The panes have changed.  Move the div.
            div.remove().
              appendTo(panes.floatPane);
        }
    };
    
    // Pan the map to fit the InfoBox.
    infoBox.prototype.panMap = function() {
        // If we go beyond map, pan map
        var map = this.map,
            bounds = map.getBounds();
        if (!bounds) return;
        
        // The position of the infowindow
        var position = this.latlng;
        
        // The dimension of the infowindow
        var iwWidth = this.width,
            iwHeight = this.height;
        
        // The offset position of the infowindow
        var iwOffsetX = this.offsetHorizontal,
            iwOffsetY = this.offsetVertical;
        
        // Padding on the infowindow
        var padX = 40,
            padY = 40;
        
        // The degrees per pixel
        var mapDiv = map.getDiv(),
            mapWidth = mapDiv.offsetWidth,
            mapHeight = mapDiv.offsetHeight,
            boundsSpan = bounds.toSpan(),
            longSpan = boundsSpan.lng(),
            latSpan = boundsSpan.lat(),
            degPixelX = longSpan / mapWidth,
            degPixelY = latSpan / mapHeight;
        
        // The bounds of the map
        var mapWestLng = bounds.getSouthWest().lng(),
            mapEastLng = bounds.getNorthEast().lng(),
            mapNorthLat = bounds.getNorthEast().lat(),
            mapSouthLat = bounds.getSouthWest().lat();
        
        // The bounds of the infowindow
        var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX,
            iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX,
            iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY,
            iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;
        
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
        var centerX = center.lng() - shiftLng,
            centerY = center.lat() - shiftLat;
        
        // center the map to the new shifted center
        map.setCenter(new google.maps.LatLng(centerY, centerX));
        
        // Remove the listener after panning is complete.
        google.maps.event.removeListener(this.boundsChangedListener);
        this.boundsChangedListener = null;
    };
    
    // Redraw the bar based on the current position and zoom level
    // This is used directly by google maps.
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
    };
    
    // Google calls this when removing the info window
    infoBox.prototype.remove = function() {
        if(this.div_.size()) div_ = this.div_.detach();
    }
    
    // Extend jQuery
    $.fn.bubbles = function() {
        var args = Array.prototype.slice.call(arguments);
        this.each(function() {
            // Add the containing element to the array of args
            args.unshift(this);
            // Apply bubbles to each element
            bubbles.apply(null, args);
        });
        // return jQuery object for chaining
        return this;
    };

})(jQuery);