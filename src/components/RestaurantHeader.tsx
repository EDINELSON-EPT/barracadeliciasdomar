import logo from '@/assets/logo.jpg';

interface RestaurantHeaderProps {
  tableNumber: string;
  onTableChange: (table: string) => void;
}

const RestaurantHeader = ({ tableNumber, onTableChange }: RestaurantHeaderProps) => {
  return (
    <header className="bg-sand sticky top-0 z-10 px-4 py-6">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg bg-card">
          <img 
            src={logo} 
            alt="Barraca Delícias do Mar" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-navy tracking-wide">
        BARRACA DELÍCIAS DO MAR
      </h1>
      
      {/* Divider */}
      <div className="w-32 h-1 bg-gold mx-auto mt-3 rounded-full" />
      
      {/* Table selector */}
      <div className="flex items-center justify-center gap-4 mt-5">
        <button 
          onClick={() => {
            const newTable = prompt('Digite o número da mesa:', tableNumber);
            if (newTable !== null) onTableChange(newTable);
          }}
          className="text-sm font-medium text-navy hover:text-gold transition-colors"
        >
          ADICIONAR MESA +
        </button>
        
        {tableNumber && (
          <div className="bg-card px-4 py-2 rounded-full shadow-md border border-border">
            <span className="text-sm font-bold text-navy">MESA # {tableNumber}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default RestaurantHeader;
