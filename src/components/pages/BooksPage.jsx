import React, { useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import BookService from '../../service/BookService';
import './pagination.css'

// Function to fetch books based on pagination
const fetchBooks = async ({ page, pageSize, searchQuery, sortField, sortOrder }) => {
  const { data } = await BookService.search({
    PageNumber: page,
    PageSize: pageSize,
    Keyword: searchQuery,
    SortBy: sortField,
    SortOrder : sortOrder
  });
  return data;
};

const BooksPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const pageSizes = [3, 6, 9];
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  // Use react-query to fetch the data with page and pageSize
  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', page, pageSize, searchQuery, sortField, sortOrder],
    queryFn: () => fetchBooks({ page, pageSize, searchQuery, sortField, sortOrder }),
    keepPreviousData: true,
    onSuccess: (data) => {
        console.log(data); // Log the data to inspect its structure
      },
      placeholderData: keepPreviousData
  });

  // Check if the data is loading or error occurred
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching posts</p>;

  // Ensure data exists and has the structure we expect
  const pageCount = Math.ceil(data.total / pageSize);

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1); // Reset to page 1 when page size changes
  };

  // Handle page click for pagination
  const handlePageClick = ({ selected }) => {
    setPage(selected + 1); // React-Paginate uses 0-based index
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
    };

    const handleSort = (field) => {
        if (field === sortField) {  
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); 
        } else {
        setSortField(field);
        setSortOrder('asc');
        } 
    };

    // Get sort icon

    const getSortIcon = (field) => {
        if (sortField !== field) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

  return (
    <Container>
      <h1>Books</h1>
      <div className="input-group">
        <span className="input-group-text">Search </span>
        <input placeholder="Cari pengguna..." type="text" className="form-control"
        onChange={handleSearch} value={searchQuery}/>
        </div>
      <ListGroup className="list-group mb-4">
        {data?.data?.map((book) => (
          <ListGroup.Item key={book.id}>
            {book.id}. {book.title} by {book.author}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="mt-3">
        {"Items per Page: "}
        <select onChange={handlePageSizeChange} value={pageSize}>
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
            <thead>
                <tr>
                    <th style={{ width: '80px' }}>
                        <button variant="link"
                        onClick={() => handleSort('id')}
                        className="text-decoration-none text-dark p-0">
                        ID {getSortIcon('id')}
                        </button>
                    </th>
                </tr>
            </thead>
        </table>
      </div>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </Container>
  );
};

export default BooksPage;
