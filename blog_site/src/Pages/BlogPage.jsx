import React, { useEffect, useState } from 'react';
import "./BlogPage.css";
import { useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Menu, User, X } from 'lucide-react';

const categories = ["Tech", "Travel", "Lifestyle", "Food"];
const tags = [
    "Database", "Travel", "Lifestyle", "Simplicity", "Recipes", "Food",
    "Quick Meals", "Ghana", "Culture", "AI", "Technology", "Innovation",
    "Organization", "Productivity", "Tips"
];

export default function BlogPage() {
  const { generalBlogs } = useSelector(state => state.blogs);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const blogsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    if (category || tag) {
      setSearchQuery(category || tag || "");
      setCurrentPage(1);
    }
  }, [searchParams]);

  const filteredBlogs = generalBlogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    blog.category.toLowerCase() === searchQuery.toLowerCase()
  );

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const displayedBlogs = filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    setCurrentPage(prevPage => {
      if (direction === 'next' && prevPage < totalPages) return prevPage + 1;
      if (direction === 'prev' && prevPage > 1) return prevPage - 1;
      return prevPage;
    });
  };

  return (
    <div className="blog-page">
      <button className="menu-toggle" onClick={() => setMenuOpen(true)}>
        <Menu size={24} /> Filters
      </button>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        {menuOpen && (
          <button className="menu-close" onClick={() => setMenuOpen(false)}>
            <X size={24}/> Close
          </button>
        )}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="categories">
          <h3>Categories</h3>
          <ul>
            {categories.map(category => (
              <li key={category}><Link to={`?category=${category}`}>{category}</Link></li>
            ))}
          </ul>
        </div>
        <div className="tags">
          <h3>Tags</h3>
          <div className="tag-list">
            {tags.map(tag => (
              <Link key={tag} to={`?tag=${tag}`} className="tag">{tag}</Link>
            ))}
          </div>
        </div>
      </aside>

      <main className="blog-list">
        <h1>All Blogs</h1>
        <div className="blogs">
          {displayedBlogs.length > 0 ? (
            displayedBlogs.map(blog => (
              <div key={blog.id} className="blog-item">
                <img src={blog.image} alt={blog.title} />
                <div className="blog-content">
                  <h2>{blog.title}</h2>
                  <div className="author-info" onClick={() => navigate(`/profile/${blog.author._id}`)}>
                  {blog.author.image ? (
                    <img
                      src={blog.author.image}
                      alt={blog.author.username}
                      className="author-image"
                    />
                  ) : (
                    <User className="profile-icon" />
                  )}
                  <p>@{blog.author.username}</p>
                </div>
                  <p>{blog.excerpt}</p>
                  <Link to={`/blog/${blog._id}`}>Read More</Link>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs found</p>
          )}
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
            <ArrowLeft size={16} /> Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
            Next <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
