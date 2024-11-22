const UsersListSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="flex  items-center justify-between lg:justify-start gap-3 p-3 w-full rounded-lg animate-pulse"
    >
      <div className="h-12 w-12 rounded-full bg-zinc-800" />
      <div className="flex-1 flex gap-3">
        <div className="h-4 w-20 md:w-24 bg-zinc-800 rounded mb-2" />
        <div className="h-4 w-10 md:w-12  bg-zinc-800" />
      </div>
    </div>
  ));
};
export default UsersListSkeleton;
