import { useState, useRef, useEffect } from 'react';
import { menuData } from '@/data/menuData';
import { useOrder } from '@/hooks/useOrder';
import RestaurantHeader from '@/components/RestaurantHeader';
import CategoryTabs from '@/components/CategoryTabs';
import MenuItemCard from '@/components/MenuItemCard';
import OrderSummary from '@/components/OrderSummary';
import BottomTotal from '@/components/BottomTotal';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState(menuData[0].id);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const {
    tables,
    activeTableIndex,
    activeTable,
    orderItems,
    addTable,
    removeTable,
    selectTable,
    addItem,
    removeItem,
    deleteItem,
    total
  } = useOrder();

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = sectionRefs.current[categoryId];
    if (element) {
      const headerOffset = 320;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Intersection observer for auto-selecting category
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-340px 0px -50% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const canAddItems = activeTableIndex !== null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <RestaurantHeader 
        tables={tables}
        activeTableIndex={activeTableIndex}
        onSelectTable={selectTable}
        onAddTable={addTable}
        onRemoveTable={removeTable}
      />
      
      <CategoryTabs 
        categories={menuData}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {!canAddItems && (
        <div className="mx-4 mt-4 p-4 bg-card rounded-xl border border-gold/30 text-center">
          <p className="text-gold-burnt text-sm">
            👆 Adicione uma mesa para começar o pedido
          </p>
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
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onAdd={addItem}
                  disabled={!canAddItems}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
      
      {canAddItems && (
        <>
          <BottomTotal total={total} tableNumber={activeTable?.tableNumber} />
          
          <OrderSummary
            items={orderItems}
            total={total}
            tableNumber={activeTable?.tableNumber}
            onAdd={addItem}
            onRemove={removeItem}
            onDelete={deleteItem}
            isOpen={isOrderOpen}
            onToggle={() => setIsOrderOpen(!isOrderOpen)}
          />
        </>
      )}
    </div>
  );
};

export default Index;
