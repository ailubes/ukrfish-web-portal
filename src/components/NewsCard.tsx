
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { uk } from "date-fns/locale";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  publishDate: Date;
  category: string;
}

const NewsCard = ({ id, title, summary, imageUrl, publishDate, category }: NewsCardProps) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <span className="absolute top-2 left-2 bg-blue-primary text-white text-xs px-2 py-1 rounded">
          {category}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/article/${id}`}>
          <h3 className="text-lg font-bold text-blue-primary hover:text-blue-800 mb-2 line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-gray-text mb-4 text-sm line-clamp-3">
          {summary}
        </p>
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {formatDistance(publishDate, new Date(), { addSuffix: true, locale: uk })}
          </span>
          <Link 
            to={`/article/${id}`} 
            className="text-blue-primary hover:text-blue-800 text-sm font-medium"
          >
            Читати далі →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
