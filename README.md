<h1>jQuery Google Bubbles</h1>

Demo: <a href="http://timmywillison.com/samples/bubbles/example.html">http://timmywillison.com/samples/bubbles/example.html</a><br/>
Github: <a href="http://github.com/timmywil/jquery-google-bubbles">http://github.com/timmywil/jquery-google-bubbles</a><br/>
Source: <a href="http://github.com/timmywil/jquery-google-bubbles/raw/master/bubbles.jquery.js">http://github.com/timmywil/jquery-google-bubbles/raw/master/bubbles.jquery.js</a> ( 11 kb )<br/>
(minified): <a href="http://github.com/timmywil/jquery-google-bubbles/raw/master/bubbles.jquery.min.js">http://github.com/timmywil/jquery-google-bubbles/raw/master/bubbles.jquery.min.js</a> ( 4.0 kb )<br/>

*Version: 0.7, Last updated: 10/23/2010*

This is a jQuery plugin for changing the look of
Google maps pins and info windows.
SDG

<h3>About: Release History</h3>

0.7 : Polished and tested ( 10/23/10 )
0.1 : First release ( 5/2/10 )

<h3>Usage</h3>

<pre>
$('#google-map').bubbles();
</pre>

<pre>
$('#another-map').bubbles({
  
    // If you wish to use the default map, 
    // but just want to change the center
    // ****NOTE: This gets overwritten if a map is passed in (see next).
    center: { lat: 36.915, lng: -95.225 },
  
    // Your own map that you created with the Google V3 API
    map: myGoogleMap,
  
    // An unlimited number of markers may be put on the map.
    // Add latitudes and longitudes for where they should be placed,
    // a title for each marker,
    // and a content string for their corresponding info window.
    // ex: [ { lat : 35.289, lng : -94.756, title : 'woot', content : '<div class="iw-content"><p>Hello World!!</p></div>' }, 
    //   { lat : 35.289, lng : -94.756, title : 'woot', content : '<div class="iw-content"><p>Hello World!!</p></div>' } ]
    markers: [ { lat : 35.289, 
                 lng : -94.756, 
                 title: 'woot', 
                 content : '<div class="iw-content"><p>Hello World!!</p></div>' } ],
  
    // Custom image for the marker
    markerIcon: 'images/google-maps-icon.png',
  
    // The shadow for the marker image
    markerShadow: 'images/google-maps-shadow.png',
              
    // The info window background image (includes its own shadow if one is needed)
    windowImage: 'images/google-maps-infobox.png',
  
    // The close image/button that goes on the info window
    closeImage: 'images/google-maps-close.png',
  
    // Offsets for the position of the info window
    // relative to the marker
    offsetVertical: -226,
    offsetHorizontal: -20,
  
    // Width and Height of the info window background image
    iwWidth: 208,
    iwHeight: 165
});
</pre>

*TIP: If all you need is a custom pin and no custom info window,
 don't use this plugin.  That is too easy with the normal
 Google API (see the attachInfo function below).*
