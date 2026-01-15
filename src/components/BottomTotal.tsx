interface BottomTotalProps {
  total: number;
  tableNumber?: string;
}

const BottomTotal = ({ total, tableNumber }: BottomTotalProps) => {
  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brown-dark border-t border-gold p-4 z-10">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-foreground font-medium">TOTAL</span>
          {tableNumber && (
            <span className="text-gold-burnt text-xs ml-2">(Mesa #{tableNumber})</span>
          )}
        </div>
        <span className="text-gold text-2xl font-bold">{formatPrice(total)}</span>
      </div>
      <p className="text-gold-burnt text-xs text-center mt-1">
        Aceitamos Pix e Cartão. Agradecemos a preferência!
      </p>
    </div>
  );
};

export default BottomTotal;
