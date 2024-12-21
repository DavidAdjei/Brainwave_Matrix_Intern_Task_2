import React, { useEffect, useState } from 'react';
import "./BlogPage.css";
import { useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Menu, User, X } from 'lucide-react';
import { tags, categories } from "../../Utils/utils";

export default function BlogPage() {
  const { generalBlogs } = useSelector(state => state.blogs);
  const { isAuth, user } = useSelector(state => state.auth); 
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState(generalBlogs)
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
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

  const filteredBlogs = blogs.filter(blog =>
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

  function getBlogsFromFollowing(blogs, following) {
    const followingIds = following.map(user => user._id);
  
    const filteredBlogs = blogs.filter(blog => followingIds.includes(blog.author._id));
  
    return filteredBlogs;
  }

  const handleSwitch = (tab) => {
    if(tab === "discover") {
      setBlogs(generalBlogs);
      setActiveTab("discover");
    }else{
      const newBlogs = getBlogsFromFollowing(generalBlogs, user.following);
      setBlogs(newBlogs);
      setActiveTab("following");
    }
  } 

  return (
    <div className="blog-page">
      <button className="menu-toggle" onClick={() => setMenuOpen(true)}>
        <Menu size={24} /> Filters
      </button>
      <aside className={`sidebar ${menuOpen ? "open" : undefined}`}>
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
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "discover" ? "active" : undefined}`}
            onClick={() => handleSwitch("discover")}
          >
            Discover
          </button>
          {isAuth && (
            <button
              className={`tab ${activeTab === "following" ? "active" : undefined}`}
              onClick={() => handleSwitch("following")}
            >
              Following
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
            <div className="blogs">
              {activeTab === "following"  && (
                <h2>Blogs from Users You Follow</h2>
              )}
              {displayedBlogs.length > 0 ? (
                displayedBlogs.map(blog => (
                  <div key={blog._id} className="blog-item">
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
                        <p>{user._id === blog.author._id ? "You" : `@${blog.author.username}`}</p>
                      </div>
                      <p>{blog.excerpt}</p>
                      <Link to={`/blog/${blog._id}`}>Read More</Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>{activeTab === "discover" ?" No blogs found" : "You are not following anyone with blogs yet."}</p>
              )}
            </div>
        </div>

        {/* Pagination */}
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
