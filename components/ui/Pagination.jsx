// کامپوننت Pagination
export default function Pagination  ({ currentPage, totalPages, onPageChange })  {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
      >
        {"<"}
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 py-1 rounded-md ${
            currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
      >
        {">"}
      </button>
    </nav>
  );
};