document.addEventListener('DOMContentLoaded', () => {
    fetch('data/data.json') // Path to your JSON file
        .then(response => response.json())
        .then(data => populatePortfolio(data))
        .catch(error => console.error('Error loading JSON data:', error));
});

function populatePortfolio(data) {
    // About Section
    const aboutText = document.getElementById('about-text');
    aboutText.textContent = data.about;

    // Portfolio Section
    const projectsContainer = document.getElementById('projects');
    projectsContainer.innerHTML = ''; // Clear any placeholders
    data.projects.forEach(project => {
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

    // CV Section
    const cvContainer = document.getElementById('cv-content');
    cvContainer.innerHTML = ''; // Clear any placeholders
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

    // Grades Section
    const gradesList = document.getElementById('grades-list');
    gradesList.innerHTML = ''; // Clear any placeholders
    data.grades.forEach(grade => {
        const gradeItem = document.createElement('li');
        gradeItem.textContent = grade.category;

        const details = document.createElement('ul');
        grade.details.forEach(detail => {
            const detailItem = document.createElement('li');
            detailItem.textContent = detail;
            details.appendChild(detailItem);
        });

        gradeItem.appendChild(details);
        gradesList.appendChild(gradeItem);
    });

    // Contact Section
    const contactInfo = document.getElementById('contact-info');
    contactInfo.innerHTML = `
        <p>Email: ${data.contact.email}</p>
        <p>Phone: ${data.contact.phone}</p>
        <p>LinkedIn: <a href="${data.contact.linkedin}" target="_blank">${data.contact.linkedin}</a></p>
        <p>Address: ${data.contact.address}</p>
    `;
}
