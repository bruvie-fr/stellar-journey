import SolarSystemScene from '@/components/SolarSystem/Scene';
import InfoPanel from '@/components/UI/InfoPanel';
import TimeControls from '@/components/UI/TimeControls';
import ControlPanel from '@/components/UI/ControlPanel';
import SearchBar from '@/components/UI/SearchBar';
import { useSolarSystem } from '@/hooks/useSolarSystem';

const Index = () => {
  const {
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
  } = useSolarSystem();

  return (
    <div className="relative w-screen h-screen bg-[#0a0a1a] overflow-hidden">
      {/* 3D Scene */}
      <SolarSystemScene
        date={date}
        selectedBodyId={selectedBodyId}
        onSelectBody={handleSelectBody}
        useRealisticScale={useRealisticScale}
        showOrbits={showOrbits}
        showMoons={showMoons}
        showDwarfPlanets={showDwarfPlanets}
      />
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            Solar System Explorer
          </h1>
          <p className="text-sm text-white/60">
            Interactive 3D visualization
          </p>
        </div>
        
        <div className="flex items-center gap-2 pointer-events-auto">
          <SearchBar onSelect={handleSelectBody} />
          <ControlPanel
            showOrbits={showOrbits}
            setShowOrbits={setShowOrbits}
            showMoons={showMoons}
            setShowMoons={setShowMoons}
            showDwarfPlanets={showDwarfPlanets}
            setShowDwarfPlanets={setShowDwarfPlanets}
            useRealisticScale={useRealisticScale}
            setUseRealisticScale={setUseRealisticScale}
          />
        </div>
      </header>
      
      {/* Time Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <TimeControls
          date={date}
          setDate={setDate}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
        />
      </div>
      
      {/* Info Panel */}
      {selectedBody && (
        <div className="absolute top-20 right-4 pointer-events-auto animate-fade-in">
          <InfoPanel
            body={selectedBody}
            date={date}
            onClose={handleCloseInfo}
          />
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-20 left-4 text-xs text-white/40 space-y-1">
        <p>🖱️ Click & drag to rotate view</p>
        <p>🔍 Scroll to zoom</p>
        <p>👆 Click on planets to view info</p>
      </div>
    </div>
  );
};

export default Index;
