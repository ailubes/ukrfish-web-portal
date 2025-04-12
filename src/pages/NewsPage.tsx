
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import HeroSection from "../components/HeroSection";
import { newsArticles } from "../data/mockData";
import { Search, Filter } from "lucide-react";

const NewsPage = () => {
  const [articles, setArticles] = useState(newsArticles);
  const [filteredArticles, setFilteredArticles] = useState(newsArticles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Get unique categories
  const categories = ["Всі категорії", ...new Set(newsArticles.map((article) => article.category))];

  useEffect(() => {
    let result = articles;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== "Всі категорії") {
      result = result.filter(
        (article) => article.category === selectedCategory
      );
    }
    
    setFilteredArticles(result);
  }, [searchTerm, selectedCategory, articles]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title="Новини та події"
          subtitle="Будьте в курсі останніх подій та новин у рибній галузі України"
        />
        
        {/* Search and Filter */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Пошук за ключовими словами..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="md:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-primary appearance-none bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>
        
        {/* News List */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-600">Нічого не знайдено</h3>
                <p className="mt-2 text-gray-500">Спробуйте змінити параметри пошуку</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    summary={article.summary}
                    imageUrl={article.imageUrl}
                    publishDate={article.publishDate}
                    category={article.category}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewsPage;
