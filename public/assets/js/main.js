
   
                // var map;

            
                
                // (function init() {
                // initMap();
                
                
                //             })();
                
                // function initMap() {
                // console.log('Initializing map');
                // map = L.map('map').setView([37, -96], 4);
                
                // // Set up map source
                // L.tileLayer(
                //     'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                //     attribution: 'Open Street Map',
                //     maxZoom: 18
                //     }).addTo(map);
                // }


    jQuery(document).ready(function(){
        $('#telnet').click(function(e){
            var data = $("#data").val;
            console.log("data", data);
            
        });


        var socket = io();
        $('form').submit(function(){
            socket.emit('chat message', $('#m').val());
            $('#m').val('');
            return false;
        });

         socket.on('chat message', function(msg){
            $('#messages').append($('<li>').text(msg));
        });
    });