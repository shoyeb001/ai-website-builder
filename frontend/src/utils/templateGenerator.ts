import { WebsiteTemplate } from '../types';

export function generateTemplate(prompt: string): WebsiteTemplate {
  // This is a simple template generator
  // In a production environment, this would connect to an AI service
  return {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="logo">Your Logo</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section class="hero">
            <h1>Welcome to Your Website</h1>
            <p>Based on prompt: ${prompt}</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 Your Website. All rights reserved.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>`,
    css: `/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #333;
}

/* Navigation */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2563eb;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: #2563eb;
}

/* Hero section */
.hero {
    padding: 4rem 2rem;
    text-align: center;
    background-color: #f8fafc;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #1e293b;
}

.hero p {
    font-size: 1.2rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
}

/* Footer */
footer {
    text-align: center;
    padding: 2rem;
    background-color: #1e293b;
    color: #fff;
}`,
    js: `// Add interactivity
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll-based navbar styling
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = '#fff';
                navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            } else {
                navbar.style.backgroundColor = 'transparent';
                navbar.style.boxShadow = 'none';
            }
        });
    }
});`
  };
}