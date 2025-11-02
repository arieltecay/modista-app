// Component that displays a single hero image occupying the full allocated space
export const ImagesHome = () => {
  return (
    <div className="relative overflow-hidden rounded-xl pt-[40%] max-sm:pt-[55%]">
      <img
        src="/images/HomeMica.jpeg"
        alt="Modista trabajando"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
};

export default ImagesHome;