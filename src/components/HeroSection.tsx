
import { Link } from "react-router-dom";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

const HeroSection = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
}: HeroSectionProps) => {
  return (
    <div
      className={`py-20 px-4 ${
        backgroundImage
          ? "bg-cover bg-center"
          : "bg-gradient-to-r from-blue-primary to-blue-800"
      }`}
      style={
        backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}
      }
    >
      <div className="container mx-auto text-center">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${backgroundImage ? 'text-white' : 'text-white'}`}>
          {title}
        </h1>
        <p className={`mt-4 text-lg md:text-xl max-w-2xl mx-auto ${backgroundImage ? 'text-white' : 'text-white/90'}`}>
          {subtitle}
        </p>
        {ctaText && ctaLink && (
          <div className="mt-8">
            <Link
              to={ctaLink}
              className="btn-secondary text-lg px-6 py-3"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
