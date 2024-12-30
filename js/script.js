document.addEventListener('DOMContentLoaded', function () {
    loadProjects();
    loadCV();
});

function loadProjects() {
    const projects = [
        {
            title: "Project 1",
            image: "images/project1.jpg",
            description: "Details about Project 1."
        },
        {
            title: "Project 2",
            image: "images/project2.jpg",           
            description: "Details about Project 2."
        }
        // Add more projects as needed
    ];  

    const projectsContainer = document.getElementById('projects');
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project');

        const projectTitle = document.createElement('h3');
        projectTitle.textContent = project.title;

        const projectImage = document.createElement('img');
        projectImage.src = project.image;
        projectImage.alt = project.title;

        const projectDescription = document.createElement('p');
        projectDescription.textContent = project.description;

        projectElement.appendChild(projectTitle);
        projectElement.appendChild(projectImage);
        projectElement.appendChild(projectDescription);

        projectsContainer.appendChild(projectElement);
    });
}

function loadCV() {
    fetch('assets/data/resume.json')
        .then(response => response.json())
        .then(data => {
            const cvContainer = document.getElementById('cv-content');
            data.cv.forEach(item => {
                const cvItem = document.createElement('div');
                cvItem.classList.add('cv-item');

                const cvTitle = document.createElement('h3');
                cvTitle.textContent = item.title;

                const cvImage = document.createElement('img');
                cvImage.src = item.image;
                cvImage.alt = item.title;

                const cvDescription = document.createElement('p');
                cvDescription.textContent = item.description;

                cvItem.appendChild(cvTitle);
                cvItem.appendChild(cvImage);
                cvItem.appendChild(cvDescription);

                cvContainer.appendChild(cvItem);
            });
        })
        .catch(error => console.error('Error loading CV:', error));
}
// Fetch and display text in the "About Me" section
fetch('assets/text/about_me.txt') // Adjust the path to the text file
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch the text file'); // Handle fetch errors
    }
    return response.text();
  })
  .then(data => {
    const aboutText = document.getElementById('about-text'); // Target the element in HTML
    if (aboutText) {
      aboutText.textContent = data; // Insert the fetched text
    } else {
      console.error('Element with id "about-text" not found');
    }
  })
  .catch(error => {
    console.error('Error fetching text file:', error);
  });

