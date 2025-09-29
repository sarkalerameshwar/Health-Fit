const Header = ({ title }) => {
  return (
    <div className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold text-dark">{title}</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-light hover:bg-gray-200">
          <i className="fas fa-bell text-gray-600"></i>
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="ml-2 text-dark hidden md:inline">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
