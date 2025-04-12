
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import NewsCard from "../components/NewsCard";
import { newsArticles, members } from "../data/mockData";

const HomePage = () => {
  const [latestNews, setLatestNews] = useState(newsArticles.slice(0, 3));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title="ГС "Риба України""
          subtitle="Об'єднуємо професіоналів рибної галузі для сталого розвитку та вирішення спільних завдань"
          ctaText="Приєднатися"
          ctaLink="/members"
          backgroundImage="https://images.pexels.com/photos/9899333/pexels-photo-9899333.jpeg"
        />

        {/* Latest News Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="section-title">Останні новини</h2>
              <Link
                to="/news"
                className="text-blue-primary hover:text-blue-800 flex items-center"
              >
                Всі новини <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestNews.map((news) => (
                <NewsCard
                  key={news.id}
                  id={news.id}
                  title={news.title}
                  summary={news.summary}
                  imageUrl={news.imageUrl}
                  publishDate={news.publishDate}
                  category={news.category}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="section-title text-center mx-auto">Наша місія</h2>
              <p className="text-gray-text mb-8">
                ГС "Риба України" створена для консолідації зусиль підприємств
                та організацій рибної галузі з метою захисту їх інтересів,
                розвитку рибного господарства України та забезпечення населення
                якісною рибною продукцією.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-blue-primary mb-2">Захист</h3>
                  <p className="text-sm text-gray-text">
                    Захист інтересів підприємств рибної галузі на державному
                    рівні
                  </p>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-blue-primary mb-2">Розвиток</h3>
                  <p className="text-sm text-gray-text">
                    Сприяння сталому розвитку рибного господарства України
                  </p>
                </div>
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-blue-primary mb-2">Якість</h3>
                  <p className="text-sm text-gray-text">
                    Підвищення якості та конкурентоспроможності української
                    рибної продукції
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Members */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="section-title">Наші члени</h2>
              <Link
                to="/members"
                className="text-blue-primary hover:text-blue-800 flex items-center"
              >
                Всі члени <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {members.map((member) => (
                <div key={member.id} className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={member.logo}
                    alt={member.name}
                    className="w-16 h-16 mx-auto mb-2 rounded-full object-cover"
                  />
                  <h3 className="text-sm font-bold text-blue-primary">
                    {member.name}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    member.membershipType === "Premium" 
                      ? "bg-yellow-accent text-blue-800" 
                      : member.membershipType === "Standard"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {member.membershipType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-primary to-blue-800 text-white text-center">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Приєднуйтесь до ГС "Риба України"
            </h2>
            <p className="mb-8 text-white/90">
              Станьте частиною найбільшого об'єднання професіоналів рибної галузі
              в Україні та отримайте доступ до унікальних можливостей для
              розвитку вашого бізнесу.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/members" className="btn-secondary">
                Переглянути переваги членства
              </Link>
              <Link to="/login" className="btn-outline bg-transparent text-white border-white hover:bg-white/10">
                Увійти в кабінет
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
