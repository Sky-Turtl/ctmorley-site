import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SectionTitle from "../components/SectionTitle";

// Distribution currently covers the Northeast — New England, New York,
// New Jersey, and Pennsylvania.
const states = [
  { label: "Connecticut", value: "CT", lat: 41.597782, lon: -72.755371 },
  { label: "Maine", value: "ME", lat: 44.693947, lon: -69.381927 },
  { label: "Massachusetts", value: "MA", lat: 42.230171, lon: -71.530106 },
  { label: "New Hampshire", value: "NH", lat: 43.452492, lon: -71.563896 },
  { label: "New Jersey", value: "NJ", lat: 40.298904, lon: -74.521011 },
  {
    label: "New York",
    value: "NY",
    lat: 42.954324,
    lon: -75.526755,
    markerLat: 40.738452,
    markerLon: -73.810683,
    zoom: 7,
  },
  { label: "Pennsylvania", value: "PA", lat: 40.590752, lon: -77.209755 },
  { label: "Rhode Island", value: "RI", lat: 41.680893, lon: -71.511780 },
  { label: "Vermont", value: "VT", lat: 44.045876, lon: -72.710686 },
];

const defaultUsCenter = [39.8283, -98.5795];
const defaultUsZoom = 4;
const stateZoom = 6;
const newYorkZoom = 6;

const redMarkerIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function WholesaleDistributorsPage() {
  const [selectedState, setSelectedState] = useState("");
  const selectedStateData = states.find((state) => state.value === selectedState);
  const selectedLabel = selectedStateData?.label || "United States";
  const isNewYork = selectedState === "NY";
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const center = selectedStateData
    ? [selectedStateData.lat, selectedStateData.lon]
    : defaultUsCenter;
  const zoom = selectedState === "" ? defaultUsZoom : isNewYork ? newYorkZoom : stateZoom;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(center, zoom, { animate: true });
    }

    if (isNewYork) {
      if (markerRef.current) {
        markerRef.current.setLatLng([selectedStateData.markerLat, selectedStateData.markerLon]);
      } else {
        markerRef.current = L.marker([selectedStateData.markerLat, selectedStateData.markerLon], {
          icon: redMarkerIcon,
        }).addTo(mapRef.current);
      }
    } else if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  }, [center, isNewYork, selectedStateData, zoom]);

  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionTitle
            eyebrow="Wholesale Distribution"
            title="Find a Distributor"
            description="CT Morley is proud to partner with wholesale distributors across the United States."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.85fr]">
          <div className="space-y-6 rounded-sm border border-slate-200 bg-white p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Pick a state
              </div>
              <div className="min-w-[12rem]">
                <label htmlFor="state-select" className="sr-only">
                  Select a state
                </label>
                <select
                  id="state-select"
                  value={selectedState}
                  onChange={(event) => setSelectedState(event.target.value)}
                  className="w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">Select a state</option>
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-sm border border-slate-200 bg-slate-50">
              <div ref={mapContainerRef} className="w-full min-h-[420px]" />
            </div>
          </div>

          <div className="rounded-sm border border-slate-200 bg-slate-50 p-8">
            {selectedState === "" ? (
              <div className="space-y-4">
                <p className="text-base leading-7 text-slate-600">
                  Choose a state from the dropdown to see distributor details.
                </p>
              </div>
            ) : isNewYork ? (
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
                    Distributor details
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                    Economy RHVAC Supply
                  </h3>
                </div>

                <div className="space-y-3 rounded-sm border border-slate-200 bg-white p-6 shadow-sm">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Address</div>
                    <p className="mt-2 text-sm text-slate-600">131-10 Avery Ave</p>
                    <p className="text-sm text-slate-600">Queens, NY 11434</p>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-900">Phone</div>
                    <a href="tel:+17186612180" className="mt-2 block text-sm text-orange-700">
                      (718) 661-2180
                    </a>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-900">Website</div>
                    <a
                      href="https://www.economyrhvac.com"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-orange-700 hover:text-orange-800"
                    >
                      economyrhvac.com
                    </a>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-slate-900">Hours</div>
                    <div className="mt-2 text-sm text-slate-600">
                      <p>Monday–Friday: 7:30 AM – 6:00 PM</p>
                      <p>Sunday: 8:00 AM – 3:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
                    Coming soon
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                    {selectedLabel}
                  </h3>
                </div>

                <div className="rounded-sm border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 shadow-sm">
                  <p>
                    We’re working to bring wholesale distribution details to {selectedLabel}. Check back soon for the first Economy RHVAC Supply location in this state.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
