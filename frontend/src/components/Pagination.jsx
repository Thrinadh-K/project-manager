const Pagination = ({ page, pages, onPage }) => {
  if (!pages || pages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-2">
      <button className="btn-secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </button>
      <span className="text-sm text-slate-500">
        Page {page} of {pages}
      </span>
      <button className="btn-secondary" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
