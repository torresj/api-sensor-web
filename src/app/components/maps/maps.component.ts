import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnInit
} from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.css"]
})
export class MapsComponent implements AfterViewInit, OnInit {
  @ViewChild("mapContainer", { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  @Input() positions: Observable<google.maps.LatLng[]>;
  markers: google.maps.Marker[];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.positions.subscribe(positions => {
      this.setMarkers(positions);
      this.mapInitializer();
    });
  }

  mapInitializer() {
    const mapOptions: google.maps.MapOptions = {
      center: this.calculateCenter(),
      zoom: 10
    };

    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
    this.markers.forEach(marker => {
      marker.setMap(this.map);
    });
  }

  private calculateCenter() {
    if (this.markers.length === 1) {
      return this.markers[0].getPosition();
    } else if (this.markers.length > 0) {
      let maxLat = this.markers[0].getPosition().lat();
      let minLat = this.markers[0].getPosition().lat();
      let maxLng = this.markers[0].getPosition().lng();
      let minLng = this.markers[0].getPosition().lng();

      for (let marker of this.markers) {
        const currentLat = marker.getPosition().lat();
        const currentLng = marker.getPosition().lng();
        if (maxLat <= currentLat) {
          maxLat = currentLat;
        }
        if (maxLng <= currentLng) {
          maxLng = currentLng;
        }
        if (minLat >= currentLat) {
          minLat = currentLat;
        }
        if (minLng >= currentLng) {
          minLng = currentLng;
        }
      }
      return new google.maps.LatLng(
        (maxLat + minLat) / 2.0,
        (maxLng + minLng) / 2.0
      );
    } else {
      return new google.maps.LatLng(0, 0);
    }
  }

  private setMarkers(positions: google.maps.LatLng[]) {
    this.markers = positions.map(position => {
      return new google.maps.Marker({
        position,
        map: this.map
      });
    });
  }
}
