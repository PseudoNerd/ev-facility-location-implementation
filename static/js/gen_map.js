var bounds = new google.maps.LatLngBounds();
var polyline_before_state = true;
var map = new google.maps.Map(document.getElementById("map_canvas"), {
    zoom: 15,
});

unassigned.forEach(client => {
    bounds.extend(new google.maps.LatLng(client.lat, client.lng));

    var marker = new google.maps.Marker({
        position: {lat: client.lat, lng: client.lng},
        map,
        icon: house_img_url,
    });

    var infowindow = new google.maps.InfoWindow({
        content: 'Unassigned client',
    });

    marker.addListener('click', () => {
        infowindow.open(map, marker);
    });
});

points.forEach(point => {
    bounds.extend(new google.maps.LatLng(point.lat, point.lng));

    var marker = new google.maps.Marker({
        position: {lat: point.lat, lng: point.lng},
        map,
        icon: fac_img_url,
    });

    var client_markers = point.assigned_clients.map(client => {
        bounds.extend(new google.maps.LatLng(client.lat, client.lng));

        return new google.maps.Marker({
            position: {lat: client.lat, lng: client.lng},
            visible: false,
            map,
            icon: house_small_url,
        });
    });

    if(point.assigned_clients.length === 1) {
        var content = '<p>1 client</p>';
    } else {
        var content = `<p>${point.assigned_clients.length} clients</p>`;
    }

    var infowindow = new google.maps.InfoWindow({content});

    marker.addListener('click', () => {
        infowindow.open(map, marker);
        var new_visible = !client_markers[0].getVisible();
        for(client of client_markers) {
            client.setVisible(new_visible);
        }
    });
});

for(line of powerlines) {
    bounds.extend(new google.maps.LatLng(line.start.lat, line.start.lng));
    bounds.extend(new google.maps.LatLng(line.end.lat, line.end.lng));

    line.polyline = new google.maps.Polyline({
        path: [line.start, line.end],
        strokeColor: line.beforeColor,
        strokeOpacity: 1.0,
        strokeWeight: 5,
        visible: false,
        map,
    });
}

var visible_button = document.createElement('button');
visible_button.classList.add('map-option');
visible_button.innerText = 'Toggle line visibility';
map.controls[google.maps.ControlPosition.TOP_CENTER].push(visible_button);
visible_button.addEventListener('click', () => {
    if(powerlines.length == 0) return;
    var new_visible = !powerlines[0].polyline.getVisible();
    for(line of powerlines) {
        line.polyline.setVisible(new_visible);
    }
});

var state_button = document.createElement('button');
state_button.classList.add('map-option');
state_button.innerText = 'Toggle grid improvements';
map.controls[google.maps.ControlPosition.TOP_CENTER].push(state_button);
state_button.addEventListener('click', () => {
    for(line of powerlines) {
        var new_color = polyline_before_state ? line.afterColor : line.beforeColor;
        line.polyline.setOptions({strokeColor: new_color});
    }
    polyline_before_state = !polyline_before_state;
});

map.fitBounds(bounds);
map.panToBounds(bounds);
