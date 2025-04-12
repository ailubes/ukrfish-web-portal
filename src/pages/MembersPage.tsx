import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { membershipPlans, members } from "../data/mockData";
import { Check, ChevronRight } from "lucide-react";

const MembersPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title={'Членство в ГС "Риба України"'}
          subtitle="Приєднуйтесь до найбільшого об'єднання професіоналів рибної галузі в Україні та отримайте доступ до унікальних можливостей для розвитку вашого бізнесу"
        />

        {/* Membership Benefits */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="section-title text-center mx-auto mb-12">
              Переваги членства
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-primary mb-3">
                  Захист інтересів
                </h3>
                <p className="text-gray-text">
                  Представництво та захист інтересів членів асоціації на
                  державному рівні та в галузевих організаціях.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-primary mb-3">
                  Професійний розвиток
                </h3>
                <p className="text-gray-text">
                  Доступ до навчальних програм, семінарів та конференцій для
                  підвищення кваліфікації та обміну досвідом.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-primary mb-3">
                  Нетворкінг
                </h3>
                <p className="text-gray-text">
                  Можливість встановлення нових ділових контактів та партнерств
                  з ключовими гравцями ринку.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Plans */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="section-title text-center mx-auto mb-12">
              Тарифні плани
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {membershipPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                    plan.isPopular
                      ? "border-2 border-yellow-accent relative"
                      : ""
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-yellow-accent text-blue-primary px-4 py-1 text-sm font-medium">
                      Популярний
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-blue-primary mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline mb-6">
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price > 0
                          ? `${plan.price.toLocaleString()} грн`
                          : "Безкоштовно"}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-500 ml-1">
                          {plan.duration}
                        </span>
                      )}
                    </div>
                    <ul className="mb-6 space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check
                            size={16}
                            className="text-blue-primary mr-2 mt-1 flex-shrink-0"
                          />
                          <span className="text-gray-text text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full rounded-md py-2 px-4 font-medium transition-colors ${
                        selectedPlan === plan.id
                          ? "bg-blue-primary text-white"
                          : plan.isPopular
                          ? "bg-yellow-accent text-blue-primary hover:bg-yellow-400"
                          : "bg-gray-100 text-blue-primary hover:bg-gray-200"
                      }`}
                    >
                      {selectedPlan === plan.id
                        ? "Обрано"
                        : "Обрати тариф"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Members */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="section-title text-center mx-auto mb-12">
              Наші учасники
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={member.logo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-blue-primary">
                        {member.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          member.membershipType === "Premium"
                            ? "bg-yellow-accent text-blue-800"
                            : member.membershipType === "Standard"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.membershipType}
                      </span>
                    </div>
                    <p className="text-gray-text text-sm mb-4">
                      {member.description}
                    </p>
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-primary hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        Відвідати сайт <ChevronRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-primary to-blue-800 text-white text-center">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Готові приєднатися?
            </h2>
            <p className="mb-8 text-white/90 max-w-2xl mx-auto">
              Заповніть форму заявки на членство, і наш представник зв'яжеться з
              вами протягом 2 робочих днів для уточнення деталей.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="#" className="btn-secondary">
                Подати заявку
              </a>
              <a
                href="mailto:membership@ukrfish.org"
                className="btn-outline bg-transparent text-white border-white hover:bg-white/10"
              >
                Зв'язатися з нами
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MembersPage;
