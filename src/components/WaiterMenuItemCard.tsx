import { Plus } from 'lucide-react';
import { DbMenuItem } from '@/hooks/useMenuData';

interface WaiterMenuItemCardProps {
  item: DbMenuItem;
  onAdd: () => void;
  disabled?: boolean;
}

const WaiterMenuItemCard = ({ item, onAdd, disabled }: WaiterMenuItemCardProps) => {
  const formatPrice = (price: number) => `R$ ${Number(price).toFixed(2).replace('.', ',')}`;

  return (
    <div className="flex items-center justify-between bg-card rounded-xl p-4 border border-border hover:border-gold/30 transition-colors">
      <div className="flex-1 min-w-0 mr-3">
        <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
        {item.description && (
          <p className="text-gold-burnt text-xs mt-0.5">{item.description}</p>
        )}
        <p className="text-gold font-bold text-sm mt-1">{formatPrice(item.price)}</p>
      </div>
      <button
        onClick={onAdd}
        disabled={disabled}
        className="flex-shrink-0 w-9 h-9 bg-gold text-primary-foreground rounded-full flex items-center justify-center hover:bg-gold-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export default WaiterMenuItemCard;
