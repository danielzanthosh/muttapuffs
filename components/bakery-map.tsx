"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BakeryMapMarker } from "@/types/bakery";
import type { DivIcon } from "leaflet";
import type * as ReactLeaflet from "react-leaflet";

const defaultCenter: [number, number] = [10.8505, 76.2711];

type LeafletRuntime = {
  MapContainer: typeof ReactLeaflet.MapContainer;
  Marker: typeof ReactLeaflet.Marker;
  Popup: typeof ReactLeaflet.Popup;
  TileLayer: typeof ReactLeaflet.TileLayer;
  makeIcon: (score: number, scam: number) => DivIcon;
};

export function BakeryMap({ markers }: { markers: BakeryMapMarker[] }) {
  const [runtime, setRuntime] = useState<LeafletRuntime | null>(null);
  const center = useMemo<[number, number]>(() => {
    return markers.length ? [markers[0].latitude, markers[0].longitude] : defaultCenter;
  }, [markers]);

  useEffect(() => {
    let mounted = true;

    async function loadLeaflet() {
      const leaflet = await import("leaflet");
      const reactLeaflet = await import("react-leaflet");

      const makeIcon = (score: number, scam: number) => {
        const label = score > 0 ? score.toFixed(1) : "NEW";
        const color = scam >= 7 ? "var(--tomato-red)" : score >= 8 ? "var(--egg-yellow)" : "var(--warm-orange)";

        return leaflet.divIcon({
          className: "",
          html: `<div style="
            background:${color};
            border:3px solid var(--chocolate-brown);
            box-shadow:4px 4px 0 var(--chocolate-brown);
            color:var(--chocolate-brown);
            font-weight:900;
            font-size:11px;
            min-width:44px;
            height:34px;
            display:flex;
            align-items:center;
            justify-content:center;
            transform:rotate(-3deg);
          ">${label}</div>`,
          iconSize: [44, 34],
          iconAnchor: [22, 34],
          popupAnchor: [0, -34],
        });
      };

      if (mounted) {
        setRuntime({
          MapContainer: reactLeaflet.MapContainer,
          Marker: reactLeaflet.Marker,
          Popup: reactLeaflet.Popup,
          TileLayer: reactLeaflet.TileLayer,
          makeIcon,
        });
      }
    }

    loadLeaflet();

    return () => {
      mounted = false;
    };
  }, []);

  if (markers.length === 0) {
    return (
      <div className="border-4 border-dashed border-chocolate-brown bg-white p-10 text-center shadow-brutalist-md">
        <div className="mx-auto mb-5 h-20 w-20 rotate-[-5deg] border-4 border-chocolate-brown bg-egg-yellow shadow-brutalist-md" />
        <h2 className="mb-2 text-3xl font-black">No Coordinates On The Board Yet.</h2>
        <p className="mx-auto max-w-xl font-bold opacity-70">
          Add latitude and longitude to bakery case files to activate the live radar.
        </p>
      </div>
    );
  }

  if (!runtime) {
    return (
      <div className="border-4 border-chocolate-brown bg-white p-12 text-center shadow-brutalist-md">
        <p className="font-comic text-2xl font-black">Loading Bakery Radar...</p>
      </div>
    );
  }

  const { MapContainer, Marker, Popup, TileLayer, makeIcon } = runtime;

  return (
    <div className="overflow-hidden border-4 border-chocolate-brown bg-white p-2 shadow-brutalist-lg">
      <MapContainer center={center} zoom={10} scrollWheelZoom className="h-[70dvh] min-h-[460px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={makeIcon(marker.stats.avgOverall, marker.stats.avgScam)}
          >
            <Popup>
              <div className="min-w-[180px] font-sans text-chocolate-brown">
                <div className="mb-1 text-sm font-black">{marker.name}</div>
                <div className="mb-3 text-xs font-bold opacity-70">
                  {marker.city}{marker.district ? `, ${marker.district}` : ""}
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2 text-xs font-black">
                  <span>Puff {marker.stats.avgOverall.toFixed(1)}</span>
                  <span>Scam {marker.stats.avgScam.toFixed(1)}</span>
                </div>
                <Link href={`/bakeries/${marker.slug}`} className="text-xs font-black underline">
                  Open case file
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
