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
    orderItems,
    tableNumber,
    setTableNumber,
    addItem,
    removeItem,
    deleteItem,
    total
  } = useOrder();

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = sectionRefs.current[categoryId];
    if (element) {
      const headerOffset = 280;
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
      { rootMargin: '-300px 0px -50% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-sand pb-24">
      <RestaurantHeader 
        tableNumber={tableNumber} 
        onTableChange={setTableNumber} 
      />
      
      <CategoryTabs 
        categories={menuData}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      <main className="px-4 py-4 space-y-8">
        {menuData.map((category) => (
          <section
            key={category.id}
            id={category.id}
            ref={(el: HTMLDivElement | null) => { sectionRefs.current[category.id] = el; }}
          >
            <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.name}
            </h2>
            
            <div className="space-y-3">
              {category.items.map((item) => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onAdd={addItem}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
      
      <BottomTotal total={total} />
      
      <OrderSummary
        items={orderItems}
        total={total}
        onAdd={addItem}
        onRemove={removeItem}
        onDelete={deleteItem}
        isOpen={isOrderOpen}
        onToggle={() => setIsOrderOpen(!isOrderOpen)}
      />
    </div>
  );
};

export default Index;
