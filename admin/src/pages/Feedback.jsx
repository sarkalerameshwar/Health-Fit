import { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import DataTable from '../components/DataTable';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState('All');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback/all');
        const data = await response.json();
        setFeedback(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Filtered + searched data
  const filteredFeedback = feedback.filter(item => {
    const matchesSearch =
      item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase());

    const matchesRating =
      filterRating === 'All' ? true : item.rating === parseInt(filterRating);

    return matchesSearch && matchesRating;
  });

  const columns = [
    { header: 'Name', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Rating',
      accessor: 'rating',
      render: (item) => {
        const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
        return <span className="text-yellow-400">{stars}</span>;
      },
    },
    {
      header: 'Message',
      accessor: 'message',
      render: (item) => (
        <div className="truncate max-w-xs">{item.message}</div>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (item) => new Date(item.createdAt).toLocaleString(),
    },
  ];

  const handleViewDetails = (feedbackItem) => {
    alert(
      `Feedback from: ${feedbackItem.username}\nEmail: ${feedbackItem.email}\nRating: ${feedbackItem.rating}/5\n\nMessage:\n${feedbackItem.message}`
    );
  };

  return (
    <div>
      <Header title="Feedback" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-dark">Customer Feedback</h2>
          <div className="flex space-x-2">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="All">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback..."
              className="border border-gray-300 rounded px-3 py-2 w-64"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredFeedback}
          loading={loading}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
};

export default Feedback;
