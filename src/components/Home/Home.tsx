import React from "react";
import Layout from "../Layout/Layout";


const Home: React.FC = () => {
  return (
    <Layout>
      <div className="home-container">
        <div className="hero-section">
          <h1 className="hero-title">Welcome to the Flow Manage</h1>
          <p className="hero-subtitle">
            Empower your team with streamlined user and role management.
          </p>
        </div>

        <div className="quote-section">
          <div className="quote-card">
            <p className="quote-text">
              "Leadership is not about titles, positions, or flowcharts. It is
              about one life influencing another."
            </p>
            <p className="quote-author">- John C. Maxwell</p>
          </div>

          <div className="quote-card">
            <p className="quote-text">
              "Alone we can do so little; together we can do so much."
            </p>
            <p className="quote-author">- Helen Keller</p>
          </div>

          <div className="quote-card">
            <p className="quote-text">
              "Great leaders inspire greatness in others."
            </p>
            <p className="quote-author">- Anonymous</p>
          </div>
        </div>

        <div className="features-section">
          <h2 className="features-title">What You Can Do</h2>
          <ul className="features-list">
            <li>🧑‍💼 Manage user roles with precision and ease.</li>
            <li>🔐 Ensure secure and efficient role-based access.</li>
            <li>📈 Track, edit, and optimize user engagement.</li>
            <li>💡 Collaborate effectively with team management tools.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
