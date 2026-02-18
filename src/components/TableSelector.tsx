import { Plus, X } from 'lucide-react';
import { TableOrder } from '@/hooks/useOrder';

interface TableSelectorProps {
  tables: TableOrder[];
  activeTableIndex: number | null;
  onSelectTable: (index: number) => void;
  onAddTable: (tableNumber: string) => void;
  onRemoveTable: (index: number) => void;
}

const TableSelector = ({ 
  tables, 
  activeTableIndex, 
  onSelectTable, 
  onAddTable,
  onRemoveTable 
}: TableSelectorProps) => {
  
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
      {tables.map((table, index) => (
        <div 
          key={index}
          className={`
            relative flex items-center gap-1 px-3 py-2 rounded-full cursor-pointer
            transition-all duration-200 border
            ${activeTableIndex === index 
              ? 'bg-gold text-primary-foreground border-gold shadow-md' 
              : 'bg-card text-gold border-gold/50 hover:border-gold'
            }
          `}
          onClick={() => onSelectTable(index)}
        >
          <span className="text-sm font-bold">Mesa #{table.tableNumber}</span>
          {table.items.length > 0 && (
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full ml-1
              ${activeTableIndex === index 
                ? 'bg-primary-foreground/20 text-primary-foreground' 
                : 'bg-gold/20 text-gold'
              }
            `}>
              {table.items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Remover Mesa #${table.tableNumber}?`)) {
                onRemoveTable(index);
              }
            }}
            className={`
              ml-1 w-5 h-5 rounded-full flex items-center justify-center
              transition-colors
              ${activeTableIndex === index 
                ? 'hover:bg-primary-foreground/20' 
                : 'hover:bg-gold/20'
              }
            `}
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

export default TableSelector;
