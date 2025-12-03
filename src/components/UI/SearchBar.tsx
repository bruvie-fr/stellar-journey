import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ALL_BODIES, CelestialBody } from '@/data/celestialBodies';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  onSelect: (id: string) => void;
}

const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isMobile = useIsMobile();

  const groupedBodies = useMemo(() => {
    const groups: Record<string, CelestialBody[]> = {
      star: [],
      planet: [],
      'dwarf-planet': [],
      moon: [],
    };
    
    ALL_BODIES.forEach(body => {
      groups[body.type]?.push(body);
    });
    
    return groups;
  }, []);

  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-start gap-2 bg-background/80 backdrop-blur-lg border-border/50 ${
            isMobile ? 'w-full h-11' : 'w-48'
          }`}
        >
          <Search className="h-4 w-4" />
          <span className="text-muted-foreground">Search planets...</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={`p-0 bg-background/95 backdrop-blur-lg border-border/50 ${
          isMobile ? 'w-[calc(100vw-32px)]' : 'w-64'
        }`}
        align={isMobile ? 'center' : 'start'}
      >
        <Command>
          <CommandInput 
            placeholder="Search celestial bodies..." 
            value={search}
            onValueChange={setSearch}
            className="h-11"
          />
          <CommandList className={isMobile ? 'max-h-[50vh]' : ''}>
            <CommandEmpty>No results found.</CommandEmpty>
            
            <CommandGroup heading="Star">
              {groupedBodies.star.map(body => (
                <CommandItem
                  key={body.id}
                  value={body.name}
                  onSelect={() => handleSelect(body.id)}
                  className={`cursor-pointer ${isMobile ? 'min-h-[44px] py-3' : ''}`}
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: body.color }}
                  />
                  {body.name}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup heading="Planets">
              {groupedBodies.planet.map(body => (
                <CommandItem
                  key={body.id}
                  value={body.name}
                  onSelect={() => handleSelect(body.id)}
                  className={`cursor-pointer ${isMobile ? 'min-h-[44px] py-3' : ''}`}
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: body.color }}
                  />
                  {body.name}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup heading="Dwarf Planets">
              {groupedBodies['dwarf-planet'].map(body => (
                <CommandItem
                  key={body.id}
                  value={body.name}
                  onSelect={() => handleSelect(body.id)}
                  className={`cursor-pointer ${isMobile ? 'min-h-[44px] py-3' : ''}`}
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: body.color }}
                  />
                  {body.name}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup heading="Moons">
              {groupedBodies.moon.map(body => (
                <CommandItem
                  key={body.id}
                  value={body.name}
                  onSelect={() => handleSelect(body.id)}
                  className={`cursor-pointer ${isMobile ? 'min-h-[44px] py-3' : ''}`}
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: body.color }}
                  />
                  {body.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
