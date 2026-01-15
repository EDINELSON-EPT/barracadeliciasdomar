import { Plus } from 'lucide-react';
import { MenuItem } from '@/data/menuData';

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const MenuItemCard = ({ item, onAdd }: MenuItemCardProps) => {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center justify-between gap-3 transition-all hover:shadow-md">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-sm truncate">{item.name}</h3>
        {item.description && (
          <p className="text-xs text-gold mt-1 truncate">{item.description}</p>
        )}
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-bold text-navy text-sm whitespace-nowrap">
          {formatPrice(item.price)}
        </span>
        <button
          onClick={() => onAdd(item)}
          className="w-8 h-8 bg-gold text-accent-foreground rounded-full flex items-center justify-center hover:bg-gold-light transition-colors shadow-sm"
          aria-label={`Adicionar ${item.name}`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
