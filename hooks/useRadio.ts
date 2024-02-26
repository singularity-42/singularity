import { useState, useEffect } from 'react';
import { RadioBrowserApi } from 'radio-browser-api';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface RadioStation {
  name: string;
  urlResolved: string;
}

const useRadio = (genre: string): { stations: RadioStation[]; currentStation: string | null } => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStation, setCurrentStation] = useState<string | null>(null);

  useEffect(() => {
    const setupApi = async () => {
      const api = new RadioBrowserApi(fetch.bind(window), "My Radio App");
      const stations = await api.searchStations({
        language: "english",
        tag: genre,
        limit:  1,
      });
      setStations(stations);
      if (stations.length >  0) {
        setCurrentStation(stations[0].urlResolved);
      }
    };
    setupApi();
  }, [genre]);

  return { stations, currentStation };
};

export default useRadio;
