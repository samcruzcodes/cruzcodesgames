import React from "react";

const Devlogs = () => {
  const posts = [
    {
      id: 1,
      title: "Building the Game Portfolio Site",
      date: "November 16, 2024",
      content:
        "In this post, I'll walk through the process of building my full-stack game portfolio site. This site will allow users to interact with games, see leaderboards, and much more! I'm currently setting up Firebase authentication and integrating the itch.io API.",
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Devlogs</h1>
      <div style={styles.postsContainer}>
        {posts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            <h2 style={styles.postTitle}>{post.title}</h2>
            <p style={styles.postDate}>{post.date}</p>
            <p style={styles.postContent}>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2rem",
    color: "var(--primary-color)",
    marginBottom: "20px",
  },
  postsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  postCard: {
    padding: "15px",
    border: `1px solid var(--subtle-accent)`,
    borderRadius: "8px",
    backgroundColor: "var(--background-primary-mix)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  postTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "var(--primary-color)",
  },
  postDate: {
    fontSize: "1rem",
    color: "var(--subtle-accent)",
    marginBottom: "10px",
  },
  postContent: {
    fontSize: "1rem",
    color: "var(--text-color)",
  },
};

export default Devlogs;
