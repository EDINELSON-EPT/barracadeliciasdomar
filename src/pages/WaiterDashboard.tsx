import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMenuData } from '@/hooks/useMenuData';
import { useWaiterTables } from '@/hooks/useWaiterTables';
import logo from '@/assets/logo.jpg';
import WaiterTableSelector from '@/components/WaiterTableSelector';
import CategoryTabs from '@/components/CategoryTabs';
import WaiterMenuItemCard from '@/components/WaiterMenuItemCard';
import WaiterOrderSummary from '@/components/WaiterOrderSummary';
import BottomTotal from '@/components/BottomTotal';
import BillModal from '@/components/BillModal';
import { LogOut, Receipt } from 'lucide-react';

const WaiterDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { menuData, isLoading: menuLoading } = useMenuData();
  const {
    tables, activeTableId, activeTable, activeOrderItems,
    loading: tablesLoading, openTable, closeTable, setActiveTableId,
    addItemToOrder, removeItemFromOrder, deleteItemFromOrder,
    subtotal, total, coverCharge, getTableOrder,
  } = useWaiterTables();

  const [activeCategory, setActiveCategory] = useState('');
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [billTableId, setBillTableId] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (menuData.length > 0 && !activeCategory) {
      setActiveCategory(menuData[0].id);
    }
  }, [menuData, activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = sectionRefs.current[categoryId];
    if (element) {
      const headerOffset = 380;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCategory(entry.target.id);
        });
      },
      { rootMargin: '-400px 0px -50% 0px' }
    );
    Object.values(sectionRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [menuData]);

  if (authLoading || menuLoading || tablesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gold text-lg">Carregando...</div>
      </div>
    );
  }

  const canAddItems = activeTableId !== null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gold">DELÍCIAS DO MAR</h1>
              <p className="text-gold-burnt text-xs">Painel do Garçom</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTableId && (
              <button
                onClick={() => setBillTableId(activeTableId)}
                className="p-2 rounded-full bg-card border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                title="Gerar conta"
              >
                <Receipt className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={async () => { await signOut(); navigate('/login'); }}
              className="p-2 rounded-full bg-card border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <WaiterTableSelector
          tables={tables}
          activeTableId={activeTableId}
          onSelectTable={setActiveTableId}
          onAddTable={openTable}
          onCloseTable={closeTable}
          onViewBill={setBillTableId}
        />
      </header>

      <CategoryTabs
        categories={menuData.map(c => ({ id: c.id, name: c.name, icon: c.icon, items: c.items.map(i => ({ ...i, category: i.category })) }))}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {!canAddItems && (
        <div className="mx-4 mt-4 p-4 bg-card rounded-xl border border-gold/30 text-center">
          <p className="text-gold-burnt text-sm">👆 Abra uma mesa para começar o pedido</p>
        </div>
      )}

      <main className="px-4 py-4 space-y-8">
        {menuData.map((category) => (
          <section
            key={category.id}
            id={category.id}
            ref={(el: HTMLDivElement | null) => { sectionRefs.current[category.id] = el; }}
          >
            <h2 className="text-xl font-bold text-gold mb-4 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.name}
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <WaiterMenuItemCard
                  key={item.id}
                  item={item}
                  onAdd={() => addItemToOrder({ id: item.id, name: item.name, price: item.price })}
                  disabled={!canAddItems}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {canAddItems && (
        <>
          <BottomTotal total={total} tableFee={coverCharge} tableNumber={activeTable?.table_number} />
          <WaiterOrderSummary
            items={activeOrderItems}
            total={total}
            subtotal={subtotal}
            tableFee={coverCharge}
            tableNumber={activeTable?.table_number}
            onRemove={removeItemFromOrder}
            onDelete={deleteItemFromOrder}
            isOpen={isOrderOpen}
            onToggle={() => setIsOrderOpen(!isOrderOpen)}
          />
        </>
      )}

      {billTableId && (
        <BillModal
          tableData={getTableOrder(billTableId)}
          onClose={() => setBillTableId(null)}
          onCloseTable={() => { closeTable(billTableId); setBillTableId(null); }}
        />
      )}
    </div>
  );
};

export default WaiterDashboard;
