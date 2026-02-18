interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

interface CategoryTabsProps {
  categories: CategoryItem[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  return (
    <div className="bg-brown-chocolate sticky top-[220px] z-10 px-2 py-3 overflow-x-auto">
      <div className="flex gap-2 min-w-max justify-start px-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 whitespace-nowrap
              ${activeCategory === category.id
                ? 'bg-gold text-primary-foreground shadow-md'
                : 'bg-card text-gold hover:bg-muted'
              }
            `}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
