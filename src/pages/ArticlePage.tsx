
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { newsArticles } from "../data/mockData";
import { Calendar, User, Tag, ArrowLeft, Facebook, Send } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(newsArticles.find(a => a.id === id));
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    if (article) {
      // Find related articles based on category or tags
      const related = newsArticles
        .filter(a => a.id !== article.id && 
          (a.category === article.category || 
           a.tags.some(tag => article.tags.includes(tag))))
        .slice(0, 3);
      
      setRelatedArticles(related);
    }
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Статтю не знайдено</h1>
            <p className="mb-8">Можливо, вона була видалена або переміщена.</p>
            <Link to="/news" className="btn-primary">
              Повернутися до новин
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Article Header */}
        <div className="bg-blue-primary text-white py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Link to="/news" className="inline-flex items-center text-white/80 hover:text-white mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Повернутися до новин
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{article.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{format(article.publishDate, "d MMMM yyyy", { locale: uk })}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <Tag size={16} className="mr-1" />
                <span>{article.category}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div 
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Share */}
            <div className="border-t border-b py-4 my-8">
              <div className="flex items-center">
                <span className="mr-4 font-medium">Поділитися:</span>
                <div className="flex gap-2">
                  <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <Facebook size={16} />
                  </a>
                  <a href="#" className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition-colors">
                    <Send size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="py-12 px-4 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
              <h2 className="section-title mb-8">Схожі статті</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <div key={related.id} className="card">
                    <Link to={`/article/${related.id}`}>
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    <div className="p-4">
                      <Link 
                        to={`/article/${related.id}`}
                        className="text-lg font-bold text-blue-primary hover:text-blue-800 block mb-2"
                      >
                        {related.title}
                      </Link>
                      <p className="text-gray-text text-sm line-clamp-2 mb-4">
                        {related.summary}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          {format(related.publishDate, "d MMMM yyyy", { locale: uk })}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                          {related.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticlePage;
