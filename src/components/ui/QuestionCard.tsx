import { useNavigate } from "react-router-dom";
import { slugify } from "@/utils/slugify";

interface QuestionCardProps {
  id: number;
  number: number;
  title: string;
  description: string;
  onClick?: () => void;
}

function QuestionCard({ id, number, title, description, onClick }: QuestionCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    const slug = slugify(title);
    navigate(`/dashboard/surveys/${id}/${slug}/questions`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-64 bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.09)] p-6 space-y-3 relative overflow-hidden cursor-pointer hover:shadow-[0px_0px_20px_rgba(0,0,0,0.15)] transition-shadow"
    >
      <h1 className="font-bold text-xl">{title}</h1>
      <p className="text-sm text-zinc-500 leading-6">{description}</p>
      <div className="absolute top-2 right-2 text-gray-400 text-xs">ID: {id}</div>
    </div>
  );
}

export default QuestionCard;
