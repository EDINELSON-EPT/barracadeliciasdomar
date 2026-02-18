import { useState, useRef, useEffect } from 'react';
import { useMenuData } from '@/hooks/useMenuData';
import logo from '@/assets/logo.jpg';
import CategoryTabs from '@/components/CategoryTabs';
import MenuItemCard from '@/components/MenuItemCard';

const Index = () => {
  const { menuData, isLoading } = useMenuData();
  const [activeCategory, setActiveCategory] = useState('');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (menuData.length > 0 && !activeCategory) {
      setActiveCategory(menuData[0].id);
    }
  }, [menuData, activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = sectionRefs.current[categoryId];
    if (element) {
      const headerOffset = 280;
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
      { rootMargin: '-300px 0px -50% 0px' }
    );
    Object.values(sectionRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [menuData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gold text-lg">Carregando cardápio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 px-4 py-6">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-2 border-gold">
            <img src={logo} alt="Barraca Delícias do Mar" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gold tracking-wide">BARRACA DELÍCIAS DO MAR</h1>
        <div className="w-32 h-1 bg-gold mx-auto mt-3 rounded-full" />
        <p className="text-center text-gold-burnt text-xs mt-2">Cardápio Digital</p>
      </header>

      <CategoryTabs
        categories={menuData.map(c => ({ id: c.id, name: c.name, icon: c.icon, items: c.items.map(i => ({ ...i, id: i.id, category: i.category })) }))}
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
            <h2 className="text-xl font-bold text-gold mb-4 flex items-center gap-2">
              <span>{category.icon}</span>
              {category.name}
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-card rounded-xl p-4 border border-border">
                  <div className="flex-1 min-w-0 mr-3">
                    <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                    {item.description && <p className="text-gold-burnt text-xs mt-0.5">{item.description}</p>}
                    <p className="text-gold font-bold text-sm mt-1">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <div className="text-center mt-8 pb-4">
        <p className="text-gold-burnt text-xs">Aceitamos Pix e Cartão</p>
        <p className="text-gold-burnt text-xs">Agradecemos a preferência! 🐟</p>
        <a href="/login" className="text-gold/40 text-xs mt-4 block hover:text-gold transition-colors">
          Área do Garçom →
        </a>
      </div>
    </div>
  );
};

export default Index;
