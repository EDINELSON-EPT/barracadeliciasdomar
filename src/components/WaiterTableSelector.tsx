import { Plus, X, Receipt } from 'lucide-react';
import { DbTable } from '@/hooks/useWaiterTables';

interface WaiterTableSelectorProps {
  tables: DbTable[];
  activeTableId: string | null;
  onSelectTable: (id: string) => void;
  onAddTable: (tableNumber: string) => void;
  onCloseTable: (id: string) => void;
  onViewBill: (id: string) => void;
}

const WaiterTableSelector = ({
  tables, activeTableId, onSelectTable, onAddTable, onCloseTable, onViewBill
}: WaiterTableSelectorProps) => {
  const handleAddTable = () => {
    const tableNumber = prompt('Digite o número da nova mesa:');
    if (!tableNumber) return;
    const sanitized = tableNumber.trim();
    if (!/^[a-zA-Z0-9]{1,10}$/.test(sanitized)) {
      alert('Número da mesa deve conter apenas letras e números (máximo 10 caracteres)');
      return;
    }
    onAddTable(sanitized);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {tables.map((table) => (
        <div
          key={table.id}
          className={`
            relative flex items-center gap-1 px-3 py-2 rounded-full cursor-pointer
            transition-all duration-200 border
            ${activeTableId === table.id
              ? 'bg-gold text-primary-foreground border-gold shadow-md'
              : 'bg-card text-gold border-gold/50 hover:border-gold'
            }
          `}
          onClick={() => onSelectTable(table.id)}
        >
          <span className="text-sm font-bold">Mesa #{table.table_number}</span>
          
          <button
            onClick={(e) => { e.stopPropagation(); onViewBill(table.id); }}
            className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center transition-colors
              ${activeTableId === table.id ? 'hover:bg-primary-foreground/20' : 'hover:bg-gold/20'}`}
            title="Ver conta"
          >
            <Receipt className="w-3 h-3" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Fechar Mesa #${table.table_number}?`)) onCloseTable(table.id);
            }}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors
              ${activeTableId === table.id ? 'hover:bg-primary-foreground/20' : 'hover:bg-gold/20'}`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      <button
        onClick={handleAddTable}
        className="flex items-center gap-1 px-4 py-2 rounded-full bg-card border border-dashed border-gold/50 text-gold hover:border-gold hover:bg-gold/10 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Nova Mesa</span>
      </button>
    </div>
  );
};

export default WaiterTableSelector;
