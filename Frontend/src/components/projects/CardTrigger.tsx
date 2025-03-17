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
        className="h-32 w-full sm:w-50 object-center object-cover rounded-2xl"
      />
      <div className="flex flex-col gap-2 justify-between flex-1">
        <div className="flex gap-2 flex-col">
          <h1 className="text-base sm:text-lg mt-2 sm:mt-0 font-rubik font-semibold">{title}</h1>
          <p className="font-roboto text-sm sm:text-base">
            {description.length > 200
              ? `${description.substring(0, 200)}...`
              : description}
          </p>
        </div>
        <h2 className={`self-end px-2 py-1 rounded-lg text-sm sm:text-base font-bold font-rubik ${status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}>
          {status.toUpperCase()}
        </h2>
      </div>
    </>
  );
}

export default ProjectCardTrigger;
