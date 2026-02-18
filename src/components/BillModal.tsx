import { X, Users } from 'lucide-react';
import { useState } from 'react';
import { DbOrderItem, DbOrder, DbTable } from '@/hooks/useWaiterTables';

interface BillModalProps {
  tableData: {
    order: DbOrder | null;
    items: DbOrderItem[];
    table: DbTable | undefined;
    subtotal: number;
    total: number;
  };
  onClose: () => void;
  onCloseTable: () => void;
}

const BillModal = ({ tableData, onClose, onCloseTable }: BillModalProps) => {
  const { items, table, subtotal, total } = tableData;
  const [splitCount, setSplitCount] = useState(1);
  const formatPrice = (price: number) => `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  const perPerson = total / splitCount;

  if (!table) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-card rounded-2xl shadow-2xl z-50 max-h-[80vh] flex flex-col border border-gold/30">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-gold">Conta - Mesa #{table.table_number}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum item no pedido</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex-1">
                  <span className="text-sm text-foreground">{item.quantity}× {item.item_name}</span>
                </div>
                <span className="text-sm text-gold font-medium">
                  {formatPrice(item.item_price * item.quantity)}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-brown-dark rounded-b-2xl border-t border-gold">
          <div className="flex items-center justify-between text-xs text-gold-burnt mb-1">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gold-burnt mb-2">
            <span>Taxa da mesa</span>
            <span>{formatPrice(table.cover_charge)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-foreground font-bold text-lg">TOTAL</span>
            <span className="text-gold text-2xl font-bold">{formatPrice(total)}</span>
          </div>

          {/* Split bill */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-card/20 rounded-xl">
            <Users className="w-5 h-5 text-gold" />
            <span className="text-sm text-foreground flex-1">Dividir em</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                className="w-8 h-8 rounded-full bg-card border border-gold/30 text-gold flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center text-gold font-bold">{splitCount}</span>
              <button
                onClick={() => setSplitCount(splitCount + 1)}
                className="w-8 h-8 rounded-full bg-card border border-gold/30 text-gold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {splitCount > 1 && (
            <div className="flex items-center justify-between mb-4 p-2 bg-gold/10 rounded-lg">
              <span className="text-sm text-foreground">Valor por pessoa</span>
              <span className="text-gold font-bold text-lg">{formatPrice(perPerson)}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gold/30 text-gold font-medium hover:bg-gold/10 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={() => {
                if (confirm('Fechar esta mesa? O pedido será finalizado.')) onCloseTable();
              }}
              className="flex-1 py-3 rounded-xl bg-gold text-primary-foreground font-bold hover:bg-gold-light transition-colors"
            >
              Fechar Mesa
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillModal;
