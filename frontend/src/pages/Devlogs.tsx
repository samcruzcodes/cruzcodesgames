const Devlogs = () => {
  const posts = [
    {
      id: 1,
      title: "Building the Game Portfolio Site",
      date: "November 16, 2024",
      content:
        "In this post, I'll walk through the process of building my full-stack game portfolio site. This site will allow users to interact with games, see leaderboards, and much more! I'm currently setting up Firebase authentication",
    },
    {
      id: 2,
      title: "Seperating front-end from back-end",
      date: "November 25, 2024",
      content:
        "In this post, I'll walk through the importance of seperating front-end from back-end and the necessities of firebase.ts in both.",
    },
    {
      id: 3,
      title: "Presentation",
      date: "December 5, 2024",
      content:
        "In this post, I'll walk through the steps taken to present this project to the class and seeing how others did on their own projects.",
    },
    {
      id: 4,
      title: "Deployment",
      date: "Dec 30, 2024",
      content:
        "In this post, I'll walk through the process of deployment. One of the hardest parts I've encountered thus far.",
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Devlogs</h1>
      <div style={styles.postsContainer}>
        {posts
          .slice()
          .reverse()
          .map((post) => (
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
    textAlign: "center" as const,
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
    flexDirection: "column" as const,
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
