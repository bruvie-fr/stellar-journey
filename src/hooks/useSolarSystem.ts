import { useState, useEffect, useCallback } from 'react';
import { getBodyById, CelestialBody } from '@/data/celestialBodies';

export const useSolarSystem = () => {
  const [date, setDate] = useState(new Date());
  const [selectedBodyId, setSelectedBodyId] = useState<string | null>(null);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showMoons, setShowMoons] = useState(true);
  const [showDwarfPlanets, setShowDwarfPlanets] = useState(true);
  const [useRealisticScale, setUseRealisticScale] = useState(false);
  const [labelSize, setLabelSize] = useState(14);

  // Update selected body when ID changes
  useEffect(() => {
    if (selectedBodyId) {
      const body = getBodyById(selectedBodyId);
      setSelectedBody(body || null);
    } else {
      setSelectedBody(null);
    }
  }, [selectedBodyId]);

  // Animation loop for time progression
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDate(prevDate => {
        // Speed is in "days per tick", interval runs 10 times/sec (every 100ms)
        const msPerDay = 24 * 60 * 60 * 1000;
        const msToAdd = (speed / 10) * msPerDay;
        return new Date(prevDate.getTime() + msToAdd);
      });
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handleSelectBody = useCallback((id: string) => {
    setSelectedBodyId(prevId => prevId === id ? null : id);
  }, []);

  const handleCloseInfo = useCallback(() => {
    setSelectedBodyId(null);
  }, []);

  return {
    date,
    setDate,
    selectedBodyId,
    selectedBody,
    handleSelectBody,
    handleCloseInfo,
    isPlaying,
    setIsPlaying,
    speed,
    setSpeed,
    showOrbits,
    setShowOrbits,
    showMoons,
    setShowMoons,
    showDwarfPlanets,
    setShowDwarfPlanets,
    useRealisticScale,
    setUseRealisticScale,
    labelSize,
    setLabelSize,
  };
};
