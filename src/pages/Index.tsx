import SolarSystemScene from '@/components/SolarSystem/Scene';
import InfoPanel from '@/components/UI/InfoPanel';
import TimeControls from '@/components/UI/TimeControls';
import ControlPanel from '@/components/UI/ControlPanel';
import SearchBar from '@/components/UI/SearchBar';
import SunlitRegions from '@/components/UI/SunlitRegions';
import { useSolarSystem } from '@/hooks/useSolarSystem';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X, Info } from 'lucide-react';
import { useState } from 'react';

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
    labelSize,
    setLabelSize,
  } = useSolarSystem();
  
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSunlitRegions, setShowSunlitRegions] = useState(!isMobile);

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
        labelSize={labelSize}
      />
      
      {/* Header - Mobile Optimized */}
      <header className="absolute top-0 left-0 right-0 p-3 md:p-4 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto">
          <h1 className={`font-bold text-white tracking-wider ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            Solar System Explorer
          </h1>
          {!isMobile && (
            <p className="text-sm text-white/60">
              Interactive 3D visualization
            </p>
          )}
        </div>
        
        {/* Desktop Controls */}
        {!isMobile && (
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
              labelSize={labelSize}
              setLabelSize={setLabelSize}
            />
          </div>
        )}
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="flex items-center gap-2 pointer-events-auto">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-background/80 backdrop-blur-lg border-border/50"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] bg-background/95 backdrop-blur-xl p-4">
                <div className="space-y-6 mt-6">
                  <SearchBar onSelect={(id) => {
                    handleSelectBody(id);
                    setMobileMenuOpen(false);
                  }} />
                  
                  <ControlPanel
                    showOrbits={showOrbits}
                    setShowOrbits={setShowOrbits}
                    showMoons={showMoons}
                    setShowMoons={setShowMoons}
                    showDwarfPlanets={showDwarfPlanets}
                    setShowDwarfPlanets={setShowDwarfPlanets}
                    useRealisticScale={useRealisticScale}
                    setUseRealisticScale={setUseRealisticScale}
                    labelSize={labelSize}
                    setLabelSize={setLabelSize}
                    isMobile
                  />
                  
                  <div className="pt-4 border-t border-border/30">
                    <SunlitRegions date={date} isMobile />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </header>
      
      {/* Time Controls - Responsive */}
      <div className={`absolute ${isMobile ? 'bottom-2 left-2 right-2' : 'bottom-4 left-1/2 -translate-x-1/2'} pointer-events-auto z-10`}>
        <TimeControls
          date={date}
          setDate={setDate}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
          isMobile={isMobile}
        />
      </div>
      
      {/* Info Panel - Desktop */}
      {selectedBody && !isMobile && (
        <div className="absolute top-20 right-4 pointer-events-auto animate-fade-in z-10">
          <InfoPanel
            body={selectedBody}
            date={date}
            onClose={handleCloseInfo}
          />
        </div>
      )}
      
      {/* Info Panel - Mobile (Bottom Sheet) */}
      {selectedBody && isMobile && (
        <Sheet open={!!selectedBody} onOpenChange={(open) => !open && handleCloseInfo()}>
          <SheetContent side="bottom" className="h-[70vh] bg-background/95 backdrop-blur-xl rounded-t-2xl">
            <InfoPanel
              body={selectedBody}
              date={date}
              onClose={handleCloseInfo}
              isMobile
            />
          </SheetContent>
        </Sheet>
      )}
      
      {/* Sunlit Regions Panel - Desktop */}
      {!isMobile && (
        <div className="absolute top-20 left-4 pointer-events-auto z-10">
          {showSunlitRegions ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 bg-background/80 rounded-full z-10"
                onClick={() => setShowSunlitRegions(false)}
              >
                <X className="h-3 w-3" />
              </Button>
              <SunlitRegions date={date} />
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-lg border-border/50"
              onClick={() => setShowSunlitRegions(true)}
            >
              <Info className="h-4 w-4 mr-2" />
              Sunlit Regions
            </Button>
          )}
        </div>
      )}
      
      {/* Instructions - Desktop Only */}
      {!isMobile && (
        <div className="absolute bottom-20 left-4 text-xs text-white/40 space-y-1 pointer-events-none">
          <p>🖱️ Click & drag to rotate view</p>
          <p>🔍 Scroll to zoom</p>
          <p>👆 Click on planets to view info</p>
        </div>
      )}
    </div>
  );
};

export default Index;
