
import { Book, Shield, Award, Users, Globe } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          title={'Про ГС "Риба України"'}
          subtitle="Національна асоціація виробників продукції аквакультури та рибальства"
        />

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="section-title text-center mx-auto mb-10">Наша місія</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-text mb-6">
                Наша асоціація утворена з метою сприяння державі Україна в забезпеченні її продовольчої безпеки та незалежності в секторі рибопродукції. Ми спрямовуємо свою діяльність на проведення необхідних законодавчих, фінансових та інституційних перетворень, впровадження організаційних заходів для сталого розвитку рибогосподарських підприємств.
              </p>
              <p className="text-gray-text mb-6">
                Вітаємо вас на офіційному сайті Національної асоціації виробників продукції аквакультури та рибальства "Риба України"! Наша організація створена з метою сприяння державі Україна в забезпеченні продовольчої безпеки та незалежності в секторі рибопродукції.
              </p>
              <p className="text-gray-text">
                Ми спрямовуємо свою діяльність на проведення необхідних законодавчих, фінансових та інституційних перетворень, впровадження організаційних заходів для сталого розвитку рибогосподарських підприємств, а також захист прав та інтересів працівників галузі.
              </p>
            </div>
          </div>
        </section>

        {/* Key Areas Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="section-title text-center mx-auto mb-12">Ключові напрямки діяльності</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-blue-primary mr-3" />
                  <h3 className="text-xl font-bold text-blue-primary">Законодавча та фінансова підтримка</h3>
                </div>
                <p className="text-gray-text">
                  Ініціювання та супровід прийняття актів, розробка програм державної допомоги для рибогосподарських підприємств.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Award className="h-8 w-8 text-blue-primary mr-3" />
                  <h3 className="text-xl font-bold text-blue-primary">Інституційні перетворення</h3>
                </div>
                <p className="text-gray-text">
                  Участь у формуванні державної політики, сприяння реформуванню системи управління у рибній галузі.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-blue-primary mr-3" />
                  <h3 className="text-xl font-bold text-blue-primary">Захист прав та інтересів</h3>
                </div>
                <p className="text-gray-text">
                  Представництво на державному та міжнародному рівнях, надання юридичної допомоги членам асоціації.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Book className="h-8 w-8 text-blue-primary mr-3" />
                  <h3 className="text-xl font-bold text-blue-primary">Освітня та наукова діяльність</h3>
                </div>
                <p className="text-gray-text">
                  Організація конференцій, семінарів, проведення досліджень щодо утвердження принципів балансу економічної доцільності та соціальної справедливості.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Globe className="h-8 w-8 text-blue-primary mr-3" />
                  <h3 className="text-xl font-bold text-blue-primary">Міжнародне співробітництво</h3>
                </div>
                <p className="text-gray-text">
                  Налагодження партнерств, обмін досвідом, представлення інтересів України та сприяння розвитку міжнародного права у сфері рибальства.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-blue-primary mr-3" />
                  <h3 className="text-xl font-bold text-blue-primary">Екологічна сталість</h3>
                </div>
                <p className="text-gray-text">
                  Забезпечення екологічно сталого та відповідального управління рибними ресурсами.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-blue-50 border-l-4 border-blue-primary p-8 rounded-lg">
              <blockquote className="text-xl text-gray-text italic">
                <p className="mb-4">Запрошуємо рибогосподарські підприємства, науковців, експертів та всіх зацікавлених осіб приєднуватись до нашої спільноти. Разом ми зможемо досягти значних позитивних змін у рибному секторі України.</p>
                <cite className="font-medium text-blue-primary block text-right">Сила в єдності!</cite>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Message from Chairman */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="section-title text-center mx-auto mb-10">Звернення голови</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-gray-text mb-6">
                Запрошуємо вас до співпраці та членства в нашій асоціації. Разом ми зможемо посилити продовольчу безпеку України та сприяти сталому розвитку вітчизняної рибної галузі.
              </p>
              <div className="text-right">
                <p className="text-gray-text">З повагою,</p>
                <p className="font-bold text-blue-primary">Любомир Гайдамака</p>
                <p className="text-gray-text">Голова спілки "Риба України"</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-primary to-blue-800 text-white text-center">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Приєднуйтесь до нас
            </h2>
            <p className="mb-8 text-white/90">
              Керуючись принципами балансу економічної доцільності та соціальної справедливості, ми прагнемо до побудови громадянського суспільства та сприяння розвитку рибної галузі в Україні.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/members" className="btn-secondary">
                Стати членом асоціації
              </a>
              <a
                href="mailto:info@ukrfish.org"
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

export default AboutPage;
