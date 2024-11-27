import React from "react";
import Header from "./Header";
import { Helmet } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import TopLoadingBar from "react-top-loading-bar";
import { useProgress } from "../../context/ProgressContext";
import { NavLink } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  type?: string;
  url?: string;
  image?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Role Gaurd | User Management | Role Management",
  description = "It's an application for the users and roles management",
  keywords = " web development, mobile app development, React, Node.js, Java, JavaScript, developer, projects",
  author = "Sudhanshu",
  type = "website",
  url = "",
  image = "",
}) => {
  return (
    <div>
      <Helmet>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="Sudhanshine" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sudhanshukushwaha" />
        <meta name="twitter:creator" content={author} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: url,
            name: title,
            author: {
              "@type": "Person",
              name: author,
            },
            description: description,
            image: image,
          })}
        </script>
      </Helmet>
      <Header />
      <nav className="layout-nav">
        <ul>
          <li>
            <NavLink to="/users" title="Manage users in Role Guard">
              Users Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/roles" title="Manage roles in Role Guard">
              Roles Management
            </NavLink>
          </li>
        </ul>
      </nav>
      <main>
        <Toaster position="top-right" reverseOrder={false} />
        <TopLoadingBarComponent />
        {children}
      </main>
    </div>
  );
};

const TopLoadingBarComponent: React.FC = () => {
  const { progress, setProgress } = useProgress();
  return (
    <TopLoadingBar
      color="#ffffff"
      height={3}
      progress={progress}
      onLoaderFinished={() => setProgress(0)}
    />
  );
};

export default Layout;
