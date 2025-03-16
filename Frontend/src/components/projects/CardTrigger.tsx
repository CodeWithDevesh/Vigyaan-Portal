interface ProjectCardTriggerProps {
  title: string;
  description: string;
  image: string;
  status: string;
}
function ProjectCardTrigger({
  image,
  title,
  description,
  status,
}: ProjectCardTriggerProps) {
  return (
    <>
      <img
        src={image}
        alt={title}
        className="h-32 w-50 object-center object-cover rounded-2xl"
      />
      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col">
          <h1 className="text-lg font-rubik font-semibold">{title}</h1>
          <p className="font-roboto">
            {description.length > 200
              ? `${description.substring(0, 200)}...`
              : description}
          </p>
        </div>
        <h2 className={`self-end px-2 py-1 rounded-lg font-bold font-rubik ${status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}>
          {status.toUpperCase()}
        </h2>
      </div>
    </>
  );
}

export default ProjectCardTrigger;
