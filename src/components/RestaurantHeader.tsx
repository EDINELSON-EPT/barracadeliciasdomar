import logo from '@/assets/logo.jpg';
import TableSelector from './TableSelector';
import { TableOrder } from '@/hooks/useOrder';

interface RestaurantHeaderProps {
  tables: TableOrder[];
  activeTableIndex: number | null;
  onSelectTable: (index: number) => void;
  onAddTable: (tableNumber: string) => void;
  onRemoveTable: (index: number) => void;
}

const RestaurantHeader = ({ 
  tables, 
  activeTableIndex, 
  onSelectTable, 
  onAddTable,
  onRemoveTable 
}: RestaurantHeaderProps) => {
  return (
    <header className="bg-background sticky top-0 z-10 px-4 py-6">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-gold">
          <img 
            src={logo} 
            alt="Barraca Delícias do Mar" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-gold tracking-wide">
        BARRACA DELÍCIAS DO MAR
      </h1>
      
      {/* Divider */}
      <div className="w-32 h-1 bg-gold mx-auto mt-3 rounded-full" />
      
      {/* Table selector */}
      <div className="mt-5">
        <TableSelector
          tables={tables}
          activeTableIndex={activeTableIndex}
          onSelectTable={onSelectTable}
          onAddTable={onAddTable}
          onRemoveTable={onRemoveTable}
        />
      </div>
    </header>
  );
};

export default RestaurantHeader;
