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
  title = "FlowManage | Advanced Role & User Management System",
  description = "Effortlessly manage users, roles, and permissions with RoleGuard. An advanced application designed for seamless user and role administration.",
  keywords = "user management, role management, role-based access control, RBAC, React, Node.js, permissions management, admin dashboard, React applications",
  author = "Sudhanshu Kushwaha",
  type = "website",
}) => {
  return (
    <div>
      <Helmet>
        <meta name="robots" content="index, follow" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="RoleGuard" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sudhanshukushwaha" />
        <meta name="twitter:creator" content={author} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: title,
            author: {
              "@type": "Person",
              name: author,
            },
            description: description,
          })}
        </script>
      </Helmet>
      <Header />
      <nav className="layout-nav">
        <ul>
          <li>
            <NavLink to="/users" title="Manage users in RoleGuard">
              Users Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/roles" title="Manage roles in RoleGuard">
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
