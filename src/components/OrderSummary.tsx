import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { OrderItem } from '@/hooks/useOrder';

interface OrderSummaryProps {
  items: OrderItem[];
  total: number;
  onAdd: (item: OrderItem) => void;
  onRemove: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const OrderSummary = ({ items, total, onAdd, onRemove, onDelete, isOpen, onToggle }: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={onToggle}
        className="fixed bottom-24 right-4 w-14 h-14 bg-navy text-primary-foreground rounded-full shadow-xl flex items-center justify-center z-20 hover:bg-navy-light transition-colors"
      >
        <ShoppingBag className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-gold text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Order panel */}
      <div className={`fixed inset-x-0 bottom-0 bg-card rounded-t-3xl shadow-2xl transition-transform duration-300 z-30 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-4 max-h-[70vh] flex flex-col">
          {/* Handle */}
          <button onClick={onToggle} className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
          
          <h2 className="text-lg font-bold text-navy mb-4">Seu Pedido</h2>
          
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum item adicionado ainda
            </p>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{formatPrice(item.price)} cada</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="w-7 h-7 bg-muted rounded-full flex items-center justify-center hover:bg-border transition-colors"
                    >
                      <Minus className="w-4 h-4 text-foreground" />
                    </button>
                    
                    <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                    
                    <button
                      onClick={() => onAdd(item)}
                      className="w-7 h-7 bg-gold rounded-full flex items-center justify-center hover:bg-gold-light transition-colors"
                    >
                      <Plus className="w-4 h-4 text-accent-foreground" />
                    </button>
                    
                    <button
                      onClick={() => onDelete(item.id)}
                      className="w-7 h-7 bg-destructive/10 rounded-full flex items-center justify-center hover:bg-destructive/20 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Total footer */}
        <div className="bg-navy p-4 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-primary-foreground font-medium">TOTAL:</span>
            <span className="text-gold text-2xl font-bold">{formatPrice(total)}</span>
          </div>
          <p className="text-primary-foreground/70 text-xs text-center">
            Aceitamos Pix e Cartão.
          </p>
          <p className="text-primary-foreground/70 text-xs text-center">
            Agradecemos a preferência!
          </p>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/30 z-20"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default OrderSummary;
